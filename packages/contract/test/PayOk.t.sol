// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PayLink.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock Token", "MOCK") {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract PayOkTest is Test {
    PayLink public payLink;
    MockERC20 public mockToken;
    address public receiver = address(0x1);
    address public payer = address(0x2);

    function setUp() public {
        payLink = new PayLink();
        mockToken = new MockERC20();
        
        // Give payer some ETH
        vm.deal(payer, 10 ether);
        
        // Give payer some tokens
        mockToken.mint(payer, 1000 * 10**18);
    }

    function testPayETHBill() public {
        // Receiver creates bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        uint256 receiverBalanceBefore = receiver.balance;
        uint256 payerBalanceBefore = payer.balance;

        // Payer pays bill
        vm.prank(payer);
        vm.expectEmit(true, true, true, true);
        emit PayLink.BillPaid(billId, payer, receiver, address(0), amount, block.timestamp);
        
        payLink.payBill{value: amount}(billId);

        // Check balances
        assertEq(receiver.balance, receiverBalanceBefore + amount);
        assertEq(payer.balance, payerBalanceBefore - amount);

        // Check bill status
        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.paid, true);
        assertEq(bill.payer, payer);
        assertEq(bill.paidAt, block.timestamp);

        // Check global counters
        assertEq(payLink.totalPaidBills(), 1);

        // Check bill status function
        (bool exists, bool isPaid) = payLink.billStatus(billId);
        assertEq(exists, true);
        assertEq(isPaid, true);
    }

    function testPayERC20Bill() public {
        // Receiver creates bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(2)));
        uint256 amount = 100 * 10**18;
        payLink.createBill(billId, address(mockToken), amount);

        uint256 receiverBalanceBefore = mockToken.balanceOf(receiver);
        uint256 payerBalanceBefore = mockToken.balanceOf(payer);

        // Payer approves and pays bill
        vm.startPrank(payer);
        mockToken.approve(address(payLink), amount);
        
        vm.expectEmit(true, true, true, true);
        emit PayLink.BillPaid(billId, payer, receiver, address(mockToken), amount, block.timestamp);
        
        payLink.payBill(billId);
        vm.stopPrank();

        // Check balances
        assertEq(mockToken.balanceOf(receiver), receiverBalanceBefore + amount);
        assertEq(mockToken.balanceOf(payer), payerBalanceBefore - amount);

        // Check bill status
        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.paid, true);
        assertEq(bill.payer, payer);
        assertEq(bill.paidAt, block.timestamp);
    }

    function testPayMultipleBills() public {
        // Create multiple bills
        vm.startPrank(receiver);
        bytes32 billId1 = keccak256(abi.encodePacked(receiver, uint256(1)));
        bytes32 billId2 = keccak256(abi.encodePacked(receiver, uint256(2)));
        
        payLink.createBill(billId1, address(0), 1 ether);
        payLink.createBill(billId2, address(mockToken), 50 * 10**18);
        vm.stopPrank();

        // Pay ETH bill
        vm.prank(payer);
        payLink.payBill{value: 1 ether}(billId1);

        // Pay ERC20 bill
        vm.startPrank(payer);
        mockToken.approve(address(payLink), 50 * 10**18);
        payLink.payBill(billId2);
        vm.stopPrank();

        // Check both bills are paid
        assertEq(payLink.totalPaidBills(), 2);
        
        PayLink.Bill memory bill1 = payLink.getBill(billId1);
        PayLink.Bill memory bill2 = payLink.getBill(billId2);
        
        assertEq(bill1.paid, true);
        assertEq(bill2.paid, true);
        assertEq(bill1.payer, payer);
        assertEq(bill2.payer, payer);
    }

    function testPayBillExactAmount() public {
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 0.5 ether;
        payLink.createBill(billId, address(0), amount);

        uint256 receiverBalanceBefore = receiver.balance;

        vm.prank(payer);
        payLink.payBill{value: amount}(billId);

        assertEq(receiver.balance, receiverBalanceBefore + amount);
    }

    function testPayBillWithDifferentPayer() public {
        address anotherPayer = address(0x3);
        vm.deal(anotherPayer, 5 ether);

        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        vm.prank(anotherPayer);
        payLink.payBill{value: amount}(billId);

        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.payer, anotherPayer);
        assertEq(bill.paid, true);
    }

    function testPayERC20BillWithSufficientBalance() public {
        uint256 billAmount = 100 * 10**18;
        uint256 payerTokens = 200 * 10**18;
        
        // Give payer more tokens than needed
        mockToken.mint(payer, payerTokens);
        
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        payLink.createBill(billId, address(mockToken), billAmount);

        vm.startPrank(payer);
        mockToken.approve(address(payLink), billAmount);
        payLink.payBill(billId);
        vm.stopPrank();

        // Check only the bill amount was transferred
        assertEq(mockToken.balanceOf(receiver), billAmount);
        assertEq(mockToken.balanceOf(payer), payerTokens - billAmount);
    }

    function testBillTimestamps() public {
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        
        uint256 creationTime = block.timestamp;
        payLink.createBill(billId, address(0), amount);

        // Fast forward time
        vm.warp(block.timestamp + 1000);
        
        uint256 paymentTime = block.timestamp;
        vm.prank(payer);
        payLink.payBill{value: amount}(billId);

        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.createdAt, creationTime);
        assertEq(bill.paidAt, paymentTime);
        assertGt(bill.paidAt, bill.createdAt);
    }
} 