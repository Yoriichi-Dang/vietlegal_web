import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  images: {
    unoptimized: true,
    domains: [
      "res.cloudinary.com",
      "legal-wise-vn.s3.ap-southeast-1.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "legal-wise-vn.s3.ap-southeast-1.amazonaws.com",
      },
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
