require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    morphHolesky: {
      url: "https://rpc-quicknode-holesky.morphl2.io",
      chainId: 2810,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      // EIP-1559 settings
      type: 2,
      maxFeePerGas: "auto",
      maxPriorityFeePerGas: "auto",
      gas: "auto",
    },
    morphMainnet: {
      url: "https://rpc-quicknode.morphl2.io",
      chainId: 2818,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      // EIP-1559 settings
      type: 2,
      maxFeePerGas: "auto",
      maxPriorityFeePerGas: "auto",
      gas: "auto",
    },
  },
  etherscan: {
    apiKey: {
      morphHolesky: "anything",
      morphMainnet: "anything",
    },
    customChains: [
      {
        network: "morphHolesky",
        chainId: 2810,
        urls: {
          apiURL: "https://explorer-api-holesky.morphl2.io/api",
          browserURL: "https://explorer-holesky.morphl2.io",
        },
      },
      {
        network: "morphMainnet",
        chainId: 2818,
        urls: {
          apiURL: "https://explorer-api.morphl2.io/api",
          browserURL: "https://explorer.morphl2.io",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}; 