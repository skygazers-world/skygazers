import "dotenv/config";
import hre, { ethers } from "hardhat";
import collections from "../collections";
import { expect } from "chai";
import fs from "fs";

console.log(`connected to ${hre.network.name}`);

const SHIFT = ethers.BigNumber.from("0x10000000000000000");
const toSolidityFixed = (n: Number, d: Number) => {
  return ethers.BigNumber
    .from(n)
    .mul(SHIFT)
    .div(ethers.BigNumber
      .from(d)).toString()
}
const fromSolidityFixed = (n: any) => {
  return n.mul(1000).div(SHIFT).toNumber() / 1000
}

async function main() {
  let contractOwner: any;
  [contractOwner] = await ethers.getSigners();

  console.log(`Deploying as ${contractOwner.address}`);


  // SkyGazers NFT
  // *************
  const SkyGazers = await ethers.getContractFactory("SkyGazers");
  console.log(`* Deploying SkyGazers`);
  const skygazers = await SkyGazers.deploy();
  // console.log(`tx sent - waiting for Tx to finish`,skygazers);
  await skygazers.deployed();
  console.log(`Skygazers deployed at ${skygazers.address}`);
  const timetokenAddress = await skygazers.timeToken();
  console.log(`Timetoken at`, timetokenAddress);

  // CurveSaleMinter
  // ***************
  const CurveSaleMinter = await ethers.getContractFactory("CurveSaleMinter");
  const collectionParams = collections[0];
  console.log(`* Deploying CurveSaleMinter`);
  const curveSaleMinter = await CurveSaleMinter.deploy(
    skygazers.address,
    collectionParams.offset,
    collectionParams.amount,
    toSolidityFixed(collectionParams.c[0], collectionParams.c[1]),
    toSolidityFixed(collectionParams.dc[0], collectionParams.dc[1]),
    ethers.utils.parseUnits(collectionParams.p[0], collectionParams.p[1]),             // initial NFT price
    toSolidityFixed(collectionParams.dp[0], collectionParams.dp[1]),
    contractOwner.address
  );
  await curveSaleMinter.deployed();
  console.log(`CurveSaleMinter deployed at ${curveSaleMinter.address}`);

  console.log(`* Setting minter for skygazers to ${curveSaleMinter.address}`)
  const tx1 = await (await skygazers.setMinter(curveSaleMinter.address)).wait();

  console.log(`* Setting UriRoot to ${process.env.URIROOT}`);
  const tx2 = await (await skygazers.setURIroot(`${process.env.URIROOT}`)).wait();

  expect(await skygazers.URIroot()).to.equal(process.env.URIROOT);

  // ProposalVoter
  // ***************

  // TODO - replace contractOwner with actual off-chain voter address
  const _proposalVoter = await ethers.getContractFactory("ProposalVoter");
  const proposalVoter = await _proposalVoter.deploy(await skygazers.address, contractOwner.address);
  await proposalVoter.deployed();
  console.log(`ProposalVoter deployed at ${proposalVoter.address}`);

  // write config 
  const dapp_config = {
    skygazers: {
      abi: require("../artifacts/contracts/SkyGazers.sol/SkyGazers.json").abi,
      address: skygazers.address
    },
    timeToken: {
      abi: require("../artifacts/contracts/TimeToken.sol/TimeToken.json").abi,
      address: timetokenAddress,
    },
    curveSaleMinter: {
      abi: require("../artifacts/contracts/CurveSaleMinter.sol/CurveSaleMinter.json").abi,
      address: curveSaleMinter.address,
    },
    proposalVoter: {
      abi: require("../artifacts/contracts/ProposalVoter.sol/ProposalVoter.json").abi,
      address: proposalVoter.address,
    }
  };
  fs.writeFileSync(`../../frontend/chainconfig-${hre.network.name}.json`, JSON.stringify(dapp_config, null, 2));

  // mint one NFT to test
  console.log(`* Minting one NFT`);
  await (await curveSaleMinter.mintItems([0], { value: ethers.utils.parseEther('0.5') })).wait();
  console.log(`tokenURI ` + await skygazers.tokenURI(0));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
