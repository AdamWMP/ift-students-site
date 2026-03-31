'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Check, Clock, MapPin, Award, ArrowRight, Heart, Sparkles, Users, Calendar, Star, ChevronRight, Zap, AlertCircle } from 'lucide-react'
import GoogleReviewsSlider from '@/components/google-reviews-slider'
import GraduatesBanner from '@/components/graduates-banner'
import CalendlyModal from '@/components/calendly-modal'

const whyReformer = [
  { icon: Zap, title: 'Higher Earning Potential', desc: 'Reformer instructors command premium rates - often 50-100% more than mat-only teachers' },
  { icon: Users, title: 'In-Demand Skills', desc: 'Studios actively seek dual-qualified instructors who can teach both mat and reformer' },
  { icon: Star, title: 'Client Variety', desc: 'Train athletes, rehab clients, and everyone in between with equipment versatility' },
  { icon: Heart, title: 'Complete Skillset', desc: 'The full Pilates repertoire unlocks more career opportunities and teaching variety' },
]

const timetables = [
  { 
    location: 'Dublin', 
    venue: 'IFT Swords Academy', 
    dates: '28th Feb + 1st Mar, 14th + 15th Mar, 28th Mar',
    exam: '29th March',
    nextStart: 'Feb 28, 2026'
  },
  { 
    location: 'Dublin', 
    venue: 'IFT Swords Academy', 
    dates: '11th + 12th Apr, 18th + 19th Apr, 2nd May',
    exam: '3rd May',
    nextStart: 'April 11, 2026'
  },
  { 
    location: 'Cork City', 
    venue: 'Himalaya Yoga Valley', 
    dates: '5th + 6th Sep, 19th + 20th Sep, 3rd Oct',
    exam: '4th October',
    nextStart: 'Sep 5, 2026'
  },
]

const learningPath = [
  'The Complete Reformer Repertoire (Beginner to Advanced)',
  'Intuitive Class Sequencing & Flow',
  'Warm & Encouraging Cueing Techniques',
  'Safety & Client Care',
  'Daily Teaching Practice in a Supportive Circle',
  'Caring for Special Populations',
  'Low Back Pain & Discomfort',
  'Shoulder & Joint Care',
  'Older Adult Modifications',
  'Postnatal Client Guidance',
]

export default function ReformerPilatesCourseContent() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/reformer-pilates.png"
            alt="Reformer Pilates Course"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/95 to-charcoal-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-40 left-20 w-64 h-64 bg-gold/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold font-medium">Add-On Course • Mat Pilates Required</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Reformer Pilates{' '}
                <span className="text-gold">Instructor</span>
                <br />
                <span className="text-2xl sm:text-3xl font-semibold text-white/70">Become Confident in 6 Days</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed max-w-xl">
                Step into your potential and learn the art of Reformer Pilates. This immersive course will give you the skills to guide clients, grow your career, and fall in love with teaching all over again.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-5 h-5 text-gold" />
                  <span className="font-medium">6 Days (3 Weekends)</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Award className="w-5 h-5 text-gold" />
                  <span className="font-medium">REPs Accredited</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span className="font-medium">Dublin & Cork</span>
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
                  href="/courses/pilates"
                  className="btn-outline flex items-center justify-center gap-2 px-8 py-4"
                >
                  Need Mat Pilates First?
                </Link>
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-charcoal-800/90 to-charcoal-900/90 backdrop-blur-sm rounded-3xl p-8 border border-gold/30 shadow-2xl relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gold rounded-full">
                  <span className="text-charcoal-950 font-bold text-sm">EARLY BIRD: SAVE €500</span>
                </div>

                <div className="text-center pt-4 mb-6">
                  <div className="text-white/40 line-through text-xl mb-1">€1,200</div>
                  <div className="text-5xl font-black text-gold mb-2">€700</div>
                  <p className="text-white/60">Pay upfront & save €500</p>
                </div>

                <div className="space-y-3 mb-8">
                  {['Complete Reformer repertoire', '6 full days of hands-on training', 'Special populations training', 'Intuitive class sequencing', 'Supportive learning environment', 'REPs Ireland accredited', '€99 deposit secures your spot'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-white/80 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-charcoal-950/50 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <p className="text-white/40 text-xs mb-1">Payment Plans Available</p>
                    <p className="text-gold font-semibold">€900 over 2-6 months (save €200)</p>
                  </div>
                </div>

                {/* Requirement Notice */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-200 font-semibold text-sm">Requirement</p>
                      <p className="text-white/60 text-xs">Mat Pilates qualification required to enroll</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsCalendlyOpen(true)}
                  className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-lg"
                >
                  Secure Your Spot for €99
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

      {/* Why Reformer */}
      <section className="py-20 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-gold text-sm uppercase tracking-widest">Why Add Reformer?</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              Double Your <span className="text-gold">Opportunities</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyReformer.map((item, index) => {
              const Icon = item.icon
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
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Your Learning Path */}
      <section className="py-20 bg-charcoal-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold text-sm uppercase tracking-widest">Your Learning Path</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">
                A 6-Day Course Designed to <span className="text-gold">Nurture Your Inner Teacher</span>
              </h2>
              <p className="text-white/60 mb-6">
                We created this course to be a warm, welcoming space where you can blossom as an instructor. We don&apos;t just give you a manual; we give you the confidence and community to truly shine.
              </p>
              <p className="text-white/70 font-semibold mb-6">This is a journey, not a test. Here&apos;s our promise to you:</p>

              <div className="space-y-3">
                {learningPath.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-gold" />
                    </div>
                    <span className="text-white/80 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/reformer-pilates.png"
                  alt="Reformer Pilates Training"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold text-charcoal-950 rounded-xl p-5 shadow-xl">
                <div className="text-3xl font-black">6 Days</div>
                <div className="text-sm font-medium">3 Weekends</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Timetables */}
      <section className="py-20 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold text-sm uppercase tracking-widest">Course Structure & Timetable</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Upcoming <span className="text-gold">Start Dates</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              6 Full Days (3 Weekends) • Bi Weekly Saturdays & Sundays • 10:00am - 6:00pm
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {timetables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-charcoal-800/50 to-charcoal-900/50 rounded-2xl p-6 border border-charcoal-700/50 hover:border-gold/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-bold text-white">{item.location}</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">{item.venue}</p>
                <div className="space-y-2 text-sm mb-4">
                  <div>
                    <span className="text-white/40">Practical Dates:</span>
                    <p className="text-white/70 mt-1">{item.dates}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Exam:</span>
                    <span className="text-white/70">{item.exam}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-charcoal-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-sm">Starts:</span>
                    <span className="text-gold font-semibold text-sm">{item.nextStart}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Is This For You Section */}
      <section className="py-16 bg-charcoal-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Is This Where <span className="text-gold">You Are Right Now?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              You passionate teaching Pilates. You have your qualification. And now you feel a calling for something more...
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "You're ready to grow beyond mat classes and explore the next step in your teaching journey.",
              "You dream of teaching on the beautiful Reformer, but you're not sure where to start.",
              "You see the incredible results clients get from the Reformer and wish you could be the one to guide them.",
              "You're looking for a supportive community to learn with, not a competitive, intimidating environment."
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 bg-charcoal-950/50 rounded-xl p-4 border border-charcoal-800"
              >
                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white/80">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/70 mt-8 max-w-2xl mx-auto"
          >
            It&apos;s time to honor that calling. <span className="text-gold font-semibold">The world needs more passionate Reformer instructors like you.</span>
          </motion.p>
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
              Become a Confident <span className="text-gold">Reformer Instructor</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto text-lg">
              Share your passion for Pilates. Add Reformer to your teaching toolkit in just 6 days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="btn-gold flex items-center gap-2 text-lg px-10 py-4"
              >
                Enroll Now & Save €500
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/courses/pilates"
                className="btn-outline flex items-center gap-2 px-8 py-4"
              >
                Need Mat Pilates First?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
