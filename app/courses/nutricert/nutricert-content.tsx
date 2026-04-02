'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Check, Award, ArrowRight, Star, Play, ChevronDown, ChevronUp,
  BookOpen, Brain, TrendingUp, Lock, AlertCircle, X,
} from 'lucide-react'
import GoogleReviewsSlider from '@/components/google-reviews-slider'
import AnimatedCounter from '@/components/animated-counter'

// ─── Data ─────────────────────────────────────────────────────────

const stats = [
  { value: 10, suffix: '', label: 'Comprehensive Units' },
  { value: 23, suffix: '+', label: 'Coaching Psychology Lessons' },
  { value: 7, suffix: '', label: 'Marketing & Ads Modules' },
  { value: 13, suffix: '+', label: 'Recipe Videos for Clients' },
  { value: 6, suffix: '+', label: 'Real Coach Interviews' },
]

const problems = [
  {
    heading: "You've done the science course.",
    body: "You know your macros, your energy systems, your micronutrients. But when a client sits in front of you, you freeze. What do you actually say?",
  },
  {
    heading: "You've no idea how to get clients.",
    body: "Nobody teaches you how to market yourself, run ads, or build a social media presence that actually converts followers into paying customers.",
  },
  {
    heading: "You're qualified — but not career-ready.",
    body: "Most nutrition certs give you a certificate and a wave goodbye. They don't give you the tools, the templates, or the confidence to run a real business.",
  },
]

const pillars = [
  {
    number: '01',
    title: 'The Science',
    units: 'Units 1, 2, 3, 4 & 9',
    tagline: 'Know your stuff inside out',
    icon: Brain,
    description: "From energy systems and macronutrients to advanced biochemistry and performance nutrition — you'll have the scientific credibility to back up every recommendation you make.",
    topics: ['Energy Systems & Metabolism', 'Body Composition & Weight Management', 'Performance & Sports Nutrition', 'Supplements & Hot Topics', 'Advanced Physiology & Biochemistry'],
  },
  {
    number: '02',
    title: 'The Coaching',
    units: 'Unit 5 — 23+ Lessons',
    tagline: 'Turn knowledge into transformation',
    icon: BookOpen,
    description: '23+ lessons in coaching psychology — CBT, motivational interviewing, behaviour change, and sports psychology. This is what separates average coaches from exceptional ones.',
    topics: ['Motivational Interviewing', 'Cognitive Behavioural Therapy Skills', 'Behaviour Change Techniques', 'Dealing with Self-Sabotage', 'Online Coaching Structure'],
  },
  {
    number: '03',
    title: 'The Business',
    units: 'Units 7 & 10',
    tagline: 'Build a career, not just a qualification',
    icon: TrendingUp,
    description: 'The part no other course teaches. Social media, paid ads, copywriting, TikTok, Google Ads, and a complete marketing blueprint — plus real interviews with successful coaches.',
    topics: ['Social Media Strategy for Coaches', 'Facebook & Instagram Ads', 'TikTok, AdWords & Google Business', 'Copywriting for Ads', 'Real Coach Business Interviews'],
  },
]

const curriculum = [
  {
    unit: 'Unit 01',
    title: 'The Basics & Science of Nutrition',
    subtitle: 'Build your scientific foundation',
    lessons: 11,
    unique: false,
    lessonList: ['Module Introduction', 'Energy Systems', 'Energy Balance', 'The Digestive Tract', 'Carbohydrates', 'Dietary Fat', 'Dietary Protein', 'Vitamins, Minerals & Trace Elements', 'Hydration', 'Setting Up a Healthy Diet', 'Unit 1 Review'],
    description: "Master the foundational science that underpins every nutrition recommendation you'll ever make.",
  },
  {
    unit: 'Unit 02',
    title: 'Body Composition & Weight Management',
    subtitle: 'The science of transformation',
    lessons: 5,
    unique: false,
    lessonList: ['Body Composition Assessment', 'Energy Balance in Practice', 'Fat Loss Strategies', 'Muscle Gain Protocols', 'Weight Management for Different Goals'],
    description: 'Understand how to assess and change body composition safely and effectively.',
  },
  {
    unit: 'Unit 03',
    title: 'Performance Nutrition',
    subtitle: 'Fuel every type of athlete',
    lessons: 5,
    unique: false,
    lessonList: ['Fuelling for Endurance', 'Strength & Power Nutrition', 'Pre & Post-Workout Nutrition', 'Competition Day Nutrition', 'Recovery Strategies'],
    description: 'From weekend warriors to competitive athletes — learn how to optimise nutrition for any performance goal.',
  },
  {
    unit: 'Unit 04',
    title: 'Hot Topics in the Health Industry',
    subtitle: 'Stay ahead of the trends',
    lessons: 5,
    unique: false,
    lessonList: ['Intermittent Fasting — The Evidence', 'Gut Health & the Microbiome', 'Supplements — What Actually Works', 'Anti-Inflammatory Nutrition', 'Emerging Research'],
    description: 'Your clients will ask about every trend they see on social media. This unit gives you the evidence-based answers.',
  },
  {
    unit: 'Unit 05',
    title: 'The Art of Coaching',
    subtitle: '23+ lessons in coaching psychology',
    lessons: 22,
    unique: true,
    lessonList: ['The Sales Call', 'Goal Setting', 'Start Up Questionnaire', 'The Coaching Relationship', 'Motivational Interviewing', 'Identifying Behaviour Patterns', 'Behaviour Change Techniques', 'Humanistic Psychology Skills', 'Cognitive Behavioural Therapy Skills', 'Fostering Client Strengths', 'Dealing with Self-Sabotage', 'Helping Your Perfectionist Client', 'Positive Feedback', 'Stress Management', 'Techniques from Positive Psychology', 'Conquering Learned Helplessness', 'Behavioral Experiment & Exposure Skills', 'Emotional Regulation', 'How to Structure Online Group Coaching', 'How to Structure Online Coaching', 'Sports Psychology Toolkit', 'Leadership, Productivity & Avoiding Burnout'],
    description: 'The most comprehensive coaching psychology module of any nutrition certification. 23+ lessons covering CBT, motivational interviewing, behaviour change, and sports psychology.',
  },
  {
    unit: 'Unit 06',
    title: 'FAQ From Your Clients',
    subtitle: 'Handle every question with confidence',
    lessons: 4,
    unique: false,
    lessonList: ['Common Client Questions Answered', 'Handling Difficult Conversations', 'When to Refer Out', 'Managing Client Expectations'],
    description: "A practical guide to the most common questions your clients will ask — so you're never caught off guard.",
  },
  {
    unit: 'Unit 07',
    title: 'Social Media Marketing & Paid Adverts',
    subtitle: 'Build a client-generating machine',
    lessons: 7,
    unique: true,
    lessonList: ['Intro & Basics of Social Media for Coaches', 'Social Media Best Practices, Ads, Copy & Blueprint', 'Ads Manager, Pixel Tiers, Requirements & Audiences', 'Create an Ad, Reporting, Key Metrics Explained', 'Self-Serve Ads: TikTok, AdWords & Google Business', 'Other Useful Resources for Social Media & Ads', 'Copywriting Tips for Ads 101'],
    description: 'The complete digital marketing system for nutrition coaches. From organic content to paid ads — you\'ll know exactly how to find and convert your ideal clients.',
  },
  {
    unit: 'Unit 08',
    title: 'Food & Recipes for Social Media & Clients',
    subtitle: 'Ready-to-use content for your business',
    lessons: 4,
    unique: true,
    lessonList: ['13+ Professional Recipe Videos', 'Downloadable Reels for Your Social Media', 'Client Recipe Packs', 'Meal Planning Templates'],
    description: '13+ professionally filmed recipe videos you can share directly with clients and on your social media. Instant, ready-to-use content that saves you hours every week.',
  },
  {
    unit: 'Unit 09',
    title: 'Physiology Biochemistry',
    subtitle: 'Advanced science for serious coaches',
    lessons: 5,
    unique: false,
    lessonList: ['Cellular Metabolism', 'Hormonal Regulation', 'Advanced Energy Systems', 'Nutrient Interactions', 'Biochemistry in Practice'],
    description: "Go deeper into the science. This advanced unit gives you the biochemical understanding to explain the 'why' behind nutrition at a cellular level.",
  },
  {
    unit: 'Unit 10',
    title: 'Business & Coaching Tips',
    subtitle: 'Learn from coaches who\'ve done it',
    lessons: 6,
    unique: true,
    lessonList: ['Interview: Building a 6-Figure Online Coaching Business', 'Interview: From PT to Nutrition Coach', 'Interview: Growing a Social Media Following', 'Interview: Pricing Your Services', 'Interview: Client Retention Strategies', 'Interview: Work-Life Balance as a Coach'],
    description: 'Real interviews with 6+ successful coaches sharing the exact strategies, mistakes, and insights that built their businesses.',
  },
]

const comparisonFeatures = [
  { category: 'Science', feature: 'Nutrition Science Foundation', nutricert: true, precision: true, setanta: true, profi: true },
  { category: 'Science', feature: 'Performance Nutrition', nutricert: true, precision: true, setanta: 'partial', profi: 'partial' },
  { category: 'Science', feature: 'Advanced Biochemistry', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Science', feature: 'Hot Topics & Supplements', nutricert: true, precision: 'partial', setanta: false, profi: false },
  { category: 'Coaching', feature: 'Coaching Psychology (23+ lessons)', nutricert: true, precision: 'partial', setanta: false, profi: false },
  { category: 'Coaching', feature: 'CBT & Behaviour Change', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Coaching', feature: 'Motivational Interviewing', nutricert: true, precision: 'partial', setanta: false, profi: false },
  { category: 'Coaching', feature: 'Online Coaching Structure', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Business', feature: 'Social Media Marketing Training', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Business', feature: 'Paid Ads (Facebook, TikTok, Google)', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Business', feature: 'Real Coach Business Interviews', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Content', feature: 'Ready-to-Use Recipe Videos (13+)', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Content', feature: 'Downloadable Social Media Reels', nutricert: true, precision: false, setanta: false, profi: false },
  { category: 'Content', feature: 'Client Meal Plan Templates', nutricert: true, precision: 'partial', setanta: false, profi: false },
  { category: 'Delivery', feature: '100% Online & Self-Paced', nutricert: true, precision: true, setanta: 'partial', profi: 'partial' },
  { category: 'Delivery', feature: 'Lifetime Access', nutricert: true, precision: true, setanta: false, profi: false },
  { category: 'Delivery', feature: 'Community Support (Skool)', nutricert: true, precision: true, setanta: false, profi: false },
  { category: 'Value', feature: 'Price', nutricert: '€750', precision: '€900–€1,400', setanta: '€495', profi: '€495' },
  { category: 'Value', feature: 'Exam / Assessment Included', nutricert: true, precision: true, setanta: true, profi: true },
]

const previews = [
  {
    unit: 'Unit 01 · Full Lesson',
    tag: 'Science',
    title: 'Setting Up a Healthy Diet',
    description: 'The foundational framework for building a client\'s nutrition plan — covering calorie targets, macronutrient ratios, and practical meal structuring.',
    videoId: 'GzjgTplMxKQ',
  },
  {
    unit: 'Unit 04 · Full Lesson',
    tag: 'Hot Topics',
    title: 'Creatine — The Full Picture',
    description: 'A deep dive into the most researched supplement in sport — what the science actually says, how to use it, and how to advise clients confidently.',
    videoId: 'h72fQUx9LrM',
  },
  {
    unit: 'Unit 05 · Full Lesson',
    tag: 'Coaching Psychology',
    title: 'Identifying Behavioural Patterns',
    description: 'Learn to spot the habits and thought patterns that keep clients stuck — and the coaching techniques to help them break through.',
    videoId: 'Zp667wlWLjw',
  },
  {
    unit: 'Unit 05 · Full Lesson',
    tag: 'Coaching Psychology',
    title: 'Cognitive Behavioural Therapy Skills',
    description: 'A practical introduction to CBT techniques for coaches — how to help clients reframe negative thinking and build sustainable habits.',
    videoId: '2kKEK7ue7g0',
  },
  {
    unit: 'Unit 08 · Recipe Video',
    tag: 'Client Content',
    title: 'Chicken Salad — Recipe & Client Content',
    description: 'A full recipe video you can share directly with clients. Every recipe comes with an accompanying ready-to-post social media reel — instant content ideas for your channels.',
    videoId: '6WEMum26ajI',
  },
]

const testimonials = [
  { quote: "Detailed, Informative, Comprehensive & Engaging. I left the course with a strong foundation and could not recommend Image enough. The tutors were brilliant, engaging, knowledgeable and collaborative.", name: 'Paul B.', title: 'Personal Trainer, Dublin' },
  { quote: "Just completed the intensive course and I could not recommend it enough. The tutors were amazing, always willing to answer any questions and help build my confidence for going forward. 10/10.", name: 'Katie B.', title: 'Fitness Instructor, Dublin' },
  { quote: "It was absolutely amazing. Really thorough. Had the best craic — would definitely recommend. Feel so prepared going into my new career. The content was next to nothing I had seen before.", name: 'Zoe C.F.', title: 'Fitness Graduate, Dublin' },
  { quote: "Couldn't ask for a better group of people — so informative and easy going. Very helpful for those who struggle to get their confidence up and running. Would definitely recommend to anyone looking to get started.", name: 'Jacob R.', title: 'Fitness Professional, Ireland' },
]

const plans = [
  {
    id: 'full',
    label: 'Pay in Full',
    price: '€750',
    per: 'one-time payment',
    total: 'Best Value',
    popular: true,
    href: 'https://booking.imageft.ie/NCG-PIF',
    cta: 'ENROL NOW — €750',
    tagline: 'Pay once and get immediate, lifetime access to everything.',
  },
  {
    id: 'payment-plan',
    label: 'Payment Plan',
    price: '€900',
    per: 'spread over 3 months',
    total: '€300 / month',
    popular: false,
    href: 'https://booking.imageft.ie/NCG-3instalment',
    cta: 'ENROL — PAYMENT PLAN',
    tagline: 'Spread the cost over three manageable monthly payments.',
  },
]

const planIncludes = [
  'Full access to all 10 units and 100+ lessons',
  '23+ coaching psychology lessons',
  'Complete social media & paid ads training',
  '13+ downloadable recipe videos for clients',
  '6+ real coach business interviews',
  'Lifetime access — revisit any time',
]

const valueStack = [
  { item: '10 Units of Advanced Nutrition Science', value: '€400' },
  { item: 'Coaching Psychology Masterclass (23+ lessons)', value: '€300' },
  { item: 'Social Media & Business Marketing Training', value: '€250' },
  { item: '13+ Ready-to-Use Recipe Reels', value: '€150' },
  { item: 'Real Coach Interview Series', value: '€100' },
  { item: 'Lifetime Access & Future Updates', value: '€200' },
]

const faqs = [
  {
    q: 'Do I need any prior qualifications to enrol?',
    a: 'A Level 3 or Level 4 Personal Trainer qualification is required. NutriCert Global is designed to advance your existing PT skills — together, your PT qualification and NutriCert give you a complete professional toolkit.',
  },
  {
    q: 'Is this course accredited?',
    a: 'Yes. NutriCert Global is a recognised nutrition coaching certification aligned with REPs Ireland standards. Please contact us directly for the most up-to-date accreditation information.',
  },
  {
    q: 'How long does the course take to complete?',
    a: 'The course is fully self-paced. Most students finish within 8–12 weeks studying part-time. You have lifetime access, so there\'s no deadline or pressure.',
  },
  {
    q: 'What makes NutriCert different from other nutrition certifications?',
    a: 'Three things: (1) Our coaching psychology unit has 23+ lessons — more than any other certification we\'re aware of. (2) We include a complete social media and paid ads training module — no other nutrition cert does this. (3) You get 13+ ready-to-use recipe videos and downloadable reels. It\'s a complete business launch system.',
  },
  {
    q: "Can I do this course if I'm a Pilates instructor or yoga teacher?",
    a: 'Absolutely. The course is designed for all fitness professionals. The content is applicable whether you coach one-on-one, run group classes, or teach on the mat or reformer.',
  },
  {
    q: 'How is the course delivered?',
    a: 'The course is delivered 100% online through our Skool platform. You get access to video lessons, downloadable resources, and a community of fellow coaches. Study on any device, at any time.',
  },
  {
    q: 'What happens after I complete the course?',
    a: "You receive a certificate of completion. More importantly, you'll have the science, the coaching skills, the marketing knowledge, and the ready-to-use content to start attracting and coaching nutrition clients immediately.",
  },
  {
    q: 'Is there a payment plan available?',
    a: 'Yes — you can pay in full (€750), split into 2 payments (€375×2), or spread over 3 monthly payments (€250×3). All plans include the exact same course content and lifetime access.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────
function FeatureCell({ value }: { value: boolean | 'partial' | string }) {
  if (typeof value === 'string' && value.startsWith('€')) {
    return <span className="text-white/80 text-sm font-medium">{value}</span>
  }
  if (value === true) return <Check className="w-5 h-5 text-gold mx-auto" />
  if (value === 'partial') return <span className="text-white/40 text-lg mx-auto block text-center">~</span>
  return <X className="w-4 h-4 text-white/20 mx-auto" />
}

// ─── Main Component ───────────────────────────────────────────────
export default function NutriCertContent() {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const { ref: pillarsRef, inView: pillarsInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: curriculumRef, inView: curriculumInView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const { ref: compRef, inView: compInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: pricingRef, inView: pricingInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [openUnit, setOpenUnit] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const scrollToCheckout = () => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })

  const filters = ['All', 'Science', 'Coaching', 'Business', 'Content', 'Delivery', 'Value']
  const filteredFeatures = activeFilter === 'All'
    ? comparisonFeatures
    : comparisonFeatures.filter(f => f.category === activeFilter)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/nutrition-coaching.png" alt="NutriCert Global — Advanced Nutrition Coaching" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/90 via-charcoal-950/80 to-charcoal-950" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-gold" fill="currentColor" />
              <span className="text-sm text-gold font-medium tracking-wide">ALIGNED WITH REPS IRELAND STANDARDS</span>
            </div>
            <p className="text-gold/80 text-sm tracking-[0.2em] uppercase mb-3">ADVANCED NUTRITION COACH CERTIFICATE · NUTRICERT GLOBAL</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Don&apos;t Just Get Certified.<br /><span className="text-gold">Get Client-Ready.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl">
              The only advanced nutrition certification in Ireland that combines the science, the coaching psychology, and the business tools to take you from qualified to earning — all in one programme.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
              {['10 Comprehensive Units', '23+ Coaching Psychology Lessons', 'Full Business & Marketing Training', 'Ready-to-Use Client Content'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button onClick={scrollToCheckout} className="btn-gold flex items-center justify-center gap-2 text-base">
                ENROL NOW — €750 <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#preview" className="btn-outline flex items-center justify-center gap-2 text-base">
                <Play className="w-4 h-4" /> WATCH FREE PREVIEWS
              </a>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/20 rounded-xl max-w-2xl">
              <AlertCircle className="w-4 h-4 text-gold/70 flex-shrink-0 mt-0.5" />
              <p className="text-white/50 text-sm leading-relaxed">
                <span className="text-white/70 font-medium">Prerequisite:</span> A Level 3 or Level 4 Personal Trainer qualification is required before enrolling on this programme.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <section ref={statsRef} className="py-12 bg-charcoal-900 border-y border-charcoal-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
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
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">THE PROBLEM</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Most nutrition certifications<br />
              <span className="text-gold">sell you knowledge. Not a career.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Here&apos;s the honest truth about what most courses leave out:</p>
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
              NutriCert Global was built to fix exactly this. It is the only advanced nutrition certification in Ireland that gives you the <span className="text-gold font-semibold">science</span>, the <span className="text-gold font-semibold">coaching skills</span>, and the <span className="text-gold font-semibold">business tools</span> to go from qualified to earning — all in one programme.
            </p>
            <button onClick={scrollToCheckout} className="btn-gold inline-flex items-center gap-2">
              ENROL NOW — €750 <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Protected Titles Note */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-10 bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gold/60 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white/80 font-semibold text-sm mb-2">A Note on Protected Titles — What This Course Does &amp; Doesn&apos;t Do</h4>
                <p className="text-white/45 text-sm leading-relaxed">
                  &quot;Dietitian&quot; and &quot;Nutritionist&quot; are protected professional titles in Ireland and the UK. NutriCert Global qualifies you to operate as an <span className="text-white/70">Advanced Nutrition Coach</span> — providing evidence-based nutritional guidance, behaviour change coaching, and performance nutrition support to healthy adults within the scope of your PT qualification. A Level 3 or Level 4 PT qualification is required before enrolling.
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
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">THE 3-PILLAR SYSTEM</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Three pillars. <span className="text-gold">One complete career.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Every other course gives you one pillar. NutriCert Global gives you all three.</p>
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
                  <p className="text-xs text-gold/60 mb-1">{pillar.units}</p>
                  <p className="text-white/50 text-sm italic mb-4">{pillar.tagline}</p>
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
              10 units. <span className="text-gold">Everything you need.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Every module, every lesson — exactly what you get on day one.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {curriculum.map((unit, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={curriculumInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.05 }}>
                <button
                  onClick={() => setOpenUnit(openUnit === i ? null : i)}
                  className={`w-full text-left rounded-xl border transition-all duration-300 overflow-hidden ${openUnit === i ? 'border-gold/40 bg-gold/5' : 'border-charcoal-800 bg-charcoal-900 hover:border-charcoal-700'}`}
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-gold/10 text-gold flex-shrink-0">{unit.unit}</span>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-white text-base">{unit.title}</h3>
                          {unit.unique && (
                            <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold rounded-full flex-shrink-0">Unique to NutriCert</span>
                          )}
                        </div>
                        <p className="text-white/40 text-xs mt-0.5">{unit.subtitle} · {unit.lessons} lessons</p>
                      </div>
                    </div>
                    {openUnit === i
                      ? <ChevronUp className="w-5 h-5 text-gold flex-shrink-0 ml-3" />
                      : <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0 ml-3" />
                    }
                  </div>
                  {openUnit === i && (
                    <div className="px-5 pb-5 border-t border-gold/10">
                      <p className="text-white/55 text-sm mt-4 mb-4 leading-relaxed">{unit.description}</p>
                      <ul className="space-y-2">
                        {unit.lessonList.map((lesson, li) => (
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
            <p className="text-white/50 text-sm mb-4">Ready to unlock all 10 units and 100+ lessons?</p>
            <button onClick={scrollToCheckout} className="btn-gold inline-flex items-center gap-2">
              ENROL TO UNLOCK ALL CONTENT <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────────────────── */}
      <section id="comparison" ref={compRef} className="py-16 sm:py-24 bg-charcoal-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={compInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">HONEST COMPARISON</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How does NutriCert <span className="text-gold">stack up?</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">We compared ourselves honestly against the leading alternatives.</p>
          </motion.div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === f ? 'bg-gold text-black' : 'bg-charcoal-800 text-white/60 hover:text-white border border-charcoal-700'}`}
              >{f}</button>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={compInView ? { opacity: 1 } : {}} className="overflow-x-auto rounded-2xl border border-charcoal-800">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-charcoal-700">
                  <th className="text-left px-5 py-4 text-white/50 text-sm font-medium w-[40%]">Feature</th>
                  <th className="text-center px-4 py-4 text-gold text-sm font-bold">NutriCert Global</th>
                  <th className="text-center px-4 py-4 text-white/40 text-sm font-medium">Precision Nutrition</th>
                  <th className="text-center px-4 py-4 text-white/40 text-sm font-medium">Setanta College</th>
                  <th className="text-center px-4 py-4 text-white/40 text-sm font-medium">ProFi Ireland</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map((row, i) => (
                  <tr key={i} className={`border-b border-charcoal-800/50 ${i % 2 === 0 ? 'bg-charcoal-950/30' : ''}`}>
                    <td className="px-5 py-3.5 text-sm text-white/70">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center"><FeatureCell value={row.nutricert} /></td>
                    <td className="px-4 py-3.5 text-center"><FeatureCell value={row.precision} /></td>
                    <td className="px-4 py-3.5 text-center"><FeatureCell value={row.setanta} /></td>
                    <td className="px-4 py-3.5 text-center"><FeatureCell value={row.profi} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-white/30 text-xs text-center mt-4">Comparison based on publicly available course information as of 2025.</p>
        </div>
      </section>

      {/* ── Course Previews ───────────────────────────────────── */}
      <section id="preview" className="py-16 sm:py-24 bg-charcoal-950">
        <VideoPreviewSection scrollToCheckout={scrollToCheckout} />
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-charcoal-900">
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
                className="bg-charcoal-950 border border-charcoal-800 rounded-2xl p-6"
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

          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-charcoal-950 border border-charcoal-800 rounded-xl">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-gold" fill="currentColor" />)}
              </div>
              <span className="text-gold font-bold">4.9</span>
              <span className="text-white/40 text-sm">· Image Fitness Training Global · Verified Google Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" ref={pricingRef} className="py-16 sm:py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">ENROLMENT</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              One Investment. <span className="text-gold">A Complete Career.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">All plans include the exact same course content and lifetime access. Choose the option that works best for you.</p>
          </motion.div>

          {/* Value Stack */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} className="max-w-xl mx-auto mb-12">
            <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-charcoal-800">
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider">What You&apos;re Getting — Total Value</p>
              </div>
              {valueStack.map((row, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-3 border-b border-charcoal-800/50">
                  <span className="text-white/70 text-sm">{row.item}</span>
                  <span className="text-white/50 text-sm font-mono">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-6 py-3 border-b border-charcoal-800/50">
                <span className="text-white/50 text-sm">Total Value</span>
                <span className="text-white/50 text-sm font-mono line-through">€1,400</span>
              </div>
              <div className="flex justify-between items-center px-6 py-4 bg-gold/5">
                <span className="text-white font-bold">Your Investment</span>
                <span className="text-gold font-bold text-xl">€750</span>
              </div>
            </div>
          </motion.div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl p-7 border flex flex-col ${plan.popular ? 'bg-gold/5 border-gold' : 'bg-charcoal-900 border-charcoal-800'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gold text-black text-xs font-bold rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <p className="text-gold/70 text-xs font-mono mb-3 uppercase tracking-wider">{plan.label}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm">{plan.per}</span>
                </div>
                <p className={`text-xs mb-5 ${plan.popular ? 'text-gold' : 'text-white/40'}`}>{plan.total}</p>
                <p className="text-white/55 text-sm mb-6">{plan.tagline}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {planIncludes.map((item, pi) => (
                    <li key={pi} className="flex items-start gap-2 text-sm text-white/65">
                      <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={scrollToCheckout}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'bg-gold text-black hover:bg-yellow-400' : 'bg-charcoal-800 text-white hover:bg-charcoal-700 border border-charcoal-700'}`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* ROI + Trust */}
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-6">
              <p className="text-white/60 text-sm leading-relaxed">
                💡 The average nutrition coaching client pays <span className="text-white/80">€100–€200/month</span>. You need just <span className="text-gold font-semibold">4–8 clients</span> to recoup your entire investment. Most coaches achieve this within their first month of practice.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/40">
            {['Secure checkout', 'Instant access on enrolment', 'REPs Ireland aligned', 'Lifetime access'].map((t, i) => (
              <span key={i} className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-24 bg-charcoal-900 relative overflow-hidden">
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
            <p className="text-white/50 text-sm mb-3">Still have questions? Get in touch directly.</p>
            <a href="https://www.imageft.ie/contact/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/80 text-sm font-medium inline-flex items-center gap-2 transition-colors">
              Contact Image Fitness Training <ArrowRight className="w-4 h-4" />
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
            <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">READY TO START?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to launch your<br /><span className="text-gold">nutrition coaching career?</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Join coaches across Ireland who are building profitable businesses with NutriCert Global.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToCheckout} className="btn-gold inline-flex items-center justify-center gap-2 text-lg">
                ENROL NOW — €750 <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={scrollToCheckout} className="btn-outline inline-flex items-center justify-center gap-2">
                PAY IN 3 — €250/mo
              </button>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-white/30 text-xs">
              <Award className="w-4 h-4 text-gold/40" />
              NutriCert Global · Aligned with REPs Ireland Standards
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

// ─── Video Preview Section ─────────────────────────────────────────
function VideoPreviewSection({ scrollToCheckout }: { scrollToCheckout: () => void }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveVideo(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeVideo])

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-sm tracking-[0.25em] text-gold uppercase mb-4">COURSE PREVIEW</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            See What&apos;s Inside the Course.
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            These are real lessons from the course — no edited highlights, no trailers. This is exactly what you get.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {previews.map((preview, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => preview.videoId && setActiveVideo(preview.videoId)}
              className={`group bg-charcoal-900 border rounded-2xl overflow-hidden transition-colors ${preview.videoId ? 'border-charcoal-800 hover:border-gold/40 cursor-pointer' : 'border-charcoal-800 opacity-70'}`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-charcoal-800 overflow-hidden">
                {preview.videoId ? (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${preview.videoId}/hqdefault.jpg`}
                      alt={preview.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/30 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-charcoal-700 rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white/30" />
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {preview.videoId
                    ? <span className="px-2 py-0.5 bg-gold text-black text-xs font-bold rounded">FREE PREVIEW</span>
                    : <span className="px-2 py-0.5 bg-charcoal-700 text-white/50 text-xs font-semibold rounded">WITH ENROLMENT</span>
                  }
                  <span className="px-2 py-0.5 bg-black/60 text-white/70 text-xs rounded">{preview.tag}</span>
                </div>
                <p className="absolute bottom-2 right-3 text-white/40 text-xs">{preview.unit}</p>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white mb-2 group-hover:text-gold transition-colors">{preview.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{preview.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-white/50 text-sm mb-4">Ready to unlock all 10 units and 100+ lessons?</p>
          <button onClick={scrollToCheckout} className="btn-gold inline-flex items-center gap-2">
            ENROL TO UNLOCK ALL CONTENT <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Video Modal ────────────────────────────────────────── */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-charcoal-950 rounded-2xl overflow-hidden border border-charcoal-700 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-charcoal-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-gold text-black text-xs font-bold rounded">FREE PREVIEW</span>
                <span className="text-white/50 text-sm">{previews.find(p => p.videoId === activeVideo)?.title}</span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-charcoal-800 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            {/* YouTube embed */}
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Course Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
