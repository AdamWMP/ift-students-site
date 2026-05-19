'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, Clock, ArrowRight, Rocket, Target, Users, TrendingUp, Calendar, MessageSquare, Video, FileText, Zap, DollarSign, ChevronRight, Sparkles } from 'lucide-react'
import GoogleReviewsSection from '@/components/google-reviews-section'
import GraduatesBanner from '@/components/graduates-banner'
import CalendlyModal from '@/components/calendly-modal'

const weeklyContent = [
  { week: 1, title: 'Define Your Niche & Offer', desc: 'Identify your ideal client and create irresistible service offerings', icon: Target },
  { week: 2, title: 'Build Your Brand', desc: 'Create a brand identity that attracts your target audience', icon: Sparkles },
  { week: 3, title: 'Organic Marketing Mastery', desc: 'Launch your services and attract clients without paid ads', icon: Users },
  { week: 4, title: 'Sales Conversations', desc: 'Master discovery calls and convert leads into paying clients', icon: MessageSquare },
  { week: 5, title: 'Systems & Operations', desc: 'Set up onboarding, payments, and delivery platforms', icon: FileText },
  { week: 6, title: 'Client Experience', desc: 'Create transformational results and build retention', icon: TrendingUp },
  { week: 7, title: '60-Day Growth Plan', desc: 'Build momentum and scale your business beyond the program', icon: Rocket },
]

const features = [
  { icon: Video, title: 'Live Mentorship Calls', desc: 'Twice-weekly evening sessions (Mon & Wed, 7pm) with expert coaches' },
  { icon: Users, title: 'Private Community', desc: 'Connect with fellow trainers building their businesses' },
  { icon: FileText, title: 'Templates & Worksheets', desc: 'Done-for-you business resources and client documents' },
  { icon: Zap, title: 'Pre-recorded Modules', desc: 'Flexible learning library you can access anytime' },
]

export default function BusinessAcceleratorContent() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/business-coaching.webp"
            alt="Fitness Business Accelerator"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/95 to-charcoal-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-40 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                <Rocket className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-medium">7-Week Career Launch Program</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Fitness Business{' '}
                <span className="text-gold">Accelerator</span>
                <br />
                <span className="text-2xl sm:text-3xl font-semibold text-white/70">Get Your First Paying Clients</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed max-w-xl">
                Don&apos;t get stuck figuring it out alone after qualifying. The FBA gives you the exact roadmap to launch your coaching business and sign paying clients fast.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-5 h-5 text-gold" />
                  <span className="font-medium">7 Weeks</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Video className="w-5 h-5 text-gold" />
                  <span className="font-medium">Live Mentorship</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-5 h-5 text-gold" />
                  <span className="font-medium">Community Support</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsCalendlyOpen(true)}
                  className="btn-gold flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  Schedule a Call
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Link
                  href="/courses/personal-trainer"
                  className="btn-outline flex items-center justify-center gap-2 px-8 py-4"
                >
                  View Complete Coach (Includes FBA)
                </Link>
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-charcoal-800/90 to-charcoal-900/90 backdrop-blur-sm rounded-3xl p-8 border border-charcoal-700/50 shadow-2xl">
                <div className="text-center mb-6">
                  <p className="text-white/50 text-sm mb-2">Standalone Price</p>
                  <div className="text-5xl font-black text-gold mb-2">€900</div>
                  <p className="text-white/60">2 months included • €297/month after</p>
                </div>

                <div className="space-y-3 mb-8">
                  {['7-week intensive program', 'Live mentorship calls 2x per week', 'Private online community access', 'Business templates & worksheets', 'Pre-recorded training modules', '60-day growth plan', 'Expert coach network support'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-white/80 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gold/10 rounded-xl p-4 mb-6 border border-gold/20">
                  <p className="text-gold text-sm text-center font-medium">
                    ✨ Included FREE in Complete Coach PT Package (€3,500)
                  </p>
                </div>

                <button
                  onClick={() => setIsCalendlyOpen(true)}
                  className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Graduates Banner */}
      <div className="bg-charcoal-900 py-8">
        <GraduatesBanner variant="compact" />
      </div>

      {/* The Problem */}
      <section className="py-20 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold text-sm uppercase tracking-widest">The Reality</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">
                Most New Trainers <span className="text-gold">Struggle</span>
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                You got your qualification. You&apos;re ready to change lives. But then what? Most newly qualified trainers spend months (or years) trying to figure out the business side.
              </p>
              <div className="space-y-4">
                {['No clear plan to find clients', 'Scared of sales conversations', 'Posting content that gets no engagement', 'Undercharging and overdelivering', 'Feeling isolated and confused'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 text-sm">✗</span>
                    </div>
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-purple-400 text-sm uppercase tracking-widest">The Solution</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">
                The FBA <span className="text-gold">Changes Everything</span>
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                In just 7 weeks, you&apos;ll have a clear niche, compelling offer, growing audience, and paying clients. No guesswork. No wasted time.
              </p>
              <div className="space-y-4">
                {['Clear niche and irresistible offers', 'Confidence on sales calls', 'Content strategy that converts', 'Premium pricing you deserve', 'Community of supportive coaches'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Weekly Curriculum */}
      <section className="py-20 bg-charcoal-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-gold text-sm uppercase tracking-widest">Week by Week</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              Your 7-Week <span className="text-gold">Roadmap</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {weeklyContent.map((week, index) => {
              const Icon = week.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-charcoal-950 rounded-2xl p-6 border border-charcoal-800 hover:border-purple-500/30 transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-purple-400 font-bold">{week.week}</span>
                    </div>
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{week.title}</h3>
                  <p className="text-white/50 text-sm">{week.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-gold text-sm uppercase tracking-widest">What You Get</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Full <span className="text-gold">Support System</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-charcoal-800/50 to-charcoal-900/50 rounded-2xl p-6 border border-charcoal-700/50 hover:border-gold/30 transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bundle CTA */}
      <section className="py-16 bg-charcoal-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-purple-500/10 via-gold/5 to-transparent rounded-3xl p-8 lg:p-12 border border-purple-500/20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-purple-400 text-sm uppercase tracking-widest">Best Value</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                  Get FBA with Your PT Qualification
                </h3>
                <p className="text-white/60 mb-6">
                  The Complete Coach package includes the Fitness Business Accelerator, giving you both the qualification AND the business training to succeed.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-gold">€3,500</div>
                  <span className="text-white/40">Complete Coach Package</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link
                  href="/courses/personal-trainer"
                  className="btn-gold flex items-center justify-center gap-2 px-8 py-4"
                >
                  View Complete Coach
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviewsSection />

      {/* Final CTA */}
      <section className="py-20 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Launch Your <span className="text-gold">Coaching Career</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto text-lg">
              Don&apos;t waste months figuring it out alone. Get the roadmap, support, and accountability to build a thriving fitness business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="btn-gold flex items-center gap-2 text-lg px-10 py-4"
              >
                Schedule a Call
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
