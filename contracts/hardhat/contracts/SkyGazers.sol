// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./TimeToken.sol";

contract SkyGazers is ERC721Enumerable, Ownable {
    TimeToken public timeToken;

    // constructor() ERC721("SkyGazer", "SKYG") {
    constructor() ERC721("S~~G~~~~~", "S~~~") {
        // timeToken = new TimeToken("Skygazer Time Token", "STT", this);
        timeToken = new TimeToken("S~~G~~~~ T~~~ Token", "S~~", this);
    }

    uint256 public startIndexNFT;
    address minter;
    string public URIroot;

    uint256 public immutable MAX_SUPPLY = 9997;

    function exists(uint256 tokenId) public view virtual returns (bool) {
        return _exists(tokenId);
    }

    function setMinter(address _CurveSaleMinter) public onlyOwner {
        minter = _CurveSaleMinter;
    }

    function setURIroot(string calldata _uriRoot) public onlyOwner {
        URIroot = _uriRoot;
    }

    function mintItem(address owner, uint256 id) public returns (uint256) {
        require(msg.sender == minter, "Not allowed to mint");
        _mint(owner, id);
        return id;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
        // set timetoken balances for sender + recipient at moment of transfer
        timeToken.setInitialBalances(from, to);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_exists(id), "id does not exist");
        return string(abi.encodePacked(URIroot, Strings.toString(id),'.json'));
    }
}
