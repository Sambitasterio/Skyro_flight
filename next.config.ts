import type { NextConfig } from "next";

// next-pwa is CJS; requires `next build --webpack` on Next.js 16+ (Turbopack skips SW generation).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline",
  },
  /** Hero JPGs are large — cache at runtime, not precache. */
  publicExcludes: ["!noprecache/**/*", "hero/**/*"],
});

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
