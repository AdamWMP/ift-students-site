'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const steps = [
  { number: 1, weeks: 'WEEKS 1–8', title: 'Get Qualified', description: 'Fitness Instruction, Group Instruction, Personal Training. REPs accredited.' },
  { number: 2, weeks: 'WEEKS 9–12', title: 'Get Placed', description: 'Real gym environment. Real clients. Real hours on your record.' },
  { number: 3, weeks: 'WEEK 13', title: 'Get Branded', description: 'Professional photoshoot + advertising reels. Your face. Your brand. Done.' },
  { number: 4, weeks: 'WEEKS 14–17', title: 'FBA Phase 1', description: 'Client acquisition, pricing strategy, how to sell without feeling like a salesperson.' },
  { number: 5, weeks: 'WEEKS 18–19', title: 'Level Up', description: 'AI for Coaches workshop + Programming for Success masterclass.' },
  { number: 6, weeks: 'WEEKS 20–24', title: 'Build the Business', description: 'FBA Phase 2 — client retention, systems, scaling.' },
]

export default function JourneySection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-charcoal-950 border-t border-charcoal-800/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">THE JOURNEY</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            From Day One to Empire. In 24 Weeks.
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Every other provider stops when the certificate is printed. That&apos;s when we start.
          </p>
        </motion.div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              {/* Number circle */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-charcoal-700 flex items-center justify-center">
                <span className="font-serif text-xl text-white/60 italic">{step.number}</span>
              </div>
              {/* Weeks label */}
              <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2 font-semibold">{step.weeks}</p>
              {/* Title */}
              <h3 className="font-serif text-xl sm:text-2xl text-white italic mb-2">{step.title}</h3>
              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing quote */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center font-serif italic text-white/40 text-lg sm:text-xl max-w-3xl mx-auto mt-16"
        >
          Twenty-four weeks. One unbroken pathway. A career, a brand, and a business — handed to you with support every step of the way.
        </motion.p>
      </div>
    </section>
  )
}
