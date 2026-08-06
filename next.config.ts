import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 90, 100],

    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],

    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aryapakhsh.shop",
        pathname: "/**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
