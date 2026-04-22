import { NextRequest, NextResponse } from 'next/server'
import { sendCapiEvent, type CapiEventInput } from '@/lib/meta/capi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const getClientIp = (req: NextRequest): string | undefined => {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || undefined
}

const parseCookie = (header: string | null, name: string): string | undefined => {
  if (!header) return undefined
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export async function POST(req: NextRequest) {
  let payload: Partial<CapiEventInput> & { userData?: Partial<CapiEventInput['userData']> }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload?.eventName || typeof payload.eventName !== 'string') {
    return NextResponse.json({ error: 'eventName is required' }, { status: 400 })
  }

  const cookieHeader = req.headers.get('cookie')
  const fbp = payload.userData?.fbp ?? parseCookie(cookieHeader, '_fbp')
  const fbc = payload.userData?.fbc ?? parseCookie(cookieHeader, '_fbc')

  const clientIp = payload.userData?.clientIp ?? getClientIp(req)
  const userAgent = payload.userData?.userAgent ?? req.headers.get('user-agent') ?? undefined

  const eventSourceUrl = payload.eventSourceUrl ?? req.headers.get('referer') ?? undefined

  const result = await sendCapiEvent({
    eventName: payload.eventName,
    eventId: payload.eventId,
    eventTime: payload.eventTime,
    actionSource: payload.actionSource ?? 'website',
    eventSourceUrl,
    userData: {
      email: payload.userData?.email ?? null,
      phone: payload.userData?.phone ?? null,
      firstName: payload.userData?.firstName ?? null,
      lastName: payload.userData?.lastName ?? null,
      city: payload.userData?.city ?? null,
      country: payload.userData?.country ?? null,
      zip: payload.userData?.zip ?? null,
      externalId: payload.userData?.externalId ?? null,
      fbp: fbp ?? null,
      fbc: fbc ?? null,
      clientIp: clientIp ?? null,
      userAgent: userAgent ?? null,
    },
    customData: payload.customData,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
