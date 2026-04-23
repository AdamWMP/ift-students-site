'use client'

import { useState, useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, Calendar } from 'lucide-react'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)
    const existingScript = document.querySelector(
      'script[src="https://cdn.oncehub.com/cal/embed.js"]'
    )
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://cdn.oncehub.com/cal/embed.js'
      script.async = true
      script.onload = () => setTimeout(() => setIsLoading(false), 500)
      document.body.appendChild(script)
    } else {
      setTimeout(() => setIsLoading(false), 500)
    }
  }, [isOpen])

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-4xl h-[calc(100dvh-2rem)] sm:h-[85vh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-charcoal-700 flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-charcoal-700 bg-charcoal-950 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              </div>
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-white font-semibold text-sm sm:text-base">
                  Schedule a Call
                </DialogPrimitive.Title>
                <p className="text-white/60 text-xs sm:text-sm truncate">Book a time that works for you</p>
              </div>
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-charcoal-800 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <X className="w-5 h-5 text-white" />
            </DialogPrimitive.Close>
          </div>

          {/* OnceHub Calendar */}
          <div className="flex-1 overflow-auto bg-white relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
              </div>
            )}
            <div
              data-oh-booking-calendar-id="BKC-PDJR9D0K6W"
              style={{ minWidth: '320px', minHeight: '700px' }}
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function useCalendlyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  return { isOpen, open, close }
}
