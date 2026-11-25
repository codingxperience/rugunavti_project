import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

import { productionSiteUrl } from "./src/lib/site-url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.ruguna\\.ac\\.ug" }],
        destination: `${productionSiteUrl}/:path*`,
        permanent: true,
      },
      { source: "/academics", destination: "/programs", permanent: true },
      { source: "/e-learning", destination: "/elearning", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/:section(admin|finance|instructor|learn|registrar|student|account|api|__clerk|sign-in|sign-up|e-learning-login|staff-portal|student-portal)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/elearning/:section(access-denied|auth-complete|forgot-password|login|logout|register|session-expired|tasks|verify-email)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/apply/status",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
