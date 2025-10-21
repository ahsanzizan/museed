"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useMintTrack } from "@/hooks/useMintTrack"
import type { UploadFormData } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TransactionStatus } from "@/components/TransactionStatus"

export function UploadForm() {
  const { isConnected } = useAccount()
  const { mintTrack, isUploading, uploadProgress, isSuccess, isConfirming, error, hash } = useMintTrack()

  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    artist: "",
    genre: "",
    description: "",
    price: "",
    audioFile: null,
    coverFile: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: "audioFile" | "coverFile") => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fileType]: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await mintTrack(formData)
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Track</CardTitle>
          <CardDescription>Connect your wallet to upload and mint your music</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect your wallet to continue.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload & Mint Your Track</CardTitle>
        <CardDescription>Create an NFT for your music and set the price</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Track Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Track Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Track Title</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter track title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Artist Name</label>
              <Input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                placeholder="Your artist name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <Input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                placeholder="e.g., Electronic, Hip-Hop, Pop"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your track"
                rows={4}
              />
            </div>
          </div>

          {/* Files */}
          <div className="space-y-4">
            <h3 className="font-semibold">Files</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Audio File (MP3, WAV)</label>
              <Input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, "audioFile")} required />
              {formData.audioFile && <p className="text-sm text-muted-foreground mt-1">{formData.audioFile.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Art (JPEG, PNG)</label>
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "coverFile")} required />
              {formData.coverFile && <p className="text-sm text-muted-foreground mt-1">{formData.coverFile.name}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold">Pricing</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Price (in MATIC/ETH)</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.1"
                step="0.001"
                min="0"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">You will receive 90% of the sale price</p>
            </div>
          </div>

          {/* Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Transaction Status */}
          {(isUploading || isConfirming || isSuccess) && (
            <TransactionStatus
              status={isUploading ? "pending" : isConfirming ? "confirming" : "success"}
              message={
                isUploading
                  ? "Uploading files to IPFS..."
                  : isConfirming
                    ? "Confirming transaction on blockchain..."
                    : "Track minted successfully!"
              }
              hash={hash}
            />
          )}

          {/* Error */}
          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          {/* Submit Button */}
          <Button type="submit" disabled={isUploading || isConfirming} className="w-full">
            {isUploading ? `Uploading... ${uploadProgress}%` : isConfirming ? "Confirming..." : "Mint Track"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
