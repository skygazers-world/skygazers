// import { config as dotEnvConfig } from "dotenv";
// dotEnvConfig();

const chains = {
    localhost: require("./chainconfig-localhost.json"),
    hardhat: require("./chainconfig-hardhat.json"),
    goerli: require("./chainconfig-goerli.json"),
    sepolia: require("./chainconfig-sepolia.json"),
    mainnet: require("./chainconfig-mainnet.json"),
}

export default chains[process.env.NEXT_PUBLIC_CHAIN];
