import { ethers } from "hardhat";
import { use, expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { any } from "hardhat/internal/core/params/argumentTypes";
// import { ethers } from "ethers";
// const { solidity } from "ethereum-waffle");
import fs from "fs";
import { subtask } from "hardhat/config";

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


describe("SKYG", async () => {
    let skyGazers: any, timeToken: any, curveSaleMinter: any;

    describe("Skygazers", async () => {

        it("Should deploy Skygazers NFT (SKYG) and time token (SGT)", async () => {
            const _skyGazers = await ethers.getContractFactory("SkyGazers");
            skyGazers = await _skyGazers.deploy();
            const timeTokenAddr = await skyGazers.timeToken();

            const _timeToken = await ethers.getContractFactory("TimeToken");
            timeToken = await _timeToken.attach(timeTokenAddr);

            expect(await skyGazers.address).to.exist;
            expect(timeToken).to.exist;
        });

        it("Should deploy CurveSaleMinter", async () => {
            const [owner, account1, funds_receiver] = await ethers.getSigners();
            const _minter = await ethers.getContractFactory("CurveSaleMinter");
            curveSaleMinter = await _minter.deploy(
                skyGazers.address,           //SkyGazers _token,
                0,                  //uint256 _offset,            // offset where to start in the collection
                3000,               // how many to mint
                toSolidityFixed(50, 1),
                toSolidityFixed(1000, 1010),
                ethers.utils.parseUnits("120", 18 - 3),             // initial NFT price
                toSolidityFixed(110, 100),
                funds_receiver.address
            );
            skyGazers.setMinter(curveSaleMinter.address);

            console.log(`c ${fromSolidityFixed(await curveSaleMinter.c())}`);
            console.log(`dc ${fromSolidityFixed(await curveSaleMinter.dc())}`);
            console.log(`p ${ethers.utils.formatUnits(await curveSaleMinter.p(), 18)}`);
            console.log(`dc ${fromSolidityFixed(await curveSaleMinter.dp())}`);

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
                }

            };
            console.log(skyGazers);
            fs.writeFileSync("../../frontend/chainconfig.json", JSON.stringify(dapp_config, 0, 2));


        });


        it("Should be able to mint if given enough ETH", async () => {
            const [owner, account1, funds_receiver] = await ethers.getSigners();

            var fs = require('fs');
            var logStream = fs.createWriteStream('prices.txt');

            for (let i = 0; i < 10 - 1; i++) {

                console.log(`${i + 1}: mint price ${ethers.utils.formatUnits(await curveSaleMinter.p(), 18)} ETH`);

                const _currentprice = ethers.utils.formatUnits(await curveSaleMinter.p(), 18);

                logStream.write(`${i + 1};${parseFloat(_currentprice).toFixed(4)}\n`);
                // mint an NFT
                await curveSaleMinter.connect(account1).mintItem(1 + i, { value: ethers.utils.parseEther('900') });

                const _c = fromSolidityFixed(await curveSaleMinter.c())
                const _dc = fromSolidityFixed(await curveSaleMinter.dc())
                const _p = ethers.utils.formatUnits(await curveSaleMinter.p(), 18)
                const _dp = fromSolidityFixed(await curveSaleMinter.dp())
                const _nextprice = ethers.utils.formatUnits(await curveSaleMinter.p(), 18);

                console.log(`c: ${_c}, d: ${_dc}, p: ${_p}, dp: ${_dp} - next price: ${_nextprice}`)


                console.log(`SkyGazers Balance is ${await skyGazers.balanceOf(account1.address)}`);
                // console.log(`funds_receiver Balance is ${await ethers.provider.getBalance(funds_receiver.address)}`);
            }
            logStream.end();
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
        //     const [owner, addr1] = await ethers.getSigners();
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
        //     const [owner, addr1] = await ethers.getSigners();

        //     // mint an NFT
        //     await skyGazers.mintItem(1, { value: ethers.utils.parseEther('1.44') });

        //     // const [owner] = await ethers.getSigners();
        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(owner.address);
        //     // console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(owner.address);
        //     // console.log(`SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 60s", async () => {
        //     const delay = 30;
        //     await ethers.provider.send('evm_increaseTime', [delay]);
        //     await ethers.provider.send('evm_mine', []);
        // });

        // it("Should see a balance of SKYG and SGT", async () => {
        //     const [owner, addr1] = await ethers.getSigners();

        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(owner.address);
        //     console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(owner.address);
        //     console.log(`SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should be able to mint 2nd NFT if given enough ETH", async () => {
        //     const [owner, addr1] = await ethers.getSigners();

        //     // mint an NFT
        //     await skyGazers.mintItem(1, { value: ethers.utils.parseEther('1.44') });

        //     // const [owner] = await ethers.getSigners();
        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(owner.address);
        //     // console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(owner.address);
        //     // console.log(`SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should see a balance of SKYG and SGT", async () => {
        //     const [owner, addr1] = await ethers.getSigners();

        //     let skygazers_balance, timetoken_balance;

        //     skygazers_balance = await skyGazers.balanceOf(owner.address);
        //     console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //     timetoken_balance = await timeToken.balanceOf(owner.address);
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
        //   const [owner, addr1] = await ethers.getSigners();

        //   console.log(`owner is ${owner.address}`);
        //   console.log(`addr1 is ${addr1.address}`);

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(owner.address);
        //   console.log(`owner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);

        // });

        // it("Should send SKYG from owner to addr1", async () => {
        //   const [owner, addr1] = await ethers.getSigners();

        //   await skyGazers.transferFrom(owner.address, addr1.address, 1);
        // });
        // it("Should see a balance of SKYG and SGT", async () => {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(owner.address);
        //   console.log(`owner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);
        // });
        // it("Should wait 10s", async () => {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });

        // it("Should see an increased balance of SGT on addr1", async () => {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`owner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 10s", async () => {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });

        // it("Should see an increased balance of SGT on addr1", async () => {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`owner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should transfer NFT back to owner", async () => {

        //   const [owner, addr1] = await ethers.getSigners();

        //   await skyGazers.connect(addr1).transferFrom(addr1.address, owner.address, 1);

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(owner.address);
        //   console.log(`owner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`owner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 10s", async () => {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });
        // it("Should see increased SGT balance on owner", async () => {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`owner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);

        // });

    });
});
