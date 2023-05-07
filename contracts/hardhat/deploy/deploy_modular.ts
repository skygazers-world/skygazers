import "dotenv/config";
import hre, { ethers } from "hardhat";
import { utils } from "ethers";
import collections from "../collections";
import { expect } from "chai";
import fs from "fs";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

console.log(`connected to ${hre.network.name}`);
console.log(`network`, hre.network);

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

const stats = async () => {

  const gasPrice = await ethers.provider.getGasPrice();
  const gasPriceGwei = utils.formatUnits(gasPrice, "gwei");
  console.log(`gasPrice=${gasPriceGwei}`);
}

const deployTimeToken = async () => {
  // TimeToken
  // *************
  const TimeToken = await ethers.getContractFactory("TimeToken");
  console.log(`* Deploying TimeToken`);

  const timeToken = await TimeToken.deploy("Skygazers Time Token", "STT");
  console.log(`tt=`, timeToken);
  await timeToken.deployed();
  console.log(`Timetoken deployed at ${timeToken.address}`);
  return { timeTokenAddress: timeToken.address }
}

const deploySkyGazersNFT = async (timeTokenAddress: string) => {
  // SkyGazers NFT
  // *************
  const SkyGazers = await ethers.getContractFactory("SkyGazers");
  console.log(`* Deploying SkyGazers`);
  const skygazers = await SkyGazers.deploy("Skygazers", "SG", timeTokenAddress);
  await skygazers.deployed();
  console.log(`Skygazers deployed at ${skygazers.address}`);
  return { skyGazersNFTAddress: skygazers.address }
}

const setNFTContract = async (timeTokenAddress: string, skyGazersNFTAddress: string) => {
  console.log(`* setNFTContract`);
  const MyContract = await ethers.getContractFactory("TimeToken");
  const timeToken = await MyContract.attach(timeTokenAddress);
  await timeToken.setNFTContract(skyGazersNFTAddress);
  console.log(`* transferOwnership`);
  await timeToken.transferOwnership(skyGazersNFTAddress);
}


const deployPaymentSplitter = async () => {
  // PaymentSplitter
  // ***************
  const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
  const wallets = [process.env.DAO_MULTISIG, ...process.env.WALLETS.split(",")];
  const shares = process.env.WALLETS_SHARES?.split(",");

  console.log(`* Splitter conf W=${wallets} , S=${shares}`);
  console.log(`* Deploying paymentSplitter`);
  const paymentSplitter = await PaymentSplitter.deploy(wallets, shares);
  await paymentSplitter.deployed();
  console.log(`paymentSplitter deployed at ${paymentSplitter.address}`);
  return { paymentSplitterAddress: paymentSplitter.address }
}

const deployCurveSaleMinter = async (skyGazersNFTAddress, paymentSplitterAddress) => {

  const SkyGazers = await ethers.getContractFactory("SkyGazers");
  const skygazers = await SkyGazers.attach(skyGazersNFTAddress);

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
    paymentSplitterAddress
  );
  await curveSaleMinter.deployed();
  console.log(`CurveSaleMinter deployed at ${curveSaleMinter.address}`);
  return { curveSaleMinterAddress: curveSaleMinter.address }
}

const initialize = async (curveSaleMinterAddress: string, skyGazersNFTAddress: string) => {

  const SkyGazers = await ethers.getContractFactory("SkyGazers");
  const skygazers = await SkyGazers.attach(skyGazersNFTAddress);
  console.log(`* Setting minter for skygazers to ${curveSaleMinterAddress}`)
  const tx1 = await (await skygazers.setMinter(curveSaleMinterAddress)).wait();

  console.log(`* Setting UriRoot to ${process.env.URIROOT}`);
  const tx2 = await (await skygazers.setURIroot(`${process.env.URIROOT}`)).wait();

  expect(await skygazers.URIroot()).to.equal(process.env.URIROOT);

}

async function main() {
  let contractOwner: any;
  [contractOwner] = await ethers.getSigners();

  console.log(`Deploying as ${contractOwner.address}`);

  await stats();

  const { timeTokenAddress } = await deployTimeToken();
  const { skyGazersNFTAddress } = await deploySkyGazersNFT(timeTokenAddress);
  await setNFTContract(timeTokenAddress, skyGazersNFTAddress);
  const { paymentSplitterAddress } = await deployPaymentSplitter();
  const { curveSaleMinterAddress } = await deployCurveSaleMinter(skyGazersNFTAddress, skyGazersNFTAddress, paymentSplitterAddress);
  await initialize(curveSaleMinterAddress, skyGazersNFTAddress);

  // // ProposalVoter
  // // ***************

  // // TODO - replace contractOwner with actual off-chain voter address
  // const _proposalVoter = await ethers.getContractFactory("ProposalVoter");
  // const proposalVoter = await _proposalVoter.deploy(await skygazers.address, contractOwner.address);
  // await proposalVoter.deployed();
  // console.log(`ProposalVoter deployed at ${proposalVoter.address}`);

  // write config 
  const dapp_config = {
    skygazers: {
      abi: require("../artifacts/contracts/SkyGazers.sol/SkyGazers.json").abi,
      address: skyGazersNFTAddress
    },
    timeToken: {
      abi: require("../artifacts/contracts/TimeToken.sol/TimeToken.json").abi,
      address: timeTokenAddress,
    },
    curveSaleMinter: {
      abi: require("../artifacts/contracts/CurveSaleMinter.sol/CurveSaleMinter.json").abi,
      address: curveSaleMinterAddress,
    },
    paymentSplitter: {
      abi: require("../artifacts/contracts/PaymentSplitter.sol/PaymentSplitter.json").abi,
      address: paymentSplitterAddress,
    },
    // proposalVoter: {
    //   abi: require("../artifacts/contracts/ProposalVoter.sol/ProposalVoter.json").abi,
    //   address: proposalVoter.address,
    // }
  };
  fs.writeFileSync(`../../frontend/chainconfig-${hre.network.name}.json`, JSON.stringify(dapp_config, null, 2));

  // mint one NFT to test
  // console.log(`* Minting one NFT`);
  // await (await curveSaleMinter.mintItems([0], { value: ethers.utils.parseEther('0.5') })).wait();
  // console.log(`tokenURI ` + await skygazers.tokenURI(0));

  // const balance = await ethers.provider.getBalance(paymentSplitter.address);;

  // console.log(`paymentSplitter balance is ${balance}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
