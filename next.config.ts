import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack für bessere Performance
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Optimierungen für Vercel
  images: {
    domains: [],
  },
  // TypeScript und ESLint während Build ignorieren für Vercel
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
