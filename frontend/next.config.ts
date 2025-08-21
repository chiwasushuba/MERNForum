import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: [
      "storage.googleapis.com", 
      "mernforum.s3.ap-southeast-1.amazonaws.com", // ✅ allow S3 bucket
    ],
  },
};

export default nextConfig;
