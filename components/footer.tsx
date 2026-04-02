'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react'

const PILATES_SITE_URL = process.env.NEXT_PUBLIC_PILATES_SITE_URL || 'https://imagepilates.ie'

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/imagefitnesstraining/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/ImageFitnessTraining/', label: 'Facebook' },
  { icon: Youtube, href: 'https://www.youtube.com/@imagefitnesstraining', label: 'YouTube' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/imagefitnesstraining', label: 'LinkedIn' },
]

const pathwayLinks = [
  { name: 'Personal Trainer', href: '/courses/personal-trainer' },
  { name: 'Strength & Conditioning', href: '/courses/strength-conditioning' },
  { name: 'Pilates Instructor', href: PILATES_SITE_URL, external: true },
  { name: 'Reformer Pilates', href: `${PILATES_SITE_URL}/reformer`, external: true },
  { name: 'NutriCert Nutrition', href: '/courses/nutricert' },
  { name: 'Pre & Post Natal', href: '/courses/pre-post-natal' },
  { name: 'Business Accelerator', href: '/business-accelerator' },
]

const companyLinks = [
  { name: 'About', href: '/about' },
  { name: 'Our Team', href: '/team' },
  { name: 'Locations', href: '/locations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  { name: 'Career Quiz', href: '/career-quiz' },
]

const communityLinks = [
  { name: 'The Floor (PT)', href: '#', external: false },
  { name: 'The Circle (Pilates)', href: PILATES_SITE_URL, external: true },
]

const accreditations = ['REPs Ireland', 'EHFA Approved', 'Skillnet Ireland']

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-charcoal-800">

      {/* ── Accreditations Bar ───────────────────────────────── */}
      <div className="border-b border-charcoal-800/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {accreditations.map((a) => (
            <span key={a} className="flex items-center gap-2 text-white/40 text-xs tracking-[0.15em] uppercase font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/50 flex-shrink-0" />
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-12 w-40 sm:h-14 sm:w-44">
                <Image
                  src="/logo-global.png"
                  alt="Image Fitness Training Global"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-white/60 text-sm mb-1 leading-relaxed max-w-[220px]">
              Where Coaches Are Made.
            </p>
            <p className="text-white/40 text-xs mb-1 max-w-[220px] leading-relaxed">
              Ireland&apos;s only end-to-end fitness career ecosystem.
            </p>
            <p className="text-white/30 text-xs mb-5 max-w-[220px]">
              16+ years · 5,000+ coaches made.
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-charcoal-800/50 border border-charcoal-700/50 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Pathways */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Pathways</h4>
            <ul className="space-y-2.5">
              {pathwayLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gold transition-colors text-sm">
                      {link.name}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-white/50 hover:text-gold transition-colors text-sm">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-gold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Graduate Communities */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Graduate Communities</h4>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gold transition-colors text-sm">
                      {link.name}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-white/50 hover:text-gold transition-colors text-sm">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/50 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gold/60 flex-shrink-0" />
                <span className="leading-relaxed">Dublin · Cork · Galway<br />Limerick · Wexford · Belfast</span>
              </li>
              <li>
                <a
                  href="tel:+35319023377"
                  className="flex items-center gap-2.5 text-white/50 hover:text-gold transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  <span>+353 1 902 3377</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/353866000001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/50 hover:text-gold transition-colors text-sm"
                >
                  <svg className="w-4 h-4 text-gold/60 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.12 1.523 5.854L.057 23.486a.75.75 0 0 0 .918.919l5.656-1.479A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.952-1.355l-.355-.21-3.684.962.982-3.592-.228-.368A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                  </svg>
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@imageft.ie"
                  className="flex items-center gap-2.5 text-white/50 hover:text-gold transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  <span>hello@imageft.ie</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Bar ───────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-charcoal-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Image Fitness Training Global. All rights reserved.
          </p>
          <Link href="/terms" className="text-white/30 hover:text-gold/70 transition-colors text-xs">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
}
