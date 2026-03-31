'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const rows = [
  { item: 'REPs/EHFA PT Qualification', value: '€2,800+' },
  { item: '3–4 week live placement', value: 'Priceless' },
  { item: 'Professional photoshoot + reels', value: '€800–1,200' },
  { item: 'AI for Coaches Workshop', value: '€300' },
  { item: 'Programming for Success Masterclass', value: '€250' },
  { item: 'Fitness Business Accelerator (Phase 1 + 2)', value: '€1,500+' },
  { item: 'Six months in The Floor community', value: '€180' },
  { item: 'Career support + hiring network access', value: 'Ongoing' },
]

export default function InvestmentSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-charcoal-950">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-10"
        >
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4 font-semibold">THE INVESTMENT</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            Let&apos;s Be Honest About<br />What This Is Worth.
          </h2>
          <p className="text-white/50 text-lg">
            Map out what you&apos;re actually receiving in The Business pathway:
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="border border-charcoal-800/50 rounded-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="flex justify-between px-6 py-4 bg-charcoal-900/50 border-b border-charcoal-800/50">
            <span className="text-xs tracking-[0.2em] text-white/40 uppercase font-semibold">WHAT YOU GET</span>
            <span className="text-xs tracking-[0.2em] text-white/40 uppercase font-semibold">MARKET VALUE</span>
          </div>
          {/* Rows */}
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-5 border-b border-charcoal-800/30 last:border-b-0"
            >
              <span className="text-white/80 text-sm sm:text-base">{row.item}</span>
              <span className="text-gold font-serif italic text-sm sm:text-base ml-4">{row.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-4 px-6 py-4 bg-charcoal-900/30 rounded-lg"
        >
          <span className="text-gold font-bold text-lg">Total Value: €6,000+</span>
          <span className="text-gold font-serif italic text-lg">Your Investment: €4,800</span>
        </motion.div>
      </div>
    </section>
  )
}
