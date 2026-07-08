import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

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

export default withSerwist(nextConfig);
