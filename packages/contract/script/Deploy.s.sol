// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/PayLink.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        PayLink payLink = new PayLink();
        
        console.log("PayLink deployed to:", address(payLink));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Block number:", block.number);
        console.log("Chain ID:", block.chainid);
        
        vm.stopBroadcast();
        
        // Save deployment info to file
        string memory deploymentInfo = string(abi.encodePacked(
            "{\n",
            '  "contract": "PayLink",\n',
            '  "address": "', vm.toString(address(payLink)), '",\n',
            '  "deployer": "', vm.toString(vm.addr(deployerPrivateKey)), '",\n',
            '  "blockNumber": ', vm.toString(block.number), ',\n',
            '  "chainId": ', vm.toString(block.chainid), ',\n',
            '  "timestamp": ', vm.toString(block.timestamp), '\n',
            "}"
        ));
        
        vm.writeFile(
            string(abi.encodePacked("./deployments/", vm.toString(block.chainid), ".json")),
            deploymentInfo
        );
        
        console.log("Deployment info saved to:", string(abi.encodePacked("./deployments/", vm.toString(block.chainid), ".json")));
    }
} 