'use client'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

export type MetaEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'Contact'
  | 'CompleteRegistration'
  | 'Subscribe'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Schedule'

export type TrackUserData = {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  country?: string | null
  zip?: string | null
  externalId?: string | null
}

export type TrackCustomData = {
  currency?: string
  value?: number
  content_ids?: string[]
  content_name?: string
  content_category?: string
  content_type?: string
  num_items?: number
  [key: string]: unknown
}

const newEventId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export async function track(
  eventName: MetaEventName,
  opts: { userData?: TrackUserData; customData?: TrackCustomData; eventId?: string } = {}
): Promise<void> {
  const eventId = opts.eventId ?? newEventId()
  const { userData, customData } = opts

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, customData ?? {}, { eventID: eventId })
    } catch {
      // swallow client errors — CAPI is source of truth
    }
  }

  try {
    await fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        userData,
        customData,
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      }),
    })
  } catch {
    // best-effort; never block user flow
  }
}

export { newEventId }
