const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying PayLink contract to Morph L2...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  
  console.log("📝 Deployer address:", deployerAddress);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "ETH");
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());
  
  // Deploy the contract
  console.log("\n📦 Deploying PayLink contract...");
  const PayLink = await ethers.getContractFactory("PayLink");
  
  // Get current fee data (EIP-1559)
  const feeData = await ethers.provider.getFeeData();
  console.log("💰 Current fee data:");
  console.log("  Base fee:", feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") + " gwei" : "N/A");
  console.log("  Max fee per gas:", feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") + " gwei" : "N/A");
  console.log("  Max priority fee:", feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei") + " gwei" : "N/A");
  
  // Get gas estimate and add 5% buffer
  const deploymentData = PayLink.interface.encodeDeploy([]);
  const gasEstimate = await ethers.provider.estimateGas({
    data: PayLink.bytecode + deploymentData.slice(2)
  });
  const gasLimit = (gasEstimate * 105n) / 100n; // Add 5% buffer
  
  console.log("⛽ Estimated gas:", gasEstimate.toString());
  console.log("⛽ Gas limit (with 5% buffer):", gasLimit.toString());
  
  // Calculate total cost
  const maxFeePerGas = feeData.maxFeePerGas || feeData.gasPrice || 0n;
  const totalCost = gasLimit * maxFeePerGas;
  console.log("💸 Estimated total cost:", ethers.formatEther(totalCost), "ETH");
  
  // Deploy with EIP-1559 transaction
  const deployOptions = {
    gasLimit: gasLimit,
  };
  
  // Add EIP-1559 fields if available
  if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
    deployOptions.maxFeePerGas = (feeData.maxFeePerGas * 110n) / 100n; // Add 10% buffer
    deployOptions.maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * 110n) / 100n;
    console.log("🔥 Using EIP-1559 transaction");
  } else if (feeData.gasPrice) {
    deployOptions.gasPrice = (feeData.gasPrice * 110n) / 100n; // Add 10% buffer
    console.log("⚡ Using legacy transaction");
  }
  
  const payLink = await PayLink.deploy(deployOptions);
  
  // Wait for deployment
  await payLink.waitForDeployment();
  const contractAddress = await payLink.getAddress();
  
  console.log("✅ PayLink deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔍 Block explorer:", getExplorerUrl(network.chainId, contractAddress));
  
  // Save deployment info
  const deploymentInfo = {
    contract: "PayLink",
    address: contractAddress,
    deployer: deployerAddress,
    chainId: network.chainId.toString(),
    timestamp: new Date().toISOString(),
    txHash: payLink.deploymentTransaction().hash,
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Verify contract (optional)
  if (network.chainId === 2810n || network.chainId === 2818n) {
    console.log("\n⏳ Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }
}

function getExplorerUrl(chainId, address) {
  switch (chainId.toString()) {
    case "2810":
      return `https://explorer-holesky.morphl2.io/address/${address}`;
    case "2818":
      return `https://explorer.morphl2.io/address/${address}`;
    default:
      return `Chain ID ${chainId} - Explorer not configured`;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 