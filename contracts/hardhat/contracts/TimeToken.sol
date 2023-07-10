// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TimeToken
 * @dev TimeToken is an ERC20 token with a dynamic balance assigned to the holder .
 */
contract TimeToken is ERC20, Ownable {
    ERC721Enumerable skygazers;

    /**
     * @dev Constructor.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    // mapping(address => uint256) initialbalance;
    mapping(address => uint256) t;
    uint256 public totalBalance;
    uint256 public totalBalance_t;

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function setNFTContract(
        ERC721Enumerable nft,
        address[] memory f,
        uint256 amount
    ) public onlyOwner {
        require(address(skygazers) == address(0), "NFT contract already set");
        skygazers = nft;
        for (uint256 i = 0; i < f.length; i++) {
            _balances[f[i]] = amount;
            t[f[i]] = block.timestamp;
        }
        totalBalance = f.length * amount;
        totalBalance_t = block.timestamp;
    }

    // called from the ERC721 _beforeTokenTransfer (at mint + burn + transfer)
    // this is
    function setInitialBalances(address from, address to) public onlyOwner {
        _setInitialBalances(from, to);
    }

    function _setInitialBalances(address from, address to) internal {
        if (from != address(0)) {
            uint256 b = balanceOf(from);
            _balances[from] = b;
            t[from] = block.timestamp;
            // adjust totalBalance
            totalBalance += b;
            totalBalance_t = block.timestamp;
        }
        if (to != address(0)) {
            t[to] = block.timestamp;
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal virtual override(ERC20) {
        _setInitialBalances(from, to);
        // _balances[from] = balanceOf(from);
        // t[from] = block.timestamp;
    }

    function balanceOf(
        address user
    ) public view virtual override returns (uint256) {
        return
            _balances[user] +
            (block.timestamp - t[user]) *
            skygazers.balanceOf(user);
    }

    function timeDelta() public view returns (uint256) {
        return block.timestamp - totalBalance_t;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return
            totalBalance +
            (block.timestamp - totalBalance_t) *
            skygazers.totalSupply();
    }
}
