import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

const OP_API_KEY = process.env.ONTRAPORT_API_KEY ?? ''
const OP_APP_ID  = process.env.ONTRAPORT_APP_ID ?? ''
const OP_BASE    = 'https://api.ontraport.com/1'

async function opRequest(path: string, method: string, body?: Record<string, unknown>) {
  const res = await fetch(`${OP_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Api-Appid': OP_APP_ID,
      'Api-key': OP_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.() ?? {}
    const { name, email, phone, subject, message } = body ?? {}

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // ── 1. Save to local DB ─────────────────────────────────
    const submission = await prisma.contactSubmission.create({
      data: {
        name: name ?? '',
        email: email ?? '',
        phone: phone ?? null,
        subject: subject ?? null,
        message: message ?? '',
        status: 'new',
      },
    })

    // ── 2. Upsert contact in Ontraport ──────────────────────
    if (OP_API_KEY && OP_APP_ID) {
      try {
        const firstName = (name ?? '').split(' ')[0] ?? name
        const lastName  = (name ?? '').split(' ').slice(1).join(' ') || ''

        const contactData: Record<string, string> = {
          email:       email ?? '',
          firstname:   firstName,
          lastname:    lastName,
          sms_number:  phone ?? '',
          f1765:       subject ?? '',   // lead source / subject
          f2538:       message ?? '',   // notes field
        }

        const contactRes = await opRequest('/Contacts/saveorupdate', 'POST', {
          object_type_id: '0',
          ...contactData,
        })

        const contactId = contactRes?.data?.attrs?.id ?? contactRes?.data?.id

        // ── 3. Tag as "Website Lead" ──────────────────────────
        if (contactId) {
          await opRequest('/Contacts/tag', 'PUT', {
            ids:       String(contactId),
            tag_names: 'Website Lead',
          })
        }
      } catch (opErr) {
        // Non-fatal — log but don't fail the request
        console.error('Ontraport contact sync error:', opErr)
      }
    }

    return NextResponse.json({ success: true, id: submission?.id ?? '' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
