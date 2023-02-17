// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TimeToken
 * @dev TimeToken is an ERC20 token with a dynamic balance assigned to the holder .
 */
contract TimeToken is ERC20, Ownable {

    IERC721 skygazers;

    /**
     * @dev Constructor.
     */
    constructor(
        string memory name,
        string memory symbol,
        IERC721 nft
    ) ERC20(name, symbol ) {
        skygazers = nft;
    }

    mapping (address => uint256) initialbalance;
    mapping (address => uint256) t;

    // called from _beforeTokenTransfer (at mint + transfer)
    function setInitialBalances(address from, address to) public onlyOwner {
        if (from != address(0)){
            initialbalance[from] = balanceOf(from);
            t[from] = block.timestamp;
        }
        if (to != address(0)){
            t[to] = block.timestamp;
        }
    }

    function balanceOf(address user) public view virtual override returns (uint256) {
        return initialbalance[user] + (block.timestamp - t[user])*skygazers.balanceOf(user);
    }    
}
