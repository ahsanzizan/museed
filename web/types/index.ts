export interface TrackMetadata {
  name: string
  description: string
  image: string
  animation_url: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export interface Track {
  tokenId: number
  artist: string
  price: bigint
  currentOwner: string
  uri: string
  metadata?: TrackMetadata
}

export interface UploadFormData {
  title: string
  artist: string
  genre: string
  description: string
  price: string
  audioFile: File | null
  coverFile: File | null
}
