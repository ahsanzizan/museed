"use client"

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="space-y-4 text-center">
        <div className="inline-block">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
