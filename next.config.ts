import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "legalwise-vietlegal.s3.us-east-1.amazonaws.com",
    ],
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
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
