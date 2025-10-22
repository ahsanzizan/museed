export const MUSEED_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"
export const CHAIN_ID = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "80001")

// Supported chains
export const SUPPORTED_CHAINS = {
  POLYGON_MUMBAI: 80001,
  BASE_SEPOLIA: 84532,
  SEPOLIA: 11155111,
}

export const CHAIN_CONFIG = {
  [SUPPORTED_CHAINS.POLYGON_MUMBAI]: {
    name: "Polygon Mumbai",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    blockExplorer: "https://mumbai.polygonscan.com",
  },
  [SUPPORTED_CHAINS.BASE_SEPOLIA]: {
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    blockExplorer: "https://sepolia.basescan.org",
  },
  [SUPPORTED_CHAINS.SEPOLIA]: {
    name: "Ethereum Sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
    blockExplorer: "https://sepolia.etherscan.io",
  },
}
