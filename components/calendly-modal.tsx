'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar } from 'lucide-react'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsLoading(true)
      
      // Load OnceHub script
      const existingScript = document.querySelector('script[src="https://cdn.oncehub.com/cal/embed.js"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://cdn.oncehub.com/cal/embed.js'
        script.async = true
        script.onload = () => {
          setTimeout(() => setIsLoading(false), 500)
        }
        document.body.appendChild(script)
      } else {
        setTimeout(() => setIsLoading(false), 500)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isClient) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-charcoal-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-700 bg-charcoal-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Schedule a Call</h3>
                  <p className="text-white/60 text-sm">Book a time that works for you</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-charcoal-800 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* OnceHub Calendar */}
            <div ref={containerRef} className="w-full h-[calc(100%-72px)] overflow-auto bg-white">
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
              )}
              <div 
                data-oh-booking-calendar-id="BKC-ZL15KN8D5X" 
                style={{ minWidth: '320px', height: '700px' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Export a hook for easy usage
export function useCalendlyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  return { isOpen, open, close }
}
