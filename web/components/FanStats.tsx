"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatEther } from "@/lib/utils"

interface FanStatsProps {
  totalTracks: number
  totalSpent: bigint
}

export function FanStats({ totalTracks, totalSpent }: FanStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Owned Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalTracks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatEther(totalSpent)} MATIC</div>
        </CardContent>
      </Card>
    </div>
  )
}
