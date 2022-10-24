const { ethers } = require("hardhat");
const { use, expect } = require("chai");
// const { solidity } = require("ethereum-waffle");

// use(solidity);

describe("SKYG", function () {
    let skyGazers: any, timeToken: any;


    describe("Skygazers", async function () {


        it("Should deploy Skygazers NFT (SKYG) and time token (SGT)", async function () {
            const _skyGazers = await ethers.getContractFactory("SkyGazers");
            skyGazers = await _skyGazers.deploy();
            const timeTokenAddr = await skyGazers.timeToken();

            const _timeToken = await ethers.getContractFactory("TimeToken");
            timeToken = await _timeToken.attach(timeTokenAddr);

            expect(await skyGazers.address).to.exist;
            expect(timeToken).to.exist;
        });

        it("Should not able to mint", async function () {
            // mint an NFT
            await expect(
                skyGazers.mintItem(1)
            ).to.be.revertedWith("Not yet minting");
        });

        it("Should set an auction", async function () {
            // create auction
            const [owner, addr1] = await ethers.getSigners();
            await expect(
                skyGazers.setAuction(
                    0, //uint256 _startIndexNFT, // offset in NFT list
                    10, //uint256 _amountToAuction, // amount to sell
                    1, // uint256 _startTime,
                    60, //uint256 _stopTime,
                    ethers.utils.parseEther('1.44'),// uint256 _startPrice,
                    ethers.utils.parseEther('0.04'), // uint256 _endPrice,
                    addr1.address, //address premintAddress
                )
            )
                .to.emit(skyGazers, "SetAuction")
                .withArgs(20);

            await expect(await skyGazers.amountToAuction()).to.equal(10);
            await expect(await skyGazers.startTime()).to.equal(1);

        });

        it("Should wait 10s", async function () {
            await ethers.provider.send('evm_increaseTime', [10]);
            await ethers.provider.send('evm_mine');
        });

        it("Should be able to mint if given enough ETH", async function () {
            const [owner, addr1] = await ethers.getSigners();

            // mint an NFT
            await skyGazers.mintItem(1, { value: ethers.utils.parseEther('1.44') });

            // const [owner] = await ethers.getSigners();
            let skygazers_balance, timetoken_balance;

            skygazers_balance = await skyGazers.balanceOf(owner.address);
            console.log(`SkyGazers Balance is ${skygazers_balance}`);

            timetoken_balance = await timeToken.balanceOf(owner.address);
            console.log(`SGT Balance is ${timetoken_balance}`);
        });

        // it("Should wait 60s", async function () {
        //   const delay = 60;

        //   await ethers.provider.send('evm_increaseTime', [delay]);
        //   await ethers.provider.send('evm_mine');
        // });
        // it("Should see a balance of SKYG and SGT", async function () {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(owner.address);
        //   console.log(`SkyGazers Balance is ${skygazers_balance}`);

        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`SGT Balance is ${timetoken_balance}`);

        //   // skyGazers.


        // });


        // it("Should see a balance of SKYG and SGT", async function () {
        //   const [owner, addr1] = await ethers.getSigners();

        //   console.log(`owner is ${owner.address}`);
        //   console.log(`addr1 is ${addr1.address}`);

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(owner.address);
        //   console.log(`owner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);

        // });

        // it("Should send SKYG from owner to addr1", async function () {
        //   const [owner, addr1] = await ethers.getSigners();

        //   await skyGazers.transferFrom(owner.address, addr1.address, 1);
        // });
        // it("Should see a balance of SKYG and SGT", async function () {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   skygazers_balance = await skyGazers.balanceOf(owner.address);
        //   console.log(`owner SkyGazers Balance is ${skygazers_balance}`);
        //   skygazers_balance = await skyGazers.balanceOf(addr1.address);
        //   console.log(`addr1 SkyGazers Balance is ${skygazers_balance}`);
        // });
        // it("Should wait 10s", async function () {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });

        // it("Should see an increased balance of SGT on addr1", async function () {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`owner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should wait 10s", async function () {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });

        // it("Should see an increased balance of SGT on addr1", async function () {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`owner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);
        // });

        // it("Should transfer NFT back to owner", async function () {

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

        // it("Should wait 10s", async function () {

        //   await ethers.provider.send('evm_increaseTime', [10]);
        //   await ethers.provider.send('evm_mine');
        // });
        // it("Should see increased SGT balance on owner", async function () {
        //   const [owner, addr1] = await ethers.getSigners();

        //   let skygazers_balance, timetoken_balance;

        //   timetoken_balance = await timeToken.balanceOf(owner.address);
        //   console.log(`owner SGT Balance is ${timetoken_balance}`);
        //   timetoken_balance = await timeToken.balanceOf(addr1.address);
        //   console.log(`addr1 SGT Balance is ${timetoken_balance}`);

        // });

    });
});
