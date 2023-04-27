import "dotenv/config";
import hre, { ethers } from "hardhat";
import collections from "../collections";
import { expect } from "chai";
import fs from "fs";

console.log(`connected to ${hre.network.name}`);

// const SHIFT = ethers.BigNumber.from("0x10000000000000000");
// const toSolidityFixed = (n: Number, d: Number) => {
//   return ethers.BigNumber
//     .from(n)
//     .mul(SHIFT)
//     .div(ethers.BigNumber
//       .from(d)).toString()
// }
// const fromSolidityFixed = (n: any) => {
//   return n.mul(1000).div(SHIFT).toNumber() / 1000
// }

async function main() {
  let contractOwner: any;
  [contractOwner] = await ethers.getSigners();

  const skygazers = await ethers.getContractAt("SkyGazers","0x74927807a147AbE65270cba78caAE8898b756E1A");
  const tx2 = await (await skygazers.setURIroot(`ipfs://QmQptJSrqJCLLEotD2VK4cxHjTRMGZcWrFf29nTVWttzmi/`)).wait();



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
