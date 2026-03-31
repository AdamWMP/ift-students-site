const path = require('path');

// Pilates site URL — set NEXT_PUBLIC_PILATES_SITE_URL in .env to override
const PILATES_SITE_URL = process.env.NEXT_PUBLIC_PILATES_SITE_URL || 'https://imagepilates.ie';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  // experimental outputFileTracingRoot removed — causes path doubling on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/courses/pilates',
        destination: PILATES_SITE_URL,
        permanent: false,
      },
      {
        source: '/courses/reformer-pilates',
        destination: `${PILATES_SITE_URL}/reformer`,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
