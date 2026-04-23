'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const tutors = [
  { name: 'Aaron Buckley', role: 'CEO', image: '/tutors/aaron.png' },
  { name: 'Simon Creedon', role: 'Co-Founder', image: '/tutors/simon.png' },
  { name: 'Conor Whyte', role: 'Co-Founder', image: '/tutors/conor.png' },
  { name: 'Johnny Broughton', role: 'Head Tutor', image: '/tutors/johnny.png' },
  { name: 'Shane Roche', role: 'Lead Tutor', image: '/tutors/shane.png' },
  { name: 'Pilar Lokko', role: 'Lead PT Tutor', image: '/tutors/pilar.png' },
  { name: 'Kevin McCarthy', role: 'Tutor & FBA Mentor', image: '/tutors/kevin.jpg' },
  { name: 'Gary Downey', role: 'Tutor', image: '/tutors/gary.jpg' },
  { name: 'Stefano Manassero', role: 'Senior Tutor', image: '/tutors/stef.png' },
  { name: 'Mark White', role: 'S&C Tutor', image: '/tutors/mark.png' },
  { name: 'Darragh Hannaphy', role: 'Tutor & Gym Manager', image: '/tutors/darragh.png' },
  { name: 'Aisling Duignan', role: 'Pre & Post Natal Tutor', image: '/tutors/aisling.png' },
  { name: 'Diarmuid Cavanagh', role: 'NutriCert Tutor', image: '/tutors/diarmuid.png' },
  { name: 'Tomas Whelan', role: 'Lead Tutor', image: '/tutors/thomas.png' },
  { name: 'Greg Magner', role: 'Tutor & Examiner', image: '/tutors/greg.png' },
  { name: 'Eoin Cremin', role: 'Tutor & FBA Mentor', image: '/tutors/eoin.png' },
  { name: 'Sharon Gannon', role: 'Tutor & Gym Manager', image: '/tutors/sharon.png' },
  { name: 'May Turner', role: 'Senior Tutor & S&C Coach', image: '/tutors/may.png' },
  { name: 'Jordan Sherlock', role: 'FBA Mentor', image: '/tutors/jordan-sherlock.jpg' },
  { name: 'Adam Ward', role: 'Head of Marketing', image: '/tutors/adam.png' },
]

// Double for seamless loop
const doubled = [...tutors, ...tutors]

export default function TeamPreviewSection() {
  return (
    <section className="py-16 sm:py-20 bg-charcoal-900 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center mb-12">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-4">YOUR TUTORS</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-2">
          <span className="text-white">Taught by coaches,</span>
          <br />
          <span className="text-gold">not lecturers.</span>
        </h2>
        <div className="w-10 h-px bg-gold mx-auto mt-4 mb-6" />
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Every tutor is an active fitness professional — still coaching, still competing, still on the gym floor.
        </p>
      </div>

      {/* Scrolling marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-charcoal-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-charcoal-900 to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-4 sm:gap-6"
          style={{
            width: 'max-content',
            animation: 'ift-marquee 45s linear infinite',
          }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {doubled.map((tutor, i) => (
            <Link
              key={i}
              href="/team"
              className="group flex-shrink-0 w-36 sm:w-44 text-center"
            >
              <div className="relative w-36 sm:w-44 h-44 sm:h-52 rounded-2xl overflow-hidden mb-3 bg-charcoal-800 border border-charcoal-700 group-hover:border-gold/50 transition-colors duration-300">
                {tutor.image ? (
                  <Image
                    src={tutor.image}
                    alt={tutor.name}
                    fill
                    className="object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                    sizes="176px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-charcoal-700">
                    <span className="text-2xl font-bold text-gold/60">
                      {tutor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <p className="text-white font-semibold text-sm leading-tight group-hover:text-gold transition-colors duration-200">{tutor.name}</p>
              <p className="text-white/50 text-xs mt-0.5">{tutor.role}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-gold text-sm font-semibold uppercase tracking-wide border border-gold/40 hover:border-gold hover:bg-gold/5 px-6 py-3 rounded-lg transition-all duration-300"
        >
          Meet the Full Team
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes ift-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
