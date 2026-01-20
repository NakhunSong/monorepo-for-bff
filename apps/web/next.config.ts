import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shared", "api"],
};

export default nextConfig;
