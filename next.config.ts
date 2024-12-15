import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during production builds
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sxjmaxobpibgfmcmmwtk.supabase.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "shawwals.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
