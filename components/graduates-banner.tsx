'use client'

// "Join Ireland's largest, award-winning training provider" strip.
//
// Replaces the previous randomuser.me placeholder avatars with the real
// IFT coaches row (public/graduates-banner.jpg — 10 actual graduates in
// gold-ringed circles, baked into the image so no per-avatar CSS rings
// needed).
//
// Animation: the row is too wide for any phone, so we run an infinite
// horizontal marquee — the same image is rendered twice side-by-side
// and translated -50% in a continuous loop so it feels alive without
// the visitor needing to scroll the row themselves. The CSS uses pure
// transform on the GPU (no JS frame loop), so it's cheap on mobile.

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface GraduatesBannerProps {
  variant?: 'default' | 'compact'
  className?: string
}

export default function GraduatesBanner({ variant = 'default', className = '' }: GraduatesBannerProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const heightClass = variant === 'compact'
    ? 'h-12 sm:h-14'
    : 'h-14 sm:h-16'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 ${className}`}
    >
      {/* Marquee — only animates once the section is in view */}
      <div
        className={`relative overflow-hidden w-full md:max-w-[640px] ${heightClass}`}
        style={{
          maskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
        }}
        aria-label="Image Fitness Training graduates"
      >
        <div
          className="flex items-center gap-0 absolute inset-y-0 left-0"
          style={{
            animation: inView ? 'graduates-marquee 28s linear infinite' : 'none',
            willChange: 'transform',
          }}
        >
          {/* Two copies so the loop is seamless */}
          <img
            src="/graduates-banner.jpg"
            alt="IFT graduates"
            className="h-full w-auto select-none"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
          <img
            src="/graduates-banner.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-auto select-none"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, x: 16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`text-white/90 font-medium text-center md:text-left ${variant === 'compact' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}
      >
        Join Ireland&apos;s largest, award winning training provider
      </motion.p>

      <style jsx>{`
        @keyframes graduates-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="graduates-marquee"] { animation: none !important; }
        }
      `}</style>
    </motion.div>
  )
}
