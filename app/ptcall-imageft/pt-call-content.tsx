'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle, Users, Award, TrendingUp,
  MapPin, Calendar, Star, MessageCircle,
  Briefcase, Shield, Zap,
} from 'lucide-react'
import { getUpcomingPtIntakes, placesLine, isUrgent, type IntakeCard } from '@/lib/upcoming-intakes'

// First-name pool used by the live-booking toast. Irish-skewing.
const TOAST_NAMES = [
  'Conor', 'Sean', 'Eoin', 'Cillian', 'Oisin', 'Liam', 'Patrick', 'Jack',
  'Daniel', 'Cian', 'Ruairi', 'Darragh', 'Aoife', 'Niamh', 'Sarah', 'Emma',
  'Ciara', 'Hannah', 'Caoimhe', 'Saoirse', 'Aine', 'Maeve',
]
// Fallback only for "Nationwide" PT intakes (8-Week Full Time runs in 6
// regions). Real-region intakes get the county pulled from intake.location
// so "from X" matches the course being booked.
const TOAST_COUNTY_FALLBACK = [
  'Dublin', 'Cork', 'Galway', 'Limerick', 'Wexford',
]

// Extract a clean county label from the intake's display location.
//   "Dublin (Swords & Tallaght)"             → "Dublin"
//   "Cork · Galway · Limerick · Wexford"     → random one of those
//   "Cork"                                   → "Cork"
//   "Nationwide"                             → random fallback
function countyFromLocation(location: string): string {
  if (/^Nationwide\b/i.test(location)) {
    return TOAST_COUNTY_FALLBACK[Math.floor(Math.random() * TOAST_COUNTY_FALLBACK.length)]
  }
  if (location.includes('·')) {
    const parts = location.split('·').map(s => s.trim()).filter(Boolean)
    return parts[Math.floor(Math.random() * parts.length)]
  }
  return location.split('(')[0].trim()
}

// ── What happens on the call ───────────────────────────────────────
const callPoints = [
  {
    icon: MapPin,
    title: 'Find your best intake',
    body: "We'll match you to the right location, timetable, and start date based on your schedule.",
  },
  {
    icon: Briefcase,
    title: 'Pick the right package',
    body: "We'll walk through The Cert, Career, and Business pathways so you know exactly what you're getting.",
  },
  {
    icon: Calendar,
    title: 'Lock in your spot',
    body: "If it's the right fit, you can secure your place with a small deposit on the same call.",
  },
]

// ── Social proof numbers ───────────────────────────────────────────
const stats = [
  { value: '5,000+', label: 'Coaches Qualified' },
  { value: '16 yrs', label: 'Perfecting the Model' },
  { value: '200+', label: 'Hiring Partners' },
  { value: '4.9 ★', label: 'Google Rating' },
]

// ── Courses ────────────────────────────────────────────────────────
const courses = [
  {
    badge: 'The Cert',
    price: '€2,800',
    tagline: 'Your qualification. Your starting line.',
    color: 'border-gold/30',
    accentBg: 'bg-gold/8',
    items: [
      'REPs Ireland PT qualification (EQF Level 4)',
      'Fitness Instruction & Group Instruction certs',
      'Nutrition Diploma',
      'Flexible delivery — blended or online',
    ],
    planNote: 'From €500 deposit · 0% finance up to 8 months',
  },
  {
    badge: 'The Career',
    price: '€3,500',
    tagline: 'Qualify. Get placed. Get hired.',
    color: 'border-gold',
    accentBg: 'bg-gold/12',
    popular: true,
    items: [
      'Everything in The Cert',
      '3–4 week live gym placement with real clients',
      'Fitness Business Accelerator Phase 1',
      'Six months free in The Floor graduate community',
    ],
    planNote: 'From €500 deposit · 0% finance up to 10 months',
  },
  {
    badge: 'The Business',
    price: '€4,800',
    tagline: 'Build the career. Then build the empire.',
    color: 'border-gold/30',
    accentBg: 'bg-gold/8',
    items: [
      'Everything in The Career',
      'Brand photoshoot + advertising reels (done for you)',
      'AI for Coaches + Programming for Success workshops',
      'Fitness Business Accelerator Phase 2',
    ],
    planNote: 'From €500 deposit · 0% finance up to 12 months',
  },
]

// ── Trust signals ──────────────────────────────────────────────────
const trust = [
  { icon: Shield,    text: 'REPs Ireland accredited — EQF Level 4' },
  { icon: Award,     text: 'Graded results: Pass, Merit, Distinction' },
  { icon: Users,     text: '200+ active hiring partners nationwide' },
  { icon: TrendingUp,text: '0% finance — no interest, no hidden fees' },
  { icon: Zap,       text: 'Fastest route: qualified in 8 weeks' },
  { icon: Star,      text: '4.9 Google rating across 16 years' },
]

// ── FAQs ──────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How long is the call?',
    a: 'Around 15–20 minutes. No sales pressure — just a genuine conversation about where you\'re at and which pathway fits best.',
  },
  {
    q: 'Do I need any experience to start the PT course?',
    a: 'None at all. We start from foundations. The course is designed for career changers and fitness enthusiasts alike.',
  },
  {
    q: 'Can I study while working full time?',
    a: 'Yes — most students do. Saturday-only and evening options are available. One day a week for 16 weeks, or evenings + Saturdays for 8 weeks.',
  },
  {
    q: 'What\'s the minimum deposit to secure a place?',
    a: 'From €500 for the main pathways. Monthly payments don\'t start until your course date — so you can lock in your spot now without a big upfront cost.',
  },
  {
    q: 'Will I get a job after qualifying?',
    a: 'IFT has 200+ active hiring partners across Ireland. The Career and Business pathways include live placement — many students receive job offers during placement, before they\'ve even graduated.',
  },
]

// ── OnceHub inline widget ─────────────────────────────────────────
// Lazy-loaded: embed.js (~80 KB + 3rd-party fonts) is deferred until the
// browser is idle after first paint, so it doesn't compete with the hero
// render. Tap-to-load fallback shows immediately if the visitor wants the
// calendar before the idle callback fires.
function OnceHubCalendar({ heightClass = 'h-[600px] md:h-[680px]' }: { heightClass?: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [shouldMount, setShouldMount] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Defer mount until the browser is idle after first paint. Safari lacks
  // requestIdleCallback, so fall back to a short timeout.
  useEffect(() => {
    if (shouldMount) return
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
    const timer = ric
      ? ric(() => setShouldMount(true), { timeout: 2500 })
      : window.setTimeout(() => setShouldMount(true), 1500)
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback
      if (ric && cic) cic(timer as number)
      else clearTimeout(timer as number)
    }
  }, [shouldMount])

  // Inject the embed.js once we've decided to mount
  useEffect(() => {
    if (!shouldMount) return
    const existing = document.querySelector('script[src="https://cdn.oncehub.com/cal/embed.js"]')
    if (existing) { setLoaded(true); return }
    const s = document.createElement('script')
    s.src = 'https://cdn.oncehub.com/cal/embed.js'
    s.async = true
    s.onload = () => setLoaded(true)
    document.body.appendChild(s)
  }, [shouldMount])

  return (
    <div
      ref={wrapperRef}
      className={`w-full bg-white rounded-2xl overflow-hidden border border-charcoal-800 shadow-2xl shadow-black/30 ${heightClass}`}
    >
      {!shouldMount && (
        <button
          type="button"
          onClick={() => setShouldMount(true)}
          className="w-full h-full flex flex-col items-center justify-center gap-3 text-charcoal-950 font-medium hover:bg-charcoal-50 transition-colors"
        >
          <Calendar className="w-8 h-8 text-gold" />
          <span className="text-sm font-semibold">Tap to load calendar</span>
          <span className="text-xs text-charcoal-600">Available today · 15-minute call</span>
        </button>
      )}
      {shouldMount && !loaded && (
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      )}
      {shouldMount && (
        <div
          data-oh-booking-calendar-id="BKC-PDJR9D0K6W"
          style={{ minWidth: '320px', height: '100%' }}
        />
      )}
    </div>
  )
}

// Wrapped calendar block — header + iframe + caption. Rendered twice (once
// for mobile, once sticky on desktop) so we can put the calendar above the
// content on small screens without duplicating styling.
function CalendarBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <div className="bg-charcoal-900 border border-charcoal-800 rounded-t-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold/15 border border-gold/25 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-4 h-4 text-gold" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm">Book Your Strategy Call</p>
          <p className="text-white/40 text-[11px] sm:text-xs">Choose a date and time that suits you</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-[11px] sm:text-xs font-medium">Available today</span>
        </div>
      </div>
      <div className="-mt-px">
        <OnceHubCalendar />
      </div>
      <p className="text-center text-white/25 text-xs mt-3">
        No commitment · 15 minutes · Phone or WhatsApp
      </p>
    </motion.div>
  )
}

export default function PtCallContent() {
  // Compute initial intakes once. Subsequent decrements (from the live-booking
  // toast) mutate the state — recomputing would undo them.
  const initialIntakes = useMemo<IntakeCard[]>(() => getUpcomingPtIntakes(3), [])
  const [intakes, setIntakes] = useState<IntakeCard[]>(initialIntakes)

  // Live-booking social-proof toast. Periodically picks a random upcoming
  // intake with places > 1, decrements its `places` count by one, and shows
  // a "X from {county} just booked" toast in the corner.
  type Toast = { id: number; name: string; county: string; courseLine: string }
  const [toast, setToast] = useState<Toast | null>(null)
  const eventsFiredRef = useRef(0)

  useEffect(() => {
    const MAX_EVENTS = 4
    let timer: ReturnType<typeof setTimeout>

    const pickAndFire = () => {
      if (eventsFiredRef.current >= MAX_EVENTS) return
      if (typeof document !== 'undefined' && document.hidden) {
        schedule()
        return
      }
      setIntakes(prev => {
        const candidates = prev.filter(i => i.places !== null && i.places > 1)
        if (candidates.length === 0) return prev
        const target = candidates[Math.floor(Math.random() * candidates.length)]
        const name = TOAST_NAMES[Math.floor(Math.random() * TOAST_NAMES.length)]
        // County matches the booked intake's location, so the toast reads
        // "Conor from Galway just booked Personal Training · 2 July intake".
        const county = countyFromLocation(target.location)
        setToast({
          id: Date.now(),
          name,
          county,
          courseLine: `Personal Training · ${target.date} intake`,
        })
        eventsFiredRef.current += 1
        return prev.map(i =>
          i.startISO === target.startISO && i.location === target.location
            ? { ...i, places: (i.places ?? 1) - 1, urgent: isUrgent((i.places ?? 1) - 1) }
            : i,
        )
      })
      schedule()
    }

    const schedule = () => {
      const delay = 35_000 + Math.random() * 50_000
      timer = setTimeout(pickAndFire, delay)
    }

    timer = setTimeout(pickAndFire, 20_000 + Math.random() * 12_000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5500)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Preconnect speeds up the inevitable OnceHub fetch by warming up the
          TLS handshake while the rest of the page renders. */}
      <link rel="preconnect" href="https://cdn.oncehub.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cdn.oncehub.com" />

      {/* ── Minimal header ─────────────────────────────────────── */}
      <header className="border-b border-charcoal-800/50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo-global.png"
              alt="Image Fitness Training"
              width={120} height={36}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <a
            href="https://wa.me/353866003667?text=Hi%2C%20I%27d%20like%20to%20book%20a%20PT%20strategy%20call."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp instead</span>
          </a>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-6 sm:pb-10">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/7 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          {/* Mobile-only layout (< lg): Headline → Calendar → CallPoints → Stats */}
          {/* Desktop layout (>= lg): two-column grid with Calendar sticky in the right column */}
          <div className="lg:grid lg:grid-cols-[1fr_500px] lg:gap-16 lg:items-start">

            {/* Headline — always first */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-start-1 lg:row-start-1"
            >
              <p className="text-xs tracking-[0.25em] text-gold uppercase font-semibold mb-4">
                Free 15-Minute Call
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] text-white leading-tight mb-6">
                Book your free<br />
                <span className="text-gold italic">PT Strategy Call.</span>
              </h1>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-6 lg:mb-10 max-w-lg">
                Not sure which course is right for you? Book a no-pressure call with the Image
                team — we'll map out the fastest path to your PT career and answer every question
                before you commit to anything.
              </p>
            </motion.div>

            {/* Mobile calendar — between headline and content on mobile only */}
            <div className="lg:hidden mt-2 mb-10">
              <CalendarBlock />
            </div>

            {/* CallPoints + Stats — third on mobile, second row of left col on desktop */}
            <div className="lg:col-start-1 lg:row-start-2">
              {/* What happens on the call */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="space-y-4 mb-10"
              >
                {callPoints.map((pt, i) => {
                  const Icon = pt.icon
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm mb-0.5">{pt.title}</p>
                        <p className="text-white/45 text-sm leading-relaxed">{pt.body}</p>
                      </div>
                    </div>
                  )
                })}
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center bg-charcoal-900 border border-charcoal-800 rounded-xl py-4 px-2">
                    <p className="font-serif text-2xl text-gold italic mb-1">{s.value}</p>
                    <p className="text-xs text-white/35 tracking-wide uppercase">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Desktop calendar — sticky right column, spans both rows */}
            <div className="hidden lg:block lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-8">
              <CalendarBlock />
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming intakes urgency bar (auto-synced from course-data) ─── */}
      {intakes.length > 0 && (
        <section className="border-y border-charcoal-800/40 bg-charcoal-900/60 py-8">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.22em] text-gold uppercase font-semibold text-center mb-6">
              Upcoming Intakes — Places Filling Now
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {intakes.map((intake, i) => (
                <motion.div
                  key={intake.startISO + intake.location}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border p-4 flex items-start gap-3 ${
                    intake.urgent
                      ? 'border-red-500/20 bg-red-500/5'
                      : 'border-charcoal-700 bg-charcoal-900/40'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${intake.urgent ? 'bg-red-400' : 'bg-amber-400'}`} />
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${intake.urgent ? 'bg-red-500' : 'bg-amber-400'}`} />
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{intake.date}</p>
                    <p className="text-white/50 text-xs mt-0.5">{intake.location}</p>
                    <p className="text-white/35 text-xs">{intake.format}</p>
                    <p className={`text-xs font-semibold mt-1.5 ${intake.urgent ? 'text-red-400' : 'text-amber-400'}`}>
                      {placesLine(intake.places)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Course guide ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs tracking-[0.25em] text-gold uppercase font-semibold mb-3">Choose Your Pathway</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
              Which course is right for you?
            </h2>
            <p className="text-white/45 max-w-xl mx-auto text-base leading-relaxed">
              This is exactly what we'll discuss on the call. Here's a quick overview so you
              can come with questions ready.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border ${course.color} ${course.accentBg} p-6 flex flex-col`}
              >
                {course.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-charcoal-950 text-[10px] font-bold tracking-[0.12em] uppercase px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <p className="text-xs tracking-[0.18em] text-gold uppercase font-bold mb-2">{course.badge}</p>
                <p className="font-serif text-3xl text-gold italic mb-1">{course.price}</p>
                <p className="text-white/50 text-sm italic mb-5">{course.tagline}</p>

                <div className="border-t border-charcoal-800/60 pt-4 mb-5 flex-1">
                  <ul className="space-y-2.5">
                    {course.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-white/60 text-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-gold/60 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-white/30 italic">{course.planNote}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/30 text-sm mt-8"
          >
            Not sure which one? That's exactly what the call is for. →
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gold hover:text-gold/80 ml-2 transition-colors font-medium"
            >
              Book your call above
            </button>
          </motion.p>
        </div>
      </section>

      {/* ── Trust signals ───────────────────────────────────────── */}
      <section className="py-10 bg-charcoal-900 border-y border-charcoal-800/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trust.map((t, i) => {
              const Icon = t.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-2 text-center px-2"
                >
                  <Icon className="w-5 h-5 text-gold/70" />
                  <p className="text-white/40 text-xs leading-tight">{t.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-xs tracking-[0.25em] text-gold uppercase font-semibold mb-3">Quick Answers</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">Common questions.</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border border-charcoal-800 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold text-sm mb-1.5">{faq.q}</p>
                    <p className="text-white/45 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-charcoal-900 border-t border-charcoal-800/40">
        <div className="max-w-[620px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.25em] text-gold uppercase font-semibold mb-4">Ready to Go?</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
              One 15-minute call.<br />
              <span className="text-gold italic">Total clarity on your path.</span>
            </h2>
            <p className="text-white/45 mb-8 leading-relaxed">
              No pressure. No hard sell. Just an honest conversation about whether IFT is
              the right move for you — and if so, the fastest way to get there.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-gold inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm tracking-[0.08em] uppercase font-bold"
            >
              <Calendar className="w-4 h-4" />
              Book Your Strategy Call
            </button>
            <p className="text-white/25 text-xs mt-5">
              Or WhatsApp us directly at{' '}
              <a
                href="https://wa.me/353866003667"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                +353 86 600 3667
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Minimal footer ──────────────────────────────────────── */}
      <footer className="border-t border-charcoal-800/40 py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            <Image
              src="/logo-global.png"
              alt="Image Fitness Training"
              width={100} height={30}
              className="h-6 w-auto opacity-60 hover:opacity-100 transition-opacity"
            />
          </Link>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="/courses/personal-trainer" className="hover:text-white/60 transition-colors">
              View PT Course
            </Link>
            <Link href="/checkout" className="hover:text-white/60 transition-colors">
              Enrol Now
            </Link>
            <a
              href="mailto:sales@imageft.ie"
              className="hover:text-white/60 transition-colors"
            >
              sales@imageft.ie
            </a>
          </div>
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Image Fitness Training Global</p>
        </div>
      </footer>

      {/* ── Mobile sticky CTA — scrolls back to calendar ─────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full pointer-events-auto inline-flex items-center justify-center gap-2 bg-gold text-charcoal-950 font-bold text-sm uppercase tracking-[0.08em] py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        >
          <Calendar className="w-4 h-4" />
          Book Your Call
        </button>
      </div>

      {/* ── Live-booking toast (social proof) ───────────────────── */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed z-50 left-4 right-4 sm:left-6 sm:right-auto bottom-20 sm:bottom-6 sm:max-w-[340px] pointer-events-none"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="rounded-xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] flex items-start gap-3 pointer-events-auto bg-charcoal-900 border border-charcoal-800"
            >
              <span className="flex h-9 w-9 rounded-full items-center justify-center flex-shrink-0 bg-green-500/15">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight text-white">
                  {toast.name} from {toast.county} just booked
                </p>
                <p className="text-[12px] mt-0.5 text-white/50 truncate">
                  {toast.courseLine}
                </p>
                <p className="text-[10px] mt-1 tracking-[0.08em] uppercase text-white/30">
                  A few seconds ago
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
