'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Clock, Star } from 'lucide-react'
import CalendlyModal from '@/components/calendly-modal'

const journeySteps = [
  {
    number: '01',
    timing: 'WEEKS 1–11',
    title: 'Master the Mat.',
    subtitle: 'The Body-Flow Method. 38+ exercises. REPs Ireland certified.',
    bullets: [
      "Body-Flow Method certification — Image's signature teaching system",
      '38+ classical mat exercises plus modern adaptations',
      'Special populations module — pregnancy, rehabilitation, older adults',
      'Pregnancy workshop included',
      'REPs Ireland & EHFA approved qualification',
    ],
    whatYouHaveNow: "Ireland's most respected mat Pilates qualification. You're certified. You're legitimate. You can teach tomorrow.",
    exitLabel: 'THE CERT PATHWAY EXITS HERE',
    exitPrice: 'From €1,800 · Payment plans available · The foundation is yours.',
  },
  {
    number: '02',
    timing: '3 WEEKENDS',
    title: 'Conquer the Reformer.',
    subtitle: "Ireland's only REPs-approved Reformer specialisation.",
    bullets: [
      "Align–Flow–Empower Reformer framework — Image's exclusive methodology",
      'Complete Reformer repertoire from foundation to advanced',
      'Weekend-friendly schedule — 3 weekends total',
      'Prerequisites: Mat certification (Step 01)',
      'REPs Ireland approved — the only approved Reformer course in Ireland',
    ],
    whatYouHaveNow: "Dual certified. Mat AND Reformer. Ireland's most employable Pilates qualification. Most instructors only have one. You have both.",
    exitLabel: null,
    exitPrice: null,
  },
  {
    number: '03',
    timing: 'POST-QUALIFICATION',
    title: 'Teach Real Classes.',
    subtitle: 'Real clients. Real money. Real experience.',
    bullets: [
      'Placement in the Image Student Studio — our HQ in Swords, Dublin',
      'Teach beginner mat and reformer classes to the general public',
      'Paid placement — earn €20–25 per class while you build your hours',
      "Classes managed by senior Image tutors — you're supported, not abandoned",
      'Build a track record of real teaching hours before your first job interview',
      'Nationwide — Image-Approved Studio Network for graduates outside Dublin',
    ],
    whatYouHaveNow: "Not just qualified — experienced. When you interview for your first studio role, you're not talking about what you might do. You're talking about classes you've already taught, clients you've already helped, hours you've already banked.",
    exitLabel: 'THE CAREER PATHWAY EXITS HERE',
    exitPrice: 'From €2,500 · Save €700 vs individual courses · Qualified, placed, experienced.',
  },
  {
    number: '04',
    timing: '30 DAYS · FULLY ONLINE',
    title: 'Build the Business.',
    subtitle: 'Everything they never teach you in a Pilates course.',
    bullets: [
      'How to get insured — the right cover, at the right price, from day one',
      'How to price your classes and private sessions — what the market pays',
      'How to market yourself online — Instagram, TikTok, local marketing',
      'How to get your first clients and keep them',
      'How to set up your own studio — from pop-up to permanent',
      'How to work with gyms, wellness centres, and corporate clients',
      'Fully online, 1–2 sessions per week, 30 days',
    ],
    whatYouHaveNow: "The qualification. The experience. The business skills. You're not just a Pilates instructor — you're a Pilates entrepreneur. Everything you need to build whatever you want.",
    exitLabel: 'THE STUDIO PATHWAY EXITS HERE',
    exitPrice: 'From €3,200 · Payment plans up to 12 months · The complete Pilates career ecosystem.',
  },
]

const outcomes = [
  {
    title: 'Get Hired',
    description: "Walk into any Pilates studio in Ireland — or anywhere in the world — with dual REPs certification and real teaching hours. You're not a graduate. You're a professional.",
  },
  {
    title: 'Go Freelance',
    description: 'Build your own client base. Teach mat classes in community centres, corporate wellness, private sessions. You have the qualification, the hours, and the business skills to fill your diary.',
  },
  {
    title: 'Open Your Studio',
    description: "The Business Accelerator gave you the playbook. Find your space. Build your brand. Open your doors. This is the pathway that produces studio owners — and we've done it many times.",
  },
]

const pathways = [
  {
    number: '01',
    name: 'The Cert',
    tagline: 'Your qualification. Your foundation. Your starting line.',
    timing: '5–11 WEEKS',
    description: "You love how Pilates makes you feel. Now learn how to create that feeling for others. Master the Body-Flow Method across 38+ classical exercises and leave with Ireland's most respected mat Pilates qualification — ready to teach from day one.",
    bullets: [
      'Body-Flow Method certification',
      '38+ mat exercises — classical and contemporary',
      'Special populations module',
      'Pregnancy workshop',
      'REPs Ireland approved qualification',
    ],
    price: '€1,800',
    priceNote: null,
    cta: 'THIS IS MY PATHWAY',
    popular: false,
  },
  {
    number: '02',
    name: 'The Career',
    tagline: 'Qualify. Teach real classes. Build a career you love.',
    timing: 'MAT + REFORMER · 8–14 WEEKS',
    description: "Dual mat and reformer credentials, real teaching hours with paying clients, and six months inside Ireland's only Pilates women's graduate community. Flexible scheduling designed around busy lives — because we know you're juggling more than just a course. When you finish, you won't just have a qualification. You'll have a practice.",
    bullets: [
      "Ireland's only REPs-approved Reformer specialisation",
      'Align–Flow–Empower Reformer framework',
      'Real-world placement hours with paying clients',
      'Access to the Image-Approved Studio Network',
      "Six months free in The Circle — Ireland's only Pilates graduate community",
      'Graded result: Pass, Merit, or Distinction',
    ],
    price: '€2,500',
    priceNote: 'was €3,200',
    cta: 'THIS IS MY PATHWAY',
    popular: true,
  },
  {
    number: '03',
    name: 'The Studio',
    tagline: "For women who don't just want to teach Pilates — they want to create a space of their own.",
    timing: 'THE COMPLETE PILATES CAREER ECOSYSTEM',
    description: "The complete journey — from your first mat class to your own studio, your own timetable, your own community of clients. You get the qualification, the teaching hours, the business knowledge, and six months of ongoing support. Because the most important months of your Pilates career aren't in the studio. They're the ones right after you leave it.",
    bullets: [
      'Everything in The Career',
      'Pilates Business Accelerator — pricing, insurance, client acquisition, marketing',
      'How to set up your own studio or go independent',
      'Six months in The Circle (free), then €9.99/month',
      'Priority placement with 200+ hiring partners',
      'Graded result — your Distinction is your competitive edge',
    ],
    price: '€3,200',
    priceNote: 'Payment plans up to 12 months',
    priceExtra: "Includes a personal video consultation — because this pathway is for coaches we believe in.",
    cta: 'APPLY FOR THE STUDIO',
    popular: false,
  },
]

const testimonials = [
  {
    initials: 'JD',
    name: 'Julie Dwyer',
    role: 'Image Pilates Graduate',
    quote: "I launched my own classes locally and they were fully booked within weeks. Best decision I've ever made.",
  },
]

const studioStats = [
  { value: '10', label: 'REFORMERS AVAILABLE' },
  { value: '€20–25', label: 'PER CLASS PAID TO GRADUATES' },
  { value: '200+', label: 'PARTNER STUDIOS NATIONWIDE' },
]

export default function PilatesCourseContent() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const { ref: journeyRef, inView: journeyInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: pathwaysRef, inView: pathwaysInView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      {/* Journey Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/80 via-charcoal-950/60 to-charcoal-950" />
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm tracking-[0.25em] text-gold uppercase mb-4"
          >
            THE IMAGE PILATES JOURNEY
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 60 }}
            transition={{ delay: 0.15 }}
            className="h-[2px] bg-gold mx-auto mb-10"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-[0.95] mb-8"
          >
            From Mat<br />To Studio.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif italic text-white/50 text-lg sm:text-xl mb-6"
          >
            Every step. Every week. Every outcome. Mapped.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-white/50 text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          >
            This is what no other Pilates provider in Ireland will show you — because no other provider takes you this far.
          </motion.p>
          {/* Pathway tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {['THE CERT', 'THE CAREER', 'THE STUDIO'].map((tab) => (
              <span key={tab} className="px-5 py-2.5 border border-charcoal-700 rounded-full text-xs tracking-[0.15em] text-white/60 uppercase">
                {tab}
              </span>
            ))}
          </motion.div>
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-gold/50" />
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-gold text-lg"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Journey */}
      <section ref={journeyRef} className="py-16 sm:py-20 bg-charcoal-950">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          {/* Day Zero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            className="relative pl-16 sm:pl-24 mb-16"
          >
            {/* Timeline line */}
            <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/30 to-charcoal-800/30" />
            {/* Circle */}
            <div className="absolute left-0 sm:left-4 top-0 w-12 h-12 rounded-full border-2 border-charcoal-700 bg-charcoal-950 flex items-center justify-center">
              <span className="text-xs tracking-wider text-white/40 font-semibold">START</span>
            </div>
            <div className="border border-charcoal-800/50 rounded-lg p-8 bg-charcoal-900/30">
              <span className="inline-block px-4 py-1.5 bg-charcoal-800 rounded-full text-xs tracking-[0.15em] text-white/50 uppercase mb-4">DAY ZERO</span>
              <h3 className="font-serif text-3xl sm:text-4xl text-white/40 mb-2">Not Qualified.</h3>
              <p className="font-serif italic text-white/30 text-base mb-6">You love Pilates. You&apos;re not yet certified to teach it.</p>
              <div className="border-t border-charcoal-800/50 pt-6">
                <p className="text-white/50 leading-relaxed">
                  You&apos;ve been practising Pilates. You know the difference it makes. You want to share that — but without the right qualification, the right experience, and the right support, that ambition stays just out of reach. This is where we change that.
                </p>
              </div>
              <p className="mt-6 font-serif italic text-white/30 text-sm">↓ This is where every pathway begins</p>
            </div>
          </motion.div>

          {/* Journey Steps */}
          {journeySteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={journeyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="relative pl-16 sm:pl-24 mb-16"
            >
              {/* Timeline line */}
              <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/30 to-charcoal-800/30" />
              {/* Number circle */}
              <div className="absolute left-0 sm:left-4 top-0 w-12 h-12 rounded-full border-2 border-gold/50 bg-charcoal-950 flex items-center justify-center">
                <span className="font-serif italic text-white/60">{step.number}</span>
              </div>

              <div className="border border-charcoal-800/50 rounded-lg p-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-charcoal-800/50 border border-charcoal-700/50 rounded-full text-xs tracking-[0.15em] text-gold uppercase mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  {step.timing}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white mb-2">{step.title}</h3>
                <p className="font-serif italic text-white/40 text-base mb-6">{step.subtitle}</p>
                <div className="border-t border-charcoal-800/50 pt-6">
                  <ul className="space-y-3 mb-8">
                    {step.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* What You Have Now box */}
                <div className="bg-charcoal-800/30 border border-charcoal-700/50 rounded-lg p-6">
                  <p className="text-xs tracking-[0.2em] text-gold uppercase mb-3 font-semibold">WHAT YOU HAVE NOW</p>
                  <p className="font-serif italic text-white/50 leading-relaxed">{step.whatYouHaveNow}</p>
                </div>
              </div>

              {/* Exit point */}
              {step.exitLabel && (
                <div className="mt-6 text-center">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="h-[1px] flex-1 border-t border-dashed border-gold/30" />
                    <span className="text-xs tracking-[0.15em] text-gold uppercase font-semibold flex items-center gap-2">
                      ◄ {step.exitLabel}
                    </span>
                    <div className="h-[1px] flex-1 border-t border-dashed border-gold/30" />
                  </div>
                  <p className="text-white/40 text-sm mt-2">{step.exitPrice}</p>
                </div>
              )}
            </motion.div>
          ))}

          {/* You Arrive Here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-gold/30 rounded-lg p-10 text-center mb-16"
          >
            <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">YOU ARRIVE HERE</p>
            <h3 className="font-serif text-4xl sm:text-5xl text-white mb-3">You Arrive Here.</h3>
            <p className="font-serif italic text-white/40 text-lg mb-10">
              Certified. Experienced. Skilled. Ready to build whatever you want.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {outcomes.map((outcome, i) => (
                <div key={i} className="border border-charcoal-800/50 rounded-lg p-6 text-left bg-charcoal-900/30">
                  <h4 className="font-serif text-xl text-gold italic mb-3">{outcome.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{outcome.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Choose Your Pathway */}
      <section ref={pathwaysRef} className="py-20 sm:py-28 bg-charcoal-950 border-t border-charcoal-800/30">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pathwaysInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-6"
          >
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white italic mb-2">
              Choose Your Pathway.
            </h2>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-gold italic mb-6">
              Shape Your Future.
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Whether you&apos;re looking for flexibility around family, a complete career change, or simply want to turn a practice you love into something meaningful — there&apos;s a pathway here for you.
            </p>
          </motion.div>

          <div className="space-y-8 mt-12">
            {pathways.map((pathway, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={pathwaysInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15 }}
                className={`relative border rounded-lg p-8 sm:p-10 ${
                  pathway.popular ? 'border-gold/40 bg-charcoal-900/50' : 'border-charcoal-800/50'
                }`}
              >
                {pathway.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gold text-charcoal-950 text-xs tracking-[0.2em] uppercase font-bold rounded">
                    MOST POPULAR
                  </div>
                )}
                <p className="text-sm tracking-[0.25em] text-gold uppercase mb-3">PATHWAY {pathway.number}</p>
                <h3 className="font-serif text-4xl sm:text-5xl text-white mb-2">{pathway.name}</h3>
                <p className="text-white/50 mb-4">{pathway.tagline}</p>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-charcoal-800/50 border border-charcoal-700/50 rounded-full text-xs tracking-[0.15em] text-gold uppercase mb-6">
                  <Clock className="w-3.5 h-3.5" />
                  {pathway.timing}
                </span>
                <p className="text-white/60 leading-relaxed mb-8 max-w-3xl">{pathway.description}</p>
                <ul className="space-y-3 mb-8">
                  {pathway.bullets.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70">
                      <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-charcoal-800/50 pt-8">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="font-serif text-4xl sm:text-5xl text-gold italic">From {pathway.price}</span>
                    {pathway.priceNote && <span className="text-white/30 line-through text-sm">{pathway.priceNote}</span>}
                  </div>
                  {pathway.priceExtra && (
                    <p className="text-white/40 italic font-serif text-sm mb-6">{pathway.priceExtra}</p>
                  )}
                </div>
                <Link
                  href="https://pilatescheckout.imageft.ie"
                  className={`inline-flex items-center justify-center gap-4 px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold transition-all w-full sm:w-auto ${
                    pathway.popular
                      ? 'bg-gold text-charcoal-950 hover:bg-gold-400'
                      : 'border border-gold/50 text-gold hover:bg-gold/10'
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

      {/* Quote */}
      <section className="py-20 sm:py-28 bg-charcoal-900 border-t border-charcoal-800/30">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <p className="font-serif text-2xl sm:text-3xl italic text-white/50 mb-2">Pilates changed something in you.</p>
          <p className="font-serif text-2xl sm:text-3xl italic text-gold">We&apos;ll help you share that with the world.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-charcoal-950">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] text-white/40 uppercase mb-4">5,000+ GRADUATES. ONE COMMUNITY.</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-white">Real Stories. Real Results.</h2>
          </div>
          <div className="space-y-6">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-charcoal-800/50 rounded-lg p-8">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 text-gold" fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif italic text-white/60 text-lg mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-charcoal-800/50 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-gold text-sm font-semibold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Circle Community */}
      <section className="py-20 sm:py-28 bg-charcoal-950 border-t border-charcoal-800/30">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-6 py-2.5 border border-charcoal-700 rounded-full text-xs tracking-[0.15em] text-white/60 uppercase mb-8">
              IRELAND&apos;S ONLY PILATES GRADUATE COMMUNITY
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-4">
              The Journey Doesn&apos;t End Here.
            </h2>
            <p className="font-serif text-2xl sm:text-3xl italic text-gold mb-8">
              It continues inside The Circle.
            </p>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
              Every Career and Studio pathway graduate gets six months free inside The Circle — Ireland&apos;s only Pilates graduate community. Exclusive jobs board. Studio partnership discounts. Peer mentorship. Ongoing support from the Image team.
            </p>
            <p className="font-serif italic text-white/40 text-base mb-10">
              After six months: €9.99/month. Cancel anytime.
            </p>
            <Link
              href="https://pilatescheckout.imageft.ie"
              className="inline-flex items-center gap-4 px-8 py-4 border border-gold/50 text-gold text-sm tracking-[0.15em] uppercase font-semibold hover:bg-gold/10 transition-all"
            >
              JOIN THE CIRCLE
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Student Studio Spotlight */}
      <section className="py-20 sm:py-28 bg-charcoal-950 border-t border-charcoal-800/30">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">STUDENT STUDIO SPOTLIGHT</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-white mb-3">The Student Studio.</h2>
            <p className="font-serif italic text-gold text-lg mb-6">Where qualifications become careers.</p>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-12">
              Our academy in Swords, Dublin houses 10 professional reformers and a full mat studio. After you qualify, this is where you get your first real classes — teaching paying clients in a supported environment. It&apos;s the bridge between qualification and career that no other provider offers.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-0 border border-charcoal-800/50 rounded-lg overflow-hidden">
            {studioStats.map((stat, i) => (
              <div key={i} className="p-8 border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0 border-charcoal-800/50 bg-charcoal-900/30">
                <p className="font-serif text-4xl sm:text-5xl text-gold italic mb-2">{stat.value}</p>
                <p className="text-xs tracking-[0.2em] text-white/40 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32 bg-charcoal-900 border-t border-charcoal-800/30">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Start Your <span className="text-gold italic">Pilates Journey</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg mb-10 max-w-lg mx-auto">
              Join Ireland&apos;s most respected Pilates instructor training program. Limited spaces available.
            </p>
            <button
              onClick={() => setIsCalendlyOpen(true)}
              className="btn-gold text-sm tracking-[0.15em] uppercase font-semibold py-4 px-10"
            >
              BOOK YOUR STRATEGY CALL
            </button>
          </motion.div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
