'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Calendar } from 'lucide-react'
import CalendlyModal from '@/components/calendly-modal'

// ── Image Pilates site URL ──────────────────────────────────────────
// Update this to the live Pilates site domain before deploying
const PILATES_SITE_URL = process.env.NEXT_PUBLIC_PILATES_SITE_URL || 'https://imagepilates.ie'

const navItems = [
  { href: '/', label: 'Home' },
  {
    label: 'About',
    children: [
      { href: '/about', label: 'About Us' },
      { href: '/team', label: 'Our Team' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    label: 'Courses',
    children: [
      { href: '/courses/personal-trainer', label: 'Personal Trainer' },
      { href: PILATES_SITE_URL, label: 'Pilates Instructor', external: true },
      { href: `${PILATES_SITE_URL}/reformer`, label: 'Reformer Pilates', external: true },
      { href: '/courses/strength-conditioning', label: 'Strength & Conditioning' },
      { href: '/courses/nutricert', label: 'NutriCert Nutrition' },
      { href: '/courses/pre-post-natal', label: 'Pre & Post Natal' },
      { href: '/business-accelerator', label: 'Business Accelerator' },
    ],
  },
  { href: '/locations', label: 'Locations' },
  { href: '/career-quiz', label: 'Career Quiz' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window?.scrollY > 20)
    }
    window?.addEventListener?.('scroll', handleScroll)
    return () => window?.removeEventListener?.('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-charcoal-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-12 w-40 sm:h-14 sm:w-48">
              <Image
                src="/logo-global.png"
                alt="Image Fitness Training Global"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems?.map?.((item, index) => (
              <div key={index} className="relative">
                {item?.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item?.label ?? null)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/80 hover:text-gold transition-colors">
                      {item?.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item?.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 bg-charcoal-800 rounded-lg shadow-xl overflow-hidden min-w-[220px]"
                        >
                          {item?.children?.map?.((child, childIndex) => (
                            (child as { external?: boolean })?.external ? (
                              <a
                                key={childIndex}
                                href={child?.href ?? '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-3 text-sm text-white/80 hover:text-gold hover:bg-charcoal-700 transition-colors"
                              >
                                {child?.label}
                              </a>
                            ) : (
                              <Link
                                key={childIndex}
                                href={child?.href ?? '#'}
                                className="block px-4 py-3 text-sm text-white/80 hover:text-gold hover:bg-charcoal-700 transition-colors"
                              >
                                {child?.label}
                              </Link>
                            )
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (item as { highlight?: boolean })?.highlight ? (
                  <Link
                    href={item?.href ?? '#'}
                    className="ml-2 px-4 py-2 text-sm font-bold bg-[#D4A836] text-black rounded-lg hover:bg-[#E5B82A] transition-colors"
                  >
                    {item?.label}
                  </Link>
                ) : (
                  <Link
                    href={item?.href ?? '#'}
                    className="px-4 py-2 text-sm font-medium text-white/80 hover:text-gold transition-colors"
                  >
                    {item?.label}
                  </Link>
                )}
              </div>
            )) ?? null}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setIsCalendlyOpen(true)}
              className="btn-gold text-sm flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              BOOK STRATEGY CALL
            </button>
          </div>

          {/* Mobile CTA + Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsCalendlyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold hover:bg-gold-600 text-charcoal-950 text-xs font-semibold rounded-full transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK STRATEGY CALL</span>
            </button>
            <button
              className="p-2 tap-target"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gold" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-charcoal-900 border-t border-charcoal-800"
          >
            <nav className="max-w-[1200px] mx-auto px-4 py-4 space-y-1">
              {navItems?.map?.((item, index) => (
                <div key={index}>
                  {item?.children ? (
                    <div className="space-y-1">
                      <p className="px-4 py-2 text-sm font-medium text-white/50">
                        {item?.label}
                      </p>
                      {item?.children?.map?.((child, childIndex) => (
                        (child as { external?: boolean })?.external ? (
                          <a
                            key={childIndex}
                            href={child?.href ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-3 text-base text-white hover:text-gold hover:bg-charcoal-800 rounded-lg transition-colors tap-target"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child?.label}
                          </a>
                        ) : (
                          <Link
                            key={childIndex}
                            href={child?.href ?? '#'}
                            className="block px-4 py-3 text-base text-white hover:text-gold hover:bg-charcoal-800 rounded-lg transition-colors tap-target"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child?.label}
                          </Link>
                        )
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item?.href ?? '#'}
                      className="block px-4 py-3 text-base text-white hover:text-gold hover:bg-charcoal-800 rounded-lg transition-colors tap-target"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item?.label}
                    </Link>
                  )}
                </div>
              )) ?? null}
              <div className="pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setIsCalendlyOpen(true)
                  }}
                  className="block w-full btn-gold text-center"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  BOOK STRATEGY CALL
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </header>
  )
}
