"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config";
import MuseedNFTABI from "@/lib/MuseedNFT.json";
import { getIPFSUrl } from "@/lib/pinata";
import type { Track, TrackMetadata } from "@/types";

export function useTrackDetails(tokenId: number) {
  const publicClient = usePublicClient();
  const [track, setTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackDetails = async () => {
      if (!publicClient) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await publicClient.readContract({
          address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
          abi: MuseedNFTABI.abi,
          functionName: "getTrackDetails",
          args: [BigInt(tokenId)],
        });

        const [artist, price, currentOwner, uri] = result as [
          string,
          bigint,
          string,
          string
        ];

        // Fetch metadata from IPFS
        let metadata: TrackMetadata | undefined;
        try {
          const ipfsUrl = getIPFSUrl(uri);
          const response = await fetch(ipfsUrl);
          metadata = await response.json();
        } catch (err) {
          console.error("Failed to fetch metadata:", err);
        }

        setTrack({
          tokenId,
          artist,
          price,
          currentOwner,
          uri,
          metadata,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch track details";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackDetails();
  }, [tokenId, publicClient]);

  return { track, isLoading, error };
}
