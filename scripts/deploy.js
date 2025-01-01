// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying Voting System...");

  // Get the contract factory
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");

  // Deploy the contract
  const voting = await VotingSystem.deploy();
  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("VotingSystem deployed to:", address);

  // Verify the contract if we're on a network that supports it
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");

    // Wait for 6 block confirmations before proceeding
    await voting.deploymentTransaction().wait(6);

    console.log("Verifying contract...");

    // Run the verification process using Hardhat's verify plugin
    await hre.run("verify:verify", {
      address: address, // Contract address to verify
      constructorArguments: [], // Constructor arguments used during deployment
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
