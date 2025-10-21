"use client"

import { useState } from "react"
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from "wagmi"
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config"
import MuseedNFTABI from "@/lib/MuseedNFT.json"
import { uploadToPinata, uploadMetadataToPinata } from "@/lib/pinata"
import { parseEther } from "@/lib/utils"
import { handleIPFSError } from "@/lib/error-handler"
import type { UploadFormData, TrackMetadata } from "@/types"

export function useMintTrack() {
  const { address } = useAccount()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { data: hash, isPending, writeContract } = useContractWrite()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const mintTrack = async (formData: UploadFormData) => {
    if (!address) {
      setError("Wallet not connected")
      return
    }

    if (!formData.audioFile || !formData.coverFile) {
      setError("Audio and cover files are required")
      return
    }

    try {
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      // Validate file sizes
      const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
      if (formData.audioFile.size > MAX_FILE_SIZE) {
        throw new Error("Audio file is too large (max 100MB)")
      }
      if (formData.coverFile.size > 10 * 1024 * 1024) {
        throw new Error("Cover art is too large (max 10MB)")
      }

      // Upload audio file to IPFS
      setUploadProgress(25)
      const audioHash = await uploadToPinata(formData.audioFile)

      // Upload cover art to IPFS
      setUploadProgress(50)
      const coverHash = await uploadToPinata(formData.coverFile)

      // Create metadata JSON
      const metadata: TrackMetadata = {
        name: formData.title,
        description: formData.description,
        image: coverHash,
        animation_url: audioHash,
        attributes: [
          { trait_type: "Artist", value: formData.artist },
          { trait_type: "Genre", value: formData.genre },
        ],
      }

      // Upload metadata to IPFS
      setUploadProgress(75)
      const metadataUri = await uploadMetadataToPinata(metadata)

      // Parse price to wei
      const priceInWei = parseEther(formData.price)

      // Call contract to mint track
      setUploadProgress(90)
      writeContract({
        address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
        abi: MuseedNFTABI.abi,
        functionName: "mintTrack",
        args: [address, metadataUri, priceInWei],
      })

      setUploadProgress(100)
    } catch (err) {
      const errorMessage = err instanceof Error ? handleIPFSError(err) : "Upload failed"
      setError(errorMessage)
      setIsUploading(false)
    }
  }

  return {
    mintTrack,
    isUploading,
    uploadProgress,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}
