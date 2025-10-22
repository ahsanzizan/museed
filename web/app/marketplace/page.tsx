"use client";
import Navbar from "@/components/Navbar";
import NFTCard from "@/components/NFTCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MuseedNFTABI from "@/lib/MuseedNFT.json";
import { MUSEED_CONTRACT_ADDRESS } from "@/lib/config";
import { getIPFSUrl } from "@/lib/pinata";
import { Track, TrackMetadata } from "@/types";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseBigInt } from "@/lib/utils";

const Marketplace = () => {
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
          fromBlock: 9466275n,
          toBlock: 9466280n,
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Marketplace</h1>
            <p className="text-muted-foreground text-lg">
              Browse and collect music NFTs from talented artists around the
              world
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks or artists..."
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-card/50 border-border/50">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="hiphop">Hip Hop</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="synthwave">Synthwave</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full md:w-[180px] bg-card/50 border-border/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      (i) => i.trait_type === "genre"
                    )?.value ?? ""
                  }
                  price={`${parseBigInt(track.price)}`}
                  title={track.metadata?.name ?? "awikwok"}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
