import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  experimental: {
    globalNotFound: true,
    useTypeScriptCli: false,
  },
};

export default nextConfig;
