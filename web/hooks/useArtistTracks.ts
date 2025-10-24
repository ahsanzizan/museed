"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config";
import MuseedNFTABI from "@/lib/MuseedNFT.json";
import { getIPFSUrl } from "@/lib/pinata";
import type {
  NftApiResponse,
  TokenTransferResponse,
  Track,
  TrackMetadata,
} from "@/types";

export function useArtistTracks() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0n);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistTracks = async () => {
      if (!publicClient || !address) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get all TrackMinted events where artist is the current user
        // const logs = await publicClient.getLogs({
        //   address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
        //   event: {
        //     type: "event",
        //     name: "TrackMinted",
        //     inputs: [
        //       { type: "uint256", indexed: true, name: "tokenId" },
        //       { type: "address", indexed: true, name: "artist" },
        //       { type: "uint256", indexed: false, name: "price" },
        //     ],
        //   },
        //   fromBlock: 9466275n,
        //   toBlock: 9466280n,
        // });
        const tracki: TokenTransferResponse = await (
          await fetch(`${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 0,
              method: "alchemy_getAssetTransfers",
              params: [
                {
                  fromBlock: "0x0",

                  fromAddress: "0x0000000000000000000000000000000000000000",
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  toAddress: address,

                  excludeZeroValue: true,

                  category: ["erc721", "erc1155"],
                },
              ],
            }),
          })
        ).json();

        // Filter for current artist
        const artistLogs = tracki.result.transfers;

        // Fetch details for each track
        const trackPromises = artistLogs.map(async (log) => {
          const tokenId = Number((log.tokenId || "0x0").slice(0, 66));

          try {
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
              string,
            ];

            // Fetch artist earnings
            const earnings = await publicClient.readContract({
              address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
              abi: MuseedNFTABI.abi,
              functionName: "artistEarnings",
              args: [BigInt(tokenId)],
            });

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
              price,
              currentOwner,
              uri,
              metadata,
              earnings: earnings as bigint,
            };
          } catch (err) {
            console.error(
              "Failed to fetch track details for token",
              tokenId,
              err,
            );
            return null;
          }
        });

        const fetchedTracks = (await Promise.all(trackPromises)).filter(
          (t) => t !== null,
        ) as (Track & {
          earnings: bigint;
        })[];
        setTracks(fetchedTracks);

        // Calculate total earnings
        const total = fetchedTracks.reduce(
          (sum, track) => sum + track.earnings,
          0n,
        );
        setTotalEarnings(total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch artist tracks";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistTracks();
  }, [address, publicClient]);

  return { tracks, totalEarnings, isLoading, error };
}
