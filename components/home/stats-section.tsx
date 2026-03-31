'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import AnimatedCounter from '@/components/animated-counter'

const stats = [
  { value: 5000, suffix: '+', label: 'COACHES MADE' },
  { value: 16, suffix: '', label: 'YEARS PERFECTING THE MODEL' },
  { value: 200, suffix: '+', label: 'HIRING PARTNERS NATIONALLY' },
  { value: 4.9, suffix: '', label: 'GOOGLE RATING', isDecimal: true },
]

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-charcoal-900">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-4xl sm:text-5xl md:text-6xl text-gold italic mb-3">
                {inView && !stat.isDecimal && (
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                )}
                {inView && stat.isDecimal && (
                  <span>{stat.value}</span>
                )}
              </div>
              <div className="text-xs sm:text-sm tracking-[0.2em] text-white/50 uppercase font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
