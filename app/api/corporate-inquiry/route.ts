import { NextRequest, NextResponse } from 'next/server'
import { notifyLead } from '@/lib/lead-notifications'

export const dynamic = 'force-dynamic'

const OP_API_KEY = process.env.ONTRAPORT_API_KEY ?? ''
const OP_APP_ID = process.env.ONTRAPORT_APP_ID ?? ''

function opHeaders() {
  return {
    'Api-Key': OP_API_KEY,
    'Api-Appid': OP_APP_ID,
    'Content-Type': 'application/json',
  }
}

async function getOrCreateTagId(tagName: string): Promise<string> {
  try {
    const searchRes = await fetch(
      `https://api.ontraport.com/1/Tags?search=${encodeURIComponent(tagName)}&listFields=id,tag_name`,
      { headers: opHeaders() }
    )
    const searchData = await searchRes.json()
    const match = (searchData?.data ?? []).find(
      (t: { tag_name: string; tag_id?: string; id?: string }) =>
        t.tag_name?.toLowerCase() === tagName.toLowerCase()
    )
    if (match?.tag_id) return String(match.tag_id)
    if (match?.id) return String(match.id)

    const createRes = await fetch('https://api.ontraport.com/1/Tags', {
      method: 'POST',
      headers: opHeaders(),
      body: JSON.stringify({ tag_name: tagName }),
    })
    const createData = await createRes.json()
    return String(createData?.data?.tag_id ?? createData?.data?.id ?? createData?.data?.attrs?.id ?? '')
  } catch (err) {
    console.error('[CorporateInquiry] getOrCreateTagId failed:', err)
    return ''
  }
}

async function upsertOntraportContact(payload: {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
}): Promise<string | undefined> {
  if (!OP_API_KEY || !OP_APP_ID) return undefined
  try {
    const res = await fetch('https://api.ontraport.com/1/Contacts/saveorupdate', {
      method: 'POST',
      headers: opHeaders(),
      body: JSON.stringify({
        firstname: payload.firstName,
        lastname: payload.lastName,
        email: payload.email,
        cell_phone: payload.phone || undefined,
        company: payload.company,
      }),
    })
    const data = await res.json()
    const contactId =
      data?.data?.attrs?.id ??
      data?.data?.id ??
      data?.data?.contact_id
    return contactId ? String(contactId) : undefined
  } catch (err) {
    console.error('[CorporateInquiry] Ontraport upsert failed:', err)
    return undefined
  }
}

async function addContactNote(contactId: string, body: string): Promise<void> {
  try {
    await fetch('https://api.ontraport.com/1/objects', {
      method: 'POST',
      headers: opHeaders(),
      body: JSON.stringify({
        objectID: 12,
        contact_id: contactId,
        data: body,
      }),
    })
  } catch (err) {
    console.error('[CorporateInquiry] Note create failed (non-fatal):', err)
  }
}

async function applyTags(contactId: string, tags: string[]): Promise<void> {
  for (const tagName of tags) {
    try {
      const tagId = await getOrCreateTagId(tagName)
      if (tagId) {
        await fetch('https://api.ontraport.com/1/Contacts/tag', {
          method: 'PUT',
          headers: opHeaders(),
          body: JSON.stringify({ ids: contactId, add_list: tagId }),
        })
      }
    } catch (err) {
      console.error(`[CorporateInquiry] Tag "${tagName}" failed (non-fatal):`, err)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      role,
      engagementType,
      groupSize,
      location,
      timeframe,
      message,
    } = body

    if (!firstName || !lastName || !email || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/\S+@\S+\.\S+/.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const contactId = await upsertOntraportContact({ firstName, lastName, email, phone, company })

    if (contactId) {
      const noteLines = [
        `Corporate enquiry via imageft.ie/corporate`,
        `Company: ${company}`,
        role ? `Role: ${role}` : '',
        engagementType ? `Engagement type: ${engagementType}` : '',
        groupSize ? `Group size: ${groupSize}` : '',
        location ? `Preferred location: ${location}` : '',
        timeframe ? `Timeframe: ${timeframe}` : '',
        '',
        message ? `What they wrote:\n${message}` : '(no message provided)',
      ].filter(Boolean).join('\n')
      await addContactNote(contactId, noteLines)
      await applyTags(contactId, ['Corporate Enquiry', 'Website Lead'])
    }

    // Email sales@imageft.ie + Slack via the existing notifyLead helper
    const subjectDetail = engagementType ? ` — ${engagementType}` : ''
    await notifyLead({
      firstName: String(firstName),
      lastName: String(lastName),
      email: String(email),
      phone: String(phone || ''),
      subject: `Corporate enquiry (${company})${subjectDetail}`,
      source: 'imageft.ie/corporate',
      interest: [groupSize, timeframe, location].filter(Boolean).join(' · '),
      pageUrl: 'https://imageft.ie/corporate',
      contactId,
    }).catch((e) => console.error('[CorporateInquiry] notifyLead failed (non-fatal):', e))

    return NextResponse.json({ success: true, contactId })
  } catch (err) {
    console.error('[CorporateInquiry] API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
