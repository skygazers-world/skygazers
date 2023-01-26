import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
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
    }
  },
  mocha: {
    timeout: 100000000
  },
};

export default config;
