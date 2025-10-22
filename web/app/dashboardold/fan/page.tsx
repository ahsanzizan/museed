"use client"

import { useAccount } from "wagmi"
import Link from "next/link"
import { ConnectWallet } from "@/components/ConnectWallet"
import { FanStats } from "@/components/FanStats"
import { OwnedTracksList } from "@/components/OwnedTracksList"
import { useFanTracks } from "@/hooks/useFanTracks"
import { Button } from "@/components/ui/button"

export default function FanDashboardPage() {
  const { isConnected } = useAccount()
  const { ownedTracks, totalSpent, isLoading, error } = useFanTracks()

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Collection</h1>
              <p className="text-muted-foreground">View your owned music NFTs</p>
            </div>
            <ConnectWallet />
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Connect your wallet to view your collection</p>
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
            <h1 className="text-4xl font-bold mb-2">My Collection</h1>
            <p className="text-muted-foreground">View your owned music NFTs</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">Browse Tracks</Button>
            </Link>
            <ConnectWallet />
          </div>
        </div>

        {/* Stats */}
        {!isLoading && <FanStats totalTracks={ownedTracks.length} totalSpent={totalSpent} />}

        {/* Error */}
        {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-8">{error}</div>}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Loading your collection...</p>
          </div>
        ) : (
          <OwnedTracksList tracks={ownedTracks} />
        )}
      </div>
    </main>
  )
}
