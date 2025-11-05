import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← Lintエラ-を無視
  },
  typescript: {
    ignoreBuildErrors: true, // ← TypeScriptエラーも無視
  },
};

export default nextConfig;
