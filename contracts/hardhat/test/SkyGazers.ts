import hre, { ethers } from "hardhat";
import { use, expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { any } from "hardhat/internal/core/params/argumentTypes";
// import { ethers } from "ethers";
// const { solidity } from "ethereum-waffle");
import fs from "fs";
import { subtask } from "hardhat/config";
console.log("connected to ", hre.network.name);

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

// const collections:
//     [{
//         name: string,
//         offset: number,
//         amount: number,
//         c: [number, number],
//         dc: [number, number],
//         p: [string, number],
//         dp: [number, number]
//     }]
//     =
//     [
//         {
//             name: "droids",
//             offset: 0,
//             amount: 3000,
//             c: [50, 1],
//             dc: [1000, 1010],
//             p: ["120", 18 - 3],
//             dp: [110, 100]
//         }
//     ]


describe("SKYG", async () => {

    let skyGazers: any, timeToken: any, curveSaleMinter: any;
    let contractOwner: any, user_that_mints: any, receiver_of_minting_eth: any;
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
                hacker_account] = await ethers.getSigners();
        })

        it("Should deploy Skygazers NFT (SKYG) and time token (SGT)", async () => {
            const _skyGazers = await ethers.getContractFactory("SkyGazers");
            skyGazers = await _skyGazers.connect(contractOwner).deploy();
            const timeTokenAddr = await skyGazers.timeToken();

            const _timeToken = await ethers.getContractFactory("TimeToken");
            timeToken = await _timeToken.connect(contractOwner).attach(timeTokenAddr);

            expect(await skyGazers.address).to.exist;
            expect(timeToken).to.exist;
        });

        it("Should deploy CurveSaleMinter for collection 1", async () => {
            const _minter = await ethers.getContractFactory("CurveSaleMinter");

            const collectionParams = collections[0];

            curveSaleMinter = await _minter.connect(contractOwner).deploy(
                skyGazers.address,
                collectionParams.offset,
                collectionParams.amount,
                toSolidityFixed(collectionParams.c[0], collectionParams.c[1]),
                toSolidityFixed(collectionParams.dc[0], collectionParams.dc[1]),
                ethers.utils.parseUnits(collectionParams.p[0], collectionParams.p[1]),             // initial NFT price
                toSolidityFixed(collectionParams.dp[0], collectionParams.dp[1]),
                receiver_of_minting_eth.address
            );
            skyGazers.connect(contractOwner).setMinter(curveSaleMinter.address);

            console.log(`c ${fromSolidityFixed(await curveSaleMinter.c())}`);
            console.log(`dc ${fromSolidityFixed(await curveSaleMinter.dc())}`);
            console.log(`p ${ethers.utils.formatUnits(await curveSaleMinter.p(), 18)}`);
            console.log(`dc ${fromSolidityFixed(await curveSaleMinter.dp())}`);

            // const dapp_config = {
            //     skygazers: {
            //         abi: require("../artifacts/contracts/SkyGazers.sol/SkyGazers.json").abi,
            //         address: skyGazers.address
            //     },
            //     timeToken: {
            //         abi: require("../artifacts/contracts/TimeToken.sol/TimeToken.json").abi,
            //         address: timeToken.address,
            //     },
            //     curveSaleMinter: {
            //         abi: require("../artifacts/contracts/CurveSaleMinter.sol/CurveSaleMinter.json").abi,
            //         address: curveSaleMinter.address,
            //     }

            // };
            // fs.writeFileSync("../../frontend/chainconfig.json", JSON.stringify(dapp_config, null, 2));


        });


        it("Should be able to mint if given enough ETH", async () => {
            // const [contractOwner, user_that_mints, receiver_of_minting_eth] = await ethers.getSigners();

            const collectionParams = collections[0];

            var fs = require('fs');
            // var logStream = fs.createWriteStream('prices.txt');

            let mintPrices = [];    // amount of NFTs to mint for this user
            for (let i = 0; i < (user_that_mints_mintAmount || (collectionParams.amount - 1)); i++) {

                console.log(`${i}: mint price ${ethers.utils.formatUnits(await curveSaleMinter.p(), 18)} ETH`);

                // const _currentprice = ethers.utils.formatUnits(await curveSaleMinter.p(), 18);
                const _currentprice = await curveSaleMinter.p();
                console.log(`p=${JSON.stringify(_currentprice)} - ${_currentprice.toString()}`);
                mintPrices[i] = _currentprice.toString();

                // logStream.write(`${i};${parseFloat(_currentprice).toFixed(4)}\n`);
                // mint an NFT
                await curveSaleMinter.connect(user_that_mints).mintItems([i], { value: ethers.utils.parseEther('900') });

                const _c = fromSolidityFixed(await curveSaleMinter.c())
                const _dc = fromSolidityFixed(await curveSaleMinter.dc())
                const _p = ethers.utils.formatUnits(await curveSaleMinter.p(), 18)
                const _dp = fromSolidityFixed(await curveSaleMinter.dp())
                const _nextprice = ethers.utils.formatUnits(await curveSaleMinter.p(), 18);

                // console.log(`c: ${_c}, d: ${_dc}, p: ${_p}, dp: ${_dp} - next price: ${_nextprice}`)
                // console.log(`SkyGazers Balance for ${user_that_mints.address} is ${await skyGazers.balanceOf(user_that_mints.address)}`);
                // console.log(`receiver_of_minting_eth Balance is ${await ethers.provider.getBalance(receiver_of_minting_eth.address)}`);

                await ethers.provider.send('evm_increaseTime', [600]);
                await ethers.provider.send('evm_mine', []);

            }
            // logStream.end();
            console.log("prices", mintPrices)
            // write price curve for use in dapp
            fs.writeFileSync(`../../frontend/pricecurve-${collectionParams.name}.json`, JSON.stringify(mintPrices, null, 2));
            // logStream.end();
            console.log("prices", mintPrices)
            // write price curve for use in dapp - only if it's a full-run
            if (!user_that_mints_mintAmount) {
                fs.writeFileSync(`../../frontend/pricecurve-${collectionParams.name}.json`, JSON.stringify(mintPrices, null, 2));
            }
        });

        // it("Should not able to mint", async () => {
        //     // mint an NFT
        //     await expect(
        //         skyGazers.mintItem(1)
        //     ).to.be.revertedWith("Not yet minting");
        // });

        // it("Should set an auction", async () => {
        //     const currentTime = await time.latest();
        //     // create auction
        //     const [contractOwner, addr1] = await ethers.getSigners();
        //     await expect(
        //         skyGazers.setAuction(
        //             0, //uint256 _startIndexNFT, // offset in NFT list
        //             10, //uint256 _amountToAuction, // amount to sell
        //             currentTime, // uint256 _startTime,
        //             currentTime + 60, //uint256 _stopTime,
        //             ethers.utils.parseEther('1.44'),// uint256 _startPrice,
        //             ethers.utils.parseEther('0.04'), // uint256 _endPrice,
        //             addr1.address, //address premintAddress
        //         )
        //     )
        //         .to.emit(skyGazers, "SetAuction")
        //         .withArgs(currentTime);

        //     await expect(await skyGazers.amountToAuction()).to.equal(10);
        //     await expect(await skyGazers.startTime()).to.equal(currentTime);

        // });

        // it("Should wait 10s", async () => {
        //     await ethers.provider.send('evm_increaseTime', [11]);
        //     await ethers.provider.send('evm_mine', []);
        // });

        // it("Should be able to mint if given enough ETH", async () => {
        //     const [contractOwner, addr1] = await ethers.getSigners();

        //     // mint an NFT
        //     await skyGazers.mintItem(1, { value: ethers.utils.parseEther('1.44') });

        //     // const [contractOwner] = await ethers.getSigners();
        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(contractOwner.address);
        //     // console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //     // console.log(`SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 60s", async () => {
        //     const delay = 30;
        //     await ethers.provider.send('evm_increaseTime', [delay]);
        //     await ethers.provider.send('evm_mine', []);
        // });

        // it("Should see a balance of SKYG and SGT", async () => {
        //     const [contractOwner, addr1] = await ethers.getSigners();

        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(contractOwner.address);
        //     console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //     console.log(`SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should be able to mint 2nd NFT if given enough ETH", async () => {
        //     const [contractOwner, addr1] = await ethers.getSigners();

        //     // mint an NFT
        //     await skyGazers.mintItem(1, { value: ethers.utils.parseEther('1.44') });

        //     // const [contractOwner] = await ethers.getSigners();
        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(contractOwner.address);
        //     // console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //     // console.log(`SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should see a balance of SKYG and SGT", async () => {
        //     const [contractOwner, addr1] = await ethers.getSigners();

        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(contractOwner.address);
        //     console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //     console.log(`SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 120s", async () => {
        //     const delay = 120;
        //     await ethers.provider.send('evm_increaseTime', [delay]);
        //     await ethers.provider.send('evm_mine', []);
        // });

        // it("Should not be able to mint 3rd NFT if auction is over", async () => {
        //     await expect(
        //         skyGazers.mintItem(1, { value: ethers.utils.parseEther('10') })
        //     ).to.be.revertedWith("Minting is currently over");

        // });

        // it("Should see a balance of SKYG and SGT", async () => {
        //   const [contractOwner, addr1] = await ethers.getSigners();

        //   console.log(`contractOwner is ${contractOwner.address}`);
        //   console.log(`addr1 is ${addr1.address}`);

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(contractOwner.address);
        //   console.log(`contractOwner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);

        // });

        // it("Should send SKYG from contractOwner to addr1", async () => {
        //   const [contractOwner, addr1] = await ethers.getSigners();

        //   await skyGazers.transferFrom(contractOwner.address, addr1.address, 1);
        // });
        // it("Should see a balance of SKYG and SGT", async () => {
        //   const [contractOwner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(contractOwner.address);
        //   console.log(`contractOwner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);
        // });
        // it("Should wait 10s", async () => {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });

        // it("Should see an increased balance of SGT on addr1", async () => {
        //   const [contractOwner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //   console.log(`contractOwner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 10s", async () => {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });

        // it("Should see an increased balance of SGT on addr1", async () => {
        //   const [contractOwner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //   console.log(`contractOwner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should transfer NFT back to contractOwner", async () => {

        //   const [contractOwner, addr1] = await ethers.getSigners();

        //   await skyGazers.connect(addr1).transferFrom(addr1.address, contractOwner.address, 1);

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(contractOwner.address);
        //   console.log(`contractOwner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //   console.log(`contractOwner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 10s", async () => {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });
        // it("Should see increased SGT balance on contractOwner", async () => {
        //   const [contractOwner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(contractOwner.address);
        //   console.log(`contractOwner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);

        // });

    });

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
                    address: curveSaleMinter.address,
                },
                proposalVoter: {
                    abi: require("../artifacts/contracts/ProposalVoter.sol/ProposalVoter.json").abi,
                    address: proposalVoter.address,
                }
            };
            fs.writeFileSync("../../frontend/chainconfig.json", JSON.stringify(dapp_config, null, 2));
        });
    });


});
