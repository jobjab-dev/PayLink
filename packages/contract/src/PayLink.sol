// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PayLink
 * @dev Smart contract for creating and paying bills via payment links
 * @author PayLink Team
 */
contract PayLink is ReentrancyGuard, Ownable {
    struct Bill {
        address receiver;
        address token; // address(0) for ETH
        uint256 amount;
        bool paid;
        uint256 createdAt;
        uint256 paidAt;
        address payer;
    }

    mapping(bytes32 => Bill) public bills;
    mapping(address => bytes32[]) public userBills;
    
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
     * @dev Pay an existing bill
     * @param billId ID of the bill to pay
     */
    function payBill(bytes32 billId) external payable nonReentrant {
        Bill storage bill = bills[billId];
        
        if (bill.receiver == address(0)) {
            revert BillNotFound();
        }
        if (bill.paid) {
            revert BillAlreadyPaid();
        }

        if (bill.token == address(0)) {
            // ETH payment
            if (msg.value != bill.amount) {
                revert InvalidAmount();
            }
            
            (bool success, ) = payable(bill.receiver).call{value: bill.amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            // ERC20 payment
            if (msg.value > 0) {
                revert InvalidAmount();
            }
            
            IERC20 token = IERC20(bill.token);
            if (token.balanceOf(msg.sender) < bill.amount) {
                revert InsufficientBalance();
            }
            
            bool success = token.transferFrom(msg.sender, bill.receiver, bill.amount);
            if (!success) {
                revert TransferFailed();
            }
        }

        bill.paid = true;
        bill.paidAt = block.timestamp;
        bill.payer = msg.sender;
        totalPaidBills++;

        emit BillPaid(
            billId,
            msg.sender,
            bill.receiver,
            bill.token,
            bill.amount,
            block.timestamp
        );
    }

    /**
     * @dev Get bill details
     * @param billId ID of the bill
     * @return Bill struct
     */
    function getBill(bytes32 billId) external view returns (Bill memory) {
        return bills[billId];
    }

    /**
     * @dev Get all bills created by a user
     * @param user Address of the user
     * @return Array of bill IDs
     */
    function getUserBills(address user) external view returns (bytes32[] memory) {
        return userBills[user];
    }

    /**
     * @dev Check if a bill exists and is unpaid
     * @param billId ID of the bill
     * @return exists Whether the bill exists
     * @return isPaid Whether the bill is paid
     */
    function billStatus(bytes32 billId) external view returns (bool exists, bool isPaid) {
        Bill memory bill = bills[billId];
        exists = bill.receiver != address(0);
        isPaid = bill.paid;
    }

    /**
     * @dev Generate a unique bill ID based on user address and nonce
     * @param user Address of the user
     * @param nonce Unique nonce
     * @return Generated bill ID
     */
    function generateBillId(address user, uint256 nonce) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(user, nonce, block.timestamp));
    }
} 