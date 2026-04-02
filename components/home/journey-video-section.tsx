'use client'

import { motion } from 'framer-motion'

export default function JourneyVideoSection() {
  return (
    <section className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/5 rounded-full blur-[180px]" />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-3 font-semibold">The Full Journey</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            From day one to<br /><span className="text-gold">your own coaching career.</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Classroom to gym floor. Qualification to clients. Brand to business. This is what the Image journey looks like — start to finish.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/10 aspect-video"
        >
          <video
            src="/videos/journey-showcase.mp4"
            controls
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  )
}
