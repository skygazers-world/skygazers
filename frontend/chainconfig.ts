// import { config as dotEnvConfig } from "dotenv";
// dotEnvConfig();

const chains = {
    hardhat: require("./chainconfig-hardhat.json"),
    goerli: require("./chainconfig-goerli.json")
}

export default chains[process.env.NEXT_PUBLIC_CHAIN];
