'use client'

// Compatibility shim. The old floating WhatsApp circle has been replaced
// site-wide by the sticky mobile action bar (Book Strategy Call +
// WhatsApp Us). This re-export keeps every `<WhatsAppButton />` import
// across the site (20+ pages) working without per-page edits.

import MobileCta from './mobile-cta'

export default function WhatsAppButton() {
  return <MobileCta />
}
