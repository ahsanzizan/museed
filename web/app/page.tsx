"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import Link from "next/link";
import { ConnectWallet } from "@/components/ConnectWallet";
import { TrackCard } from "@/components/TrackCard";
import { Button } from "@/components/ui/button";
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config";
import MuseedNFTABI from "@/lib/MuseedNFT.json";
import { getIPFSUrl } from "@/lib/pinata";
import type { Track, TrackMetadata } from "@/types";

export default function HomePage() {
  const publicClient = usePublicClient();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      if (!publicClient) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get all TrackMinted events
        const logs = await publicClient.getLogs({
          address: MUSEED_CONTRACT_ADDRESS as `0x${string}`,
          event: {
            type: "event",
            name: "TrackMinted",
            inputs: [
              { type: "uint256", indexed: true, name: "tokenId" },
              { type: "address", indexed: true, name: "artist" },
              { type: "uint256", indexed: false, name: "price" },
            ],
          },
          fromBlock: 0n,
        });

        // Fetch details for each track
        const trackPromises = logs.map(async (log) => {
          const tokenId = Number((log.topics[1] || "0x0").slice(0, 66));

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
              price,
              currentOwner,
              uri,
              metadata,
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
        ) as Track[];
        setTracks(fetchedTracks);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch tracks";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [publicClient]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Museed</h1>
            <p className="text-muted-foreground">
              Discover and own music as NFTs on the blockchain
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/upload">
              <Button>Upload Track</Button>
            </Link>
            <ConnectWallet />
          </div>
        </div>

        {/* Tracks Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Loading tracks...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No tracks yet. Be the first to upload!
            </p>
            <Link href="/upload">
              <Button>Upload Your First Track</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track) => (
              <TrackCard key={track.tokenId} track={track} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
