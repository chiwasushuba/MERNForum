import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // previously used when using local storage to store images
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'http',
  //       hostname: 'localhost',
  //       port: '4000', // Specify your backend's port
  //       pathname: '/uploads/**', // Match the image path structure
  //     },
  //   ],
  // },

  // Now this is for cloud storage using firebase i can allow anything to be used well it's better to just use google so i'll just keep this in case 
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: '**', // para ma allow lahat ng sites
  //     },
  //   ],
  // },

  // Eto na yung legit
  images: {
    domains: ["storage.googleapis.com"], 
  },
};

export default nextConfig;
