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
let custom_gasPrice;
let deployer;
let verifyCommands = [];

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

const getGasPrice = async () => {

  const gasPrice = await ethers.provider.getGasPrice();
  const gasPriceGwei = utils.formatUnits(gasPrice, "gwei");
  console.log(`network gasPrice=${gasPriceGwei}`);

  custom_gasPrice = gasPrice.mul(150).div(100);
  const custom_gasPriceGwei = utils.formatUnits(custom_gasPrice, "gwei");
  console.log(`custom gasPrice=${custom_gasPriceGwei}`);

  const [d] = await ethers.getSigners();
  deployer = d;
  const nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log(`nonce=${nonce}`);
}

const deployTimeToken = async () => {
  // TimeToken
  // *************
  await getGasPrice();

  const TimeToken = await ethers.getContractFactory("TimeToken");
  console.log(`* Deploying TimeToken`);

  // const timeToken = await TimeToken.deploy("Skygazers Time Token", "STT", process.env.WALLETS.split(","), process.env.TT_PER_WALLET, { gasPrice: custom_gasPrice });
  // console.log(`Deploying TxHash=${timeToken?.deployTransaction?.hash}`);
  // console.log("tt=", timeToken);



  const dt = await TimeToken.getDeployTransaction("Skygazers Time Token", "STT");
  // const paymentSplitter = await PaymentSplitter.deploy(wallets, shares, { gasPrice: custom_gasPrice });
  const t = {
    ...dt,
    // type: 2,
    gasPrice: custom_gasPrice
  }
  const tx = await deployer.sendTransaction(t);
  console.log(`Deploying TxHash=`, tx.hash); //${timeToken?.deployTransaction?.hash}`);
  await deployer.provider.waitForTransaction(tx.hash);
  console.log(`Timetoken deployed at ${tx.creates}`);
  const vc = `npx hardhat verify --network sepolia ${tx.creates} "Skygazers Time Token" "STT"`;
  console.log(vc);
  verifyCommands.push(vc);
  return { timeTokenAddress: tx.creates }
}

const deploySkyGazersNFT = async (timeTokenAddress: string) => {
  // SkyGazers NFT
  // *************
  await getGasPrice();
  const SkyGazers = await ethers.getContractFactory("SkyGazers");
  console.log(`* Deploying SkyGazers`);
  const skygazers = await SkyGazers.deploy("Skygazers", "SG", timeTokenAddress, { gasPrice: custom_gasPrice });
  console.log(`Deploying TxHash=${skygazers?.deployTransaction?.hash}`);
  await skygazers.deployed();
  console.log(`Skygazers deployed at ${skygazers.address}`);
  const vc = `npx hardhat verify --network sepolia ${skygazers.address} "Skygazers" "SG" ${timeTokenAddress}`;
  console.log(vc);
  verifyCommands.push(vc);
  return { skyGazersNFTAddress: skygazers.address }
}

const setNFTContract = async (timeTokenAddress: string, skyGazersNFTAddress: string) => {
  console.log(`* setNFTContract`);
  await getGasPrice();
  const MyContract = await ethers.getContractFactory("TimeToken");
  const timeToken = await MyContract.attach(timeTokenAddress);
  const tx1 = await timeToken.setNFTContract(skyGazersNFTAddress, process.env.WALLETS.split(","), process.env.TT_PER_WALLET);
  console.log(`txhash=${tx1.hash}`)
  const tx1_receipt = await tx1.wait();

  console.log(`* transferOwnership`);
  await getGasPrice();
  await (await timeToken.transferOwnership(skyGazersNFTAddress)).wait();

  // const b1 = await timeToken.balanceOf(process.env.WALLETS.split(",")[0]);
  // console.log(`wallet ${process.env.WALLETS.split(",")[0]} has ${b1.toString()} tokens`)
  // const b2 = await timeToken.balanceOf(process.env.WALLETS.split(",")[1]);
  // console.log(`wallet ${process.env.WALLETS.split(",")[1]} has ${b2.toString()} tokens`)


}


const deployPaymentSplitter = async () => {
  // PaymentSplitter
  // ***************
  await getGasPrice();
  const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
  const wallets = [process.env.DAO_MULTISIG, ...process.env.WALLETS.split(",")];
  const shares = process.env.WALLETS_SHARES?.split(",");

  console.log(`* Splitter conf W=${wallets} , S=${shares}`);
  console.log(`* Deploying paymentSplitter`);
  // const dt = await PaymentSplitter.getDeployTransaction(wallets, shares);
  const paymentSplitter = await PaymentSplitter.deploy(wallets, shares, { gasPrice: custom_gasPrice });
  console.log(`Deploying TxHash=${paymentSplitter?.deployTransaction?.hash}`);
  await paymentSplitter.deployed();
  console.log(`paymentSplitter deployed at ${paymentSplitter.address}`);
  fs.writeFileSync(`./${paymentSplitter.address}_args.js`, `module.exports=${JSON.stringify([wallets, shares])}`);
  const vc = `npx hardhat verify --network sepolia --constructor-args ./${paymentSplitter.address}_args.js ${paymentSplitter.address}`;
  verifyCommands.push(vc);
  return { paymentSplitterAddress: paymentSplitter.address }
}

const deployCurveSaleMinter = async (skyGazersNFTAddress, paymentSplitterAddress) => {

  const SkyGazers = await ethers.getContractFactory("SkyGazers");
  const skygazers = await SkyGazers.attach(skyGazersNFTAddress);

  // CurveSaleMinter
  // ***************
  await getGasPrice();
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
    paymentSplitterAddress,
    { gasPrice: custom_gasPrice }
  );
  console.log(`Deploying TxHash=${curveSaleMinter?.deployTransaction?.hash}`);
  await curveSaleMinter.deployed();
  console.log(`CurveSaleMinter deployed at ${curveSaleMinter.address}`);
  fs.writeFileSync(`./${curveSaleMinter.address}_args.js`, `module.exports=${JSON.stringify([
    skygazers.address,
    collectionParams.offset,
    collectionParams.amount,
    toSolidityFixed(collectionParams.c[0], collectionParams.c[1]),
    toSolidityFixed(collectionParams.dc[0], collectionParams.dc[1]),
    ethers.utils.parseUnits(collectionParams.p[0], collectionParams.p[1]),             // initial NFT price
    toSolidityFixed(collectionParams.dp[0], collectionParams.dp[1]),
    paymentSplitterAddress,
  ])}`);
  const vc = `npx hardhat verify --network sepolia --constructor-args ./${curveSaleMinter.address}_args.js ${curveSaleMinter.address}`;
  verifyCommands.push(vc);
  return { curveSaleMinterAddress: curveSaleMinter.address }
}

const initialize = async (curveSaleMinterAddress: string, skyGazersNFTAddress: string) => {

  const SkyGazers = await ethers.getContractFactory("SkyGazers");
  const skygazers = await SkyGazers.attach(skyGazersNFTAddress);
  console.log(`* Setting minter for skygazers to ${curveSaleMinterAddress}`)
  await getGasPrice();
  const tx1 = await skygazers.setMinter(curveSaleMinterAddress);
  console.log(`txhash=${tx1.hash}`)
  const tx1_receipt = await tx1.wait();

  console.log(`* Setting UriRoot to ${process.env.URIROOT}`);
  await getGasPrice();
  const tx2 = await skygazers.setURIroot(`${process.env.URIROOT}`);
  console.log(`txhash=${tx2.hash}`)
  const tx2_receipt = await tx2.wait();

  expect(await skygazers.URIroot()).to.equal(process.env.URIROOT);

}

async function main() {
  let contractOwner: any;
  [contractOwner] = await ethers.getSigners();

  console.log(`Deploying as ${contractOwner.address}`);


  let timeTokenAddress = null;
  let skyGazersNFTAddress = null;
  let paymentSplitterAddress = null;
  let curveSaleMinterAddress = null;

  if (!timeTokenAddress) {
    const { timeTokenAddress: r } = await deployTimeToken();
    timeTokenAddress = r;
  }

  if (!skyGazersNFTAddress) {
    const { skyGazersNFTAddress: r } = await deploySkyGazersNFT(timeTokenAddress);
    skyGazersNFTAddress = r;
    await setNFTContract(timeTokenAddress, skyGazersNFTAddress);
  }
  if (!paymentSplitterAddress) {
    const { paymentSplitterAddress: r } = await deployPaymentSplitter();
    paymentSplitterAddress = r;
  }
  if (!curveSaleMinterAddress) {
    const { curveSaleMinterAddress: r } = await deployCurveSaleMinter(skyGazersNFTAddress, paymentSplitterAddress);
    curveSaleMinterAddress = r;
    await initialize(curveSaleMinterAddress, skyGazersNFTAddress);
  }

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

  fs.writeFileSync(`./verify-${hre.network.name}.sh`, verifyCommands.reduce((accum, l) => { return (accum + `${l}\n`) }, ""));

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
