const path = require('path');

// Pilates site URL — set NEXT_PUBLIC_PILATES_SITE_URL in .env to override
const PILATES_SITE_URL = process.env.NEXT_PUBLIC_PILATES_SITE_URL || 'https://imagepilates.ie';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      // ── Pilates → imagepilates.ie ────────────────────────────────────────
      {
        source: '/courses/pilates',
        destination: PILATES_SITE_URL,
        permanent: true,
      },
      {
        source: '/courses/reformer-pilates',
        destination: `${PILATES_SITE_URL}/reformer`,
        permanent: true,
      },
      {
        // Old imageft.ie pilates course slug
        source: '/pilates-course',
        destination: PILATES_SITE_URL,
        permanent: true,
      },
      {
        source: '/pilates-instructor-course-ireland',
        destination: PILATES_SITE_URL,
        permanent: true,
      },
      {
        source: '/reformer-pilates-course',
        destination: `${PILATES_SITE_URL}/reformer`,
        permanent: true,
      },
      {
        // Catch all /pilates* paths not already matched
        source: '/pilates:path*',
        destination: PILATES_SITE_URL,
        permanent: true,
      },

      // ── Personal Trainer ─────────────────────────────────────────────────
      {
        // Old imageft.ie main PT slug (highest traffic page)
        source: '/personal-trainer-courses-ireland',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/personal-trainer-courses-ireland/:path*',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/courses/personal-trainer-course',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/courses/personal-trainer-course/:path*',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/personal-trainer-course-cork',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/personal-trainer-course-dublin',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/personal-trainer-course-ireland',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/courses/fitness-instruction-course',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/pt-course',
        destination: '/courses/personal-trainer',
        permanent: true,
      },

      // ── NutriCert ────────────────────────────────────────────────────────
      {
        source: '/nutricert-global',
        destination: '/courses/nutricert',
        permanent: true,
      },
      {
        source: '/nutricert',
        destination: '/courses/nutricert',
        permanent: true,
      },
      {
        source: '/nutrition-course',
        destination: '/courses/nutricert',
        permanent: true,
      },

      // ── Strength & Conditioning ──────────────────────────────────────────
      {
        source: '/strength-and-conditioning-course',
        destination: '/courses/strength-conditioning',
        permanent: true,
      },
      {
        source: '/strength-conditioning-course',
        destination: '/courses/strength-conditioning',
        permanent: true,
      },
      {
        source: '/sc-course',
        destination: '/courses/strength-conditioning',
        permanent: true,
      },

      // ── Pre & Post Natal ─────────────────────────────────────────────────
      {
        source: '/pre-and-post-natal-course',
        destination: '/courses/pre-post-natal',
        permanent: true,
      },
      {
        source: '/pre-post-natal-course',
        destination: '/courses/pre-post-natal',
        permanent: true,
      },
      {
        source: '/prenatal-course',
        destination: '/courses/pre-post-natal',
        permanent: true,
      },

      // ── Fitness Business Accelerator ─────────────────────────────────────
      {
        source: '/fitness-business-accelerator',
        destination: '/business-accelerator',
        permanent: true,
      },
      {
        source: '/fba',
        destination: '/business-accelerator',
        permanent: true,
      },

      // ── Post-Grad / Specialist Courses ───────────────────────────────────
      {
        source: '/post-pt-courses',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        source: '/post-pt-courses/:path*',
        destination: '/courses/personal-trainer',
        permanent: true,
      },

      // ── Locations ────────────────────────────────────────────────────────
      {
        source: '/ourlocations',
        destination: '/locations',
        permanent: true,
      },
      {
        source: '/our-locations',
        destination: '/locations',
        permanent: true,
      },
      {
        source: '/belfast',
        destination: '/locations',
        permanent: true,
      },

      // ── Booking → ptcheckout.imageft.ie ──────────────────────────────────
      {
        source: '/booking',
        destination: 'https://ptcheckout.imageft.ie',
        permanent: true,
      },
      {
        source: '/book',
        destination: 'https://ptcheckout.imageft.ie',
        permanent: true,
      },
      {
        source: '/enrol',
        destination: 'https://ptcheckout.imageft.ie',
        permanent: true,
      },
      {
        source: '/enroll',
        destination: 'https://ptcheckout.imageft.ie',
        permanent: true,
      },
      {
        source: '/apply',
        destination: 'https://ptcheckout.imageft.ie',
        permanent: true,
      },
      {
        // Pilates checkout
        source: '/pilates-booking',
        destination: 'https://pilatescheckout.ie',
        permanent: true,
      },
      {
        source: '/pilates-enrol',
        destination: 'https://pilatescheckout.ie',
        permanent: true,
      },

      // ── Legacy misc ──────────────────────────────────────────────────────
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/image-x',
        destination: '/',
        permanent: false,
      },
      {
        source: '/comp',
        destination: '/',
        permanent: false,
      },
      {
        source: '/image-fitness-training-courses/workshops',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
