"use client";
import { Track, TrackMetadata } from "@/types";
import NFTCard from "./NFTCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MuseedNFTABI from "@/lib/MuseedNFT.json";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config";
import { getIPFSUrl } from "@/lib/pinata";
import { parseBigInt } from "@/lib/utils";

const FeaturedNFTs = () => {
  // Mock data - will be replaced with real data from blockchain
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
        const tracki: { nfts: { id: { tokenId: string } }[] } = await (
          await fetch(
            `${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}/getNFTsForCollection?limit=4&contractAddress=${MUSEED_CONTRACT_ADDRESS}`,
          )
        ).json();

        // Fetch details for each track
        const trackPromises = tracki.nfts.map(async (log) => {
          const tokenId = Number((log.id.tokenId || "0x0").slice(0, 66));

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
              err,
            );
            return null;
          }
        });

        const fetchedTracks = (await Promise.all(trackPromises)).filter(
          (t) => t !== null,
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
    <section className="py-20 bg-gradient-href-b from-background href-background/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">Featured Tracks</h2>
            <p className="text-muted-foreground">
              Discover the latest music NFTs from top artists
            </p>
          </div>
          <Link href="/marketplace">
            <Button
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-muted-foreground">Loading tracks...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          ) : (
            tracks.map((track) => (
              <NFTCard
                key={track.tokenId}
                artist={track.artist}
                coverUrl={
                  track.metadata?.image
                    ? getIPFSUrl(track.metadata.image)
                    : "/music-cover.jpg"
                }
                tokenId={track.tokenId.toString()}
                genre={
                  track.metadata?.attributes.find(
                    (i) => i.trait_type === "genre",
                  )?.value ?? ""
                }
                price={`${parseBigInt(track.price)}`}
                title={track.metadata?.name ?? "awikwok"}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNFTs;
