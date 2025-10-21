"use client"

import { useAccount } from "wagmi"
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config"
import MuseedNFTABI from "@/lib/MuseedNFT.json"

export function useMuseedContract() {
  const { address } = useAccount()

  const getTrackDetails = async (tokenId: number) => {
    // This will be implemented with viem in the actual contract calls
    return null
  }

  return {
    address,
    contractAddress: MUSEED_CONTRACT_ADDRESS,
    abi: MuseedNFTABI.abi,
    getTrackDetails,
  }
}
