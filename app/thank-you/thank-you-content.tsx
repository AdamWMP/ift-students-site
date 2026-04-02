'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import {
  CheckCircle, Calendar, MessageCircle, ArrowRight,
  Clock, Users, Briefcase, Star, TrendingUp, Award
} from 'lucide-react'

// ─── What Happens Next ────────────────────────────────────────────
const nextSteps = [
  {
    icon: Clock,
    step: '01',
    title: 'We\'ll be in touch within 2 hours',
    description: 'A member of the Image team will reach out to confirm your call and answer any questions you have in the meantime.',
  },
  {
    icon: Calendar,
    step: '02',
    title: 'Your career strategy call with the team',
    description: 'A focused chat to understand where you\'re at, explore whether Pro Coach or Complete Coach is the right fit, and map out your fastest path to get qualified and earning. No pressure — just clear direction.',
  },
  {
    icon: Briefcase,
    step: '03',
    title: 'Your place is reserved',
    description: 'If the timing and fit is right, you can secure your intake spot with a deposit on the call or straight after — no rush.',
  },
]

// ─── Phase styles — static so Tailwind always picks them up ──────
const phaseStyles = [
  { border: 'border-gold/40',        bg: 'bg-gold/5',          label: 'text-gold',         dot: 'bg-gold'         },
  { border: 'border-blue-500/30',    bg: 'bg-blue-900/10',     label: 'text-blue-400',     dot: 'bg-blue-400'     },
  { border: 'border-purple-500/30',  bg: 'bg-purple-900/10',   label: 'text-purple-400',   dot: 'bg-purple-400'   },
  { border: 'border-emerald-500/30', bg: 'bg-emerald-900/10',  label: 'text-emerald-400',  dot: 'bg-emerald-400'  },
  { border: 'border-orange-500/30',  bg: 'bg-orange-900/10',   label: 'text-orange-400',   dot: 'bg-orange-400'   },
  { border: 'border-gold/40',        bg: 'bg-gold/5',          label: 'text-gold',         dot: 'bg-gold'         },
]

// ─── Full Career Journey ──────────────────────────────────────────
const journeySteps = [
  {
    phase: 'Phase 1',
    weeks: 'Weeks 1–8',
    title: 'Get Qualified',
    items: [
      'Fitness Instruction (EQF Level 3)',
      'Group Fitness Instruction',
      'Personal Training (EQF Level 4)',
      'REPs Ireland accredited',
      'Theory + practical exams',
    ],
    note: 'You finish this phase with 3 certifications. Most providers stop here.',
  },
  {
    phase: 'Phase 2',
    weeks: 'Weeks 9–12',
    title: 'Get Real Experience',
    items: [
      'Placement in a real gym environment',
      'Supervised client sessions',
      'Logged coaching hours for REPs',
      'Tutor feedback on your practice',
    ],
    note: 'Real hours. Real clients. Real confidence before you go solo.',
  },
  {
    phase: 'Phase 3',
    weeks: 'Week 13',
    title: 'Build Your Brand',
    items: [
      'Professional photoshoot',
      'Advertising reels produced',
      'Social media content package',
      'Personal brand strategy session',
    ],
    note: 'You look the part before you take your first paying client.',
  },
  {
    phase: 'Phase 4',
    weeks: 'Weeks 14–17',
    title: 'Start Earning',
    items: [
      'Fitness Business Accelerator (FBA) Phase 1',
      'Pricing and packaging your services',
      'Client acquisition without cold selling',
      'Sales psychology and handling objections',
    ],
    note: 'Most coaches spend years figuring this out. You start with it.',
  },
  {
    phase: 'Phase 5',
    weeks: 'Weeks 18–19',
    title: 'Level Up',
    items: [
      'AI for Coaches workshop',
      'Programming for Success masterclass',
      'Advanced session design',
      'Content creation systems',
    ],
    note: 'The tools that separate a good coach from a modern business.',
  },
  {
    phase: 'Phase 6',
    weeks: 'Weeks 20–24',
    title: 'Build the Business',
    items: [
      'FBA Phase 2 — client retention systems',
      'Scaling beyond 1-to-1',
      'Online coaching setup',
      'Six months access to The Floor graduate community',
    ],
    note: 'Your qualification is your foundation. This is your ceiling.',
  },
]

// ─── Proof Points ─────────────────────────────────────────────────
const proofPoints = [
  { value: '5,000+', label: 'Coaches Made' },
  { value: '16 yrs', label: 'Perfecting the Model' },
  { value: '200+', label: 'Hiring Partners' },
  { value: '4.9 ★', label: 'Google Rating' },
]

// ─── FAQs ─────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Do I need any fitness experience to start?',
    a: 'No prior qualifications are needed. We start from the foundations and build up. The course is designed for career changers and fitness enthusiasts alike.',
  },
  {
    q: 'How does the payment plan work?',
    a: 'You secure your place with a deposit. The remaining balance can be spread across monthly instalments — we\'ll walk through the options on your strategy call.',
  },
  {
    q: 'Can I study while working?',
    a: 'Yes. Most of our students are in full-time employment when they start. Saturday cohorts and evening options are available across our 7 locations.',
  },
  {
    q: 'What happens if I miss a session?',
    a: 'All classroom content is backed up with recordings and notes in your student portal. Tutors are also available for catch-up support.',
  },
  {
    q: 'Will I actually get work after graduating?',
    a: 'We have 200+ active hiring partners across Ireland who post positions exclusively to our graduate board. Placement support is built into the programme — not an afterthought.',
  },
]

// ─── Inner Content (needs Suspense for useSearchParams) ──────────
function ThankYouInner() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') // 'booking' | 'enquiry' | null
  const isBooking = type === 'booking'

  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: nextRef, inView: nextInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: journeyRef, inView: journeyInView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const { ref: proofRef, inView: proofInView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { ref: faqRef, inView: faqInView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-charcoal-950 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold/8 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/15 border border-gold/30 mb-8"
          >
            <CheckCircle className="w-8 h-8 text-gold" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-sm tracking-[0.25em] text-gold uppercase mb-4 font-semibold"
          >
            {isBooking ? 'Call Confirmed' : 'Enquiry Received'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            {isBooking
              ? <>You&apos;re booked in.<br /><span className="text-gold italic">We&apos;ll see you soon.</span></>
              : <>You&apos;re on our radar.<br /><span className="text-gold italic">We&apos;ll be in touch shortly.</span></>
            }
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg leading-relaxed mb-10"
          >
            {isBooking
              ? 'Check your email for the calendar invite. While you\'re here — take a few minutes to see exactly where this journey takes you.'
              : 'A member of the team will reach out within 2 hours. In the meantime, read through what your journey as a coach actually looks like with Image.'
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://wa.me/353866000001?text=Hi!%20I%20just%20submitted%20an%20enquiry%20and%20wanted%20to%20introduce%20myself."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us Now
            </a>
            <Link href="/courses/personal-trainer" className="btn-gold inline-flex items-center justify-center gap-2">
              Explore the PT Course <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── What Happens Next ────────────────────────────────── */}
      <section ref={nextRef} className="py-16 sm:py-20 bg-charcoal-900 border-y border-charcoal-800/30">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={nextInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-3 font-semibold">What Happens Next</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">Here&apos;s the next 48 hours.</h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {nextSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={nextInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="bg-charcoal-950 border border-charcoal-800 rounded-2xl p-7 relative"
                >
                  <span className="absolute top-5 right-5 font-serif text-5xl text-white/5 italic leading-none">{step.step}</span>
                  <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Proof Stats Bar ───────────────────────────────────── */}
      <section ref={proofRef} className="py-12 bg-charcoal-950 border-b border-charcoal-800/30">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {proofPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={proofInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
              >
                <p className="font-serif text-3xl sm:text-4xl text-gold italic mb-1">{p.value}</p>
                <p className="text-xs tracking-[0.2em] text-white/40 uppercase">{p.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full Career Journey ───────────────────────────────── */}
      <section ref={journeyRef} className="py-20 sm:py-28 bg-charcoal-950">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4 font-semibold">Your Journey</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
              From Enquiry to Empire.<br />
              <span className="text-gold italic">This is the full picture.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Every step. No surprises. This is exactly what the next 24 weeks look like once you decide to go.
            </p>
          </motion.div>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Mobile: left-side line | Desktop: centre line */}
            <div className="absolute left-[18px] sm:left-1/2 top-0 bottom-0 w-px bg-charcoal-800 sm:-translate-x-px" />

            <div className="space-y-0">
              {journeySteps.map((step, i) => {
                const isLeft = i % 2 === 0
                const s = phaseStyles[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    animate={journeyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.12 }}
                    className={`flex items-start gap-0 sm:gap-0 pb-8 sm:pb-12 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                  >
                    {/* ── Mobile dot (left side) ─────────────────── */}
                    <div className="flex-shrink-0 flex flex-col items-center sm:hidden" style={{ width: 38 }}>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 border-charcoal-800 mt-6 z-10 relative ${s.dot}`} />
                    </div>

                    {/* ── Card ─────────────────────────────────────── */}
                    <div className={`flex-1 sm:flex-none sm:w-[calc(50%-2rem)] ${isLeft ? 'sm:pr-8' : 'sm:pl-8'}`}>
                      <div className={`border rounded-2xl p-5 sm:p-6 ${s.border} ${s.bg}`}>
                        {/* Phase header */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs tracking-[0.2em] uppercase font-bold ${s.label}`}>{step.phase}</span>
                          <span className="text-white/20 text-xs">·</span>
                          <span className="text-white/50 text-xs">{step.weeks}</span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl text-white italic mb-4">{step.title}</h3>
                        <ul className="space-y-2 mb-4">
                          {step.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-white/60 text-sm">
                              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <p className="text-white/30 text-xs italic border-t border-white/10 pt-3">
                          {step.note}
                        </p>
                      </div>
                    </div>

                    {/* ── Desktop centre dot ────────────────────────── */}
                    <div className="hidden sm:flex w-16 items-start justify-center flex-shrink-0 pt-6">
                      <div className={`w-4 h-4 rounded-full border-2 border-charcoal-800 z-10 ${s.dot}`} />
                    </div>

                    {/* ── Desktop spacer ───────────────────────────── */}
                    <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                  </motion.div>
                )
              })}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="text-center font-serif italic text-white/40 text-lg sm:text-xl max-w-3xl mx-auto mt-12"
          >
            Twenty-four weeks. One unbroken pathway. A career, a brand, and a business — handed to you with support every step of the way.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section ref={faqRef} className="py-16 sm:py-24 bg-charcoal-900 border-t border-charcoal-800/30">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-3 font-semibold">Before the Call</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">Questions People Always Ask</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="border border-charcoal-800 rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="text-gold mt-0.5 flex-shrink-0">
                    <Star className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-white mb-2">{faq.q}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[620px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4 font-semibold">Ready When You Are</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Any questions before<br />
              <span className="text-gold italic">your call?</span>
            </h2>
            <p className="text-white/50 mb-10">
              Message us on WhatsApp — we typically respond within the hour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/353866000001?text=Hi!%20I%20have%20a%20quick%20question%20before%20my%20call."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center justify-center gap-2 text-sm tracking-[0.1em] uppercase font-semibold py-4"
              >
                <MessageCircle className="w-4 h-4" /> Message Us on WhatsApp
              </a>
              <Link
                href="/courses/personal-trainer"
                className="btn-outline inline-flex items-center justify-center gap-2 text-sm tracking-[0.1em] uppercase font-semibold py-4"
              >
                View the PT Course <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default function ThankYouContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-charcoal-950" />}>
      <ThankYouInner />
    </Suspense>
  )
}
