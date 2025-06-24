// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PayLink.sol";

contract CreateOkTest is Test {
    PayLink public payLink;
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public tokenAddress = address(0x123);

    function setUp() public {
        payLink = new PayLink();
    }

    function testCreateETHBill() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        uint256 amount = 1 ether;
        
        vm.expectEmit(true, true, true, true);
        emit PayLink.BillCreated(billId, user1, address(0), amount, block.timestamp);
        
        payLink.createBill(billId, address(0), amount);
        
        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.receiver, user1);
        assertEq(bill.token, address(0));
        assertEq(bill.amount, amount);
        assertEq(bill.paid, false);
        assertEq(bill.createdAt, block.timestamp);
        assertEq(bill.paidAt, 0);
        assertEq(bill.payer, address(0));
        
        assertEq(payLink.totalBills(), 1);
        assertEq(payLink.totalPaidBills(), 0);
        
        vm.stopPrank();
    }

    function testCreateERC20Bill() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(2)));
        uint256 amount = 100 * 10**18;
        
        vm.expectEmit(true, true, true, true);
        emit PayLink.BillCreated(billId, user1, tokenAddress, amount, block.timestamp);
        
        payLink.createBill(billId, tokenAddress, amount);
        
        PayLink.Bill memory bill = payLink.getBill(billId);
        assertEq(bill.receiver, user1);
        assertEq(bill.token, tokenAddress);
        assertEq(bill.amount, amount);
        assertEq(bill.paid, false);
        
        vm.stopPrank();
    }

    function testCreateMultipleBills() public {
        vm.startPrank(user1);
        
        bytes32 billId1 = keccak256(abi.encodePacked(user1, uint256(1)));
        bytes32 billId2 = keccak256(abi.encodePacked(user1, uint256(2)));
        
        payLink.createBill(billId1, address(0), 1 ether);
        payLink.createBill(billId2, tokenAddress, 100 ether);
        
        assertEq(payLink.totalBills(), 2);
        
        bytes32[] memory userBills = payLink.getUserBills(user1);
        assertEq(userBills.length, 2);
        assertEq(userBills[0], billId1);
        assertEq(userBills[1], billId2);
        
        vm.stopPrank();
    }

    function testBillStatus() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        
        // Before creation
        (bool exists, bool isPaid) = payLink.billStatus(billId);
        assertEq(exists, false);
        assertEq(isPaid, false);
        
        // After creation
        payLink.createBill(billId, address(0), 1 ether);
        (exists, isPaid) = payLink.billStatus(billId);
        assertEq(exists, true);
        assertEq(isPaid, false);
        
        vm.stopPrank();
    }

    function testCreateBillWithDifferentUsers() public {
        bytes32 billId1 = keccak256(abi.encodePacked(user1, uint256(1)));
        bytes32 billId2 = keccak256(abi.encodePacked(user2, uint256(1)));
        
        vm.prank(user1);
        payLink.createBill(billId1, address(0), 1 ether);
        
        vm.prank(user2);
        payLink.createBill(billId2, address(0), 2 ether);
        
        PayLink.Bill memory bill1 = payLink.getBill(billId1);
        PayLink.Bill memory bill2 = payLink.getBill(billId2);
        
        assertEq(bill1.receiver, user1);
        assertEq(bill2.receiver, user2);
        assertEq(bill1.amount, 1 ether);
        assertEq(bill2.amount, 2 ether);
    }
} 