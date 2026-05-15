'use client'

// Hero section — Apple-style background video on every device.
//
// Hero video was re-encoded ffmpeg-side from 37.6 MB → 4.9 MB (libx264,
// CRF 28, no audio track, +faststart so playback starts before the file
// finishes downloading). At that size it's now safe to autoplay on
// phones too — bandwidth cost is comparable to a few hero images.
//
// First paint sequence:
//   1. /hero-poster.jpg (40 KB) renders as the <video poster>, painting
//      instantly. The browser also has a fetchPriority="high" preload
//      hint for this image in the root <head>.
//   2. The video file streams in alongside the rest of the page. Because
//      it has +faststart the first frames are playable as soon as the
//      moov atom + first GOP land.
//   3. <video> fades from poster → live video on `loadeddata`.
//
// Animations are still CSS @keyframes (no framer-motion on the LCP path).

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.75
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Poster + video both reference the same JPG so even if the
            video never loads (rare), the visual stays identical. */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-poster.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-40'}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/90 via-charcoal-950/75 to-charcoal-950" />
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] opacity-60" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-gold/8 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.7)_100%)]" />
        {/* Subtle ambient gold ray — CSS-only, GPU-driven */}
        <div className="hero-ray absolute top-0 right-1/4 w-[2px] h-[60%] bg-gradient-to-b from-gold/30 via-gold/10 to-transparent rotate-[15deg] blur-sm" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal-950 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="hero-fade hero-fade-1 text-sm sm:text-base tracking-[0.25em] text-gold font-medium uppercase mb-6">
            IMAGE FITNESS TRAINING GLOBAL
          </p>
          <div className="hero-fade hero-fade-2 h-[2px] bg-gold mb-10" style={{ width: 60 }} />
          <h1 className="hero-fade hero-fade-3 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-4">
            Where Coaches<br />Are Made.
          </h1>
          <p className="hero-fade hero-fade-4 text-2xl sm:text-3xl md:text-4xl font-serif italic text-gold mb-10">
            Not certified. Made.
          </p>
          <p className="hero-fade hero-fade-5 text-base sm:text-lg text-white/60 mb-10 max-w-2xl leading-relaxed">
            The only fitness educator in Ireland — probably anywhere — that doesn&apos;t stop when the certificate is in your hand. Because that&apos;s when the real work begins.
          </p>
          <p className="hero-fade hero-fade-6 text-sm sm:text-base text-gold font-medium mb-6">
            <span className="font-bold">5,000+ Coaches</span>
            <span className="mx-3 text-white/30">&bull;</span>
            <span className="font-bold">16 Years</span>
            <span className="mx-3 text-white/30">&bull;</span>
            <span className="font-bold">Zero Compromise</span>
          </p>
          <p className="hero-fade hero-fade-7 text-xs tracking-[0.2em] text-white/40 uppercase mb-12">
            REPS ACCREDITED &middot; EHFA APPROVED &middot; SKILLNET IRELAND
          </p>
          <div className="hero-fade hero-fade-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="#pathways"
              prefetch
              className="btn-gold btn-press flex items-center justify-center gap-2 text-sm sm:text-base tracking-[0.15em] uppercase font-semibold"
            >
              EXPLORE THE PATHWAYS
            </Link>
            <Link
              href="/career-quiz"
              prefetch
              className="btn-outline btn-press flex items-center justify-center gap-2 text-sm sm:text-base tracking-[0.15em] uppercase font-semibold"
            >
              TAKE THE CAREER QUIZ
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-fade-in {
          from { opacity: 0; transform: translate3d(0, 12px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes hero-ray {
          0%, 100% { opacity: 0.10; }
          50%      { opacity: 0.20; }
        }
        .hero-fade {
          opacity: 0;
          animation: hero-fade-in 0.55s ease-out forwards;
          will-change: opacity, transform;
        }
        .hero-fade-1 { animation-delay: 0.05s; }
        .hero-fade-2 { animation-delay: 0.12s; }
        .hero-fade-3 { animation-delay: 0.18s; }
        .hero-fade-4 { animation-delay: 0.26s; }
        .hero-fade-5 { animation-delay: 0.34s; }
        .hero-fade-6 { animation-delay: 0.40s; }
        .hero-fade-7 { animation-delay: 0.46s; }
        .hero-fade-8 { animation-delay: 0.52s; }
        :global(.hero-ray) {
          animation: hero-ray 8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-fade { animation: none; opacity: 1; transform: none; }
          :global(.hero-ray) { animation: none; opacity: 0.15; }
        }
      `}</style>
    </section>
  )
}
