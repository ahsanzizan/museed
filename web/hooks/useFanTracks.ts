"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config";
import MuseedNFTABI from "@/lib/MuseedNFT.json";
import { getIPFSUrl } from "@/lib/pinata";
import type { Track, TrackMetadata } from "@/types";

export function useFanTracks() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [ownedTracks, setOwnedTracks] = useState<Track[]>([]);
  const [totalSpent, setTotalSpent] = useState(0n);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFanTracks = async () => {
      if (!publicClient || !address) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get all TrackPurchased events where buyer is the current user
        const logs = await publicClient.getLogs({
          address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
          event: {
            type: "event",
            name: "TrackPurchased",
            inputs: [
              { type: "uint256", indexed: true, name: "tokenId" },
              { type: "address", indexed: true, name: "buyer" },
              { type: "uint256", indexed: false, name: "price" },
            ],
          },
          fromBlock: 9466398n,
          toBlock: 9466403n,
        });

        // Filter for current user
        const userLogs = logs.filter((log) => {
          const buyer = `0x${log.topics[2]?.slice(-40)}`;
          return buyer.toLowerCase() === address.toLowerCase();
        });

        // Fetch details for each track
        const trackPromises = userLogs.map(async (log) => {
          const tokenId = Number((log.topics[1] || "0x0").slice(0, 66));
          const price = BigInt(log.data || "0");

          try {
            const result = await publicClient.readContract({
              address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
              abi: MuseedNFTABI.abi,
              functionName: "getTrackDetails",
              args: [BigInt(tokenId)],
            });

            const [artist, trackPrice, currentOwner, uri] = result as [
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
              console.error("Failed to fetch metadata for token", tokenId, err);
            }

            return {
              tokenId,
              artist,
              price: trackPrice,
              currentOwner,
              uri,
              metadata,
              purchasePrice: price,
            };
          } catch (err) {
            console.error(
              "Failed to fetch track details for token",
              tokenId,
              err
            );
            return null;
          }
        });

        const fetchedTracks = (await Promise.all(trackPromises)).filter(
          (t) => t !== null
        ) as (Track & {
          purchasePrice: bigint;
        })[];
        setOwnedTracks(fetchedTracks);

        // Calculate total spent
        const total = fetchedTracks.reduce(
          (sum, track) => sum + track.purchasePrice,
          0n
        );
        setTotalSpent(total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch owned tracks";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFanTracks();
  }, [address, publicClient]);

  return { ownedTracks, totalSpent, isLoading, error };
}
