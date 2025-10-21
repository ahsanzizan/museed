"use client"

import { useAccount } from "wagmi"
import { usePurchaseTrack } from "@/hooks/usePurchaseTrack"
import { Button } from "@/components/ui/button"

interface PurchaseButtonProps {
  tokenId: number
  price: bigint
  isOwned: boolean
}

export function PurchaseButton({ tokenId, price, isOwned }: PurchaseButtonProps) {
  const { isConnected } = useAccount()
  const { purchaseTrack, isPending, isConfirming, isSuccess, error } = usePurchaseTrack(tokenId, price)

  if (!isConnected) {
    return <Button disabled>Connect Wallet to Purchase</Button>
  }

  if (isOwned) {
    return <Button disabled>You Own This Track</Button>
  }

  return (
    <div className="space-y-2">
      <Button onClick={purchaseTrack} disabled={isPending || isConfirming} className="w-full" size="lg">
        {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Purchase Track"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {isSuccess && <p className="text-sm text-green-600">Purchase successful!</p>}
    </div>
  )
}
