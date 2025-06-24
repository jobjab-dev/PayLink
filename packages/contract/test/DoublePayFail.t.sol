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

contract DoublePayFailTest is Test {
    PayLink public payLink;
    MockERC20 public mockToken;
    address public receiver = address(0x1);
    address public payer1 = address(0x2);
    address public payer2 = address(0x3);

    function setUp() public {
        payLink = new PayLink();
        mockToken = new MockERC20();
        
        // Give payers some ETH
        vm.deal(payer1, 10 ether);
        vm.deal(payer2, 10 ether);
        
        // Give payers some tokens
        mockToken.mint(payer1, 1000 * 10**18);
        mockToken.mint(payer2, 1000 * 10**18);
    }

    function testCannotPayETHBillTwiceSamePayer() public {
        // Create bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        // First payment should succeed
        vm.prank(payer1);
        payLink.payBill{value: amount}(billId);

        // Second payment should fail
        vm.prank(payer1);
        vm.expectRevert(PayLink.BillAlreadyPaid.selector);
        payLink.payBill{value: amount}(billId);
    }

    function testCannotPayETHBillTwiceDifferentPayers() public {
        // Create bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        // First payment by payer1
        vm.prank(payer1);
        payLink.payBill{value: amount}(billId);

        // Second payment by payer2 should fail
        vm.prank(payer2);
        vm.expectRevert(PayLink.BillAlreadyPaid.selector);
        payLink.payBill{value: amount}(billId);
    }

    function testCannotPayERC20BillTwiceSamePayer() public {
        // Create bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 100 * 10**18;
        payLink.createBill(billId, address(mockToken), amount);

        // First payment
        vm.startPrank(payer1);
        mockToken.approve(address(payLink), amount);
        payLink.payBill(billId);
        vm.stopPrank();

        // Second payment should fail
        vm.startPrank(payer1);
        mockToken.approve(address(payLink), amount);
        vm.expectRevert(PayLink.BillAlreadyPaid.selector);
        payLink.payBill(billId);
        vm.stopPrank();
    }

    function testCannotPayERC20BillTwiceDifferentPayers() public {
        // Create bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 100 * 10**18;
        payLink.createBill(billId, address(mockToken), amount);

        // First payment by payer1
        vm.startPrank(payer1);
        mockToken.approve(address(payLink), amount);
        payLink.payBill(billId);
        vm.stopPrank();

        // Second payment by payer2 should fail
        vm.startPrank(payer2);
        mockToken.approve(address(payLink), amount);
        vm.expectRevert(PayLink.BillAlreadyPaid.selector);
        payLink.payBill(billId);
        vm.stopPrank();
    }

    function testCannotPayNonExistentBill() public {
        bytes32 nonExistentBillId = keccak256(abi.encodePacked("nonexistent"));
        
        vm.prank(payer1);
        vm.expectRevert(PayLink.BillNotFound.selector);
        payLink.payBill{value: 1 ether}(nonExistentBillId);
    }

    function testCannotPayETHBillWithWrongAmount() public {
        // Create bill for 1 ETH
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        // Try to pay with wrong amount
        vm.prank(payer1);
        vm.expectRevert(PayLink.InvalidAmount.selector);
        payLink.payBill{value: 0.5 ether}(billId);

        // Try to pay with too much
        vm.prank(payer1);
        vm.expectRevert(PayLink.InvalidAmount.selector);
        payLink.payBill{value: 2 ether}(billId);
    }

    function testCannotPayERC20BillWithETH() public {
        // Create ERC20 bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 100 * 10**18;
        payLink.createBill(billId, address(mockToken), amount);

        // Try to pay with ETH
        vm.prank(payer1);
        vm.expectRevert(PayLink.InvalidAmount.selector);
        payLink.payBill{value: 1 ether}(billId);
    }

    function testCannotPayERC20BillWithInsufficientBalance() public {
        // Create bill for more tokens than payer has
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 2000 * 10**18; // More than payer balance
        payLink.createBill(billId, address(mockToken), amount);

        vm.startPrank(payer1);
        mockToken.approve(address(payLink), amount);
        vm.expectRevert(PayLink.InsufficientBalance.selector);
        payLink.payBill(billId);
        vm.stopPrank();
    }

    function testCannotPayERC20BillWithoutApproval() public {
        // Create bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 100 * 10**18;
        payLink.createBill(billId, address(mockToken), amount);

        // Try to pay without approval
        vm.prank(payer1);
        vm.expectRevert(PayLink.TransferFailed.selector);
        payLink.payBill(billId);
    }

    function testStateRemainsUnchangedAfterFailedPayment() public {
        // Create bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        uint256 totalPaidBefore = payLink.totalPaidBills();
        uint256 receiverBalanceBefore = receiver.balance;
        uint256 payerBalanceBefore = payer1.balance;

        // Try to pay with wrong amount
        vm.prank(payer1);
        vm.expectRevert(PayLink.InvalidAmount.selector);
        payLink.payBill{value: 0.5 ether}(billId);

        // State should remain unchanged
        assertEq(payLink.totalPaidBills(), totalPaidBefore);
        assertEq(receiver.balance, receiverBalanceBefore);
        assertEq(payer1.balance, payerBalanceBefore);

        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.paid, false);
        assertEq(bill.payer, address(0));
        assertEq(bill.paidAt, 0);
    }

    function testBillStatusAfterSuccessfulPayment() public {
        // Create bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        // Check status before payment
        (bool exists, bool isPaid) = payLink.billStatus(billId);
        assertEq(exists, true);
        assertEq(isPaid, false);

        // Pay bill
        vm.prank(payer1);
        payLink.payBill{value: amount}(billId);

        // Check status after payment
        (exists, isPaid) = payLink.billStatus(billId);
        assertEq(exists, true);
        assertEq(isPaid, true);

        // Try to pay again
        vm.prank(payer2);
        vm.expectRevert(PayLink.BillAlreadyPaid.selector);
        payLink.payBill{value: amount}(billId);
    }

    function testPaymentRecordsPersist() public {
        // Create and pay bill
        vm.prank(receiver);
        bytes32 billId = keccak256(abi.encodePacked(receiver, uint256(1)));
        uint256 amount = 1 ether;
        payLink.createBill(billId, address(0), amount);

        uint256 paymentTime = block.timestamp + 100;
        vm.warp(paymentTime);
        
        vm.prank(payer1);
        payLink.payBill{value: amount}(billId);

        // Verify payment details are recorded
        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.paid, true);
        assertEq(bill.payer, payer1);
        assertEq(bill.paidAt, paymentTime);

        // Try to pay again much later
        vm.warp(block.timestamp + 1000);
        vm.prank(payer2);
        vm.expectRevert(PayLink.BillAlreadyPaid.selector);
        payLink.payBill{value: amount}(billId);

        // Original payment details should be preserved
        bill = payLink.getBill(billId);
        assertEq(bill.payer, payer1); // Still original payer
        assertEq(bill.paidAt, paymentTime); // Still original time
    }
} 