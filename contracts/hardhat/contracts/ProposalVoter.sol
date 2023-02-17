// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ProposalVoter {
    IERC721 skygazers;
    address voteManager;

    enum State {
        SUBMITTED,
        WITHDRAWN,
        REJECTED,
        APPROVED
    }

    struct NFTVote {
        uint nftId;
        string hash;
        State state;
    }

    constructor(IERC721 nft, address votemananger) {
        skygazers = nft;
        voteManager = votemananger;
    }

    NFTVote[] public votes;

    modifier onlyNFTOwner(uint256 _nftID) {
        require(
            skygazers.ownerOf(_nftID) == msg.sender,
            "Only the NFT owner can perform this action."
        );
        _;
    }

    modifier onlyVoteOwner(uint256 _voteID) {
        uint nftId = votes[_voteID].nftId;
        require(
            skygazers.ownerOf(nftId) == msg.sender,
            "Only the NFT owner can perform this action."
        );
        _;
    }

    modifier onlyVoteManager() {
        require(
            voteManager == msg.sender,
            "Only the Vote Manager owner can perform this action."
        );
        _;
    }

    function getVotes() public view returns (NFTVote[] memory) {
        return votes;
    }

    function submitVote(
        uint256 _nftId,
        string memory _hash
    ) public onlyNFTOwner(_nftId) {
        votes.push(NFTVote(_nftId, _hash, State.SUBMITTED));
    }

    function withdrawVote(uint256 _voteId) public onlyVoteOwner(_voteId) {
        votes[_voteId].state = State.WITHDRAWN;
    }

    function setVoteState(
        uint256 _voteId,
        State _newState
    ) public onlyVoteManager {
        votes[_voteId].state = _newState;
    }

    function getVote(
        uint256 _nftID
    ) public view returns (string memory, State) {
        return (votes[_nftID].hash, votes[_nftID].state);
    }
}
