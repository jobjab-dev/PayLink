const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking Morph Holesky status...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  
  console.log("📝 Deployer address:", deployerAddress);
  console.log("💰 Current balance:", ethers.formatEther(balance), "ETH");
  
  // Get current fee data
  const feeData = await ethers.provider.getFeeData();
  console.log("\n💰 Current gas prices:");
  console.log("  Gas Price:", feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") + " gwei" : "N/A");
  console.log("  Max Fee Per Gas:", feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") + " gwei" : "N/A");
  console.log("  Max Priority Fee:", feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei") + " gwei" : "N/A");
  
  // Estimate deployment cost
  const PayLink = await ethers.getContractFactory("PayLink");
  const deploymentData = PayLink.interface.encodeDeploy([]);
  const gasEstimate = await ethers.provider.estimateGas({
    data: PayLink.bytecode + deploymentData.slice(2)
  });
  
  const gasLimit = (gasEstimate * 105n) / 100n; // Add 5% buffer
  const maxFeePerGas = feeData.maxFeePerGas || feeData.gasPrice || 0n;
  const totalCost = gasLimit * maxFeePerGas;
  
  console.log("\n⛽ Deployment estimates:");
  console.log("  Gas needed:", gasEstimate.toString());
  console.log("  Gas limit (5% buffer):", gasLimit.toString());
  console.log("  Total cost:", ethers.formatEther(totalCost), "ETH");
  
  // Check if we have enough
  const hasEnough = balance >= totalCost;
  console.log("\n✅ Status:");
  console.log("  Sufficient funds:", hasEnough ? "YES ✅" : "NO ❌");
  
  if (!hasEnough) {
    const needed = totalCost - balance;
    console.log("  Additional ETH needed:", ethers.formatEther(needed), "ETH");
    console.log("\n🔗 Get testnet ETH:");
    console.log("  1. Get Holesky ETH: https://holesky-faucet.pk910.de");
    console.log("  2. Bridge to Morph: https://bridge-holesky.morphl2.io");
  }
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("\n🌐 Network info:");
  console.log("  Name:", network.name);
  console.log("  Chain ID:", network.chainId.toString());
  
  // Get latest block
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log("  Latest block:", blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 