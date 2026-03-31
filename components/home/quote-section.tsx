'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface QuoteSectionProps {
  lines: { text: string; gold?: boolean }[]
}

export default function QuoteSection({ lines }: QuoteSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-charcoal-950">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15 }}
            className={`font-serif text-xl sm:text-2xl md:text-3xl italic leading-relaxed ${
              line.gold ? 'text-gold font-semibold' : 'text-white/50'
            }`}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
