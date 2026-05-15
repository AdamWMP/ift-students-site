'use client'

// Singleton OnceHub booking modal. Mounted once in the root layout; every
// "Book Strategy Call" button across the site flips it open via the
// `open-booking-modal` event. The iframe is mounted once during idle (or
// on first user interaction, whichever comes first) and never remounts,
// so opening the modal is a pure visibility flip — no second iframe boot.
//
// Replaces the previous per-instance CalendlyModal pattern, which mounted
// a hidden warm-up iframe AND a fresh visible iframe per modal open,
// defeating the warm-up on the user-visible slot.

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Calendar, X } from 'lucide-react'

const ONCEHUB_CALENDAR_ID = 'BKC-PDJR9D0K6W'
const ONCEHUB_SCRIPT_SRC = 'https://cdn.oncehub.com/cal/embed.js'

export const OPEN_BOOKING_MODAL_EVENT = 'open-booking-modal'
export const CLOSE_BOOKING_MODAL_EVENT = 'close-booking-modal'

export function openBookingModal() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_BOOKING_MODAL_EVENT))
}

export function closeBookingModal() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CLOSE_BOOKING_MODAL_EVENT))
}

export default function BookingModalRoot({
  successUrl = '/thank-you',
}: { successUrl?: string }) {
  const [mounted, setMounted] = useState(false)
  const [warmed, setWarmed] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const warmTriggered = useRef(false)

  useEffect(() => { setMounted(true) }, [])

  // Open/close event listeners — any booking button can call openBookingModal()
  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)
    window.addEventListener(OPEN_BOOKING_MODAL_EVENT, onOpen)
    window.addEventListener(CLOSE_BOOKING_MODAL_EVENT, onClose)
    return () => {
      window.removeEventListener(OPEN_BOOKING_MODAL_EVENT, onOpen)
      window.removeEventListener(CLOSE_BOOKING_MODAL_EVENT, onClose)
    }
  }, [])

  // Pre-warm: inject embed.js + mount the iframe host on idle OR on first
  // user interaction (touchstart/pointerdown), whichever comes first. The
  // interaction trigger ensures the iframe is ready by the time a user
  // can actually tap the booking button — even on a slow phone where
  // idle never fires before they reach the CTA.
  const warmUp = useCallback(() => {
    if (warmTriggered.current) return
    warmTriggered.current = true
    const existing = document.querySelector(`script[src="${ONCEHUB_SCRIPT_SRC}"]`)
    if (!existing) {
      const s = document.createElement('script')
      s.src = ONCEHUB_SCRIPT_SRC
      s.async = true
      document.head.appendChild(s)
    }
    setWarmed(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const onInteract = () => warmUp()
    window.addEventListener('pointerdown', onInteract, { once: true, passive: true })
    window.addEventListener('touchstart', onInteract, { once: true, passive: true })
    window.addEventListener('scroll', onInteract, { once: true, passive: true })

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (h: number) => void
    }
    const handle = w.requestIdleCallback
      ? w.requestIdleCallback(warmUp, { timeout: 3000 })
      : window.setTimeout(warmUp, 1500)

    return () => {
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('scroll', onInteract)
      if (w.requestIdleCallback && w.cancelIdleCallback) w.cancelIdleCallback(handle as number)
      else clearTimeout(handle as number)
    }
  }, [mounted, warmUp])

  // OnceHub fires a postMessage on successful booking — intercept and
  // redirect to /thank-you to mirror the previous CalendlyModal behaviour.
  useEffect(() => {
    if (!open) return
    function onMessage(event: MessageEvent) {
      const origin = event.origin || ''
      if (!origin.includes('oncehub.com')) return
      const data = event.data
      const payload = typeof data === 'string'
        ? data.toLowerCase()
        : JSON.stringify(data ?? '').toLowerCase()
      if (payload.includes('booking') && (payload.includes('complete') || payload.includes('confirmed') || payload.includes('success'))) {
        setOpen(false)
        router.push(successUrl)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [open, router, successUrl])

  // Body scroll lock while modal is open
  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = open ? 'hidden' : prev
    return () => { document.body.style.overflow = prev }
  }, [open, mounted])

  // ESC closes
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!mounted) return null

  return createPortal(
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed',
        inset: 0,
        // Park off-screen when closed so the iframe stays mounted but
        // invisible — toggling `display: none` would unmount the iframe in
        // some browsers, defeating the warm-up.
        transform: open ? 'translate3d(0,0,0)' : 'translate3d(-200vw,0,0)',
        zIndex: open ? 9999 : -1,
        pointerEvents: open ? 'auto' : 'none',
        background: open ? 'rgba(10,10,10,0.85)' : 'transparent',
        backdropFilter: open ? 'blur(6px)' : 'none',
        WebkitBackdropFilter: open ? 'blur(6px)' : 'none',
        opacity: open ? 1 : 0,
        transition: 'opacity 180ms ease-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '56rem',
          height: 'min(92dvh, 820px)',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          border: '1px solid #3a3631',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header — dark IFT theme */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #3a3631',
            background: '#0a0a0a',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                background: 'rgba(212,168,54,0.15)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Calendar style={{ width: '1rem', height: '1rem', color: '#D4A836' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>
                Schedule a Call
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', margin: 0 }}>
                Book a time that works for you
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            style={{
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* OnceHub calendar slot — fills remaining flex space so the time
            slots are reachable on every viewport. minHeight 0 lets the
            child shrink instead of overflowing on short phones. */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            background: '#fff',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {warmed ? (
            <div
              data-oh-booking-calendar-id={ONCEHUB_CALENDAR_ID}
              style={{ width: '100%', minWidth: '320px', height: '100%', minHeight: '560px' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '3px solid rgba(212,168,54,0.25)',
                  borderTopColor: '#D4A836',
                  borderRadius: '50%',
                  animation: 'spin 0.9s linear infinite',
                }}
              />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
