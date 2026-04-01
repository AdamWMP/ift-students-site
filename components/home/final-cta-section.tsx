'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'
import CalendlyModal from '@/components/calendly-modal'

export default function FinalCtaSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-charcoal-900 border-t border-charcoal-800/30">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
            The Next Intake<br />
            Starts <span className="text-gold italic">Soon.</span><br />
            Your Competition<br />
            Isn&apos;t Waiting.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-white/50 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto"
        >
          Book a 15-minute strategy call. Tell us where you want to be. We&apos;ll tell you exactly how to get there. No pressure. No pitch. Just the clearest 15 minutes you&apos;ll spend on your career.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4 max-w-md mx-auto"
        >
          <button
            onClick={() => setIsCalendlyOpen(true)}
            className="w-full btn-gold text-sm tracking-[0.15em] uppercase font-semibold py-4"
          >
            BOOK YOUR STRATEGY CALL
          </button>
          <Link
            href="https://wa.me/353866000001?text=Hi!%20I%27m%20interested%20in%20the%20Personal%20Trainer%20course."
            target="_blank"
            className="w-full btn-outline text-sm tracking-[0.15em] uppercase font-semibold py-4 text-center"
          >
            WHATSAPP US
          </Link>
          <Link
            href="/career-quiz"
            className="w-full btn-outline text-sm tracking-[0.15em] uppercase font-semibold py-4 text-center"
          >
            TAKE THE CAREER QUIZ
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-white/40 text-sm mt-8"
        >
          We typically respond within 2 hours.
        </motion.p>
      </div>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  )
}
