'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MapPin, Clock, Dumbbell, Heart, ArrowRight, Check, Phone, Navigation } from 'lucide-react'
import CalendlyModal from '@/components/calendly-modal'

const locations = [
  {
    city: 'Dublin - Swords',
    venue: 'IFT Academy',
    address: 'The Castle Shopping Centre, Swords, Co. Dublin',
    courses: ['Personal Trainer', 'S&C', 'Mat Pilates', 'Reformer Pilates'],
    schedule: 'Daytime, Evenings & Saturdays',
    highlight: true,
    mapUrl: 'https://maps.google.com/?q=IFT+Academy+Swords+Dublin',
  },
  {
    city: 'Dublin - Tallaght',
    venue: 'The Vault Health Club',
    address: 'Tallaght, Dublin 24',
    courses: ['Personal Trainer', 'Mat Pilates'],
    schedule: 'Evenings & Saturdays',
    highlight: false,
    mapUrl: 'https://maps.google.com/?q=The+Vault+Health+Club+Tallaght',
  },
  {
    city: 'Cork City',
    venue: 'FLYEfit Cork & Himalaya Yoga Valley',
    address: 'Stapleton House / 52 South Mall, Cork City',
    courses: ['Personal Trainer', 'Mat Pilates', 'Reformer Pilates'],
    schedule: 'Every 2nd Saturday',
    highlight: true,
    mapUrl: 'https://maps.google.com/?q=FLYEfit+Cork',
  },
  {
    city: 'Galway',
    venue: 'HQ Gym',
    address: 'N17 Business Park, Tuam, Co. Galway',
    courses: ['Personal Trainer', 'Mat Pilates'],
    schedule: 'Intensive Weekends',
    highlight: false,
    mapUrl: 'https://maps.google.com/?q=HQ+Gym+Tuam+Galway',
  },
  {
    city: 'Limerick',
    venue: 'Matchbox Fitness',
    address: 'Unit 6E Eastpoint Retail Park, Limerick',
    courses: ['Personal Trainer'],
    schedule: 'Saturdays',
    highlight: false,
    mapUrl: 'https://maps.google.com/?q=Matchbox+Fitness+Limerick',
  },
  {
    city: 'Wexford',
    venue: 'Predator Fitness',
    address: 'Unit 4, Kerlogue Industrial Estate, Wexford',
    courses: ['Personal Trainer'],
    schedule: 'Saturdays',
    highlight: false,
    mapUrl: 'https://maps.google.com/?q=Predator+Fitness+Wexford',
  },
  {
    city: 'Clare',
    venue: 'The Pilates Playground',
    address: 'Unit 19, Ballycasey Craft & Design Centre, Shannon, Co. Clare, V14 EA30',
    courses: ['Personal Trainer'],
    schedule: 'Saturdays',
    highlight: false,
    mapUrl: 'https://maps.google.com/?q=Ballycasey+Craft+and+Design+Centre+Shannon+Clare',
  },
  {
    city: 'Belfast',
    venue: 'Momentum Fitness',
    address: 'Unit 7, 220 Stewartstown Rd, Belfast',
    courses: ['Personal Trainer'],
    schedule: 'Saturdays',
    highlight: false,
    mapUrl: 'https://maps.google.com/?q=Momentum+Fitness+Belfast',
  },
]

export default function LocationsContent() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ireland-map-hero.png"
            alt="Map of Ireland - Training Locations"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 via-charcoal-950/60 to-charcoal-950" />
        </div>

        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium">8 Locations Across Ireland</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Find Your{' '}
              <span className="text-gold">Training Center</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 mb-8">
              From Dublin to Belfast, we&apos;ve got you covered. Train in real gyms with hands-on practical experience at any of our partner facilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`group rounded-2xl p-6 border transition-all duration-500 ${
                  location.highlight
                    ? 'bg-gradient-to-br from-gold/10 to-charcoal-900 border-gold/30'
                    : 'bg-charcoal-800/50 border-charcoal-700/50 hover:border-gold/30'
                }`}
              >
                {location.highlight && (
                  <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full mb-4">
                    Full Course Offering
                  </span>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{location.city}</h3>
                    <p className="text-gold text-sm font-medium">{location.venue}</p>
                  </div>
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-charcoal-700/50 rounded-xl flex items-center justify-center text-white/60 hover:text-gold hover:bg-gold/10 transition-all"
                  >
                    <Navigation className="w-5 h-5" />
                  </a>
                </div>

                <p className="text-white/50 text-sm mb-4">{location.address}</p>

                <div className="mb-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Courses Available:</p>
                  <div className="flex flex-wrap gap-2">
                    {location.courses.map((course, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-charcoal-700/50 text-white/70 text-xs rounded-md"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{location.schedule}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Option */}
      <section className="py-16 bg-charcoal-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-blue-500/10 via-charcoal-800 to-charcoal-800 rounded-3xl p-8 lg:p-12 border border-blue-500/20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full mb-4">
                  Can&apos;t Make It In Person?
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Online Learning Available
                </h3>
                <p className="text-white/60 mb-6">
                  Our Pilates Instructor course is available fully online with live Zoom sessions. Study from anywhere in Ireland (or the world) and get the same quality education.
                </p>
                <ul className="space-y-3">
                  {['Live Zoom classes Tue & Thu evenings', '7-week intensive program', 'Interactive practical sessions', 'Same REPs accreditation'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70">
                      <Check className="w-5 h-5 text-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link
                  href="/courses/pilates"
                  className="btn-gold flex items-center justify-center gap-2 px-8 py-4"
                >
                  View Online Option
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-950">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to <span className="text-gold">Get Started?</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Book a call to discuss which location and course schedule works best for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="btn-gold flex items-center gap-2 text-lg px-10 py-4"
              >
                Schedule a Call
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://wa.me/353851234567?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20training%20locations."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2 px-10 py-4"
              >
                <Phone className="w-5 h-5" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
