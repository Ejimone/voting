// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract VotingSystem {
    address public owner;
    uint256[] public candidates;
    address[] public voters;
    bool public votingEnded;

    mapping(address => bool) public voterStatus;
    mapping(uint256 => uint256) public candidateVotes;

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    event CandidateAdded(uint256 indexed candidateId);
    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingEnded(uint256 winningCandidateId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier votingNotEnded() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    function addCandidate(uint256 _candidate) public onlyOwner votingNotEnded {
        for (uint256 i = 0; i < candidates.length; i++) {
            require(candidates[i] != _candidate, "Candidate already exists");
        }
        candidates.push(_candidate);
        emit CandidateAdded(_candidate);
    }

    function registerVoter(address _voter) public onlyOwner votingNotEnded {
        for (uint256 i = 0; i < voters.length; i++) {
            require(voters[i] != _voter, "Voter already exists");
        }
        voters.push(_voter);
        emit VoterRegistered(_voter);
    }

    function vote(
        uint256 _voterIndex,
        uint256 _candidateId
    ) public votingNotEnded {
        require(!voterStatus[msg.sender], "You have already voted");
        require(
            msg.sender == voters[_voterIndex],
            "You are not registered to vote"
        );

        bool candidateExists = false;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i] == _candidateId) {
                candidateExists = true;
                candidateVotes[_candidateId]++;
                break;
            }
        }
        require(candidateExists, "Candidate does not exist");

        voterStatus[msg.sender] = true;
        emit VoteCast(msg.sender, _candidateId);
    }

    function getWinner() public view returns (uint256) {
        require(candidates.length > 0, "No candidates registered");

        uint256 winningVoteCount = 0;
        uint256 winningCandidateId = 0;

        for (uint256 i = 0; i < candidates.length; i++) {
            uint256 candidateId = candidates[i];
            if (candidateVotes[candidateId] > winningVoteCount) {
                winningVoteCount = candidateVotes[candidateId];
                winningCandidateId = candidateId;
            }
        }

        return winningCandidateId;
    }

    function endVoting() public onlyOwner votingNotEnded {
        votingEnded = true;
        emit VotingEnded(getWinner());
    }
}
