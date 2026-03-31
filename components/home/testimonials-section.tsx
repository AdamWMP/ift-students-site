'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Nikki Hanlon',
    course: 'Pilates Graduate',
    content: 'I cannot recommend Pilar enough. Her mentorship helped me start my own fully-booked Pilates business.',
    rating: 5,
  },
  {
    name: 'Sarah Murphy',
    course: 'PT Graduate, Cork',
    content: 'From leg press dropsets to Tabata at 9am, the Cork tutors made it an unforgettable 8 weeks. Best decision ever!',
    rating: 5,
  },
  {
    name: 'Paula Spillane',
    course: 'PT Graduate, Midleton',
    content: 'The 8-week intensive was incredible. May & Tomás were professional and supportive throughout.',
    rating: 5,
  },
  {
    name: 'Leah Barry',
    course: 'Pilates Graduate',
    content: 'Set me up with all the tools to teach immediately. Instructor Tomás was brilliant—highly recommend!',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-charcoal-950">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            What Our <span className="text-gold">Graduates</span> Say
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Real stories from real people who transformed their careers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials?.map?.((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-charcoal-800 rounded-xl p-6 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-gold/30 mb-4" />
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                &ldquo;{testimonial?.content ?? ''}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold font-semibold">
                    {testimonial?.name?.charAt?.(0) ?? '?'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{testimonial?.name ?? ''}</p>
                  <p className="text-white/50 text-xs">{testimonial?.course ?? ''}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {Array.from({ length: testimonial?.rating ?? 5 })?.map?.((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold" fill="currentColor" />
                ))}
              </div>
            </motion.div>
          )) ?? null}
        </div>
      </div>
    </section>
  )
}
