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
  // Re-enabled Vercel image optimization (May 2026 audit). Lighthouse
  // had flagged "Serve images in next-gen formats" at −610 ms on
  // mobile. With this on, Next.js auto-converts JPG/PNG → WebP/AVIF
  // at request time and serves responsive sizes — no need to
  // pre-generate every variant by hand. Vercel Pro plan covers
  // ~5,000 transformations/month for free, comfortably above
  // current traffic.
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
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
      {
        // Marketed PT strategy call URL variants → canonical /ptcall-imageft
        source: '/PT-call-imageft',
        destination: '/ptcall-imageft',
        permanent: true,
      },
      {
        source: '/pt-call-imageft',
        destination: '/ptcall-imageft',
        permanent: true,
      },
      {
        source: '/pt-call',
        destination: '/ptcall-imageft',
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

      // ── PT Checkout path migration (cache-bust for ptcheckout.imageft.ie) ─
      {
        source: '/checkout/pt',
        destination: '/checkout/launch',
        permanent: false,
      },
      {
        source: '/checkout/ptstart',
        destination: '/checkout/launch',
        permanent: false,
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
        source: '/enroll',
        destination: '/enrol',
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
        // Phase 9: was permanent:false (307 temp). Google doesn't consolidate
        // ranking signals through 307. Now 308 perm so stale SERPs drop out.
        source: '/image-x',
        destination: '/',
        permanent: true,
      },
      {
        // Phase 9: same fix.
        source: '/comp',
        destination: '/',
        permanent: true,
      },
      {
        source: '/image-fitness-training-courses/workshops',
        destination: '/courses/personal-trainer',
        permanent: true,
      },
      {
        // Phase 9: /courses was 404. Redirect to / until hub page in Phase 11.
        source: '/courses',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
