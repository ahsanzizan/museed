"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatEther } from "@/lib/utils"

interface ArtistStatsProps {
  totalTracks: number
  totalEarnings: bigint
}

export function ArtistStats({ totalTracks, totalEarnings }: ArtistStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalTracks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatEther(totalEarnings)} MATIC</div>
        </CardContent>
      </Card>
    </div>
  )
}
