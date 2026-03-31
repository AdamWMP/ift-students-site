'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Users, Briefcase, Clock, Shield, Trophy, Star, CheckCircle, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

const stats = [
  {
    value: 15,
    suffix: '+',
    label: 'Years at the Top',
    icon: Clock,
    description: 'Industry leaders since 2012'
  },
  {
    value: 5000,
    suffix: '+',
    label: 'Graduates',
    icon: Users,
    description: 'Successful careers launched'
  },
  {
    value: 100,
    suffix: '%',
    label: 'REPs Accredited',
    icon: Shield,
    description: 'Industry recognized'
  },
]

const badges = [
  { icon: Shield, label: 'REPs Accredited' },
  { icon: Award, label: 'Internationally Recognised' },
  { icon: Trophy, label: 'Award Winning' },
  { icon: Star, label: '4.9 Google Reviews', isGoogle: true },
]

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })

  useEffect(() => {
    if (inView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function ReputationSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <section className="py-20 bg-charcoal-950" />
  }

  return (
    <section ref={ref} className="relative py-20 sm:py-28 bg-charcoal-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <Trophy className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">Ireland&apos;s #1 Choice</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
              A Name That
            </h2>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gold relative">
                Carries a Reputation
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" preserveAspectRatio="none">
                  <path d="M0,6 Q150,12 300,6" stroke="#D4A836" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              As an Image Fitness Training graduate you&apos;ll be joining a family of previous leaders in our industry, 
              who&apos;ve forged the way for you to have a smoother transition into the industry by reputation alone.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              When asked <span className="text-white font-medium">&apos;where did you do your course?&apos;</span> People will know the qualification, 
              knowledge and credibility you have gained on your journey with us. <span className="text-gold font-semibold">Especially employers.</span>
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                    badge.isGoogle 
                      ? 'bg-white/10 border border-white/30 backdrop-blur-sm' 
                      : 'bg-charcoal-800/50 border border-charcoal-700'
                  }`}
                >
                  {badge.isGoogle ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-white font-semibold text-sm">4.9</span>
                      <span className="text-white/70 text-xs">Google Reviews</span>
                    </>
                  ) : (
                    <>
                      <badge.icon className="w-4 h-4 text-gold" />
                      <span className="text-white/80 text-sm">{badge.label}</span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/courses/personal-trainer"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-400 text-charcoal-950 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Stats + Team Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-charcoal-900/80 backdrop-blur-sm border border-charcoal-800 rounded-2xl p-4 sm:p-6 text-center hover:border-gold/50 transition-all duration-300 h-full">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 transition-colors">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                    </div>
                    {/* Value */}
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    {/* Label */}
                    <div className="text-white/70 text-xs sm:text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gold/10 blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                </motion.div>
              ))}
            </div>

            {/* Team Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-charcoal-800 group">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-gold/50 rounded-tl-2xl z-10" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-gold/50 rounded-tr-2xl z-10" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-gold/50 rounded-bl-2xl z-10" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-gold/50 rounded-br-2xl z-10" />

                <div className="relative aspect-[16/9] sm:aspect-[2/1]">
                  <Image
                    src="/team-group.jpg"
                    alt="Image Fitness Training Team"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                </div>

                {/* Team Label */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-charcoal-950" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Our Expert Team</p>
                      <p className="text-white/60 text-xs">20+ Industry Professionals</p>
                    </div>
                  </div>
                  <Link
                    href="/team"
                    className="text-gold text-sm font-medium hover:underline hidden sm:block"
                  >
                    Meet the Team →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Checkmarks */}
            <div className="grid grid-cols-2 gap-3">
              {[
                'Industry Recognition',
                'Employer Trust',
                'Career Support',
                'Lifelong Network'
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
