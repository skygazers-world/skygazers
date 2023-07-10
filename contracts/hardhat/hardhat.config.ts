import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    hardhat: {
      gasPrice: 470000000000,
      chainId: 1337,
      accounts: {
        accountsBalance: "1000000000000000000000000000"
      },
      // mining: {
      //   auto: false,
      //   interval: [3000, 6000]
      // }
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.GOERLI_WALLET_PRIVATE_KEY!],
      timeout: 80000
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.GOERLI_WALLET_PRIVATE_KEY!],
      timeout: 80000
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.MAINNET_WALLET_PRIVATE_KEY!],
      timeout: 80000
    },
  },
  mocha: {
    timeout: 100000000
  },
};

export default config;
