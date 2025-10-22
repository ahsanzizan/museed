"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { PurchaseButton } from "@/components/PurchaseButton";
import { useTrackDetails } from "@/hooks/useTrackDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther, formatAddress } from "@/lib/utils";
import { getIPFSUrl } from "@/lib/pinata";

export default function TrackDetailsPage() {
  const params = useParams();
  const { address } = useAccount();
  const tokenId = Number.parseInt(params.id as string);
  const { track, isLoading, error } = useTrackDetails(tokenId);

  const isOwned =
    track &&
    address &&
    track.currentOwner.toLowerCase() === address.toLowerCase();
  const coverUrl = track?.metadata?.image
    ? getIPFSUrl(track.metadata.image)
    : "/music-cover.jpg";
  const audioUrl = track?.metadata?.animation_url
    ? getIPFSUrl(track.metadata.animation_url)
    : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <Link href="/">
            <Button variant="outline">← Back to Browse</Button>
          </Link>
          <ConnectWallet />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Loading track details...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        ) : track ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cover Art & Player */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden mb-6">
                <Image
                  src={coverUrl || "/placeholder.svg"}
                  alt={track.metadata?.name || "Track cover"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </CardContent>
                </Card>
              )}

              {/* Purchase Button */}
              <PurchaseButton
                tokenId={tokenId}
                price={track.price}
                isOwned={isOwned || false}
              />
            </div>

            {/* Track Information */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {track.metadata?.name || "Untitled"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {track.metadata?.description}
                </p>
              </div>

              {/* Track Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Track Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Artist</p>
                      <p className="font-semibold">
                        {track.metadata?.attributes?.[0]?.value || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Genre</p>
                      <p className="font-semibold">
                        {track.metadata?.attributes?.[1]?.value || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold">
                        {formatEther(track.price)} MATIC
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Token ID</p>
                      <p className="font-semibold">#{tokenId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ownership Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Ownership</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Original Artist
                    </p>
                    <p className="font-mono text-sm">
                      {formatAddress(track.artist)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Owner
                    </p>
                    <p className="font-mono text-sm">
                      {formatAddress(track.currentOwner)}
                    </p>
                  </div>
                  {isOwned && (
                    <div className="p-3 bg-green-500/10 text-green-700 rounded-lg text-sm">
                      You own this track!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metadata */}
              {track.metadata?.attributes &&
                track.metadata.attributes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Attributes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {track.metadata.attributes.map((attr, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">
                              {attr.trait_type}
                            </p>
                            <p className="font-semibold">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Track not found</p>
          </div>
        )}
      </div>
    </main>
  );
}
