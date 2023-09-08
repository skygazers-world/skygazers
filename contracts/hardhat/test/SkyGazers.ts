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

const testmint = true;

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
    let contractOwner: any, user1_that_mints: any, user2_that_mints: any, receiver_of_minting_eth: any;
    let founder1_wallet: any, founder2_wallet: any, dao_wallet: any;
    let o1: any, o2: any, o3: any, o4: any, o5: any;
    let snapshotVoteManager: any;
    let hacker_account: any;
    let proposalVoter: any;
    const user1_that_mints_mintAmount = 3;

    describe("Skygazers NFT", async () => {
        beforeEach(async function () {
            [
                contractOwner,
                user1_that_mints,
                user2_that_mints,
                receiver_of_minting_eth,
                snapshotVoteManager,
                founder1_wallet,
                founder2_wallet,
                dao_wallet,
                hacker_account,
                o1,
                o2,
                o3,
                o4,
                o5,
            ] = await ethers.getSigners();
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
            console.log(`deploy TT`);
            const _TimeToken = await ethers.getContractFactory("TimeToken");
            timeToken = await _TimeToken.connect(contractOwner).deploy("Skygazers Time Token", "SGTT");
            console.log(`deploy SG`);

            const _skyGazers = await ethers.getContractFactory("SkyGazers");
            skyGazers = await _skyGazers.connect(contractOwner).deploy("Skygazers", "SG", timeToken.address);

            console.log(`set NFT contract to ${skyGazers.address} o1=${founder1_wallet.address} o2=${founder2_wallet.address}`);
            await timeToken.setNFTContract(skyGazers.address, [
                founder1_wallet.address,
                founder2_wallet.address
            ], 100);

            console.log(`transfer ownership to ${skyGazers.address}`);

            await timeToken.transferOwnership(skyGazers.address);

            // expect(await timeToken.balanceOf(founder1_wallet.address)).to.equal(1);

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
            await skyGazers.connect(contractOwner).setMinter(curveSaleMinter1.address);
        });

        const checkBalances = async () => {
            const tt_totalSupply = ethers.BigNumber.from(await timeToken.totalSupply());
            const tt_f1_b = ethers.BigNumber.from(await timeToken.balanceOf(founder1_wallet.address));
            const tt_f2_b = ethers.BigNumber.from(await timeToken.balanceOf(founder2_wallet.address));
            const tt_o1_b = ethers.BigNumber.from(await timeToken.balanceOf(o1.address));
            const tt_o2_b = ethers.BigNumber.from(await timeToken.balanceOf(o2.address));
            const tt_o3_b = ethers.BigNumber.from(await timeToken.balanceOf(o3.address));
            const tt_o4_b = ethers.BigNumber.from(await timeToken.balanceOf(o4.address));
            const tt_o5_b = ethers.BigNumber.from(await timeToken.balanceOf(o5.address));
            console.log(`f1=${tt_f1_b}`);
            console.log(`f2=${tt_f2_b}`);
            console.log(`o1=${tt_o1_b}`);
            console.log(`o2=${tt_o2_b}`);
            console.log(`o3=${tt_o3_b}`);
            console.log(`o4=${tt_o4_b}`);
            console.log(`o5=${tt_o5_b}`);

            const tt_totalBalance = await timeToken.totalBalance();
            const tt_time = await timeToken.time();
            const tt_totalBalance_t = await timeToken.totalBalance_t();
            const tt_delta = await timeToken.timeDelta();
            console.log(`totalBalance=${tt_totalBalance.toString()}`)
            console.log(`totalBalance_t=${tt_totalBalance_t}`);
            console.log(`t-totalBalance_t=${tt_delta.toString()}`)
            const sg_totalSupply = await skyGazers.totalSupply();
            console.log(`sg_totalSupply=${sg_totalSupply.toString()}`)
            console.log(`tt_totalsupply=totalBalance+(t-totalBalance_t)*sg_totalSupply`);
            console.log(`tt_totalsupply=${tt_totalSupply}`);

            expect(tt_f1_b.add(tt_f2_b).add(tt_o1_b).add(tt_o2_b).add(tt_o3_b).add(tt_o4_b).add(tt_o5_b)).to.equal(tt_totalSupply);
            console.log(`Balance check OK`);
            console.log("------");
        }


        if (testmint) {
            it("Should be able to mint if given enough ETH", async () => {
                // const [contractOwner, user1_that_mints, receiver_of_minting_eth] = await ethers.getSigners();

                // const collectionParams = collections[0];

                // var fs = require('fs');
                // // var logStream = fs.createWriteStream('prices.txt');

                // let mintPrices = [];    // amount of NFTs to mint for this user
                // for (let i = 0; i < (user1_that_mints_mintAmount || (collectionParams.amount - 1)); i++) {

                // console.log(`${i}: mint price ${ethers.utils.formatUnits(await curveSaleMinter1.p(), 18)} ETH`);
                // const _currentprice = await curveSaleMinter1.p();
                // console.log(`p=${JSON.stringify(_currentprice)} - ${_currentprice.toString()}`);
                // mintPrices[i] = _currentprice.toString();

                // logStream.write(`${i};${parseFloat(_currentprice).toFixed(4)}\n`);
                // mint an NFT
                // let tt_totalSupply;
                // tt_totalSupply = await timeToken.totalSupply();
                // console.log(`totalsupply=${tt_totalSupply}`);

                await checkBalances();

                console.log("MINT!");
                // mint some NFTs
                await curveSaleMinter1.connect(o1).mintItems([0], { value: ethers.utils.parseEther('900') });
                await curveSaleMinter1.connect(o2).mintItems([100 + 0], { value: ethers.utils.parseEther('900') });
                await curveSaleMinter1.connect(o2).mintItems([100 + 1], { value: ethers.utils.parseEther('900') });

                await checkBalances();
                await ethers.provider.send('evm_increaseTime', [600]);
                await ethers.provider.send('evm_mine', []);
                await checkBalances();

                // mint some NFTs
                await curveSaleMinter1.connect(o3).mintItems([200 + 0], { value: ethers.utils.parseEther('900') });
                await curveSaleMinter1.connect(o3).mintItems([200 + 1], { value: ethers.utils.parseEther('900') });
            });
            it("Should be possible to transfer timetokens", async () => {

                // transfer some timetokens
                await timeToken.connect(o2).transfer(o3.address, 1);

                await checkBalances();
                await ethers.provider.send('evm_increaseTime', [600]);
                await ethers.provider.send('evm_mine', []);
                await checkBalances();

                // transfer some timetokens
                await timeToken.connect(o2).transfer(o3.address, 600);

                await checkBalances();
                await ethers.provider.send('evm_increaseTime', [600]);
                await ethers.provider.send('evm_mine', []);
                await checkBalances();
            });
            it("Should be possible to burn timetokens", async () => {

                // burn some timetokens
                await skyGazers.connect(o2).transferFrom(o2.address, 1, 100);

                await checkBalances();
                await ethers.provider.send('evm_increaseTime', [500]);
                await ethers.provider.send('evm_mine', []);
                await checkBalances();


                await timeToken.connect(o2).transfer(o3.address, 600);

                await checkBalances();
                await ethers.provider.send('evm_increaseTime', [600]);
                await ethers.provider.send('evm_mine', []);
                await checkBalances();



                // const _c = fromSolidityFixed(await curveSaleMinter1.c())
                // const _dc = fromSolidityFixed(await curveSaleMinter1.dc())
                // const _p = ethers.utils.formatUnits(await curveSaleMinter1.p(), 18)
                // const _dp = fromSolidityFixed(await curveSaleMinter1.dp())
                // const _nextprice = ethers.utils.formatUnits(await curveSaleMinter1.p(), 18);

                // console.log(`paymentSplitter balance is ${await ethers.provider.getBalance(paymentSplitter.address)}`);

                // for (let i = 0; i < 3; i++) {
                //     console.log("ZzZ");
                //     await ethers.provider.send('evm_increaseTime', [10 - 1]);
                //     await ethers.provider.send('evm_mine', []);

                //     await timeToken.connect(user1_that_mints).transfer(user2_that_mints.address, 1);

                //     console.log(`totalBalance=${await timeToken.totalBalance()}`)
                //     console.log(`totalBalance_t=${await timeToken.totalBalance_t()}`)

                //     tt_delta = await timeToken.timeDelta();
                //     console.log(`Delta T=${tt_delta.toString()}`)

                //     const tt_user1_b = await timeToken.balanceOf(user1_that_mints.address);
                //     console.log(`user 1 balance=${tt_user1_b.toString()}`)

                //     // expect(tt_user1_b).to.be.equal(tt_totalSupply);


                //     let tt_user2_b = await timeToken.balanceOf(user2_that_mints.address);
                //     console.log(`user 2 balance=${tt_user2_b.toString()}`)

                //     // console.log("MINT!");
                //     // await curveSaleMinter1.connect(user1_that_mints).mintItems([i+1], { value: ethers.utils.parseEther('900') });

                //     tt_totalSupply = await timeToken.totalSupply();
                //     console.log(`TT totalsupply=${tt_totalSupply}`);
                //     console.log(`SG totalsupply=${await skyGazers.totalSupply()}`);
                // }

                // }

                // // write price curve for use in dapp - only if it's a full-run
                // if (!user1_that_mints_mintAmount) {
                //     fs.writeFileSync(`../../frontend/pricecurve-${collectionParams.name}.json`, JSON.stringify(mintPrices, null, 2));
                // } else {
                //     console.log("skipping writing of pricecurve data (not a full run)")
                // }
            });


            // it("Should deploy CurveSaleMinter for collection 2", async () => {
            //     const _minter = await ethers.getContractFactory("CurveSaleMinter");
            //     const collectionParams = collections[1];
            //     console.log(`collection: ${collectionParams.name}`)
            //     curveSaleMinter2 = await _minter.connect(contractOwner).deploy(
            //         skyGazers.address,
            //         collectionParams.offset,
            //         collectionParams.amount,
            //         toSolidityFixed(collectionParams.c[0], collectionParams.c[1]),
            //         toSolidityFixed(collectionParams.dc[0], collectionParams.dc[1]),
            //         ethers.utils.parseUnits(collectionParams.p[0], collectionParams.p[1]),             // initial NFT price
            //         toSolidityFixed(collectionParams.dp[0], collectionParams.dp[1]),
            //         paymentSplitter.address
            //     );
            //     skyGazers.connect(contractOwner).setMinter(curveSaleMinter2.address);
            // });


            // it("Should be able to mint in collection2 if given enough ETH", async () => {
            //     // const [contractOwner, user1_that_mints, receiver_of_minting_eth] = await ethers.getSigners();

            //     const collectionParams = collections[1];

            //     var fs = require('fs');
            //     // var logStream = fs.createWriteStream('prices.txt');

            //     let mintPrices = [];    // amount of NFTs to mint for this user
            //     for (let i = 0; i < (user1_that_mints_mintAmount || (collectionParams.amount - 1)); i++) {
            //         const offset = collectionParams.offset + i;
            //         console.log(`${offset}: mint price ${ethers.utils.formatUnits(await curveSaleMinter2.p(), 18)} ETH`);
            //         const _currentprice = await curveSaleMinter2.p();
            //         console.log(`p=${JSON.stringify(_currentprice)} - ${_currentprice.toString()}`);
            //         mintPrices[i] = _currentprice.toString();

            //         // logStream.write(`${i};${parseFloat(_currentprice).toFixed(4)}\n`);
            //         // mint an NFT
            //         await curveSaleMinter2.connect(user1_that_mints).mintItems([offset], { value: ethers.utils.parseEther('900') });

            //         const _c = fromSolidityFixed(await curveSaleMinter2.c())
            //         const _dc = fromSolidityFixed(await curveSaleMinter2.dc())
            //         const _p = ethers.utils.formatUnits(await curveSaleMinter2.p(), 18)
            //         const _dp = fromSolidityFixed(await curveSaleMinter2.dp())
            //         const _nextprice = ethers.utils.formatUnits(await curveSaleMinter2.p(), 18);

            //         console.log(`paymentSplitter balance is ${await ethers.provider.getBalance(paymentSplitter.address)}`);

            //         await ethers.provider.send('evm_increaseTime', [600]);
            //         await ethers.provider.send('evm_mine', []);

            //     }

            // });


            // it("Should be able to release from splitter", async () => {
            //     console.log(`founder1_wallet balance is ${await ethers.provider.getBalance(founder1_wallet.address)}`);
            //     await paymentSplitter['release(address)'](founder1_wallet.address);
            //     console.log(`after release founder1_wallet balance is ${await ethers.provider.getBalance(founder1_wallet.address)}`);
            // });
        }

    });

    // if (testmint) {

    //     describe("Adventure voting", async () => {
    //         const NFTid = 0;    // an NFTid owned by user1_that_mints

    //         it("Should deploy ProposalVoter", async () => {
    //             const _proposalVoter = await ethers.getContractFactory("ProposalVoter");
    //             proposalVoter = await _proposalVoter.deploy(await skyGazers.address, snapshotVoteManager.address);

    //             expect(await proposalVoter.address).to.exist;
    //         });

    //         it("Should create a vote for NFT #0", async () => {
    //             await proposalVoter.connect(user1_that_mints).submitVote(0, "Qmtralala");
    //         });
    //         it("Should create a vote for NFT #1", async () => {
    //             await proposalVoter.connect(user1_that_mints).submitVote(1, "QmQuaakQuaak");
    //         });

    //         it("Should be impossible for a non-owner to submit a vote", async () => {
    //             await expect(
    //                 proposalVoter.connect(hacker_account).submitVote(0, "Qmtralala")
    //             ).to.be.revertedWith("Only the NFT owner can perform this action.");
    //         });

    //         // it("Should be possible to set state of a vote from the manager ", async () => {
    //         //     await proposalVoter.connect(snapshotVoteManager).submitVote(0, "Qmtralala");
    //         // });
    //     });
    // }
    // describe("dapp provisioning", async () => {
    //     it("Should write chainconfig.json", async () => {
    //         const dapp_config = {
    //             skygazers: {
    //                 abi: require("../artifacts/contracts/SkyGazers.sol/SkyGazers.json").abi,
    //                 address: skyGazers.address
    //             },
    //             timeToken: {
    //                 abi: require("../artifacts/contracts/TimeToken.sol/TimeToken.json").abi,
    //                 address: timeToken.address,
    //             },
    //             curveSaleMinter: {
    //                 abi: require("../artifacts/contracts/CurveSaleMinter.sol/CurveSaleMinter.json").abi,
    //                 address: curveSaleMinter1.address,
    //             },
    //             // proposalVoter: {
    //             //     abi: require("../artifacts/contracts/ProposalVoter.sol/ProposalVoter.json").abi,
    //             //     address: proposalVoter.address,
    //             // }
    //         };
    //         fs.writeFileSync(`../../frontend/chainconfig-${hre.network.name}.json`, JSON.stringify(dapp_config, null, 2));
    //     });
    // });


});
