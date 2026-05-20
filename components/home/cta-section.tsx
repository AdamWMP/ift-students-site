'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Calendar } from 'lucide-react'
import CalendlyModal from '@/components/calendly-modal'

export default function CTASection() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <>
      <section className="py-16 sm:py-24 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gold/10 border border-gold/30 rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Start Your <span className="text-gold">Journey</span>?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                Get certified, build your career, and make an impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsCalendlyOpen(true)}
                  className="btn-gold flex items-center justify-center gap-2 text-base sm:text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule a Call
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="https://wa.me/353866003667?text=Hi!%20I%27m%20interested%20in%20your%20fitness%20courses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline flex items-center justify-center gap-2 text-base sm:text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat With Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
