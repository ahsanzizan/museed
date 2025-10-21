"use client"

import { useAccount } from "wagmi"
import Link from "next/link"
import { ConnectWallet } from "@/components/ConnectWallet"
import { ArtistStats } from "@/components/ArtistStats"
import { ArtistTracksList } from "@/components/ArtistTracksList"
import { useArtistTracks } from "@/hooks/useArtistTracks"
import { Button } from "@/components/ui/button"

export default function ArtistDashboardPage() {
  const { isConnected } = useAccount()
  const { tracks, totalEarnings, isLoading, error } = useArtistTracks()

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Artist Dashboard</h1>
              <p className="text-muted-foreground">Manage your tracks and earnings</p>
            </div>
            <ConnectWallet />
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Connect your wallet to view your dashboard</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Artist Dashboard</h1>
            <p className="text-muted-foreground">Manage your tracks and earnings</p>
          </div>
          <div className="flex gap-4">
            <Link href="/upload">
              <Button>Upload New Track</Button>
            </Link>
            <ConnectWallet />
          </div>
        </div>

        {/* Stats */}
        {!isLoading && <ArtistStats totalTracks={tracks.length} totalEarnings={totalEarnings} />}

        {/* Error */}
        {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-8">{error}</div>}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Loading your tracks...</p>
          </div>
        ) : (
          <ArtistTracksList tracks={tracks} />
        )}
      </div>
    </main>
  )
}
