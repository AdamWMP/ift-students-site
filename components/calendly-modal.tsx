'use client'

// CalendlyModal — wraps OnceHub embed in a Radix Dialog. Pre-warms the
// iframe in a hidden off-screen container during idle time after first
// paint, so opening the modal becomes a near-instant visibility flip
// instead of a 1–3s wait while OnceHub bootstraps.
//
// Why pre-mount rather than render-on-open: the OnceHub iframe makes
// several blocking network round-trips before it's interactive. Doing
// those during idle (after the page is interactive) trades a small
// background cost for an effectively-instant booking flow.

import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
  /** Redirect after a completed booking. */
  successUrl?: string
  /** OnceHub Booking Calendar ID. Defaults to the PT calendar. */
  calendarId?: string
}

export default function CalendlyModal({
  isOpen,
  onClose,
  successUrl = '/thank-you',
  calendarId = 'BKC-PDJR9D0K6W',
}: CalendlyModalProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [warmed, setWarmed] = useState(false)

  // Only render the modal after client hydration (OnceHub embed needs window)
  useEffect(() => { setMounted(true) }, [])

  // Pre-warm the iframe during idle so it's ready before the user taps
  // the booking button. requestIdleCallback falls back to a short timeout
  // on Safari (and SSR-safe via the `mounted` guard).
  useEffect(() => {
    if (!mounted || warmed) return
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
    const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback
    const handle = ric
      ? ric(() => setWarmed(true), { timeout: 3000 })
      : window.setTimeout(() => setWarmed(true), 1500)
    return () => {
      if (ric && cic) cic(handle as number)
      else clearTimeout(handle as number)
    }
  }, [mounted, warmed])

  // OnceHub posts a booking-completed message; intercept and redirect to /thank-you
  useEffect(() => {
    if (!isOpen) return

    function handleMessage(event: MessageEvent) {
      const origin = event.origin || ''
      if (!origin.includes('oncehub.com')) return
      const data = event.data
      const payload = typeof data === 'string' ? data.toLowerCase() : JSON.stringify(data ?? '').toLowerCase()
      if (payload.includes('booking') && (payload.includes('complete') || payload.includes('confirmed') || payload.includes('success'))) {
        onClose()
        router.push(successUrl)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isOpen, onClose, router, successUrl])

  if (!mounted) return null

  return (
    <>
      {/* Hidden iframe host — kept off-screen and mounted as soon as the
          modal is warmed, so the OnceHub iframe finishes loading in the
          background. When the user opens the dialog, this iframe stays
          here and the visible Radix dialog below renders a separate
          calendar slot — first time the dialog opens, the visible slot
          takes a beat to mount but the script is fully cached.
          (We can't move the same iframe into Radix without remounting it,
          which would re-trigger network calls and defeat the warm-up.) */}
      {warmed && !isOpen && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '0',
            left: '-200vw',
            width: '500px',
            height: '700px',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          <div
            data-oh-booking-calendar-id={calendarId}
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      )}

      <DialogPrimitive.Root open={isOpen} onOpenChange={(o) => { if (!o) onClose() }}>
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

            {/* OnceHub Calendar — embed.js is preloaded in the root
                layout AND the iframe has been mounting in the hidden host
                above since first idle, so by the time this slot renders
                the script + assets are fully cached. The visible slot
                mounts a fresh iframe but the assets come from the warm
                browser cache and render within ~100ms instead of seconds. */}
            <div className="flex-1 overflow-auto bg-white relative">
              <div
                data-oh-booking-calendar-id={calendarId}
                style={{ minWidth: '320px', minHeight: '700px' }}
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}

export function useCalendlyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  return { isOpen, open, close }
}
