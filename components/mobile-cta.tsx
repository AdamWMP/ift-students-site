'use client'

// Sticky bottom action bar (mobile) + floating WhatsApp pill (desktop).
//
// Mobile (< lg): full-width sticky bar at bottom of viewport with two
// buttons side-by-side: Book Strategy Call + WhatsApp Us. Pairs the
// singleton BookingModalRoot with a direct WhatsApp link so visitors
// always have a 1-tap path to either a strategy call or an immediate
// message.
//
// Desktop (≥ lg): floating WhatsApp pill anchored to the bottom-right
// corner. The booking CTA already lives in the header on desktop, so we
// only surface WhatsApp as a passive always-visible option here.
//
// Message context: usePathname() reads the current route and picks a
// pre-written WhatsApp message relevant to the page the visitor is on —
// e.g. /courses/pilates → "Hi! I'm interested in the Pilates Instructor
// course". Gives a useful conversation opener instead of a generic
// "Hi there" — helps Adam know what the visitor was looking at when
// they opened the chat.

import { MessageCircle, Calendar } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { openBookingModal } from '@/components/booking-modal-root'
import { track } from '@/lib/meta/events'

// TODO Adam: verify this number. The pilates contact page uses
// 353866003667; this currently uses 353866000001 (ends in 000001 which
// looks placeholder-y). Update WHATSAPP_NUMBER below if a different
// number should answer these messages.
const WHATSAPP_NUMBER = '353866000001'

// Pathname → pre-written WhatsApp message. First matching regex wins,
// so order specific routes before broad ones (e.g. /courses/pilates
// before /courses).
const MESSAGES: Array<[RegExp, string]> = [
  [/^\/courses\/personal-trainer/, "Hi! I'm interested in the Personal Trainer course and have a few questions."],
  [/^\/courses\/strength-conditioning/, "Hi! I'm interested in the Strength & Conditioning course and have a few questions."],
  [/^\/courses\/nutricert/, "Hi! I'm interested in the NutriCert nutrition course and have a few questions."],
  [/^\/courses\/pre-post-natal/, "Hi! I'm interested in the Pre & Post Natal course and have a few questions."],
  [/^\/courses\/reformer-pilates/, "Hi! I'm interested in the Reformer Pilates course and have a few questions."],
  [/^\/courses\/pilates/, "Hi! I'm interested in the Pilates Instructor course and have a few questions."],
  [/^\/courses\b/, "Hi! I'd like to know more about your courses."],
  [/^\/business-accelerator/, "Hi! I'd like to know more about the Business Accelerator programme."],
  [/^\/career-quiz/, "Hi! I just took the career quiz and would like to chat about my results."],
  [/^\/course-pathway-quiz/, "Hi! I just took the pathway quiz and would like some guidance."],
  [/^\/locations/, "Hi! I'd like to ask about course locations and upcoming dates."],
  [/^\/team/, "Hi! I'd like to know more about the IFT team."],
  [/^\/about/, "Hi! I have a question about Image Fitness Training."],
  [/^\/contact/, "Hi! I'd like to get in touch with the IFT team."],
  [/^\/enrol/, "Hi! I'm ready to enrol and need a hand finalising it."],
  [/^\/checkout/, "Hi! I have a question about my order/payment."],
  [/^\/blog\/[^/]+/, "Hi! I have a question about an article I just read on the IFT blog."],
  [/^\/blog/, "Hi! I'd like more info on something I saw on your blog."],
  [/^\/post\/[^/]+/, "Hi! I have a question about an article I just read on the IFT blog."],
  [/^\/ai-for-coaches/, "Hi! I'm interested in the AI for Coaches workshop."],
]

function getContextMessage(pathname: string): string {
  for (const [pattern, msg] of MESSAGES) {
    if (pattern.test(pathname)) return msg
  }
  return "Hi! I'd like to know more about Image Fitness Training."
}

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function MobileCta() {
  // usePathname returns null briefly during prerender / hydration edge cases.
  const pathname = usePathname() || '/'
  const message = getContextMessage(pathname)
  const whatsappUrl = buildWhatsAppUrl(message)

  return (
    <>
      {/* MOBILE: sticky bottom action bar — Book + WhatsApp side by side */}
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
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('Contact', { customData: { content_name: 'WhatsApp Mobile Bar', content_category: 'contact' } })}
          className="btn-press flex-1 h-[48px] inline-flex items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold tracking-[0.12em] uppercase"
          style={{ background: 'transparent', color: '#25D366', border: '1px solid rgba(37,211,102,0.55)' }}
          aria-label={`WhatsApp us — ${message}`}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp Us
        </a>
      </div>

      {/* DESKTOP: floating WhatsApp pill bottom-right.
          Hidden on mobile (mobile already has the sticky bar above). */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('Contact', { customData: { content_name: 'WhatsApp Desktop Float', content_category: 'contact' } })}
        className="hidden lg:inline-flex fixed bottom-6 right-6 z-40 items-center gap-2.5 rounded-full pl-4 pr-5 py-3.5 shadow-xl hover:scale-[1.03] transition-transform"
        style={{
          background: '#25D366',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(37,211,102,0.35), 0 4px 12px rgba(0,0,0,0.20)',
        }}
        aria-label={`WhatsApp us — ${message}`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[13px] font-semibold tracking-[0.06em]">WhatsApp Us</span>
      </a>
    </>
  )
}
