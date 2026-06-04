import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aryapakhsh.shop",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
