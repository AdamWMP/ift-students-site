import { NextRequest, NextResponse } from 'next/server';
import { postToSlack, notifySaleFromOntraportContact } from '@/lib/sale-notifications';

// ─── Slack Ding-Ding Health Check ──────────────────────────────────────
// GET  /api/checkout/test-slack
//   → Sends a one-line "Slack bot is alive" message to #sales.
//
// GET  /api/checkout/test-slack?contactId=12345
//   → Re-fires the full Ding Ding for an existing Ontraport contact (safe
//     for testing — does not charge anything, only posts to Slack).
//
// Use this whenever a sale appears to have not dinged: hit it from a browser
// or `curl https://imageft.ie/api/checkout/test-slack` and check #sales.
// ────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const contactId = url.searchParams.get('contactId');

  if (contactId) {
    const result = await notifySaleFromOntraportContact(contactId);
    return NextResponse.json({
      mode: 'replay-from-contact',
      contactId,
      slack: result,
    });
  }

  const stamp = new Date().toISOString();
  const result = await postToSlack(
    `:white_check_mark: Slack sales bot health check — ${stamp}\n` +
    `If you can read this, the webhook URL is configured correctly.`,
    'health check',
  );

  return NextResponse.json({
    mode: 'health-check',
    timestamp: stamp,
    slack: result,
    config: {
      slackWebhookConfigured: !!process.env.SLACK_SALES_WEBHOOK_URL,
    },
  });
}
