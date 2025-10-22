"use client";

import {
  uploadFileToPinata,
  uploadMetadataToPinata,
} from "@/lib/actions/pinata-actions";
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config";
import { handleIPFSError } from "@/lib/error-handler";
import MuseedNFTABI from "@/lib/MuseedNFT.json";
import { parseEther } from "@/lib/utils";
import type { TrackMetadata, UploadFormData } from "@/types";
import { useState } from "react";
import {
  useAccount,
  useContractWrite,
  useWaitForTransactionReceipt,
} from "wagmi";

export function useMintTrack() {
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { data: hash, writeContract } = useContractWrite();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintTrack = async (formData: UploadFormData) => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    if (!formData.audioFile || !formData.coverFile) {
      setError("Audio and cover files are required");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate file sizes
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
      if (formData.audioFile.size > MAX_FILE_SIZE) {
        throw new Error("Audio file is too large (max 100MB)");
      }
      if (formData.coverFile.size > 10 * 1024 * 1024) {
        throw new Error("Cover art is too large (max 10MB)");
      }

      // Upload audio file to IPFS via server action
      setUploadProgress(25);
      const audioFormData = new FormData();
      audioFormData.append("file", formData.audioFile);
      const audioHash = await uploadFileToPinata(audioFormData);

      // Upload cover art to IPFS via server action
      setUploadProgress(50);
      const coverFormData = new FormData();
      coverFormData.append("file", formData.coverFile);
      const coverHash = await uploadFileToPinata(coverFormData);

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
      };

      // Upload metadata to IPFS via server action
      setUploadProgress(75);
      const metadataUri = await uploadMetadataToPinata(metadata);

      // Parse price to wei
      const priceInWei = parseEther(formData.price);

      // Call contract to mint track
      setUploadProgress(90);
      writeContract({
        address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
        abi: MuseedNFTABI.abi,
        functionName: "mintTrack",
        args: [address, metadataUri, priceInWei],
      });

      setUploadProgress(100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? handleIPFSError(err) : "Upload failed";
      setError(errorMessage);
      setIsUploading(false);
    }
  };

  return {
    mintTrack,
    isUploading,
    uploadProgress,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
