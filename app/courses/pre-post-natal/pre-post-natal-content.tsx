'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import Link from 'next/link'
import { useState, useRef } from 'react'
import {
  Check, Award, ArrowRight, Star, ChevronDown, ChevronUp,
  BookOpen, Shield, AlertCircle, X, Play, Lock, Heart,
} from 'lucide-react'
import GoogleReviewsSlider from '@/components/google-reviews-slider'
import AnimatedCounter from '@/components/animated-counter'

// ─── Data ─────────────────────────────────────────────────────────

const stats = [
  { value: 11, suffix: '', label: 'Learning Modules' },
  { value: 16, suffix: '', label: 'CPD Points' },
  { value: 200, suffix: '+', label: 'Page Course Manual' },
  { value: 54000, suffix: '+', label: 'Births in Ireland / Year' },
]

const problems = [
  {
    heading: 'You have female clients who are pregnant.',
    body: "Without this qualification your insurance won't cover you — and the risk is entirely yours. Most PTs simply tell pregnant clients to come back after the baby. You lose them for a year, often permanently.",
  },
  {
    heading: 'Only 5.5% of PTs hold this qualification.',
    body: "In a saturated market, this is one of the clearest ways to differentiate. Over 54,000 babies are born in Ireland each year. The demand is enormous. The supply of qualified coaches is tiny.",
  },
  {
    heading: "You're guessing — and you know it.",
    body: "When a pregnant client asks what's safe, what to avoid, or how to get back to training postpartum — you need real answers. Not Google. Not instinct. Qualified expertise that protects both of you.",
  },
]

const pillars = [
  {
    number: '01',
    title: 'The Science',
    subtitle: 'Anatomy, Physiology & Pregnancy',
    icon: BookOpen,
    description: "Full understanding of what the body goes through — endocrine changes, musculoskeletal adaptations, cardiovascular shifts, and how labour and birth affect every system. You'll know the 'why' behind every modification you make.",
    topics: [
      'Endocrine system changes across trimesters',
      'Musculoskeletal adaptations (relaxin, joint laxity)',
      'Cardiovascular & respiratory changes',
      'Baby development trimester-by-trimester',
      'Labour, childbirth & the 4th trimester',
    ],
  },
  {
    number: '02',
    title: 'The Practice',
    subtitle: 'Programming, Assessment & Exercise',
    icon: Shield,
    description: 'Trimester-specific programme design, client screening, pelvic floor coaching, diastasis recti assessment, and a full video exercise library — core, compound, regression, and stretch exercises demonstrated with real clients.',
    topics: [
      'Trimester-by-trimester exercise programming',
      'Client screening & contraindications',
      'Pelvic floor & core exercise coaching',
      'Diastasis recti assessment & management',
      'Safe return-to-exercise postnatal protocols',
    ],
  },
  {
    number: '03',
    title: 'The Career',
    subtitle: 'Clients, Referrals & Income',
    icon: Heart,
    description: "One of the most underserved niches in Irish fitness. Qualify and you immediately access a client base your competition can't legally serve — plus referral networks with midwives, GPs, and physios that generate clients for years.",
    topics: [
      'Positioning as a specialist coach',
      'Building healthcare referral networks',
      'Supporting client health & wellbeing',
      'Nutrition principles for pre/postnatal clients',
      'Client goal setting & programme planning',
    ],
  },
]

const curriculum = [
  {
    module: 'Introduction',
    title: 'Introduction & Onboarding',
    subtitle: 'Start here',
    lessons: 3,
    lessonList: [
      'Welcome to the Pre & Post Natal Online Course',
      'Course Manual (200+ page digital reference)',
      'Introduction & Onboarding overview',
    ],
    description: 'Get oriented to the course, download your 200+ page manual, and understand how the assessment structure works.',
  },
  {
    module: 'Module 1',
    title: 'Roles and Responsibilities',
    subtitle: 'Scope of practice & professional standards',
    lessons: 1,
    lessonList: [
      'Scope of practice for pre/postnatal exercise instructors',
      'Professional responsibilities and liability',
      'When and how to refer to healthcare providers',
      'Working collaboratively with midwives, GPs & physios',
    ],
    description: "Understand exactly what you can and can't do — and why getting this right protects both you and your clients legally and professionally.",
  },
  {
    module: 'Module 2',
    title: 'Understanding Pregnancy',
    subtitle: 'Stages, development & key milestones',
    lessons: 1,
    lessonList: [
      'First trimester: weeks 1–12',
      'Second trimester: weeks 13–26',
      'Third trimester: weeks 27–40',
      'Baby development by trimester',
      'Common pregnancy discomforts & how they affect training',
    ],
    description: "A clear, practical overview of pregnancy from conception to birth — giving you the confidence to have informed conversations with every client.",
  },
  {
    module: 'Module 3',
    title: 'Physiological Changes During & After Pregnancy',
    subtitle: 'The body in transformation',
    lessons: 8,
    lessonList: [
      'Unit 1 — Endocrine System Changes (Part 1): hormones, relaxin, progesterone',
      'Unit 1 — Endocrine System Changes (Part 2): effects on joints, ligaments & tissue',
      'Unit 2 — Stretching: safe flexibility training during pregnancy',
      'Unit 4 — Changes in Other Body Systems: cardiovascular, respiratory',
      'Unit 6A — Changes in the Muscular System: postural adaptations',
      'Unit 6B — Changes in the Muscular System: core function & diastasis recti',
      'Unit 6C — Changes in the Muscular System: pelvic floor under load',
      'Unit 6D — Changes in the Muscular System: gait, balance & centre of gravity',
    ],
    description: "The most detailed module in the course. You'll understand every major physiological change and translate it into safe, effective programming decisions.",
  },
  {
    module: 'Module 4',
    title: 'Labour and Childbirth',
    subtitle: 'What every trainer needs to understand',
    lessons: 1,
    lessonList: [
      'Stages of labour and what they mean for the body',
      'Vaginal delivery vs. C-section: recovery differences',
      'How birth affects pelvic floor and core function',
      'The 4th trimester: first 12 weeks postpartum',
      'Medical clearance timelines and what they really mean',
    ],
    description: 'Understand what your postnatal clients have physically been through — so your programming respects their recovery and delivers safe, progressive results.',
  },
  {
    module: 'Module 5',
    title: 'Postnatal Exercise',
    subtitle: 'Safe return-to-training protocols',
    lessons: 1,
    lessonList: [
      'The 6-week GP clearance — minimum, not green light',
      'Progressive return to exercise: stages and timelines',
      'C-section specific modifications and loading timelines',
      'Rebuilding core, glute & posterior chain strength',
      'Managing postnatal conditions: back pain, PGP, SPD',
      'Breastfeeding clients: energy demands & hydration',
    ],
    description: "One of the most valuable modules for any PT with female clients. You'll learn the progressive approach to postnatal return-to-exercise that GPs don't have time to explain.",
  },
  {
    module: 'Module 6',
    title: 'Benefits, Risks & Contraindications',
    subtitle: 'What to do — and what to stop',
    lessons: 2,
    lessonList: [
      'Part A — Benefits of exercise during pregnancy: gestational diabetes, birth outcomes, mental health',
      'Part A — ACOG 2020 guidelines: 150 mins/week moderate exercise',
      'Part B — Absolute contraindications: when to not exercise at all',
      'Part B — Relative contraindications: when to modify',
      'Part B — Warning signs to stop exercise immediately',
      'Exercises to avoid and why (supine, high-impact, PNF stretching)',
    ],
    description: "Know with complete confidence when it's safe to train, when to modify, and when to stop — protecting your client and your career.",
  },
  {
    module: 'Module 7',
    title: 'Support Health & Wellbeing for Clients',
    subtitle: 'The whole person, not just the workout',
    lessons: 1,
    lessonList: [
      'Perinatal mental health: anxiety, prenatal depression, postnatal depression',
      'Body image during pregnancy and postpartum',
      'Managing fatigue, sleep deprivation & motivation',
      'Pelvic floor health & coaching Kegel exercises',
      'Building a supportive, non-judgmental coaching environment',
    ],
    description: 'Pregnancy and the postnatal period are emotionally complex. This module gives you the tools to support the whole person — not just design workouts.',
  },
  {
    module: 'Module 8',
    title: 'Apply Nutrition Rules for a Healthy Lifestyle',
    subtitle: 'Nutrition principles within scope',
    lessons: 1,
    lessonList: [
      'Caloric and macronutrient needs across trimesters',
      'Key nutrients: folate, iron, calcium, vitamin D, omega-3s',
      'Postnatal nutrition: recovery, breastfeeding, energy balance',
      'Hydration during pregnancy and exercise',
      'Scope of practice: what you can and cannot advise',
    ],
    description: "Practical nutrition knowledge you can confidently share with clients — clearly within your scope and grounded in evidence.",
  },
  {
    module: 'Module 9',
    title: 'Collect and Analyse Information About Clients',
    subtitle: 'Screening, consent & goal setting',
    lessons: 1,
    lessonList: [
      'Aims of exercise during pregnancy',
      'What to include in client intake: medical history, PAR-Q adaptations',
      'Legal, ethical & procedural responsibilities (consent, GDPR)',
      'Pre-screening for pregnant and postnatal clients',
      'Postnatal screening questions & client-specific checks',
      'Safe fitness assessments during and after pregnancy',
      'Goal setting and exercise planning considerations',
    ],
    description: 'The professional framework for taking on a pre/postnatal client — screening, consent, goal setting, and assessment all covered.',
  },
  {
    module: 'Module 10',
    title: 'Plan Exercise for Pregnant Clients',
    subtitle: 'Trimester-specific programme design',
    lessons: 1,
    lessonList: [
      'Trimester-by-trimester programming principles',
      'First trimester: fatigue, nausea, maintaining fitness',
      'Second trimester: scaling load, modifying supine exercises',
      'Third trimester: low-impact, breath-focused, birth preparation',
      'Exercise selection rules: modifications and substitutions',
      'Progressions, regressions and load management',
    ],
    description: 'Design safe, effective, trimester-appropriate programmes for any pregnant client — no more guessing or blanket restrictions.',
  },
  {
    module: 'Module 11',
    title: 'Instruct and Support Clients During Exercise',
    subtitle: 'Coaching, cueing & in-session management',
    lessons: 1,
    lessonList: [
      'Coaching cues and communication for pre/postnatal clients',
      'Monitoring intensity: RPE vs. heart rate for pregnancy',
      'In-session safety: what to watch for and how to respond',
      'Adapting sessions in real time as pregnancy progresses',
      'Motivating and retaining pre/postnatal clients long-term',
    ],
    description: "The practical coaching skills to deliver sessions confidently — from first trimester through the postnatal return to exercise.",
  },
]

const sampleVideos = [
  {
    title: 'Bird Dog',
    category: 'Core Exercise',
    tag: 'Core',
    description: 'A pregnancy-safe core stability exercise coaching clients to engage deep abdominal muscles without spinal loading.',
    src: '/videos/ppn/bird-dog.mp4',
    poster: '/videos/ppn/thumbs/bird-dog.mp4.png',
  },
  {
    title: 'Box Squat',
    category: 'Regression Exercise',
    tag: 'Regression',
    description: 'A controlled squat variation with tactile cue — ideal for clients in all trimesters needing lower-limb strength with added support.',
    src: '/videos/ppn/box-squat.mp4',
    poster: '/videos/ppn/thumbs/box-squat.mp4.png',
  },
  {
    title: 'Side Plank',
    category: 'Core Exercise',
    tag: 'Core',
    description: 'Lateral core stabilisation demonstrated with trimester-appropriate modifications — protecting the pelvic floor and avoiding diastasis aggravation.',
    src: '/videos/ppn/side-plank.mp4',
    poster: '/videos/ppn/thumbs/side-plank.mp4.png',
  },
]

const exerciseLibrary = [
  {
    category: 'Core Exercises',
    exercises: ['Bird Dog', 'Pelvic Rock Tilt', 'Side Plank'],
    note: 'Trimester-appropriate core stability',
  },
  {
    category: 'Compound Exercises',
    exercises: ['Shoulder Press', 'The Squat'],
    note: 'Safe loaded movement patterns',
  },
  {
    category: 'Regression Exercises',
    exercises: ['Box Squat', 'Chest Press', 'The Lunge', 'Burpee modification'],
    note: 'Modified for every stage',
  },
  {
    category: 'Stretch & Mobility',
    exercises: ['Cat Cow Stretch', 'Child Pose'],
    note: 'Pregnancy-safe flexibility',
  },
  {
    category: 'Isolation Exercises',
    exercises: ['Side Lying Clam'],
    note: 'Glute & hip activation',
  },
]

const faqs = [
  {
    q: 'Do I need this qualification if I already have a Level 3 PT diploma?',
    a: "Yes. A general PT diploma does not cover trimester-specific programming, pelvic floor health, diastasis recti assessment, or postnatal return-to-exercise protocols. Critically, most PT insurance policies will not cover claims arising from training pregnant or recently postnatal clients without a recognised specialist qualification.",
  },
  {
    q: 'Am I legally allowed to train pregnant clients without this qualification?',
    a: "No law explicitly prohibits it, but your professional insurance — required for all practising PTs — typically won't cover you for claims arising from training pregnant or postnatal clients without a specialist qualification. If something goes wrong, the liability is entirely yours.",
  },
  {
    q: 'Can pregnant women really exercise safely?',
    a: "Extensively — and with excellent evidence behind it. ACOG (2020) recommends 150 minutes of moderate-intensity exercise per week for most pregnant women. The risks of inactivity (gestational diabetes, excessive weight gain, back pain, poor birth outcomes) are now considered greater than the risks of appropriately managed exercise.",
  },
  {
    q: 'When can a postnatal client return to exercise?',
    a: "The standard GP clearance at 6 weeks post-birth is a minimum, not a green light for full training. Return should be progressive: gentle activity from day one (breathing, pelvic floor, walking), building toward loaded exercise from 8–12 weeks, and higher-impact exercise only after a proper return-to-run screening — typically no earlier than 12 weeks, and later for C-section deliveries.",
  },
  {
    q: 'What is Diastasis Recti and why does it matter for personal trainers?',
    a: "Diastasis Recti (DRA) is a separation of the rectus abdominis muscles along the linea alba. It affects approximately 60% of women at 6 weeks postpartum. Without proper management it can cause core dysfunction, low back pain, and pelvic floor problems. As a qualified coach, you'll know how to assess for it, what exercises to avoid, and how to programme to support healing.",
  },
  {
    q: 'What CPD points does this course give me?',
    a: "16 CPD points — covering 80% of the full 20-point biennial CPD requirement for REPs Ireland membership, achieved in a single course.",
  },
  {
    q: 'Is there demand for pre/postnatal specialists in Ireland?',
    a: "Enormous demand, minimal supply. Over 54,000 babies are born in Ireland each year. The average first-time mother is 31.7 years old — a health-conscious demographic who was likely already a gym member pre-pregnancy. Only 5.5% of personal trainers currently hold a pre/postnatal qualification.",
  },
  {
    q: 'Can I train postnatal clients who had a C-section?',
    a: "Yes, but with different timelines. C-section is major abdominal surgery. Scar tissue healing affects core loading capacity for longer — typically 12+ weeks minimum before abdominal loading. This course covers C-section-specific modifications, loading timelines, and when to refer to physiotherapy.",
  },
]

const testimonials = [
  {
    quote: "Detailed, Informative, Comprehensive & Engaging. I left the course with a strong foundation and could not recommend Image enough. The tutors were brilliant, engaging, knowledgeable and collaborative.",
    name: 'Paul B.', title: 'Personal Trainer, Dublin',
  },
  {
    quote: "Just completed the intensive course and I could not recommend it enough. The tutors were amazing, always willing to answer any questions and help build my confidence for going forward. 10/10.",
    name: 'Katie B.', title: 'Fitness Instructor, Dublin',
  },
  {
    quote: "Feel so prepared going into my new career. The content was next to nothing I had seen before — really thorough and practical.",
    name: 'Zoe C.F.', title: 'Fitness Graduate, Dublin',
  },
  {
    quote: "Very helpful for those who struggle to get their confidence up and running. Would definitely recommend to anyone looking to get started in a specialist area.",
    name: 'Jacob R.', title: 'Fitness Professional, Ireland',
  },
]

const valueStack = [
  { item: '11 Comprehensive Learning Modules', value: '€300' },
  { item: 'Dual Accreditation (REPs Ireland + PD:Approval)', value: '€150' },
  { item: '16 CPD Points for Your Portfolio', value: '€100' },
  { item: '200+ Page Digital Course Manual', value: '€80' },
  { item: 'Video Exercise Library (Core, Compound, Regression)', value: '€120' },
  { item: 'Mock + Final Theory Examination', value: '€50' },
]

// ─── Main Component ───────────────────────────────────────────────
export default function PrePostNatalContent() {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const { ref: pillarsRef, inView: pillarsInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: curriculumRef, inView: curriculumInView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const { ref: exerciseRef, inView: exerciseInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: pricingRef, inView: pricingInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [openModule, setOpenModule] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const scrollToCheckout = () => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const waLink = "https://wa.me/353866000001?text=Hi!%20I%27m%20interested%20in%20the%20Pre%20%26%20Post%20Natal%20Exercise%20Coaching%20course."

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/prenatal-fitness.webp" alt="Pre & Post Natal Exercise Coaching" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/90 via-charcoal-950/80 to-charcoal-950" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-gold" fill="currentColor" />
              <span className="text-sm text-gold font-medium tracking-wide">REPs Ireland + PD:Approval · Dual Accredited</span>
            </div>
            <p className="text-gold/80 text-sm tracking-[0.2em] uppercase mb-3">PRE & POST NATAL EXERCISE COACHING CERTIFICATION · EQF LEVEL 4</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Train the Clients<br /><span className="text-gold">Most PTs Can't.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl">
              Ireland's only online pre/postnatal certification with dual REPs Ireland and PD:Approval accreditation. 11 modules. 16 CPD points. A 200+ page manual. The complete toolkit to safely coach pregnant and postnatal clients — and build the specialism your competitors don't have.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
              {['11 Learning Modules', '16 CPD Points', 'REPs Ireland + PD:Approval', '200+ Page Manual', 'Video Exercise Library'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button onClick={scrollToCheckout} className="btn-gold flex items-center justify-center gap-2 text-base">
                ENROL NOW — €697 <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#curriculum" className="btn-outline flex items-center justify-center gap-2 text-base">
                <Play className="w-4 h-4" /> SEE WHAT'S INSIDE
              </a>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/20 rounded-xl max-w-2xl">
              <AlertCircle className="w-4 h-4 text-gold/70 flex-shrink-0 mt-0.5" />
              <p className="text-white/50 text-sm leading-relaxed">
                <span className="text-white/70 font-medium">Prerequisite:</span> A Level 3 Fitness Instructor or Personal Trainer qualification is required before enrolling.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <section ref={statsRef} className="py-12 bg-charcoal-900 border-y border-charcoal-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gold mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/50 text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Problem ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">THE OPPORTUNITY</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              The most in-demand specialism<br />
              <span className="text-gold">with the fewest qualified coaches.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Here&apos;s the reality of the Irish fitness market right now:</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {problems.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-7"
              >
                <div className="w-8 h-8 bg-red-900/30 rounded-lg flex items-center justify-center mb-5">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{p.heading}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gold/5 border border-gold/20 rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto text-center"
          >
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              This course gives you the <span className="text-gold font-semibold">qualification</span>, the <span className="text-gold font-semibold">knowledge</span>, and the <span className="text-gold font-semibold">insurance coverage</span> to confidently coach pregnant and postnatal clients — and build a specialist reputation that generates referrals for your entire career.
            </p>
            <button onClick={scrollToCheckout} className="btn-gold inline-flex items-center gap-2">
              ENROL NOW — €697 <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Scope Note */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-10 bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gold/60 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white/80 font-semibold text-sm mb-2">Your Scope of Practice — What This Course Qualifies You To Do</h4>
                <p className="text-white/45 text-sm leading-relaxed">
                  As a qualified Pre & Post Natal Exercise Coach, you can design and deliver safe, trimester-appropriate exercise programmes, conduct pre-exercise screening, coach pelvic floor activation, assess diastasis recti, and support postnatal return-to-exercise. This does <span className="text-white/70">not</span> qualify you to diagnose medical conditions, provide clinical nutrition advice, or replace the role of a midwife, OB/GYN, or pelvic health physiotherapist.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3 Pillars ────────────────────────────────────────── */}
      <section ref={pillarsRef} className="py-16 sm:py-24 bg-charcoal-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={pillarsInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">WHAT YOU GET</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              The science. The skills. <span className="text-gold">The career.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">One course. Three things that transform your coaching.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={pillarsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }}
                  className="bg-charcoal-950 border border-charcoal-800 hover:border-gold/30 rounded-2xl p-7 transition-colors"
                >
                  <p className="text-gold text-sm font-mono mb-3">{pillar.number}</p>
                  <Icon className="w-8 h-8 text-gold mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">{pillar.title}</h3>
                  <p className="text-gold/60 text-sm mb-4">{pillar.subtitle}</p>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{pillar.description}</p>
                  <ul className="space-y-2">
                    {pillar.topics.map((t, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-sm text-white/70">
                        <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />{t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Full Curriculum ───────────────────────────────────── */}
      <section id="curriculum" ref={curriculumRef} className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={curriculumInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">FULL CURRICULUM</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              11 modules. <span className="text-gold">Everything you need.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Every module, every lesson — exactly what you get from day one.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {curriculum.map((mod, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={curriculumInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.04 }}>
                <button
                  onClick={() => setOpenModule(openModule === i ? null : i)}
                  className={`w-full text-left rounded-xl border transition-all duration-300 overflow-hidden ${openModule === i ? 'border-gold/40 bg-gold/5' : 'border-charcoal-800 bg-charcoal-900 hover:border-charcoal-700'}`}
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-gold/10 text-gold flex-shrink-0">{mod.module}</span>
                      <div className="text-left min-w-0">
                        <h3 className="font-semibold text-white text-base">{mod.title}</h3>
                        <p className="text-white/40 text-xs mt-0.5">{mod.subtitle}</p>
                      </div>
                    </div>
                    {openModule === i
                      ? <ChevronUp className="w-5 h-5 text-gold flex-shrink-0 ml-3" />
                      : <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0 ml-3" />
                    }
                  </div>
                  {openModule === i && (
                    <div className="px-5 pb-5 border-t border-gold/10">
                      <p className="text-white/55 text-sm mt-4 mb-4 leading-relaxed">{mod.description}</p>
                      <ul className="space-y-2">
                        {mod.lessonList.map((lesson, li) => (
                          <li key={li} className="flex items-center gap-3 text-sm text-white/65">
                            <BookOpen className="w-4 h-4 text-gold/40 flex-shrink-0" />{lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
            <p className="text-white/50 text-sm mb-4">Plus: Mock Exam + Final Theory Examination</p>
            <button onClick={scrollToCheckout} className="btn-gold inline-flex items-center gap-2">
              ENROL TO UNLOCK ALL CONTENT <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Exercise Library Preview ──────────────────────────── */}
      <section ref={exerciseRef} className="py-16 sm:py-24 bg-charcoal-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={exerciseInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">VIDEO EXERCISE LIBRARY</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Demonstrated with <span className="text-gold">Real Clients</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Every exercise is video-demonstrated with pregnancy-specific coaching cues and modifications — ready to use with your clients from day one.
            </p>
          </motion.div>

          {/* ── 3 Sample Videos ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {sampleVideos.map((video, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={exerciseInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}
                className="group bg-charcoal-950 border border-charcoal-800 hover:border-gold/30 rounded-2xl overflow-hidden transition-colors"
              >
                {/* Video / Thumbnail */}
                <div className="relative aspect-video bg-black">
                  {playingVideo === i ? (
                    <video
                      ref={el => { videoRefs.current[i] = el }}
                      src={video.src}
                      poster={video.poster}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onEnded={() => setPlayingVideo(null)}
                    />
                  ) : (
                    <>
                      <Image src={video.poster} alt={video.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-80" />
                      <div className="absolute inset-0 bg-black/30" />
                      {/* Play button */}
                      <button
                        onClick={() => setPlayingVideo(i)}
                        className="absolute inset-0 flex items-center justify-center group/play"
                        aria-label={`Play ${video.title}`}
                      >
                        <div className="w-16 h-16 bg-gold/20 border-2 border-gold/60 rounded-full flex items-center justify-center group-hover/play:bg-gold/40 group-hover/play:scale-110 transition-all duration-200">
                          <Play className="w-7 h-7 text-gold ml-1" fill="currentColor" />
                        </div>
                      </button>
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-0.5 bg-gold text-black text-xs font-bold rounded">FREE SAMPLE</span>
                        <span className="px-2 py-0.5 bg-black/70 text-white/70 text-xs rounded">{video.tag}</span>
                      </div>
                    </>
                  )}
                </div>
                {/* Info */}
                <div className="p-5">
                  <p className="text-gold text-xs font-mono uppercase tracking-wider mb-1">{video.category}</p>
                  <h3 className="font-bold text-white text-lg mb-2">{video.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Full Library Overview ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-charcoal-950 border border-charcoal-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-charcoal-800 flex items-center justify-between">
                <p className="text-white font-semibold">Full Exercise Library — Included in the Course</p>
                <span className="text-gold text-xs font-mono">11 Videos</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-charcoal-800">
                {exerciseLibrary.map((cat, i) => (
                  <div key={i} className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-gold rounded-full" />
                      <h4 className="text-white/80 text-sm font-semibold">{cat.category}</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {cat.exercises.map((ex, ei) => (
                        <li key={ei} className="flex items-center gap-2 text-xs text-white/50">
                          <Lock className="w-3 h-3 text-gold/30 flex-shrink-0" />{ex}
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/25 text-xs mt-3 italic">{cat.note}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-charcoal-800 text-center">
                <p className="text-white/40 text-sm">Enrol to unlock all exercise videos with coaching cues and trimester modifications</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">WHAT COACHES SAY</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Real results from <span className="text-gold">real coaches.</span>
            </h2>
            <p className="text-white/50 text-sm">Verified Google reviews from Image Fitness Training graduates</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, si) => <Star key={si} className="w-4 h-4 text-gold" fill="currentColor" />)}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-sm font-bold">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.title}</p>
                  </div>
                  <div className="ml-auto text-xs text-white/30">Google Review</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section ref={pricingRef} className="py-16 sm:py-24 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">ENROLMENT</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              One Investment. <span className="text-gold">A Lifetime Specialism.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Fully online, self-paced. Start today. Study around your life.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            {/* Value Stack */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}}>
              <div className="bg-charcoal-950 border border-charcoal-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-charcoal-800">
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">What You&apos;re Getting — Total Value</p>
                </div>
                {valueStack.map((row, i) => (
                  <div key={i} className="flex justify-between items-center px-6 py-3 border-b border-charcoal-800/50">
                    <span className="text-white/70 text-sm">{row.item}</span>
                    <span className="text-white/40 text-sm font-mono">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-6 py-3 border-b border-charcoal-800/50">
                  <span className="text-white/50 text-sm">Total Value</span>
                  <span className="text-white/40 text-sm font-mono line-through">€800</span>
                </div>
                <div className="flex justify-between items-center px-6 py-4 bg-gold/5">
                  <span className="text-white font-bold">Your Investment</span>
                  <span className="text-gold font-bold text-xl">€697</span>
                </div>
              </div>

              <div className="mt-4 bg-charcoal-950/50 border border-charcoal-800 rounded-xl p-5">
                <p className="text-white/60 text-sm leading-relaxed text-center">
                  💡 <span className="text-gold font-semibold">Intreo funding:</span> May be eligible for €1,000 off. <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">Ask us about eligibility.</a>
                </p>
              </div>
            </motion.div>

            {/* Enrol Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}>
              <div className="bg-gold/5 border-2 border-gold rounded-2xl p-8">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden" />
                <p className="text-gold/70 text-xs font-mono uppercase tracking-wider mb-3">Full Access</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold text-white">€697</span>
                  <span className="text-white/40">one-time payment</span>
                </div>
                <p className="text-gold text-xs mb-6">Lifetime access · Start immediately</p>

                <ul className="space-y-3 mb-8">
                  {[
                    '11 comprehensive learning modules',
                    'REPs Ireland + PD:Approval dual accreditation',
                    '16 CPD points for your portfolio',
                    '200+ page digital course manual',
                    'Video exercise library (all categories)',
                    'Mock exam + final theory examination',
                    'Lifetime access — revisit any time',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gold text-black hover:bg-yellow-400 transition-colors text-base"
                >
                  ENROL NOW — €697 <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-4 bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-4">
                  <p className="text-white/60 text-sm text-center font-medium mb-1">Payment Plan Available</p>
                  <p className="text-center text-white/40 text-xs">€897 spread over 3 months · €299/month</p>
                  <button onClick={scrollToCheckout} className="mt-3 w-full py-2 rounded-lg border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors">
                    ENROL — PAYMENT PLAN (€897)
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-5 text-sm text-white/40">
                {['Secure checkout', 'Instant access', 'REPs Ireland aligned', 'Lifetime access'].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-gold" />{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Interactive Checkout ────────────────────────────── */}
      <section id="checkout">
        <AddonCheckout courseId="ppn" />
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Questions? <span className="text-gold">We&apos;ve got answers.</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full text-left p-5 sm:p-6 rounded-xl border transition-all duration-300 ${openFaq === i ? 'bg-gold/10 border-gold/30' : 'bg-charcoal-800/50 border-charcoal-700 hover:border-charcoal-600'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`font-semibold text-base sm:text-lg ${openFaq === i ? 'text-gold' : 'text-white'}`}>{faq.q}</h3>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-gold flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-white/50 flex-shrink-0" />}
                  </div>
                  {openFaq === i && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/70 mt-3 leading-relaxed text-sm sm:text-base">
                      {faq.a}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-white/50 text-sm mb-3">Still have questions? Chat with us directly.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/80 text-sm font-medium inline-flex items-center gap-2 transition-colors">
              WhatsApp Us <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Google Reviews ────────────────────────────────────── */}
      <GoogleReviewsSlider />

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">READY TO SPECIALISE?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Train the clients<br /><span className="text-gold">most PTs turn away.</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              54,000+ births in Ireland every year. Only 5.5% of PTs qualified to coach them. Enrol today and own that market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToCheckout} className="btn-gold inline-flex items-center justify-center gap-2 text-lg">
                ENROL NOW — €697 <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="/checkout" className="btn-outline inline-flex items-center justify-center gap-2">
                Add to PT Course Package
              </Link>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-white/30 text-xs">
              <Award className="w-4 h-4 text-gold/40" />
              REPs Ireland + PD:Approval · Dual Accredited · 16 CPD Points
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
