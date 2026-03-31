'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const benefits = [
  'Exclusive jobs board — positions posted by our 200+ hiring partners',
  'Industry discount codes (insurance, equipment, software)',
  'Peer community of 5,000+ Image graduates',
  'Ongoing mentorship and content from our senior coaches',
  "Access for partner brands looking to reach Ireland's best PTs",
]

export default function GraduateCommunitySection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-charcoal-950">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4 font-semibold">GRADUATE COMMUNITY</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-2">
            Your Career Doesn&apos;t End<br />at Graduation.
          </h2>
          <p className="font-serif italic text-white/40 text-lg mb-8">Neither Do We.</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-white/60 leading-relaxed mb-10 max-w-3xl"
        >
          The Floor is Ireland&apos;s only dedicated PT graduate community. As part of The Career or The Business pathway, you get six months free access.
        </motion.p>

        {/* Benefits */}
        <ul className="space-y-4 mb-10">
          {benefits.map((benefit, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-start gap-3 text-white/70"
            >
              <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>{benefit}</span>
            </motion.li>
          ))}
        </ul>

        {/* Pricing callout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="border border-charcoal-800/50 rounded-lg p-8 mb-10"
        >
          <p className="font-serif text-2xl sm:text-3xl text-gold italic mb-2">
            Six months free — included with your pathway
          </p>
          <p className="text-white/40 text-sm">
            After six months: €9.99/month. Cancel anytime.
          </p>
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="font-serif italic text-white/40 text-lg">This isn&apos;t a WhatsApp group.</p>
          <p className="text-gold font-semibold text-lg">This is your professional network.</p>
        </motion.div>
      </div>
    </section>
  )
}
