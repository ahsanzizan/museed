const PINATA_JWT = process.env.PINATA_JWT;

export async function uploadToPinata(file: File): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
}

export async function uploadMetadataToPinata(
  metadata: Record<string, unknown>
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
      throw new Error(`Pinata metadata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("Pinata metadata upload error:", error);
    throw error;
  }
}

export function getIPFSUrl(ipfsHash: string): string {
  if (ipfsHash.startsWith("ipfs://")) {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash.slice(7)}`;
  }
  return ipfsHash;
}
