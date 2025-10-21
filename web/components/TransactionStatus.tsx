"use client"

import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TransactionStatusProps {
  status: "pending" | "confirming" | "success" | "error"
  message: string
  hash?: string
}

export function TransactionStatus({ status, message, hash }: TransactionStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      label: "Pending",
    },
    confirming: {
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      label: "Confirming",
    },
    success: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      label: "Success",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      label: "Error",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className={config.bgColor}>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Icon className={`h-5 w-5 ${config.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`font-semibold ${config.color}`}>{config.label}</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            {hash && (
              <p className="text-xs font-mono text-muted-foreground mt-2">
                Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
