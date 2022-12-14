// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SkyGazers.sol";

contract CurveSaleMinter is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    TimeToken public timeToken;

    constructor(
        SkyGazers _token,
        uint256 _offset, // offset where to start in the collection
        uint256 _amount, // how many to mint
        uint256 _c, // initial NFT batch size
        uint256 _dc, // delta
        uint256 _p, // initial NFT price
        uint256 _dp, // delta
        address _receiver // receiver of funds
    ) public {
        c = _c;
        dc = _dc;
        p = _p;
        dp = _dp;
        amount = _amount;
        token = _token;
        receiver = _receiver;
    }

    SkyGazers public token;
    uint256 public c;
    uint256 public dc;
    uint256 public p; // current mintprice
    uint256 public dp;
    uint256 public amount;
    uint256 public offset;
    address public receiver;
    uint256 public x;

    function nextPrice() internal {
        if (x > (c >> 64)) {
            p = ((p * dp) >> 64);
            c = ((c * dc) >> 64);
            x = 0;
        }
        x++;
    }

    function currentIndex() public view returns (uint256) {
        return _tokenIds.current();
    }

    function mintItems(uint256[] memory ids) public payable {
        for (uint i = 0; i < ids.length; i++) {
            mintItem(ids[i]);
        }
    }

    function mintItem(uint256 id) public payable {
        require(_tokenIds.current() <= amount, "All NFTs minted");
        require(id >= offset && id < offset + amount, "Id not in range");
        require(msg.value >= p, "Not enough ether sent");
        payable(receiver).transfer(p);
        payable(msg.sender).transfer(msg.value - p);
        token.mintItem(msg.sender, id);
        _tokenIds.increment();
        nextPrice();
    }
}
