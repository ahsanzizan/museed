"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEther } from "@/lib/utils";
import { getIPFSUrl } from "@/lib/pinata";
import type { Track } from "@/types";

interface ArtistTracksListProps {
  tracks: (Track & { earnings: bigint })[];
}

export function ArtistTracksList({ tracks }: ArtistTracksListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        {tracks.length === 0 ? (
          <p className="text-muted-foreground">No tracks uploaded yet.</p>
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
                      {track.metadata?.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Price: </span>
                        <span className="font-medium">
                          {formatEther(track.price)} MATIC
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Earnings:{" "}
                        </span>
                        <span className="font-medium text-green-600">
                          {formatEther(track.earnings)} MATIC
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 bg-transparent"
                  >
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
