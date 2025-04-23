import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "registry.npmmirror.com",
      },
      {
        hostname: "scontent.fdad1-3.fna.fbcdn.net",
      },
      {
        hostname: "static.vecteezy.com",
      },
    ],
  },
};

export default nextConfig;
