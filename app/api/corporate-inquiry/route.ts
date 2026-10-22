// Corporate B2B lead endpoint — self-contained Ontraport upsert +
// Slack notify + sales@imageft.ie email via Ontraport /1/message.
// Mirrors the same mechanics used by other lead endpoints without
// taking a dependency on local-only lib/lead-notifications.ts.

import { NextRequest, NextResponse } from 'next/server'

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

async function postSlack(blocks: unknown[], text: string): Promise<void> {
  const slackWebhook = (process.env.SLACK_LEADS_WEBHOOK_URL ?? process.env.SLACK_SALES_WEBHOOK_URL ?? '').trim()
  const slackToken = process.env.SLACK_BOT_TOKEN
  const payload = { text, blocks }
  try {
    if (slackWebhook) {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else if (slackToken) {
      await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${slackToken}` },
        body: JSON.stringify({ channel: 'C04T7HMBXRS', ...payload }),
      })
    }
  } catch (err) {
    console.error('[CorporateInquiry] Slack notification failed (non-fatal):', err)
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
        `CORPORATE ENQUIRY via imageft.ie/corporate`,
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

    // Slack notification to the sales team
    await postSlack(
      [
        { type: 'header', text: { type: 'plain_text', text: '🏢 Corporate enquiry — IFT' } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Name*\n${firstName} ${lastName}` },
            { type: 'mrkdwn', text: `*Company*\n${company}` },
            { type: 'mrkdwn', text: `*Email*\n${email}` },
            { type: 'mrkdwn', text: `*Phone*\n${phone || '—'}` },
            { type: 'mrkdwn', text: `*Role*\n${role || '—'}` },
            { type: 'mrkdwn', text: `*Engagement*\n${engagementType || '—'}` },
            { type: 'mrkdwn', text: `*Group size*\n${groupSize || '—'}` },
            { type: 'mrkdwn', text: `*Timeframe*\n${timeframe || '—'}` },
            { type: 'mrkdwn', text: `*Location*\n${location || '—'}` },
          ],
        },
        ...(message
          ? [{ type: 'section' as const, text: { type: 'mrkdwn' as const, text: `*Message*\n${message}` } }]
          : []),
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: contactId
                ? `Ontraport: https://app.ontraport.com/#!/contacts/view?id=${contactId}`
                : 'Source: imageft.ie/corporate',
            },
          ],
        },
      ],
      `🏢 Corporate enquiry — ${company}`
    )

    return NextResponse.json({ success: true, contactId })
  } catch (err) {
    console.error('[CorporateInquiry] API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
