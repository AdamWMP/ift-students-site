'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Award, Check } from 'lucide-react'

const courses = [
  {
    title: 'Personal Trainer Course',
    subtitle: 'Most Popular',
    description: 'Become a certified PT in just 8 weeks. REPs accredited, internationally recognized.',
    image: 'https://lh3.googleusercontent.com/C8p1sLc7xpYSnq4VQYozfzZ01d_yNkCMiVLRqvkn-WP9F97Cld-52D0lNs4Vqgsgw3p3sPwkTvCZLnmI2BUAFwqafOTaqn8YAoE=s2048',
    price: '€1,350',
    priceNote: 'with funding',
    duration: '8-16 weeks',
    features: ['EQF L3 & L4 Certified', 'Nutrition Diploma', 'Business Mentorship'],
    href: '/courses/personal-trainer',
    popular: true,
  },
  {
    title: 'Strength & Conditioning',
    subtitle: 'Advanced',
    description: 'Level 4 S&C Coach certification. Train athletes, build champions.',
    image: 'https://lh3.googleusercontent.com/AG3jW40CZ5gg69dVsM8kQfc4T2c3M_EjwbmrF_dOq-XPh14-lHuyCQAOz0NcXSquL7Hx_m8O-FY5YLI8oG_ZadsK6lYZJXH6TUQq=s2048',
    price: '€1,350',
    priceNote: 'early bird',
    duration: '12 weeks',
    features: ['Active IQ L4 Cert', 'Olympic Lifting', 'Athlete Programming'],
    href: '/courses/strength-conditioning',
    popular: false,
  },
]

export default function CoursesPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-charcoal-900">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-gold">Courses</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Industry-leading certifications designed to launch your fitness career
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {courses?.map?.((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="group relative bg-charcoal-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
            >
              {course?.popular && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">
                  POPULAR
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={course?.image ?? ''}
                  alt={course?.title ?? 'Course'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-800 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 -mt-16 relative">
                <p className="text-gold text-sm font-medium mb-2">{course?.subtitle ?? ''}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {course?.title ?? ''}
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  {course?.description ?? ''}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {course?.features?.map?.((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-gold flex-shrink-0" />
                      {feature}
                    </li>
                  )) ?? null}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-gold">{course?.price ?? ''}</p>
                    <p className="text-white/50 text-xs">{course?.priceNote ?? ''}</p>
                  </div>
                  <Link
                    href={course?.href ?? '#'}
                    className="btn-gold flex items-center gap-2 text-sm"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )) ?? null}
        </div>
      </div>
    </section>
  )
}
