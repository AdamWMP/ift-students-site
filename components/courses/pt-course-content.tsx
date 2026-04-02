'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import {
  Check, Clock, MapPin, Award, ArrowRight, Star, Calendar, Play,
  CreditCard, ChevronDown, ChevronUp, Dumbbell, TrendingUp,
  Brain, Lock,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import GoogleReviewsSlider from '@/components/google-reviews-slider'
import { ResultsWallSection } from '@/components/home/results-wall-section'
import AnimatedCounter from '@/components/animated-counter'

// ─── Topics Covered (compact grid) ────────────────────────────────
const topicsGrid = [
  { label: 'Skeletal System', category: 'Science' },
  { label: 'Muscular System', category: 'Science' },
  { label: 'Circulatory System', category: 'Science' },
  { label: 'Respiratory System', category: 'Science' },
  { label: 'Energy Systems', category: 'Science' },
  { label: 'Macros & Micros', category: 'Nutrition' },
  { label: 'Popular Diets', category: 'Nutrition' },
  { label: 'Metabolism & TDEE', category: 'Nutrition' },
  { label: 'Hydration & Supplements', category: 'Nutrition' },
  { label: 'Program Design', category: 'Practice' },
  { label: 'Posture Assessment', category: 'Practice' },
  { label: 'Somatotypes', category: 'Practice' },
  { label: 'Regressions & Progressions', category: 'Practice' },
  { label: 'Advanced Methods', category: 'Practice' },
  { label: 'Special Populations', category: 'Practice' },
  { label: 'SMART Goal Setting', category: 'Practice' },
  { label: '40+ Exercise Videos', category: 'Library' },
  { label: 'Theory + Practical Exams', category: 'Assessed' },
]

const categoryColour: Record<string, string> = {
  Science:   'bg-blue-900/30 text-blue-300 border-blue-700/30',
  Nutrition: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
  Practice:  'bg-gold/10 text-gold border-gold/20',
  Library:   'bg-purple-900/30 text-purple-300 border-purple-700/30',
  Assessed:  'bg-red-900/30 text-red-300 border-red-700/30',
}

// ─── Upcoming Intakes (raw data) ──────────────────────────────────
// Grace period: keep showing for 10 days after start date
const RAW_INTAKES = [
  {
    month: 'April 2026',
    badge: 'Filling Now',
    urgent: true,
    dates: [
      {
        isoDate: '2026-04-25',
        date: '25 Apr',
        format: '16-Week · Saturday',
        schedule: 'Sat 10:00 AM – 4:30 PM',
        locations: ['Cork', 'Galway', 'Limerick', 'Wexford'],
      },
      {
        isoDate: '2026-04-27',
        date: '27 Apr',
        format: '8-Week · Evenings + Saturday',
        schedule: 'Mon & Wed 7–10 PM · Sat 10 AM–4:30 PM',
        locations: ['Dublin Swords', 'Dublin Tallaght'],
      },
    ],
  },
  {
    month: 'July 2026',
    badge: 'Limited Places',
    urgent: false,
    dates: [
      {
        isoDate: '2026-07-02',
        date: '2 Jul',
        format: '8-Week Full Time',
        schedule: 'Thu & Fri 10:00 AM – 4:30 PM',
        locations: ['Dublin Swords', 'Dublin Tallaght', 'Cork', 'Galway', 'Limerick', 'Wexford'],
      },
    ],
  },
]

// Filter out dates that are more than 10 days past
function getActiveIntakes() {
  const now = new Date()
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - 10)

  return RAW_INTAKES
    .map(group => ({
      ...group,
      dates: group.dates.filter(d => new Date(d.isoDate) >= cutoff),
    }))
    .filter(group => group.dates.length > 0)
}

// ─── Exercise Library ──────────────────────────────────────────────
const exerciseLibrary = [
  {
    category: 'Shoulder Exercises',
    examples: ['Shoulder Press', 'Lateral Raise', 'Front Raise', 'Arnold Press'],
  },
  {
    category: 'Chest Exercises',
    examples: ['Barbell Bench Press', 'Dumbbell Fly', 'Cable Crossover', 'Push-Up Variations'],
  },
  {
    category: 'Back Exercises',
    examples: ['Deadlift', 'Barbell Row', 'Lat Pulldown', 'Seated Cable Row'],
  },
  {
    category: 'Arm Exercises',
    examples: ['Barbell Curl', 'Tricep Pushdown', 'Hammer Curl', 'Skull Crusher'],
  },
  {
    category: 'Leg Exercises',
    examples: ['Barbell Back Squat', 'Bulgarian Split Squat', 'Romanian Deadlift', 'Barbell Hip Thrust', 'Leg Press'],
  },
  {
    category: 'Advanced Methods',
    examples: ['Supersets', 'Drop Sets', 'Rest-Pause Training', 'Periodisation Techniques'],
  },
]

// ─── Business Accelerator Modules ────────────────────────────────
const businessModules = [
  {
    title: 'Content That Converts',
    description: 'Build a social media presence that attracts your ideal clients and keeps them engaged — with frameworks you can use from day one.',
  },
  {
    title: 'Crafting & Pricing Your Offer',
    description: 'Package your services, set your rates, and confidently justify your value to any prospective client.',
  },
  {
    title: 'Launch: Getting Your First Clients',
    description: 'Step-by-step launch plan to get paying clients from the gym floor from day one. No guessing — just a proven playbook.',
  },
  {
    title: 'All Things Sales & Mindset',
    description: 'Master the consultation process and close without feeling salesy. Jordan Sherlock walks you through the exact frameworks he uses with global clients.',
  },
  {
    title: 'Client Experience & Retention',
    description: 'Keep clients long-term with onboarding and retention systems that run themselves — so you spend less time chasing and more time coaching.',
  },
  {
    title: 'Gym Floor Mastery',
    description: 'Dominate the gym floor — consultations, onboarding, and converting enquiries into loyal, paying clients.',
  },
  {
    title: 'AI for Coaches Workshop',
    description: 'Learn to use AI tools to automate your admin, generate content, build training plans, and outpace every competitor who isn\'t using them yet.',
  },
  {
    title: 'Programming for Success Masterclass',
    description: 'Advanced session design, periodisation models and programming logic for clients at every level — from beginner to competitive athlete.',
  },
  {
    title: 'Professional Brand Photoshoot & Reels',
    description: 'Walk away with a full set of professional photos and advertising reels — done for you. Your brand, your face, your story. Ready to post from day one. Included with The Business pathway.',
    highlight: true,
  },
]

// ─── Workshop Outcomes ────────────────────────────────────────────
const workshopOutcomes = [
  {
    number: '01',
    workshop: 'Content That Converts',
    headline: 'A 30-day content system — ready to use',
    outcomes: [
      'Plug-and-play content framework for Instagram & TikTok',
      'Your niche identified and messaging locked in',
      'Hooks, captions and post structures that attract enquiries',
      'A weekly posting rhythm you can sustain from day one',
    ],
  },
  {
    number: '02',
    workshop: 'Crafting & Pricing Your Offer',
    headline: 'Your service packaged and priced with confidence',
    outcomes: [
      'Signature coaching package built (1-to-1, online, or hybrid)',
      'Pricing set based on market rate and your positioning',
      'Value proposition written — so you can explain what you do in 30 seconds',
      'Upsell and renewal pathway mapped out',
    ],
  },
  {
    number: '03',
    workshop: 'Launch: Getting Your First Clients',
    headline: 'A step-by-step launch plan you can activate immediately',
    outcomes: [
      'Pre-launch checklist completed before you graduate',
      'Your first 5 outreach conversations scripted and ready',
      'Referral and social proof system in place',
      'Launch sequence to generate your first paid enquiries',
    ],
  },
  {
    number: '04',
    workshop: 'All Things Sales & Mindset',
    headline: 'A consultation framework you can use every time',
    outcomes: [
      'Jordan Sherlock\'s exact consultation structure (used with global clients)',
      'Objection handling scripts for price, time, and commitment',
      'Confidence to close without being pushy or awkward',
      'Sales mindset shift — from "selling" to "solving"',
    ],
  },
  {
    number: '05',
    workshop: 'Client Experience & Retention',
    headline: 'Systems that keep clients — and free up your time',
    outcomes: [
      'Onboarding process built (welcome pack, check-ins, progress tracking)',
      'Retention touchpoints mapped across the client journey',
      'Renewal conversation framework so clients re-sign without being asked',
      'Templates for check-ins, progress reviews, and re-engagement',
    ],
  },
  {
    number: '06',
    workshop: 'Gym Floor Mastery',
    headline: 'The confidence to approach, consult, and convert on the floor',
    outcomes: [
      'Floor conversation scripts — from hello to consultation booked',
      'Body language and environment strategies that build instant trust',
      'Trial session structure that leads naturally to a paid programme',
      'Your intro offer and gym floor pitch finalised',
    ],
  },
  {
    number: '07',
    workshop: 'AI for Coaches',
    headline: 'AI tools running your admin and content creation',
    outcomes: [
      'Custom ChatGPT prompts for training plans, nutrition guides, and emails',
      'Content generation workflow set up — cut creation time by 80%',
      'AI-assisted client check-in and progress report templates',
      'Automation stack that frees up 5–10 hours per week',
    ],
  },
  {
    number: '08',
    workshop: 'Programming for Success Masterclass',
    headline: 'Advanced programming ability that sets you apart',
    outcomes: [
      'Periodisation models for beginners, intermediates, and athletes',
      'Block programming, deload protocols, and plateau-busting strategies',
      'Programming templates for 6 common client goals',
      'The ability to write programmes that get results — and keep clients long-term',
    ],
  },
  {
    number: '09',
    workshop: 'Professional Brand Photoshoot & Reels',
    headline: 'A full professional brand identity — done for you',
    outcomes: [
      '30+ professional brand photos (studio and gym environment)',
      '3–5 advertising reels edited and ready to post',
      'Profile, cover, and story content across Instagram, Facebook, LinkedIn',
      'Visual brand assets you\'d otherwise spend €2,000+ on',
    ],
    businessOnly: true,
  },
]

// ─── 3 Pillars ────────────────────────────────────────────────────
const pillars = [
  {
    number: '01',
    title: 'The Science',
    subtitle: 'Anatomy, Physiology & Nutrition',
    description:
      "From the skeletal and muscular systems to energy metabolism, circulatory and respiratory function, and applied nutrition — you'll understand the body at a level that sets you apart from every other trainer in the room.",
    topics: [
      'Skeletal & Muscular Systems',
      'Circulatory & Respiratory Systems',
      'Energy Systems & Metabolism',
      'Macros, Micros & Popular Diets',
      'Somatotypes & Body Composition',
    ],
    icon: Brain,
  },
  {
    number: '02',
    title: 'The Practice',
    subtitle: 'Programming, Assessment & Exercise',
    description:
      'A video-guided exercise library across every muscle group, posture and movement assessment, periodisation models, and programming frameworks for any client — beginner to advanced athlete.',
    topics: [
      'Full Video Exercise Library (40+ exercises)',
      'Posture & Movement Assessment',
      'Program Design & Periodisation',
      'Regressions, Progressions & Advanced Methods',
      'Special Populations (Pregnancy, etc.)',
    ],
    icon: Dumbbell,
  },
  {
    number: '03',
    title: 'The Business',
    subtitle: 'Clients, Income & Career Launch',
    description:
      'Included in The Career and The Business pathways. A structured mentorship programme covering client acquisition, pricing, sales, social media, and retention — so you launch earning, not just qualified.',
    topics: [
      'Content That Converts',
      'Crafting & Pricing Your Offer',
      'Getting Your First 5 Clients',
      'Client Retention Systems',
      'Sales Consultation Framework',
    ],
    icon: TrendingUp,
    careerOnly: true,
  },
]

// ─── Stats ────────────────────────────────────────────────────────
const stats = [
  { value: 7, suffix: '', label: 'Weekly Course Modules' },
  { value: 40, suffix: '+', label: 'Video Lessons' },
  { value: 3, suffix: '', label: 'Qualifications Included' },
  { value: 5000, suffix: '+', label: 'Graduates Nationwide' },
]

// ─── FAQ ──────────────────────────────────────────────────────────
const faqData = [
  {
    question: 'Am I too old to do the personal trainer course?',
    answer: 'Not at all — many students are 30–60+. Life experience makes you more relatable as a PT in Ireland, especially for clients who value real-world understanding.',
  },
  {
    question: "I'm still on my weight loss journey — should I wait to start?",
    answer: "No. Your story makes you relatable and credible. It's proof you understand the journey and helps inspire others to take action with your coaching.",
  },
  {
    question: 'I work full time — can I still do the course?',
    answer: 'Yes, 90% of our students work full time. Our part-time PT course fits busy lives with flexible study and online learning — even one hour a week works.',
  },
  {
    question: 'Will I get help finding work after qualifying?',
    answer: "Absolutely. We're a REPs-approved provider and gyms regularly contact us directly. We also share job leads through our 200+ hiring partner network.",
  },
  {
    question: 'Is there good money in personal training?',
    answer: "Yes — if you're willing to work. Most PTs start at €30–€40 per session. With experience, online coaches and top trainers can earn €50–€100+ an hour.",
  },
  {
    question: 'How much can I actually earn as a PT?',
    answer: 'It depends on your niche and location. Many qualified PTs in Ireland earn €1,000+ weekly once established in gyms or online.',
  },
  {
    question: 'How long does it take to become a qualified PT in Ireland?',
    answer: 'Most qualify in 8–16 weeks through our REPs-accredited personal trainer course, with online and part-time options across Ireland.',
  },
  {
    question: 'What 3 qualifications will I leave with?',
    answer: "You'll graduate with Fitness Instruction (EQF Level 3), Group Instruction (EQF Level 3), and Personal Training (EQF Level 4) — all REPs Ireland approved.",
  },
]

// ─── FAQ Component ────────────────────────────────────────────────
function FAQSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-charcoal-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-3">GOT QUESTIONS?</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="text-gold">Questions</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Here are the most common things people ask before starting.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full text-left p-5 sm:p-6 rounded-xl border transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-gold/10 border-gold/30'
                    : 'bg-charcoal-800/50 border-charcoal-700 hover:border-charcoal-600'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`font-semibold text-base sm:text-lg ${openIndex === index ? 'text-gold' : 'text-white'}`}>
                    {faq.question}
                  </h3>
                  {openIndex === index
                    ? <ChevronUp className="w-5 h-5 text-gold flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-white/50 flex-shrink-0" />
                  }
                </div>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-white/70 mt-3 leading-relaxed text-sm sm:text-base"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export default function PTCourseContent() {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const { ref: pillarsRef, inView: pillarsInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: topicsRef, inView: topicsInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: datesRef, inView: datesInView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const { ref: exerciseRef, inView: exerciseInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: businessRef, inView: businessInView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/pt-hero.jpg"
            alt="Personal Trainer Course Ireland"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/90 via-charcoal-950/80 to-charcoal-950" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-gold" fill="currentColor" />
              <span className="text-sm text-gold font-medium">REPs Ireland Accredited · EQF Level 4</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Personal Trainer <span className="text-gold">Course</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8">
              Ireland's most complete fitness qualification. 3 certifications. 8–16 weeks of structured modules. A video exercise library you'll use for life. Available across Dublin, Cork, Galway, Limerick, Wexford and Online.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="w-5 h-5 text-gold" /><span>8–16 weeks</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Award className="w-5 h-5 text-gold" /><span>EQF L3 & L4</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-5 h-5 text-gold" /><span>7 locations</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <CreditCard className="w-5 h-5 text-gold" /><span>From €500 deposit</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/checkout" className="btn-gold flex items-center justify-center gap-2">
                Enrol Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:sales@imageft.ie?subject=PT Course Enquiry"
                className="btn-outline flex items-center justify-center gap-2"
              >
                Book a Free Call
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <section ref={statsRef} className="py-12 bg-charcoal-900 border-y border-charcoal-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-gold mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 Pillars ────────────────────────────────────────── */}
      <section id="the-cert" ref={pillarsRef} className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">THREE PILLARS. ONE COMPLETE QUALIFICATION.</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Every other course gives you one pillar.<br />
              <span className="text-gold">We give you all three.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15 }}
                  className={`relative rounded-2xl p-7 border ${
                    pillar.careerOnly
                      ? 'border-gold/30 bg-gold/5'
                      : 'border-charcoal-800 bg-charcoal-900'
                  }`}
                >
                  {pillar.careerOnly && (
                    <div className="absolute -top-3 left-6">
                      <span className="px-3 py-1 bg-gold text-black text-xs font-bold rounded-full tracking-wider">
                        THE CAREER &amp; BUSINESS
                      </span>
                    </div>
                  )}
                  <p className="text-gold text-sm font-mono mb-3">{pillar.number}</p>
                  <Icon className="w-8 h-8 text-gold mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">{pillar.title}</h3>
                  <p className="text-gold/70 text-sm mb-4">{pillar.subtitle}</p>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{pillar.description}</p>
                  <ul className="space-y-2">
                    {pillar.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Topics Covered (compact) ──────────────────────────── */}
      <section ref={topicsRef} className="py-16 sm:py-24 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={topicsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-10"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">EVERY TOPIC COVERED</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              8–16 weeks. 18 topics. <span className="text-gold">3 qualifications.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Science, practice, nutrition — all in one REPs-accredited programme.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={topicsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2.5 justify-center max-w-4xl mx-auto"
          >
            {topicsGrid.map((topic, i) => (
              <span
                key={i}
                className={`px-3.5 py-1.5 rounded-full text-sm border font-medium ${categoryColour[topic.category]}`}
              >
                {topic.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={topicsInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mt-8"
          >
            {[
              { colour: 'bg-blue-500', label: 'Science' },
              { colour: 'bg-emerald-500', label: 'Nutrition' },
              { colour: 'bg-gold', label: 'Practice' },
              { colour: 'bg-purple-500', label: 'Exercise Library' },
              { colour: 'bg-red-500', label: 'Assessed' },
            ].map(({ colour, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-white/40">
                <span className={`w-2 h-2 rounded-full ${colour}`} />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Intakes ──────────────────────────────────── */}
      <section id="the-career" ref={datesRef} className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[130px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={datesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-4">
              <Calendar className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium">2026 Intakes Open</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Next Start <span className="text-gold">Dates</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Two intake windows. Multiple locations. One decision away.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {getActiveIntakes().map((intake, gi) => (
              <motion.div
                key={gi}
                initial={{ opacity: 0, y: 24 }}
                animate={datesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: gi * 0.15 }}
                className={`rounded-2xl border p-6 sm:p-8 relative overflow-hidden ${
                  intake.urgent
                    ? 'border-gold/40 bg-gradient-to-br from-gold/8 to-charcoal-900'
                    : 'border-charcoal-800 bg-charcoal-900'
                }`}
              >
                {/* Month header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{intake.month}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    intake.urgent
                      ? 'bg-gold text-black'
                      : 'bg-charcoal-700 text-white/70'
                  }`}>
                    {intake.badge}
                  </span>
                </div>

                {/* Date cards within the month */}
                <div className="space-y-4">
                  {intake.dates.map((d, di) => (
                    <div
                      key={di}
                      className="bg-charcoal-950/60 border border-charcoal-800 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Big date */}
                        <div className="flex-shrink-0 text-center bg-gold/10 border border-gold/20 rounded-xl px-3 py-2 min-w-[52px]">
                          <p className="text-gold font-bold text-lg leading-tight">
                            {d.date.split(' ')[0]}
                          </p>
                          <p className="text-gold/70 text-xs font-medium">
                            {d.date.split(' ')[1]}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm mb-1">{d.format}</p>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Clock className="w-3 h-3 text-gold/60 flex-shrink-0" />
                            <p className="text-white/50 text-xs">{d.schedule}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {d.locations.map((loc) => (
                              <span key={loc} className="text-xs px-2 py-0.5 bg-charcoal-800 text-white/60 rounded-md border border-charcoal-700">
                                {loc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/checkout"
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                    intake.urgent
                      ? 'bg-gold text-black hover:bg-gold-400'
                      : 'bg-charcoal-800 text-white hover:bg-charcoal-700 border border-charcoal-700'
                  }`}
                >
                  Reserve Your Place
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No dates showing fallback */}
          {getActiveIntakes().length === 0 && (
            <div className="max-w-5xl mx-auto text-center py-12">
              <p className="text-white/50 mb-4">New intake dates coming soon.</p>
              <a href="https://wa.me/353866000001?text=Hi!%20When%20is%20the%20next%20PT%20course%20intake?" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors text-sm font-medium">
                Get notified when dates are released →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Exercise Library ──────────────────────────────────── */}
      <section ref={exerciseRef} className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={exerciseInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">EXERCISE LIBRARY</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Video-Guided Exercise Library<br />
              <span className="text-gold">For Every Muscle Group</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              40+ exercises — each demonstrated on video with coaching scripts and cues. Available on Skool as part of your enrolment.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exerciseLibrary.map((cat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={exerciseInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.08 }}
                className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Dumbbell className="w-5 h-5 text-gold" />
                  <h3 className="font-semibold text-white">{cat.category}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.examples.map((ex, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                      <span className="w-1 h-1 bg-gold/50 rounded-full flex-shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Accelerator Preview ─────────────────────── */}
      <section id="the-business" ref={businessRef} className="py-16 sm:py-24 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gold/5 rounded-full blur-[130px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={businessInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-4">
              <Lock className="w-4 h-4" /> The Career &amp; The Business Pathways Only
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Fitness Business <span className="text-gold">Accelerator</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A structured group mentorship programme built to get you earning — not just qualified. Included with The Career and The Business pathways.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {businessModules.map((mod, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={businessInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.08 }}
                className={`rounded-xl p-6 border ${(mod as { highlight?: boolean }).highlight ? 'border-gold bg-gold/10' : 'bg-charcoal-950 border-gold/20'}`}
              >
                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gold text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                </div>
                {(mod as { highlight?: boolean }).highlight && (
                  <span className="inline-block px-2 py-0.5 bg-gold text-black text-xs font-bold rounded mb-2">The Business Only</span>
                )}
                <h3 className="font-semibold text-white mb-2">{mod.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{mod.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workshop Outcomes ────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gold/4 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">WHAT YOU WALK AWAY WITH</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Every workshop has a<br />
              <span className="text-gold">tangible outcome.</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              These aren&apos;t lectures. Each session ends with something built, written, or ready to use — so by the time you graduate, your business is already in motion.
            </p>
          </motion.div>

          <div className="space-y-4">
            {workshopOutcomes.map((ws, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border p-6 sm:p-8 ${ws.businessOnly ? 'border-gold/40 bg-gold/5' : 'border-charcoal-800 bg-charcoal-900'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  {/* Number + workshop label */}
                  <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1 sm:w-44">
                    <span className="text-gold font-mono text-sm">{ws.number}</span>
                    <span className="text-white/30 text-xs uppercase tracking-wider leading-tight">{ws.workshop}</span>
                    {ws.businessOnly && (
                      <span className="inline-block px-2 py-0.5 bg-gold text-black text-xs font-bold rounded whitespace-nowrap">The Business Only</span>
                    )}
                  </div>

                  {/* Headline + outcomes */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base sm:text-lg mb-4">{ws.headline}</p>
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                      {ws.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold/60 flex-shrink-0 mt-1.5" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mid-page Conversion Strip ────────────────────────── */}
      <section className="py-10 bg-gold/5 border-y border-gold/20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold text-lg">Not sure which pathway is right for you?</p>
              <p className="text-white/50 text-sm mt-1">Chat with Aaron — he&apos;ll help you figure out whether Pro Coach or Complete Coach is the right fit and your fastest path to get qualified and earning.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="mailto:sales@imageft.ie?subject=PT Course Strategy Call"
                className="btn-gold flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                Book a Free Call <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/353866000001?text=Hi!%20I%27d%20like%20to%20chat%20about%20the%20PT%20course%20options."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── B-Roll Video Showcase ─────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[600px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-gold/4 rounded-full blur-[130px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">INSIDE IMAGE FITNESS TRAINING</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              This is what it <span className="text-gold">looks like.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Real coaching. Real facility. Real people. Filmed at Image Fitness Training HQ, Swords.
            </p>
          </motion.div>

          {/* Featured wide video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/10 mb-4 aspect-video"
          >
            <video
              src="/videos/hero-tutors.mp4"
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-5">
              <span className="text-xs text-white/60 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                📍 Image Fitness Training — Swords, Co. Dublin
              </span>
            </div>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-14 h-14 border-l-2 border-t-2 border-gold/50 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-14 h-14 border-r-2 border-t-2 border-gold/50 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-14 h-14 border-l-2 border-b-2 border-gold/50 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-14 h-14 border-r-2 border-b-2 border-gold/50 rounded-br-2xl pointer-events-none" />
          </motion.div>

          {/* 5-clip coaching grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {[
              { src: '/videos/coaching-1.mp4', label: 'Tutor coaching' },
              { src: '/videos/coaching-2.mp4', label: 'Practical training' },
              { src: '/videos/coaching-3.mp4', label: 'Class session' },
              { src: '/videos/coaching-4.mp4', label: 'Kettlebell coaching' },
              { src: '/videos/coaching-5.mp4', label: 'Deadlift technique' },
            ].map((clip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-xl overflow-hidden aspect-[9/16] bg-charcoal-900 border border-charcoal-800 hover:border-gold/30 transition-colors group"
              >
                <video
                  src={clip.src}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[10px] text-white/60">{clip.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-white/50 text-sm italic max-w-xl mx-auto">
              &quot;I loved the vibe and crack in our class — made friends for life and feel ready to start my new career.&quot;
            </p>
            <p className="text-gold text-sm mt-2 font-medium">— Carl Mc Dermot, Tallaght 2025</p>
          </motion.div>
        </div>
      </section>


      {/* ── Classroom + Gym Floor ────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gold/4 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">SWORDS · TALLAGHT · 2025</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Theory. Practical. <span className="text-gold">Real Coaching.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Every week combines classroom theory with hands-on gym floor practice — so you graduate confident in both the science and the session.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Left: In the Classroom */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-0.5 bg-gold" />
                <span className="text-gold text-sm font-semibold uppercase tracking-widest">In the Classroom</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { src: '/videos/classroom-1.mp4', label: 'Tutor at the whiteboard' },
                  { src: '/videos/classroom-2.mp4', label: 'Theory session' },
                ].map((clip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative rounded-xl overflow-hidden aspect-[9/16] bg-charcoal-800 border border-charcoal-700 hover:border-gold/40 transition-colors group"
                  >
                    <video
                      src={clip.src}
                      autoPlay muted loop playsInline
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-[10px] text-white/60">{clip.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-3 text-center">Filmed at IFT Swords Academy</p>
            </motion.div>

            {/* Right: On the Gym Floor */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-0.5 bg-gold" />
                <span className="text-gold text-sm font-semibold uppercase tracking-widest">On the Gym Floor</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { src: '/videos/practical-2.mp4', label: 'Resistance coaching' },
                  { src: '/videos/practical-3.mp4', label: 'Cardio practical' },
                  { src: '/videos/practical-4.mp4', label: 'Group cardio session' },
                  { src: '/videos/practical-1.mp4', label: 'Group dumbbell drill' },
                ].map((clip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative rounded-xl overflow-hidden aspect-[9/16] bg-charcoal-800 border border-charcoal-700 hover:border-gold/40 transition-colors group"
                  >
                    <video
                      src={clip.src}
                      autoPlay muted loop playsInline
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-[10px] text-white/60">{clip.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-3 text-center">Filmed at IFT Tallaght &amp; Swords</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Results Wall ──────────────────────────────────────── */}
      <ResultsWallSection />

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── Google Reviews ────────────────────────────────────── */}
      <GoogleReviewsSlider />

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">READY TO START?</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Your career starts<br /><span className="text-gold">with one decision.</span>
          </h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Join the next cohort. 3 qualifications. 8–16 weeks of flexible learning. A career that&apos;s yours to build. Secure your place with a €500 deposit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/checkout" className="btn-gold inline-flex items-center justify-center gap-2 text-lg">
              Enrol Now — From €2,800 <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:sales@imageft.ie?subject=PT Course Enquiry"
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              Book a Free Call
            </a>
            <a
              href="https://wa.me/353866000001?text=Hi!%20I%27d%20love%20to%20know%20more%20about%20the%20PT%20course."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Sticky Mobile CTA Bar ─────────────────────────────── */}
      <StickyMobileBar />
    </>
  )
}

function StickyMobileBar() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-charcoal-950 border-t border-gold/20 px-4 py-3 flex gap-3">
        <Link
          href="/checkout"
          className="flex-1 btn-gold flex items-center justify-center gap-1.5 text-sm py-2.5"
        >
          Enrol Now <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="mailto:sales@imageft.ie?subject=PT Course Enquiry"
          className="flex-1 btn-outline flex items-center justify-center gap-1.5 text-sm py-2.5"
        >
          Book a Call
        </a>
        <a
          href="https://wa.me/353866000001?text=Hi!%20I%27m%20interested%20in%20the%20PT%20course."
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 btn-outline flex items-center justify-center shrink-0 text-sm py-2.5"
          aria-label="WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gold">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.12 1.523 5.854L.057 23.486a.75.75 0 0 0 .918.919l5.656-1.479A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.952-1.355l-.355-.21-3.684.962.982-3.592-.228-.368A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
