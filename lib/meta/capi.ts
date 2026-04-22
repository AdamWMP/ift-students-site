import 'server-only'
import { createHash, randomUUID } from 'crypto'

const GRAPH_VERSION = 'v19.0'

type RawUserData = {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  country?: string | null
  zip?: string | null
  externalId?: string | null
  fbp?: string | null
  fbc?: string | null
  clientIp?: string | null
  userAgent?: string | null
}

type CustomData = Record<string, unknown> & {
  currency?: string
  value?: number
  content_ids?: string[]
  content_name?: string
  content_category?: string
  content_type?: string
  num_items?: number
}

export type CapiEventInput = {
  eventName: string
  eventId?: string
  eventTime?: number
  actionSource?: 'website' | 'email' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other'
  eventSourceUrl?: string
  userData: RawUserData
  customData?: CustomData
}

const hash = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (!normalized) return undefined
  return createHash('sha256').update(normalized).digest('hex')
}

const hashPhone = (phone: string | null | undefined): string | undefined => {
  if (!phone) return undefined
  const digitsOnly = phone.replace(/[^\d]/g, '')
  if (!digitsOnly) return undefined
  return createHash('sha256').update(digitsOnly).digest('hex')
}

export const newEventId = (): string => randomUUID()

export async function sendCapiEvent(input: CapiEventInput): Promise<{ ok: boolean; status: number; body: unknown }> {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  const testEventCode = process.env.META_TEST_EVENT_CODE

  if (!pixelId || !accessToken) {
    return { ok: false, status: 0, body: { error: 'META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set' } }
  }

  const u = input.userData
  const user_data: Record<string, unknown> = {
    em: hash(u.email) ? [hash(u.email)] : undefined,
    ph: hashPhone(u.phone) ? [hashPhone(u.phone)] : undefined,
    fn: hash(u.firstName) ? [hash(u.firstName)] : undefined,
    ln: hash(u.lastName) ? [hash(u.lastName)] : undefined,
    ct: hash(u.city) ? [hash(u.city)] : undefined,
    country: hash(u.country) ? [hash(u.country)] : undefined,
    zp: hash(u.zip) ? [hash(u.zip)] : undefined,
    external_id: hash(u.externalId) ? [hash(u.externalId)] : undefined,
    fbp: u.fbp || undefined,
    fbc: u.fbc || undefined,
    client_ip_address: u.clientIp || undefined,
    client_user_agent: u.userAgent || undefined,
  }
  Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k])

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: input.eventId ?? randomUUID(),
    action_source: input.actionSource ?? 'website',
    event_source_url: input.eventSourceUrl,
    user_data,
  }
  if (input.customData && Object.keys(input.customData).length > 0) {
    event.custom_data = input.customData
  }

  const body: Record<string, unknown> = { data: [event] }
  if (testEventCode) body.test_event_code = testEventCode

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, body: json }
  } catch (err) {
    return { ok: false, status: 0, body: { error: String(err) } }
  }
}
