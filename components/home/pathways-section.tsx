'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const pathways = [
  {
    number: '01',
    name: 'The Cert',
    tagline: 'Get qualified. Get moving.',
    badges: ['FITNESS INSTRUCTION', 'GROUP INSTRUCTION', 'PERSONAL TRAINING'],
    description: "REPs accredited. Eight weeks. Everything you need to enter the profession with credibility. This is your foundation. Solid. Internationally recognised. The beginning of something that can become anything.",
    included: [
      'REPs Ireland approved PT qualification (EQF Level 4)',
      'Fitness Instruction certification',
      'Group Instruction certification',
      'Flexible delivery: blended, scheduled, or fully online',
    ],
    price: '€2,800',
    priceNote: 'Payment plans up to 8 months',
    cta: 'THIS IS MY STARTING POINT',
    href: '/courses/personal-trainer',
    popular: false,
  },
  {
    number: '02',
    name: 'The Career',
    tagline: 'Qualify. Get placed. Get hired.',
    badges: ['Most Popular', 'Best Value for Career Starters'],
    badgeGold: true,
    description: "The Cert gets you the qualification. The Career pathway gets you the career. You'll complete your training, step into a real gym environment for a live placement with actual clients, build your sales and acquisition skills through Phase 1 of our Fitness Business Accelerator, and join The Floor — Ireland's only PT graduate community — for six months of ongoing support, job listings, and industry connection. By the time you're done, you won't just have a certificate. You'll have experience, confidence, and a network.",
    included: [
      'Everything in The Cert',
      '3–4 week live job placement (real clients, real environment)',
      'Fitness Business Accelerator Phase 1 — client acquisition, pricing, how to sell',
      "Six months free in The Floor — Ireland's PT graduate community",
      'Graded result: Pass, Merit, or Distinction',
    ],
    price: '€3,500',
    priceNote: 'Payment plans up to 12 months',
    cta: 'THIS IS MY PATH',
    href: '/courses/personal-trainer',
    popular: true,
  },
  {
    number: '03',
    name: 'The Business',
    tagline: 'Build the career. Then build the empire.',
    badges: ['The Most Comprehensive Fitness Pathway in Ireland'],
    badgeGold: true,
    description: "From your first day of training to a fully operational personal training business — in 24 weeks. No other provider in Ireland offers this. Not even close.",
    included: [
      'Everything in The Career',
      'Professional brand photoshoot + advertising reels (done for you)',
      'AI for Coaches workshop — automate, optimise, outpace',
      'Programming for Success masterclass',
      'Fitness Business Accelerator Phase 2 — retention systems, scaling strategy',
      'Priority placement through our 200+ hiring partner network',
      'Extended membership in The Floor graduate community',
    ],
    price: '€4,800',
    priceNote: 'Payment plans up to 12 months',
    priceExtra: "This pathway includes a personal video consultation. We only take people we believe in — and we want to make sure this is right for both of us.",
    cta: 'APPLY FOR THE BUSINESS',
    href: '/courses/personal-trainer',
    popular: false,
  },
]

export default function PathwaysSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="pathways" ref={ref} className="py-20 sm:py-28 bg-charcoal-950">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">CHOOSE YOUR PATH</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-4">
            What&apos;s Your Path?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Choose where you want to end up. We&apos;ll build the road that gets you there.
          </p>
        </motion.div>

        {/* Pathway Cards */}
        <div className="space-y-8">
          {pathways.map((pathway, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
              className={`relative border rounded-lg p-8 sm:p-10 ${
                pathway.popular
                  ? 'border-gold/40 bg-charcoal-900/50'
                  : 'border-charcoal-800/50 bg-charcoal-950'
              }`}
            >
              {/* Popular badge */}
              {pathway.popular && (
                <div className="absolute -top-4 right-8 px-4 py-1.5 bg-charcoal-800 border border-charcoal-700 text-white text-xs tracking-[0.2em] uppercase font-semibold rounded">
                  MOST POPULAR
                </div>
              )}

              {/* Pathway number */}
              <p className="text-sm tracking-[0.25em] text-gold uppercase mb-3">
                PATHWAY {pathway.number}
              </p>

              {/* Name */}
              <h3 className="font-serif text-4xl sm:text-5xl text-white mb-2">
                {pathway.name}
              </h3>

              {/* Tagline */}
              <p className="text-white/40 italic font-serif text-lg mb-4">
                {pathway.tagline}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {pathway.badges.map((badge, i) => (
                  <span
                    key={i}
                    className={`text-xs sm:text-sm font-semibold ${
                      pathway.badgeGold ? 'text-gold' : 'text-gold'
                    }`}
                  >
                    {badge}
                    {i < pathway.badges.length - 1 && <span className="mx-2 text-white/30">&middot;</span>}
                  </span>
                ))}
              </div>

              {/* Separator */}
              <div className="w-12 h-[2px] bg-gold mb-8" />

              {/* Description */}
              <p className="text-white/60 leading-relaxed mb-8 max-w-3xl">
                {pathway.description}
              </p>

              {/* What's Included */}
              <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-4 font-semibold">
                WHAT&apos;S INCLUDED
              </p>
              <ul className="space-y-3 mb-10">
                {pathway.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70">
                    <span className="text-white/30 mt-1.5">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="border-t border-charcoal-800/50 pt-8" />

              {/* Pricing */}
              <div className="mb-6">
                <span className="font-serif text-4xl sm:text-5xl text-gold italic">From {pathway.price}</span>
                <p className="text-white/40 text-sm mt-2">{pathway.priceNote}</p>
              </div>

              {pathway.priceExtra && (
                <p className="text-white/40 italic font-serif text-sm mb-8 max-w-2xl">
                  {pathway.priceExtra}
                </p>
              )}

              {/* CTA */}
              <Link
                href={pathway.href}
                className={`inline-flex items-center justify-between gap-4 px-8 py-4 border text-sm tracking-[0.15em] uppercase font-semibold transition-all ${
                  pathway.popular
                    ? 'bg-gold text-charcoal-950 border-gold hover:bg-gold-400'
                    : 'border-gold/50 text-gold hover:bg-gold/10'
                }`}
              >
                {pathway.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
