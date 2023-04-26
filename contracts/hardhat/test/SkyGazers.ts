import hre, { ethers } from "hardhat";
import { use, expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { any } from "hardhat/internal/core/params/argumentTypes";
// import { ethers } from "ethers";
// const { solidity } from "ethereum-waffle");
import fs from "fs";
import { subtask } from "hardhat/config";
console.log(`connected to ${hre.network.name}`);
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const testmint = false;

// use(solidity);
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

import collections from "../collections";

describe("SKYG", async () => {

    let skyGazers: any, timeToken: any, curveSaleMinter1: any, curveSaleMinter2: any, paymentSplitter: any;
    let contractOwner: any, user_that_mints: any, receiver_of_minting_eth: any;
    let founder1_wallet: any, founder2_wallet: any, dao_wallet: any;
    let snapshotVoteManager: any;
    let hacker_account: any;
    let proposalVoter: any;
    const user_that_mints_mintAmount = 3;

    describe("Skygazers NFT", async () => {
        beforeEach(async function () {
            [contractOwner,
                user_that_mints,
                receiver_of_minting_eth,
                snapshotVoteManager,
                founder1_wallet,
                founder2_wallet,
                dao_wallet,
                hacker_account] = await ethers.getSigners();
        })

        it("Should deploy Skygazers NFT (SKYG) and time token (SGT)", async () => {

            const wallets = [dao_wallet.address, founder1_wallet.address, founder2_wallet.address];
            const shares = [6, 2, 2];

            console.log(`* Splitter conf W=${wallets} , S=${shares}`);
            const _PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
            paymentSplitter = await _PaymentSplitter.deploy(wallets, shares);

            expect(await paymentSplitter.address).to.exist;
            expect(await paymentSplitter.totalShares()).to.equal(ethers.BigNumber.from(10));
            expect(await paymentSplitter.payee(0)).to.equal(dao_wallet.address);

            const _TimeToken = await ethers.getContractFactory("TimeToken");
            timeToken = await _TimeToken.connect(contractOwner).deploy("Skygazers Time Token", "SGTT");

            const _skyGazers = await ethers.getContractFactory("SkyGazers");
            skyGazers = await _skyGazers.connect(contractOwner).deploy("Skygazers", "SG", timeToken.address);

            await timeToken.setNFTContract(skyGazers.address);
            await timeToken.transferOwnership(skyGazers.address);

            expect(await skyGazers.address).to.exist;
            expect(timeToken).to.exist;
        });

        it("Should deploy CurveSaleMinter for collection 1", async () => {
            const _minter = await ethers.getContractFactory("CurveSaleMinter");
            const collectionParams = collections[0];
            console.log(`collection: ${collectionParams.name}`)
            curveSaleMinter1 = await _minter.connect(contractOwner).deploy(
                skyGazers.address,
                collectionParams.offset,
                collectionParams.amount,
                toSolidityFixed(collectionParams.c[0], collectionParams.c[1]),
                toSolidityFixed(collectionParams.dc[0], collectionParams.dc[1]),
                ethers.utils.parseUnits(collectionParams.p[0], collectionParams.p[1]),             // initial NFT price
                toSolidityFixed(collectionParams.dp[0], collectionParams.dp[1]),
                paymentSplitter.address
            );
            skyGazers.connect(contractOwner).setMinter(curveSaleMinter1.address);
        });

        if (testmint) {
            it("Should be able to mint if given enough ETH", async () => {
                // const [contractOwner, user_that_mints, receiver_of_minting_eth] = await ethers.getSigners();

                const collectionParams = collections[0];

                var fs = require('fs');
                // var logStream = fs.createWriteStream('prices.txt');

                let mintPrices = [];    // amount of NFTs to mint for this user
                for (let i = 0; i < (user_that_mints_mintAmount || (collectionParams.amount - 1)); i++) {

                    console.log(`${i}: mint price ${ethers.utils.formatUnits(await curveSaleMinter1.p(), 18)} ETH`);
                    const _currentprice = await curveSaleMinter1.p();
                    console.log(`p=${JSON.stringify(_currentprice)} - ${_currentprice.toString()}`);
                    mintPrices[i] = _currentprice.toString();

                    // logStream.write(`${i};${parseFloat(_currentprice).toFixed(4)}\n`);
                    // mint an NFT
                    await curveSaleMinter1.connect(user_that_mints).mintItems([i], { value: ethers.utils.parseEther('900') });

                    const _c = fromSolidityFixed(await curveSaleMinter1.c())
                    const _dc = fromSolidityFixed(await curveSaleMinter1.dc())
                    const _p = ethers.utils.formatUnits(await curveSaleMinter1.p(), 18)
                    const _dp = fromSolidityFixed(await curveSaleMinter1.dp())
                    const _nextprice = ethers.utils.formatUnits(await curveSaleMinter1.p(), 18);

                    console.log(`paymentSplitter balance is ${await ethers.provider.getBalance(paymentSplitter.address)}`);

                    await ethers.provider.send('evm_increaseTime', [600]);
                    await ethers.provider.send('evm_mine', []);

                }

                // write price curve for use in dapp - only if it's a full-run
                if (!user_that_mints_mintAmount) {
                    fs.writeFileSync(`../../frontend/pricecurve-${collectionParams.name}.json`, JSON.stringify(mintPrices, null, 2));
                } else {
                    console.log("skipping writing of pricecurve data (not a full run)")
                }
            });


            it("Should deploy CurveSaleMinter for collection 2", async () => {
                const _minter = await ethers.getContractFactory("CurveSaleMinter");
                const collectionParams = collections[1];
                console.log(`collection: ${collectionParams.name}`)
                curveSaleMinter2 = await _minter.connect(contractOwner).deploy(
                    skyGazers.address,
                    collectionParams.offset,
                    collectionParams.amount,
                    toSolidityFixed(collectionParams.c[0], collectionParams.c[1]),
                    toSolidityFixed(collectionParams.dc[0], collectionParams.dc[1]),
                    ethers.utils.parseUnits(collectionParams.p[0], collectionParams.p[1]),             // initial NFT price
                    toSolidityFixed(collectionParams.dp[0], collectionParams.dp[1]),
                    paymentSplitter.address
                );
                skyGazers.connect(contractOwner).setMinter(curveSaleMinter2.address);
            });


            it("Should be able to mint in collection2 if given enough ETH", async () => {
                // const [contractOwner, user_that_mints, receiver_of_minting_eth] = await ethers.getSigners();

                const collectionParams = collections[1];

                var fs = require('fs');
                // var logStream = fs.createWriteStream('prices.txt');

                let mintPrices = [];    // amount of NFTs to mint for this user
                for (let i = 0; i < (user_that_mints_mintAmount || (collectionParams.amount - 1)); i++) {
                    const offset = collectionParams.offset + i;
                    console.log(`${offset}: mint price ${ethers.utils.formatUnits(await curveSaleMinter2.p(), 18)} ETH`);
                    const _currentprice = await curveSaleMinter2.p();
                    console.log(`p=${JSON.stringify(_currentprice)} - ${_currentprice.toString()}`);
                    mintPrices[i] = _currentprice.toString();

                    // logStream.write(`${i};${parseFloat(_currentprice).toFixed(4)}\n`);
                    // mint an NFT
                    await curveSaleMinter2.connect(user_that_mints).mintItems([offset], { value: ethers.utils.parseEther('900') });

                    const _c = fromSolidityFixed(await curveSaleMinter2.c())
                    const _dc = fromSolidityFixed(await curveSaleMinter2.dc())
                    const _p = ethers.utils.formatUnits(await curveSaleMinter2.p(), 18)
                    const _dp = fromSolidityFixed(await curveSaleMinter2.dp())
                    const _nextprice = ethers.utils.formatUnits(await curveSaleMinter2.p(), 18);

                    console.log(`paymentSplitter balance is ${await ethers.provider.getBalance(paymentSplitter.address)}`);

                    await ethers.provider.send('evm_increaseTime', [600]);
                    await ethers.provider.send('evm_mine', []);

                }

            });


            it("Should be able to release from splitter", async () => {
                console.log(`founder1_wallet balance is ${await ethers.provider.getBalance(founder1_wallet.address)}`);
                await paymentSplitter['release(address)'](founder1_wallet.address);
                console.log(`after release founder1_wallet balance is ${await ethers.provider.getBalance(founder1_wallet.address)}`);
            });
        }

    });

    if (testmint) {

        describe("Adventure voting", async () => {
            const NFTid = 0;    // an NFTid owned by user_that_mints

            it("Should deploy ProposalVoter", async () => {
                const _proposalVoter = await ethers.getContractFactory("ProposalVoter");
                proposalVoter = await _proposalVoter.deploy(await skyGazers.address, snapshotVoteManager.address);

                expect(await proposalVoter.address).to.exist;
            });

            it("Should create a vote for NFT #0", async () => {
                await proposalVoter.connect(user_that_mints).submitVote(0, "Qmtralala");
            });
            it("Should create a vote for NFT #1", async () => {
                await proposalVoter.connect(user_that_mints).submitVote(1, "QmQuaakQuaak");
            });

            it("Should be impossible for a non-owner to submit a vote", async () => {
                await expect(
                    proposalVoter.connect(hacker_account).submitVote(0, "Qmtralala")
                ).to.be.revertedWith("Only the NFT owner can perform this action.");
            });

            // it("Should be possible to set state of a vote from the manager ", async () => {
            //     await proposalVoter.connect(snapshotVoteManager).submitVote(0, "Qmtralala");
            // });
        });
    }
    describe("dapp provisioning", async () => {
        it("Should write chainconfig.json", async () => {
            const dapp_config = {
                skygazers: {
                    abi: require("../artifacts/contracts/SkyGazers.sol/SkyGazers.json").abi,
                    address: skyGazers.address
                },
                timeToken: {
                    abi: require("../artifacts/contracts/TimeToken.sol/TimeToken.json").abi,
                    address: timeToken.address,
                },
                curveSaleMinter: {
                    abi: require("../artifacts/contracts/CurveSaleMinter.sol/CurveSaleMinter.json").abi,
                    address: curveSaleMinter1.address,
                },
                // proposalVoter: {
                //     abi: require("../artifacts/contracts/ProposalVoter.sol/ProposalVoter.json").abi,
                //     address: proposalVoter.address,
                // }
            };
            fs.writeFileSync(`../../frontend/chainconfig-${hre.network.name}.json`, JSON.stringify(dapp_config, null, 2));
        });
    });


});
