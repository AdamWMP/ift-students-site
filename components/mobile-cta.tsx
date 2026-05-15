'use client'

// Sticky bottom action bar — visible on mobile only. Pairs the singleton
// BookingModalRoot with a direct WhatsApp link so visitors always have a
// 1-tap path to either a strategy call or an immediate message.
//
// Mirrors the pattern from imagepilates.ie's MobileCta, swapping the
// "Enrol Now" link for WhatsApp per Adam's request — the WhatsApp pill
// replaces the previous floating-circle WhatsAppButton component, which
// is no longer mounted on the homepage.

import { MessageCircle, Calendar } from 'lucide-react'
import { openBookingModal } from '@/components/booking-modal-root'
import { track } from '@/lib/meta/events'

const WHATSAPP_URL =
  'https://wa.me/353866000001?text=' +
  encodeURIComponent("Hi! I'm interested in the Personal Trainer course.")

export default function MobileCta() {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex gap-2.5 px-4 py-3 pb-safe"
      style={{
        background: 'rgba(10,10,10,0.97)',
        borderTop: '1px solid rgba(212,168,54,0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.45)',
      }}
    >
      <button
        onClick={() => {
          track('Schedule', { customData: { content_name: 'Strategy Call', content_category: 'booking' } })
          openBookingModal()
        }}
        className="btn-press flex-1 h-[48px] inline-flex items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold tracking-[0.12em] uppercase"
        style={{ background: '#D4A836', color: '#0a0a0a', border: '1px solid #D4A836' }}
      >
        <Calendar className="w-4 h-4" />
        Book Strategy Call
      </button>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('Contact', { customData: { content_name: 'WhatsApp Mobile Bar', content_category: 'contact' } })}
        className="btn-press flex-1 h-[48px] inline-flex items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold tracking-[0.12em] uppercase"
        style={{ background: 'transparent', color: '#25D366', border: '1px solid rgba(37,211,102,0.55)' }}
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp Us
      </a>
    </div>
  )
}
