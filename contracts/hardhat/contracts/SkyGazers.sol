// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TimeToken.sol";

contract SkyGazers is ERC721, Ownable {

    TimeToken public timeToken;

    constructor() public ERC721("SkyGazer", "SKYG") {
        timeToken = new TimeToken("Skygazer Time Token", "SKYGTT", this);
    }

    uint256 public startIndexNFT;
    address minter;

    uint256 public immutable MAX_SUPPLY = 9997;

    function setMinter(address _CurveSaleMinter) public onlyOwner {
        minter = _CurveSaleMinter;
    }

    function mintItem(address owner, uint256 id) public returns (uint256) {
        require(msg.sender == minter,"Not allowed to mint");
        _mint(owner, id);
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
