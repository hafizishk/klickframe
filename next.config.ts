import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `npm run export` sets this to emit a fully static `out/` directory, which
  // `scripts/bundle.mjs` then inlines into one self-contained HTML file for
  // sharing a pitch link. Left off for normal dev and Vercel builds.
  ...(process.env.STATIC_EXPORT ? { output: "export" as const } : {}),
};

export default nextConfig;
