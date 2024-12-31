const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
  let voting;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    voting = await VotingSystem.deploy();
  });

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });
  });

  describe("Candidate Management", function () {
    it("should allow owner to add a candidate", async function () {
      await voting.connect(owner).addCandidate(1);
      expect(await voting.candidates(0)).to.equal(1);
    });

    it("should prevent adding duplicate candidates", async function () {
      await voting.connect(owner).addCandidate(1);
      await expect(voting.connect(owner).addCandidate(1)).to.be.revertedWith(
        "Candidate already exists"
      );
    });

    it("should prevent non-owner from adding candidates", async function () {
      await expect(voting.connect(addr1).addCandidate(1)).to.be.revertedWith(
        "Only the owner can perform this action"
      );
    });
  });

  describe("Voter Registration", function () {
    it("should allow owner to register voters", async function () {
      await voting.connect(owner).registerVoter(addr1.address);
      expect(await voting.voters(0)).to.equal(addr1.address);
    });

    it("should prevent registering duplicate voters", async function () {
      await voting.connect(owner).registerVoter(addr1.address);
      await expect(
        voting.connect(owner).registerVoter(addr1.address)
      ).to.be.revertedWith("Voter already exists");
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      await voting.connect(owner).addCandidate(1);
      await voting.connect(owner).registerVoter(addr1.address);
    });

    it("should allow registered voter to vote", async function () {
      await voting.connect(addr1).vote(0, 1);
      expect(await voting.voterStatus(addr1.address)).to.be.true;
    });

    it("should prevent double voting", async function () {
      await voting.connect(addr1).vote(0, 1);
      await expect(voting.connect(addr1).vote(0, 1)).to.be.revertedWith(
        "You have already voted"
      );
    });
  });
});
