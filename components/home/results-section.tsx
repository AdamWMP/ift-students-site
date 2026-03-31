'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const tiers = [
  { name: 'Pass', width: '50%', label: 'Qualified' },
  { name: 'Merit', width: '70%', label: 'Priority Placed' },
  { name: 'Distinction', width: '90%', label: 'First Through the Door' },
]

export default function ResultsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-charcoal-950">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4 font-semibold">RESULTS THAT MATTER</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-2">
            Because Not All Coaches<br />Are the Same.
          </h2>
          <p className="font-serif italic text-white/40 text-lg mb-8">And the market should know it.</p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-white/60 leading-relaxed mb-8 max-w-3xl"
        >
          Image graduates receive a graded result: Pass, Merit, or Distinction. Your practical exam, written assessment, and case studies all contribute to your final grade. Our Merit and Distinction graduates are the ones first through the door at our placement partner facilities — because we only send our best to the best.
        </motion.p>

        {/* Gold italic closing */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <p className="font-serif italic text-gold text-lg">Your grade isn&apos;t just a number.</p>
          <p className="font-serif italic text-gold text-lg">It&apos;s the first line of your professional reputation.</p>
        </motion.div>

        {/* Tier bars */}
        <div className="space-y-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-charcoal-900 rounded-lg p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-6 flex-1">
                <span className="font-serif text-xl sm:text-2xl text-white min-w-[120px]">{tier.name}</span>
                <div className="flex-1 h-2 bg-charcoal-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: tier.width } : {}}
                    transition={{ delay: 0.4 + index * 0.15, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                  />
                </div>
              </div>
              <span className="text-white/50 text-sm ml-4 text-right min-w-[100px]">{tier.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
