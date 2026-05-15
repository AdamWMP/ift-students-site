'use client'

// Thin compatibility shim around BookingModalRoot.
//
// Previously this component mounted its own OnceHub iframe per instance,
// which meant every "Book Strategy Call" button across the site spun up
// a hidden warm-up iframe AND, on open, a second visible iframe — slow
// and prone to mobile sizing bugs.
//
// Now: the actual modal is a singleton mounted once in app/layout.tsx.
// This shim just forwards isOpen → openBookingModal() so existing call
// sites keep working without changes.

import { useEffect } from 'react'
import { openBookingModal, closeBookingModal } from '@/components/booking-modal-root'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
  successUrl?: string
  calendarId?: string
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  useEffect(() => {
    if (isOpen) {
      openBookingModal()
      onClose()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data === '__booking_modal_closed__') onClose()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onClose])

  return null
}

export { openBookingModal, closeBookingModal }
