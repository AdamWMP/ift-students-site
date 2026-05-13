'use client'

import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
  /**
   * Where to redirect after the booking is completed. Defaults to /thank-you.
   * OnceHub's own dashboard redirect setting remains the authoritative path —
   * this is a client-side fallback for the in-modal embed.
   */
  successUrl?: string
}

export default function CalendlyModal({
  isOpen,
  onClose,
  successUrl = '/thank-you',
}: CalendlyModalProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Only render on the client (OnceHub embed relies on window)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Listen for OnceHub booking-completed events and redirect to the thank-you page
  useEffect(() => {
    if (!isOpen) return

    function handleMessage(event: MessageEvent) {
      const origin = event.origin || ''
      if (!origin.includes('oncehub.com')) return

      const data = event.data
      const payload = typeof data === 'string' ? data.toLowerCase() : JSON.stringify(data ?? '').toLowerCase()

      // OnceHub emits a variety of lifecycle events; we only care about completion
      if (payload.includes('booking') && (payload.includes('complete') || payload.includes('confirmed') || payload.includes('success'))) {
        onClose()
        router.push(successUrl)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isOpen, onClose, router, successUrl])

  if (!isClient) return null

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

          {/* OnceHub Calendar — script is pre-loaded in the root layout, so this renders instantly */}
          <div className="flex-1 overflow-auto bg-white relative">
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
