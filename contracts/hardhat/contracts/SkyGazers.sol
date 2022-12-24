// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TimeToken.sol";

contract SkyGazers is ERC721Enumerable, Ownable {

    TimeToken public timeToken;

    constructor()  ERC721("SkyGazer", "SKYG") {
        timeToken = new TimeToken("Skygazer Time Token", "SKYGTT", this);
    }

    uint256 public startIndexNFT;
    address minter;

    uint256 public immutable MAX_SUPPLY = 9997;

    function exists(uint256 tokenId) public view virtual returns (bool) {
        return _exists(tokenId);
    }

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
    ) internal virtual override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
        timeToken.setInitialBalances(from, to);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_exists(id), "not exist");
        return string(abi.encodePacked("https://ipfs.io/tralala/", id));
    }
}
