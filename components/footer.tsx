'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react'

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/imagefitnesstraining/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/ImageFitnessTraining/', label: 'Facebook' },
  { icon: Youtube, href: 'https://www.youtube.com/@imagefitnesstraining', label: 'YouTube' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/imagefitnesstraining', label: 'LinkedIn' },
]

const PILATES_SITE_URL = process.env.NEXT_PUBLIC_PILATES_SITE_URL || 'https://imagepilates.ie'

const courseLinks = [
  { name: 'Personal Trainer', href: '/courses/personal-trainer' },
  { name: 'Strength & Conditioning', href: '/courses/strength-conditioning' },
  { name: 'Pilates Instructor', href: PILATES_SITE_URL, external: true },
  { name: 'Reformer Pilates', href: `${PILATES_SITE_URL}/reformer`, external: true },
  { name: 'NutriCert Nutrition', href: '/courses/nutricert' },
  { name: 'Pre & Post Natal', href: '/courses/pre-post-natal' },
  { name: 'Business Accelerator', href: '/business-accelerator' },
]

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Our Team', href: '/team' },
  { name: 'Locations', href: '/locations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  { name: 'Career Quiz', href: '/career-quiz' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-charcoal-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Logo & About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <div className="relative h-12 w-40 sm:h-14 sm:w-48">
                <Image
                  src="/logo-global.png"
                  alt="Image Fitness Training"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-white/60 text-sm mb-6 leading-relaxed max-w-xs">
              Ireland&apos;s #1 fitness educator. 15+ years of excellence, 5,000+ graduates. 
              REPs accredited, internationally recognized.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
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

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Our Courses</h4>
            <ul className="space-y-2.5">
              {courseLinks.map((link) => (
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
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
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

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gold/70 flex-shrink-0" />
                <span>Dublin • Cork • Galway • Limerick • Wexford • Belfast</span>
              </li>
              <li>
                <a 
                  href="https://wa.me/353851234567" 
                  className="flex items-center gap-3 text-white/50 hover:text-gold transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-gold/70" />
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:sales@imageft.ie"
                  className="flex items-center gap-3 text-white/50 hover:text-gold transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-gold/70" />
                  <span>sales@imageft.ie</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-charcoal-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Image Fitness Training. All rights reserved.
          </p>
          <Link href="/terms" className="text-white/30 hover:text-gold/70 transition-colors text-xs">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
}
