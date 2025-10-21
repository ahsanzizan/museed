export class MuseedError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = "MuseedError"
  }
}

export function handleContractError(error: unknown): string {
  if (error instanceof Error) {
    // Handle common contract errors
    if (error.message.includes("insufficient funds")) {
      return "Insufficient funds for this transaction"
    }
    if (error.message.includes("user rejected")) {
      return "Transaction rejected by user"
    }
    if (error.message.includes("Already owner")) {
      return "You already own this track"
    }
    if (error.message.includes("Insufficient payment")) {
      return "Payment amount is insufficient"
    }
    return error.message
  }
  return "An unknown error occurred"
}

export function handleIPFSError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("Pinata")) {
      return "Failed to upload file to IPFS. Please try again."
    }
    if (error.message.includes("network")) {
      return "Network error. Please check your connection."
    }
    return error.message
  }
  return "Failed to process file"
}

export function handleWalletError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("not installed")) {
      return "Wallet extension not installed. Please install MetaMask or another Web3 wallet."
    }
    if (error.message.includes("wrong network")) {
      return "You are on the wrong network. Please switch to Polygon Mumbai or Base Sepolia."
    }
    return error.message
  }
  return "Wallet connection failed"
}
