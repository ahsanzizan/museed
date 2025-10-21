import { ethers } from "hardhat";
import deploymentData from "../deployments/MuseedNFT.json";

async function main() {
  const [deployer, artist, fan] = await ethers.getSigners();

  const contract = await ethers.getContractAt(
    "MuseedNFT",
    deploymentData.address,
    deployer
  );

  console.log(`\n🎵 Testing MuseedNFT Contract`);
  console.log(`Contract: ${deploymentData.address}`);

  console.log(`\n1️⃣ Minting track...`);
  const ipfsUri = "ipfs://QmExample123/metadata.json";
  const priceInEth = "0.1";
  const priceInWei = ethers.parseEther(priceInEth);

  const mintTx = await contract.mintTrack(artist.address, ipfsUri, priceInWei);
  const mintReceipt = await mintTx.wait();

  console.log(`✅ Track minted (TX: ${mintReceipt?.hash})`);

  console.log(`\n2️⃣ Getting track details...`);
  const details = await contract.getTrackDetails(0);
  console.log(`Artist: ${details.artist}`);
  console.log(`Price: ${ethers.formatEther(details.price)} ETH`);
  console.log(`URI: ${details.uri}`);

  console.log(`\n3️⃣ Fan purchasing track...`);
  const contractAsFan = contract.connect(fan);
  const purchaseTx = await contractAsFan.purchaseTrack(0, {
    value: priceInWei,
  });
  const purchaseReceipt = await purchaseTx.wait();

  console.log(`✅ Track purchased (TX: ${purchaseReceipt?.hash})`);

  const newDetails = await contract.getTrackDetails(0);
  console.log(`\n4️⃣ New owner: ${newDetails.currentOwner}`);
  console.log(`Fan address: ${fan.address}`);
  console.log(`Owner match: ${newDetails.currentOwner === fan.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
