'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { Target, Users, Award, Heart, ArrowRight, CheckCircle } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Hands-on Training',
    description: 'Real gym environments, real equipment, real experience. No boring lecture halls.',
  },
  {
    icon: Users,
    title: 'Expert Tutors',
    description: 'World-class industry professionals who\'ve been where you want to go.',
  },
  {
    icon: Award,
    title: 'Career-Focused',
    description: 'Business skills, mentorship, and connections to land your first clients.',
  },
  {
    icon: Heart,
    title: 'REPs Accredited',
    description: 'Internationally recognized qualifications that open doors worldwide.',
  },
]

const milestones = [
  { year: '2009', event: 'Founded in Dublin with a mission to transform fitness education' },
  { year: '2012', event: 'Expanded to Cork and Galway, bringing quality training nationwide' },
  { year: '2016', event: 'Reached 2,000 graduates milestone' },
  { year: '2020', event: 'Launched online training options during challenging times' },
  { year: '2024', event: 'Celebrated 5,000+ graduates and 15 years of excellence' },
]

export default function AboutContent() {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })
  const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Ireland&apos;s <span className="text-gold">#1</span> Fitness Educator
            </h1>
            <p className="text-lg sm:text-xl text-white/70">
              For over 15 years, we&apos;ve been transforming passionate individuals into certified fitness professionals. No fluff. Just results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-24 bg-charcoal-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/team-photo.webp"
                  alt="Image Fitness Training Team"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Our <span className="text-gold">Mission</span>
              </h2>
              <p className="text-white/70 text-lg mb-6">
                To provide accessible, efficient, and career-ready qualifications in the fitness industry. We get you qualified, confident, and connected to real opportunities.
              </p>
              <p className="text-white/70 mb-8">
                No long, expensive programs. No outdated teaching methods. Just practical, hands-on training that prepares you for the real world from day one.
              </p>
              <Link href="/#course-finder" className="btn-gold inline-flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Makes Us <span className="text-gold">Different</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We&apos;re not just another course provider. We&apos;re your career partners.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values?.map?.((value, index) => {
              const Icon = value?.icon ?? Target
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="bg-charcoal-800 rounded-xl p-6 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value?.title ?? ''}</h3>
                  <p className="text-white/60 text-sm">{value?.description ?? ''}</p>
                </motion.div>
              )
            }) ?? null}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={storyRef} className="py-16 sm:py-24 bg-charcoal-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our <span className="text-gold">Journey</span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {milestones?.map?.((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {milestone?.year ?? ''}
                  </div>
                  {index < (milestones?.length ?? 0) - 1 && (
                    <div className="w-0.5 h-full bg-gold/30 mt-2" />
                  )}
                </div>
                <div className="pt-2">
                  <p className="text-white/80">{milestone?.event ?? ''}</p>
                </div>
              </motion.div>
            )) ?? null}
          </div>
        </div>
      </section>

      {/* Graduation Video */}
      <section className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Graduation <span className="text-gold">Highlights</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Watch highlights from our incredible Graduation Party at K Sixty Seven! We celebrated our newly qualified Personal Trainers and Pilates Instructors from all over Ireland – including Dublin (Swords & Tallaght), Cork, Galway, Limerick, and Wexford – who are now starting their careers in the fitness industry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-gold/10"
          >
            <iframe
              src="https://www.youtube.com/embed/RPLiiNyTfOo?rel=0&modestbranding=1"
              title="Image Fitness Training Graduation Party Highlights"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-charcoal-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Join <span className="text-gold">5,000+</span> Graduates?
          </h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Your fitness career is waiting. Take the first step today.
          </p>
          <Link href="/#course-finder" className="btn-gold inline-flex items-center gap-2 text-lg">
            Find Your Course
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
