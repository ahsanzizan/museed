"use client"

import { useState } from "react"
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from "wagmi"
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config"
import MuseedNFTABI from "@/lib/MuseedNFT.json"
import { handleContractError } from "@/lib/error-handler"

export function usePurchaseTrack(tokenId: number, price: bigint) {
  const { address } = useAccount()
  const [error, setError] = useState<string | null>(null)

  const { data: hash, isPending, writeContract } = useContractWrite()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const purchaseTrack = async () => {
    if (!address) {
      setError("Wallet not connected")
      return
    }

    try {
      setError(null)
      writeContract({
        address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
        abi: MuseedNFTABI.abi,
        functionName: "purchaseTrack",
        args: [BigInt(tokenId)],
        value: price,
      })
    } catch (err) {
      const errorMessage = handleContractError(err)
      setError(errorMessage)
    }
  }

  return {
    purchaseTrack,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}
