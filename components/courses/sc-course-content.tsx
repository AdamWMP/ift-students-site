'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Check, Clock, MapPin, Award, ArrowRight, Dumbbell, Target, BarChart, Zap, Users, TrendingUp, Calendar, Shield, Trophy, Play, ChevronRight } from 'lucide-react'
import GoogleReviewsSlider from '@/components/google-reviews-slider'
import GraduatesBanner from '@/components/graduates-banner'
import CalendlyModal from '@/components/calendly-modal'

const modules = [
  { icon: Target, title: 'Testing Athletes', desc: 'CMJ (Countermovement Jump), sprint profiling, COD drills, conditioning assessments', items: ['Speed Testing', 'Power Output', 'Agility Assessment', 'Endurance Profiling'] },
  { icon: Dumbbell, title: 'Olympic Lifting', desc: 'Master coaching Olympic lifts and plyometric exercises with elite techniques', items: ['Clean & Jerk', 'Snatch Variations', 'Plyometric Jumps', 'Power Progressions'] },
  { icon: Shield, title: 'Screening & Prevention', desc: 'Comprehensive athlete screening protocols to prevent injuries', items: ['Movement Screening', 'Risk Assessment', 'Injury Prevention', 'Return-to-Play'] },
  { icon: BarChart, title: 'Programming Mastery', desc: 'Advanced periodization with blocks, deloads, tapers, and peak weeks', items: ['Periodization', 'Load Management', 'Recovery Cycles', 'Peaking Protocols'] },
  { icon: Zap, title: 'Speed & Power', desc: 'Develop explosive athletes with cutting-edge conditioning methods', items: ['Acceleration', 'Max Velocity', 'Power Development', 'Reactive Strength'] },
  { icon: TrendingUp, title: 'Data & Analytics', desc: 'Collect, analyze, and present performance data professionally', items: ['Data Collection', 'Analysis Methods', 'Progress Tracking', 'Client Reporting'] },
]

const schedule = [
  { type: 'Online Calls', day: 'Mondays', time: '7pm – 9pm', details: 'Weekly theory & discussion via video call' },
  { type: 'Practical Weekends', day: 'Sat & Sun', time: '10am – 4:30pm', details: 'Hands-on coaching at IFT Academy, Swords' },
  { type: 'Final Assessment', day: 'Nov 29–30', time: '10am – 4:30pm', details: '2-day practical assessment' },
]

const timetable = [
  { month: 'Month 1', dates: 'Sep–Oct 2026', online: 'Mon 7 Sep · Mon 14 Sep · Mon 21 Sep', practical: 'Sat–Sun 3–4 Oct' },
  { month: 'Month 2', dates: 'Oct 2026',     online: 'Mon 5 Oct · Mon 12 Oct · Mon 19 Oct', practical: 'Sat–Sun 24–25 Oct' },
  { month: 'Month 3', dates: 'Nov 2026',     online: 'Mon 2 Nov · Mon 9 Nov · Mon 16 Nov',  practical: 'Sat–Sun 21–22 Nov' },
  { month: 'Assessment', dates: 'Nov 2026',  online: '',                                      practical: 'Sat–Sun 29–30 Nov' },
]

const benefits = [
  { icon: Trophy, title: 'Charge 20-50% More', desc: 'Performance coaches earn significantly more than standard PTs' },
  { icon: Users, title: 'Elite Client Base', desc: 'Work with athletes, academies, clubs, and semi-professionals' },
  { icon: TrendingUp, title: 'Proven Results', desc: 'Demonstrate success with data: faster sprints, higher jumps' },
  { icon: Award, title: 'Global Recognition', desc: 'Active IQ RQF Level 4 - rare internationally recognized qualification' },
]

export default function SCCourseContent() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const scrollToCheckout = () => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })
  const { ref: modulesRef, inView: modulesInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: scheduleRef, inView: scheduleInView } = useInView({ triggerOnce: true })
  const { ref: benefitsRef, inView: benefitsInView } = useInView({ triggerOnce: true })

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/AG3jW40CZ5gg69dVsM8kQfc4T2c3M_EjwbmrF_dOq-XPh14-lHuyCQAOz0NcXSquL7Hx_m8O-FY5YLI8oG_ZadsK6lYZJXH6TUQq=s2048"
            alt="Strength & Conditioning Course"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/95 to-charcoal-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-40 left-20 w-64 h-64 bg-gold/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                <Dumbbell className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold font-medium">Advanced Certification • RQF Level 4</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Strength &{' '}
                <span className="text-gold">Conditioning</span>
                <br />
                <span className="text-2xl sm:text-3xl font-semibold text-white/70">Coach Certification</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed max-w-xl">
                Transform from Personal Trainer to Performance Coach. Train athletes, build champions, and command premium rates with Ireland&apos;s most comprehensive S&C certification.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-5 h-5 text-gold" />
                  <span className="font-medium">12 Weeks</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Award className="w-5 h-5 text-gold" />
                  <span className="font-medium">Active IQ Level 4</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span className="font-medium">Dublin + Online</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsCalendlyOpen(true)}
                  className="btn-gold flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  Schedule a Call
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="https://wa.me/353866000001?text=Hi!%20I%27m%20interested%20in%20the%20S%26C%20Course."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline flex items-center justify-center gap-2 px-8 py-4"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-charcoal-800/90 to-charcoal-900/90 backdrop-blur-sm rounded-3xl p-8 border border-charcoal-700/50 shadow-2xl">
                <div className="text-center pt-4 mb-6">
                  <div className="text-5xl font-black text-gold mb-2">€1,500</div>
                  <p className="text-white/60">Payment plans available</p>
                </div>

                <div className="space-y-3 mb-8">
                  {['12-week intensive program', 'Live online theory sessions', 'Practical coaching weekends', 'Full assessment & certification', 'REPs Ireland & Active IQ accredited', 'Payment plans available'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-white/80 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-charcoal-950/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Next Intake:</span>
                    <span className="text-gold font-semibold">Sept 2026 • Dublin</span>
                  </div>
                </div>

                <button
                  onClick={scrollToCheckout}
                  className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-lg"
                >
                  Enrol Now
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

      {/* Why S&C Section */}
      <section ref={benefitsRef} className="py-20 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <span className="text-gold text-sm uppercase tracking-widest">Level Up Your Career</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              Why Become an <span className="text-gold">S&C Coach?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Performance coaching is the fastest-growing sector in fitness. Here&apos;s why our graduates are thriving.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-charcoal-800/50 to-charcoal-900/50 rounded-2xl p-6 border border-charcoal-700/50 hover:border-gold/30 transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{benefit.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section ref={modulesRef} className="py-20 bg-charcoal-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={modulesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <span className="text-gold text-sm uppercase tracking-widest">Comprehensive Curriculum</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              What You&apos;ll <span className="text-gold">Master</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Six intensive modules covering every aspect of elite performance coaching
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={modulesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-charcoal-950 rounded-2xl p-6 border border-charcoal-800 hover:border-gold/30 transition-all duration-500"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{module.title}</h3>
                      <p className="text-white/50 text-sm">{module.desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {module.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <ChevronRight className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section ref={scheduleRef} className="py-20 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={scheduleInView ? { opacity: 1, x: 0 } : {}}
            >
              <span className="text-gold text-sm uppercase tracking-widest">Flexible Learning</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">
                Course <span className="text-gold">Schedule</span>
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Our 12-week program combines online theory sessions with intensive practical weekends, designed to fit around your existing schedule.
              </p>

              <div className="space-y-4 mb-6">
                {schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={scheduleInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className="bg-charcoal-800/50 rounded-xl p-5 border border-charcoal-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{item.type}</h4>
                      <span className="text-gold text-sm">{item.day}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{item.details}</span>
                      <span className="text-white/40">{item.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Full timetable breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={scheduleInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="bg-charcoal-900 rounded-2xl border border-charcoal-700/50 overflow-hidden"
              >
                <div className="px-5 py-3 bg-gold/10 border-b border-charcoal-700/50">
                  <p className="text-gold text-xs font-bold uppercase tracking-widest">Full Timetable — Sept–Nov 2026</p>
                </div>
                {timetable.map((row, i) => (
                  <div key={i} className={`px-5 py-4 ${i < timetable.length - 1 ? 'border-b border-charcoal-800' : ''}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gold font-bold text-sm">{row.month}</span>
                      <span className="text-white/30 text-xs">{row.dates}</span>
                    </div>
                    {row.online && (
                      <p className="text-white/60 text-xs mb-1">
                        <span className="text-white/40">Online: </span>{row.online}
                      </p>
                    )}
                    <p className="text-white/60 text-xs">
                      <span className="text-white/40">Practical: </span>{row.practical}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={scheduleInView ? { opacity: 1, x: 0 } : {}}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/sc-gym.jpg"
                  alt="Strength & Conditioning Gym"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold text-charcoal-950 rounded-xl p-4 shadow-xl">
                <div className="text-3xl font-black">12</div>
                <div className="text-sm font-medium">Week Program</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="py-16 bg-charcoal-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-gold/10 to-transparent rounded-2xl p-8 border border-gold/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Prerequisite: Personal Trainer Certificate</h3>
                <p className="text-white/60">
                  This advanced course is designed for qualified fitness professionals. Already a PT? You&apos;re ready to elevate. Just starting out? Check our <Link href="/courses/personal-trainer" className="text-gold hover:underline">Personal Trainer Course</Link> first.
                </p>
              </div>
              <Link href="/courses/personal-trainer" className="btn-outline flex items-center gap-2 whitespace-nowrap">
                View PT Course <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviewsSlider />

      {/* Final CTA */}
      <section className="py-20 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent" />
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Next Intake: <span className="text-gold">September 2026</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto text-lg">
              Limited places per intake. Starts 7th September 2026. Secure your spot and transform your coaching career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToCheckout}
                className="btn-gold flex items-center gap-2 text-lg px-10 py-4"
              >
                Enrol Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="btn-outline flex items-center gap-2 text-lg px-10 py-4"
              >
                Schedule a Call
              </button>
              <a
                href="https://wa.me/353866000001?text=Hi!%20I%27m%20interested%20in%20the%20S%26C%20Course."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2 px-10 py-4"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calendly Modal */}
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
