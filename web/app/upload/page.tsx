import { ConnectWallet } from "@/components/ConnectWallet"
import { UploadForm } from "@/components/UploadForm"

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ConnectWallet />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upload Your Track</h1>
          <p className="text-muted-foreground">Tokenize your music and start earning from your art</p>
        </div>

        <UploadForm />
      </div>
    </main>
  )
}
