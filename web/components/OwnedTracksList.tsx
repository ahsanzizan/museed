"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEther } from "@/lib/utils";
import { getIPFSUrl } from "@/lib/pinata";
import type { Track } from "@/types";

interface OwnedTracksListProps {
  tracks: (Track & { purchasePrice: bigint })[];
}

export function OwnedTracksList({ tracks }: OwnedTracksListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Collection</CardTitle>
      </CardHeader>
      <CardContent>
        {tracks.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't purchased any tracks yet.
          </p>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => {
              const coverUrl = track.metadata?.image
                ? getIPFSUrl(track.metadata.image)
                : "/music-cover.jpg";

              return (
                <div
                  key={track.tokenId}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded">
                    <Image
                      src={coverUrl || "/placeholder.svg"}
                      alt={track.metadata?.name || "Track cover"}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {track.metadata?.name || "Untitled"}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.metadata?.attributes?.[0]?.value ||
                        "Unknown Artist"}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Purchased:{" "}
                        </span>
                        <span className="font-medium">
                          {formatEther(track.purchasePrice)} MATIC
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/track/${track.tokenId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 bg-transparent"
                    >
                      Play
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
