import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
  basePath: process.env.GITHUB_ACTIONS ? "/uiux-trend-atlas" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/uiux-trend-atlas/" : "",
};

export default nextConfig;
