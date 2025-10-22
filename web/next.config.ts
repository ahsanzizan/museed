import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [new URL("https://gateway.pinata.cloud/ipfs/**")],
  },
};

export default nextConfig;
