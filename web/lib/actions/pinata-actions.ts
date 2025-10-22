"use server";

import type { TrackMetadata } from "@/types";

const PINATA_JWT = process.env.PINATA_JWT;

export async function uploadFileToPinata(fileData: FormData): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured");
  }

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: fileData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Pinata upload failed: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
}

export async function uploadMetadataToPinata(
  metadata: TrackMetadata
): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured");
  }

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Pinata metadata upload failed: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("Pinata metadata upload error:", error);
    throw error;
  }
}
