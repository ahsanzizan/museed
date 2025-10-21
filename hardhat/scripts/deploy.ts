import * as fs from "fs";
import { ethers } from "hardhat";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying MuseedNFT contract...");

  const MuseedNFT = await ethers.getContractFactory("MuseedNFT");
  const contract = await MuseedNFT.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`✅ MuseedNFT deployed to: ${contractAddress}`);

  // Get ABI
  const abi = MuseedNFT.interface.formatJson();

  // Create deployments folder if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentInfo = {
    address: contractAddress,
    abi: JSON.parse(abi),
    network: (await ethers.provider.getNetwork()).name,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "MuseedNFT.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Also save a quick reference file
  const addresses = {
    MuseedNFT: contractAddress,
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  console.log("📄 Deployment info saved to deployments/MuseedNFT.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
