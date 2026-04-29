import { NextRequest, NextResponse } from 'next/server';
import { notifySaleFromOntraportContact } from '@/lib/sale-notifications';

// ─── Ontraport "Customers" Tag → Slack Ding Ding ────────────────────────
// Configure an Ontraport rule:
//   Trigger:    Tag Added → "Customers"
//   Action:     Ping URL  → https://imageft.ie/api/ontraport/sale-tag-webhook
//                          POST body: contact_id={{contact_id}} & token=<SHARED_SECRET>
//
// This is the bulletproof second source of truth for sale notifications.
// It fires whenever Ontraport tags a contact "Customers" (post-payment),
// independent of the inline ding from create-*-payment routes.
// ────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const expectedToken = (process.env.ONTRAPORT_TAG_WEBHOOK_TOKEN || '').trim();

  // Parse body — accept either JSON or form-encoded (Ontraport Ping URL uses form)
  const contentType = request.headers.get('content-type') || '';
  let contactId: string | undefined;
  let token: string | undefined;

  try {
    if (contentType.includes('application/json')) {
      const json = await request.json() as Record<string, unknown>;
      contactId = String(json.contact_id ?? json.contactId ?? json.id ?? '');
      token = String(json.token ?? '');
    } else {
      const form = await request.formData();
      contactId = String(form.get('contact_id') ?? form.get('contactId') ?? form.get('id') ?? '');
      token = String(form.get('token') ?? '');
    }
  } catch (e) {
    console.error('[TagWebhook] Failed to parse body:', e);
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Optional shared-secret guard: only enforce if server has a token configured.
  if (expectedToken && token !== expectedToken) {
    console.warn(`[TagWebhook] Rejected: bad/missing token for contact ${contactId}`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!contactId) {
    console.error('[TagWebhook] Missing contact_id');
    return NextResponse.json({ error: 'contact_id required' }, { status: 400 });
  }

  console.log(`[TagWebhook] Customers tag fired for contact ${contactId}`);

  const result = await notifySaleFromOntraportContact(contactId);

  return NextResponse.json({
    received: true,
    contactId,
    slack: result,
  });
}

// Allow GET for an at-a-glance health check from a browser
export async function GET() {
  const hasSlack = !!process.env.SLACK_SALES_WEBHOOK_URL;
  const hasToken = !!process.env.ONTRAPORT_TAG_WEBHOOK_TOKEN;
  const hasOntraport = !!process.env.ONTRAPORT_API_KEY && !!process.env.ONTRAPORT_APP_ID;
  return NextResponse.json({
    endpoint: 'ontraport/sale-tag-webhook',
    config: {
      slackWebhookConfigured: hasSlack,
      ontraportCredentialsConfigured: hasOntraport,
      sharedSecretEnforced: hasToken,
    },
  });
}
