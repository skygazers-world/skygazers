// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TimeToken.sol";

contract SkyGazers is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    TimeToken public timeToken;

    constructor() public ERC721("SkyGazer", "SKYG") {
        timeToken = new TimeToken("Skygazer Time Token", "SKYGTT", this);
    }

    // when did this change hands ?
    mapping(uint256 => uint256) public ownDate;

    uint256 public startIndexNFT;
    uint256 public amountToAuction;
    uint256 public startTime;
    uint256 public stopTime;
    uint256 public startPrice;
    uint256 public endPrice;
    uint256 public discountRate;

    uint256 public immutable MAX_SUPPLY = 9997;

    event SetAuction(uint256 currentTimestamp); // Event

    function setAuction(
        uint256 _startIndexNFT, // offset in NFT list
        uint256 _amountToAuction, // amount to sell
        uint256 _startTime,
        uint256 _stopTime,
        uint256 _startPrice,
        uint256 _endPrice,
        address premintAddress
    ) public onlyOwner {
        startIndexNFT = _startIndexNFT;
        amountToAuction = _amountToAuction;
        startTime = _startTime;
        stopTime = _stopTime;
        startPrice = _startPrice;
        endPrice = _endPrice;

        discountRate = 1; //(_endPrice - _startPrice) / (_stopTime - _startTime);

        emit SetAuction(block.timestamp);
    }

    function mintPrice() public view returns (uint256) {
        if (block.timestamp <= startTime) {
            return startPrice;
        }

        if (block.timestamp > stopTime) {
            return endPrice;
        }

        return startPrice - ((block.timestamp - startTime) * discountRate);
    }

    function mintUnclaimed(uint256 id) public onlyOwner {
        // 
        _mint(msg.sender, id);
    }


    function mintItem(uint256 amount) public payable returns (uint256) {
        require(block.timestamp <= startTime, "Not yet minting");
        require(block.timestamp > stopTime, "Minting is currently over");

        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        require(id >= startIndexNFT, "Can't mint before startindex");
        require(
            id < startIndexNFT + amountToAuction,
            "Can't mint after end-index"
        );

        require(id < MAX_SUPPLY, "ALL NFTs MINTED");

        require(msg.value >= (amount * mintPrice()), "Not enough ether sent");

        _mint(msg.sender, id);

        return id;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
        timeToken.setInitialBalances(from, to);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_exists(id), "not exist");
        return string(abi.encodePacked("https://ipfs.io/tralala/", id));
    }
}
