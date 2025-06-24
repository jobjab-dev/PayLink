// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PayLink
 * @dev Smart contract for creating and paying bills via payment links
 * Supports EIP-7702 for gasless transactions
 * @author PayLink Team
 */
contract PayLink is ReentrancyGuard {
    struct Bill {
        address receiver;
        address token; // address(0) for ETH
        uint256 amount;
        bool paid;
        uint256 createdAt;
        uint256 paidAt;
        address payer;
    }

    struct Authorization {
        address authorizer;
        bytes32 billId;
        uint256 nonce;
        uint256 chainId;
        address contractAddress;
        bytes signature;
    }

    mapping(bytes32 => Bill) public bills;
    mapping(address => bytes32[]) public userBills;
    mapping(address => uint256) public nonces;
    
    uint256 public totalBills;
    uint256 public totalPaidBills;
    
    event BillCreated(
        bytes32 indexed billId,
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );
    
    event BillPaid(
        bytes32 indexed billId,
        address indexed payer,
        address indexed receiver,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    error BillAlreadyExists();
    error BillNotFound();
    error BillAlreadyPaid();
    error InvalidAmount();
    error InsufficientBalance();
    error TransferFailed();
    error InvalidAuthorization();
    error InvalidNonce();

    constructor() {}

    /**
     * @dev Create a new bill with unique ID
     * @param billId Unique identifier for the bill
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to be paid
     */
    function createBill(
        bytes32 billId,
        address token,
        uint256 amount
    ) external {
        if (bills[billId].receiver != address(0)) {
            revert BillAlreadyExists();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }

        bills[billId] = Bill({
            receiver: msg.sender,
            token: token,
            amount: amount,
            paid: false,
            createdAt: block.timestamp,
            paidAt: 0,
            payer: address(0)
        });

        userBills[msg.sender].push(billId);
        totalBills++;

        emit BillCreated(billId, msg.sender, token, amount, block.timestamp);
    }

    /**
     * @dev Pay an existing bill (standard method)
     * @param billId ID of the bill to pay
     */
    function payBill(bytes32 billId) external payable nonReentrant {
        _payBill(billId, msg.sender, msg.value);
    }

    /**
     * @dev Pay a bill using EIP-7702 authorization
     * This allows a sponsor to pay gas fees while the actual payment comes from the authorizer
     * @param authorization The authorization struct containing signature and details
     */
    function payBillWithAuthorization(
        Authorization calldata authorization
    ) external payable nonReentrant {
        // Verify the authorization
        if (!_verifyAuthorization(authorization)) {
            revert InvalidAuthorization();
        }
        
        // Check nonce
        if (authorization.nonce != nonces[authorization.authorizer]) {
            revert InvalidNonce();
        }
        
        // Increment nonce
        nonces[authorization.authorizer]++;
        
        // Get bill details
        Bill storage bill = bills[authorization.billId];
        
        if (bill.receiver == address(0)) {
            revert BillNotFound();
        }
        if (bill.paid) {
            revert BillAlreadyPaid();
        }

        // For ETH payments, the sponsor needs to send the ETH value
        if (bill.token == address(0)) {
            if (msg.value != bill.amount) {
                revert InvalidAmount();
            }
            
            (bool success, ) = payable(bill.receiver).call{value: bill.amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            // For ERC20, transfer from the authorizer's balance
            if (msg.value > 0) {
                revert InvalidAmount();
            }
            
            IERC20 token = IERC20(bill.token);
            if (token.balanceOf(authorization.authorizer) < bill.amount) {
                revert InsufficientBalance();
            }
            
            // Transfer from authorizer to receiver
            bool success = token.transferFrom(authorization.authorizer, bill.receiver, bill.amount);
            if (!success) {
                revert TransferFailed();
            }
        }

        // Update bill status
        bill.paid = true;
        bill.paidAt = block.timestamp;
        bill.payer = authorization.authorizer;
        totalPaidBills++;

        emit BillPaid(
            authorization.billId,
            authorization.authorizer,
            bill.receiver,
            bill.token,
            bill.amount,
            block.timestamp
        );
    }

    /**
     * @dev Internal function to process standard bill payment
     */
    function _payBill(bytes32 billId, address payer, uint256 msgValue) internal {
        Bill storage bill = bills[billId];
        
        if (bill.receiver == address(0)) {
            revert BillNotFound();
        }
        if (bill.paid) {
            revert BillAlreadyPaid();
        }

        if (bill.token == address(0)) {
            // ETH payment
            if (msgValue != bill.amount) {
                revert InvalidAmount();
            }
            
            (bool success, ) = payable(bill.receiver).call{value: bill.amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            // ERC20 payment
            if (msgValue > 0) {
                revert InvalidAmount();
            }
            
            IERC20 token = IERC20(bill.token);
            if (token.balanceOf(payer) < bill.amount) {
                revert InsufficientBalance();
            }
            
            bool success = token.transferFrom(payer, bill.receiver, bill.amount);
            if (!success) {
                revert TransferFailed();
            }
        }

        bill.paid = true;
        bill.paidAt = block.timestamp;
        bill.payer = payer;
        totalPaidBills++;

        emit BillPaid(
            billId,
            payer,
            bill.receiver,
            bill.token,
            bill.amount,
            block.timestamp
        );
    }

    /**
     * @dev Verify EIP-7702 style authorization
     */
    function _verifyAuthorization(Authorization calldata auth) internal view returns (bool) {
        // Create the message hash that was signed
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encode(
                        auth.billId,
                        auth.nonce,
                        auth.chainId,
                        auth.contractAddress
                    )
                )
            )
        );
        
        // Recover signer from signature
        address signer = _recoverSigner(messageHash, auth.signature);
        
        // Verify the signer matches the authorizer
        return signer == auth.authorizer && 
               auth.chainId == block.chainid && 
               auth.contractAddress == address(this);
    }

    /**
     * @dev Recover signer address from signature
     */
    function _recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "Invalid signature v value");
        
        return ecrecover(messageHash, v, r, s);
    }

    /**
     * @dev Get bill details
     */
    function getBill(bytes32 billId) external view returns (Bill memory) {
        return bills[billId];
    }

    /**
     * @dev Get all bills created by a user
     */
    function getUserBills(address user) external view returns (bytes32[] memory) {
        return userBills[user];
    }

    /**
     * @dev Check if a bill exists and is unpaid
     */
    function billStatus(bytes32 billId) external view returns (bool exists, bool isPaid) {
        Bill memory bill = bills[billId];
        exists = bill.receiver != address(0);
        isPaid = bill.paid;
    }

    /**
     * @dev Generate a unique bill ID
     */
    function generateBillId(address user, uint256 nonce) external view returns (bytes32) {
        return keccak256(abi.encodePacked(user, nonce, block.timestamp));
    }

    /**
     * @dev Get current nonce for an address
     */
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }
} 