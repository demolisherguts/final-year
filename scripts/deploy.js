const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying DocumentRegistry with account:", deployer.address);

  const DocumentRegistry = await hre.ethers.getContractFactory("DocumentRegistry");
  const contract = await DocumentRegistry.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("DocumentRegistry deployed to:", address);
  console.log("");
  console.log("Add this to frontend/.env (then restart the frontend):");
  console.log("VITE_CONTRACT_ADDRESS=" + address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
