let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// import ABI from constants.js
let abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
    ],
    name: "CandidateAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "VoterRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "winningCandidateId",
        type: "uint256",
      },
    ],
    name: "VotingEnded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidate",
        type: "uint256",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidateVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinner",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "registerVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_voterIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voterStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingEnded",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let provider;
let signer;
let votingContract;

window.onload = async () => {
  // Connect to MetaMask
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    votingContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log("Connected to contract:", contractAddress);
  } else {
    alert("Please install MetaMask to interact with this app.");
  }
};

async function addCandidate() {
  const candidateId = document.getElementById("candidateId").value;
  try {
    const tx = await votingContract.addCandidate(candidateId);
    await tx.wait();
    alert("Candidate added successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to add candidate.");
  }
}

async function registerVoter() {
  const voterAddress = document.getElementById("voterAddress").value;
  try {
    const tx = await votingContract.registerVoter(voterAddress);
    await tx.wait();
    alert("Voter registered successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to register voter.");
  }
}

async function castVote() {
  const voterIndex = document.getElementById("voterIndex").value;
  const voteCandidateId = document.getElementById("voteCandidateId").value;
  try {
    const tx = await votingContract.vote(voterIndex, voteCandidateId);
    await tx.wait();
    alert("Vote cast successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to cast vote.");
  }
}

async function getWinner() {
  try {
    const winnerId = await votingContract.getWinner();
    document.getElementById(
      "winnerDisplay"
    ).innerText = `Winner Candidate ID: ${winnerId}`;
  } catch (error) {
    console.error(error);
    alert("Failed to fetch the winner.");
  }
}
