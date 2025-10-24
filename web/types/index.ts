export interface TrackMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface Track {
  tokenId: number;
  artist: string;
  price: bigint;
  currentOwner: string;
  uri: string;
  metadata?: TrackMetadata;
}

export interface UploadFormData {
  title: string;
  artist: string;
  genre: string;
  description: string;
  price: string;
  audioFile: File | null;
  coverFile: File | null;
}

export interface GatewayUri {
  gateway: string;
  raw: string;
}

// For the items in metadata.attributes
export interface Attribute {
  trait_type: string;
  value: string;
}

// For the id.tokenMetadata object
export interface TokenMetadata {
  tokenType: string;
}

// For the contract object
export interface Contract {
  address: string;
}

// For the id object
export interface Id {
  tokenId: string;
  tokenMetadata: TokenMetadata;
}

// For the metadata object
export interface Metadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: Attribute[];
}

// For the contractMetadata object
export interface ContractMetadata {
  name: string;
  symbol: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSea: Record<string, unknown>; // or "any" if you prefer
}

// For the spamInfo object
export interface SpamInfo {
  isSpam: string; // Note: this is a string "false", not a boolean
  classifications: any[]; // Sample was empty
}

// For the main objects in the ownedNfts array
export interface OwnedNft {
  contract: Contract;
  id: Id;
  balance: string; // Note: this is a string "1", not a number
  title: string;
  description: string;
  tokenUri: GatewayUri;
  media: GatewayUri[];
  metadata: Metadata;
  timeLastUpdated: string; // ISO date-time string
  contractMetadata: ContractMetadata;
  spamInfo: SpamInfo;
}

// The root-level API response
export interface NftApiResponse {
  ownedNfts: OwnedNft[];
  totalCount: number;
  blockHash: string;
}

/**
 * Interface for the raw contract details within a transfer.
 */
export interface TokenTransferRawContract {
  value: string;
  address: string | null;
  decimal: string;
}

/**
 * Interface for a single transfer record.
 */
export interface TokenTransfer {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: string | null;
  erc1155Metadata: any | null; // Type as 'any' since it's null and structure isn't defined
  tokenId: string | null;
  asset: string;
  category: string;
  rawContract: TokenTransferRawContract; // Use the prefixed interface
}

/**
 * Interface for the 'result' object in the API response.
 */
export interface TokenTransferResult {
  transfers: TokenTransfer[]; // Use the prefixed interface
  pageKey: string;
}

/**
 * Top-level interface for the JSON-RPC API response.
 */
export interface TokenTransferResponse {
  jsonrpc: "2.0";
  id: string;
  result: TokenTransferResult; // Use the prefixed interface
}
