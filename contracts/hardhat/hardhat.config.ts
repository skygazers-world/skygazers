import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      gasPrice: 470000000000,
      chainId: 43112,
      accounts: {
        accountsBalance: "10000000000000000000000000"
      }
    }
  },
  mocha: {
    timeout: 100000000
  },
};

export default config;
