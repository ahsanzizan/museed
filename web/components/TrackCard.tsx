"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatEther } from "@/lib/utils"
import { getIPFSUrl } from "@/lib/pinata"
import type { Track } from "@/types"

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  const coverUrl = track.metadata?.image ? getIPFSUrl(track.metadata.image) : "/music-cover.jpg"

  return (
    <Link href={`/track/${track.tokenId}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-0">
          <div className="relative w-full aspect-square bg-muted">
            <Image
              src={coverUrl || "/placeholder.svg"}
              alt={track.metadata?.name || "Track cover"}
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 p-4">
          <div className="w-full">
            <h3 className="font-semibold truncate">{track.metadata?.name || "Untitled"}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {track.metadata?.attributes?.[0]?.value || "Unknown Artist"}
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-semibold">{formatEther(track.price)} MATIC</p>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
