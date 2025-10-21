import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MuseedNFTModule = buildModule("MuseedNFTModule", (m) => {
  // Deploy the MuseedNFT contract with no constructor arguments
  const museedNFT = m.contract("MuseedNFT");

  // You can also define dependencies like:
  // const token = m.contract("Token");
  // const market = m.contract("Market", [token]);

  // Return all deployed contracts
  return { museedNFT };
});

export default MuseedNFTModule;
