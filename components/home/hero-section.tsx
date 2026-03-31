'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/90 via-charcoal-950/75 to-charcoal-950" />
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] opacity-60" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-gold/8 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.7)_100%)]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[2px] h-[60%] bg-gradient-to-b from-gold/30 via-gold/10 to-transparent rotate-[15deg] blur-sm"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal-950 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base tracking-[0.25em] text-gold font-medium uppercase mb-6"
          >
            IMAGE FITNESS TRAINING GLOBAL
          </motion.p>

          {/* Gold separator line */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 60 }}
            transition={{ delay: 0.15 }}
            className="h-[2px] bg-gold mb-10"
          />

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-4"
          >
            Where Coaches<br />Are Made.
          </motion.h1>

          {/* Subheadline - gold italic */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-gold mb-10"
          >
            Not certified. Made.
          </motion.p>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl leading-relaxed"
          >
            The only fitness educator in Ireland — probably anywhere — that doesn&apos;t stop when the certificate is in your hand. Because that&apos;s when the real work begins.
          </motion.p>

          {/* Stats line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-sm sm:text-base text-gold font-medium mb-6"
          >
            <span className="font-bold">5,000+ Coaches</span>
            <span className="mx-3 text-white/30">&bull;</span>
            <span className="font-bold">16 Years</span>
            <span className="mx-3 text-white/30">&bull;</span>
            <span className="font-bold">Zero Compromise</span>
          </motion.p>

          {/* Accreditations */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs tracking-[0.2em] text-white/40 uppercase mb-12"
          >
            REPS ACCREDITED &middot; EHFA APPROVED &middot; SKILLNET IRELAND
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="#pathways"
              className="btn-gold flex items-center justify-center gap-2 text-sm sm:text-base tracking-[0.15em] uppercase font-semibold"
            >
              EXPLORE THE PATHWAYS
            </Link>
            <Link
              href="/career-quiz"
              className="btn-outline flex items-center justify-center gap-2 text-sm sm:text-base tracking-[0.15em] uppercase font-semibold"
            >
              TAKE THE CAREER QUIZ
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
