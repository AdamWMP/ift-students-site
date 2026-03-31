import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReminder } from '@/lib/aisensy';
import { addDays, format, lastDayOfMonth } from 'date-fns';

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

/**
 * Cron trigger: runs daily at 10am via Vercel Cron.
 * Checks if tomorrow is the 30th (or last day of Feb) and sends
 * WhatsApp payment reminders to all students with active payment plans.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const tomorrow = addDays(now, 1);
  const tomorrowDay = tomorrow.getDate();
  const lastDay = lastDayOfMonth(tomorrow).getDate();

  // Only send reminders if tomorrow is the 30th, or last day of month if month has < 30 days
  const isPaymentDay = tomorrowDay === 30 || (lastDay < 30 && tomorrowDay === lastDay);

  if (!isPaymentDay) {
    return NextResponse.json({ message: 'Not a payment reminder day', tomorrow: format(tomorrow, 'yyyy-MM-dd') });
  }

  const paymentDateStr = format(tomorrow, 'd MMMM yyyy');

  try {
    // Query Ontraport for contacts with active payment plans:
    // - Has tag 50 (Customers)
    // - f2456 = 542 (NOT PAID — fees still outstanding)
    // - Has monthly amount set
    const searchRes = await fetch('https://api.ontraport.com/1/Contacts?condition=' +
      encodeURIComponent(JSON.stringify([
        { field: { field: 'tag_id' }, op: 'IN', value: { list: ['50'] } },
        { field: { field: 'f2456' }, op: '=', value: '542' },
      ])) +
      '&range=100&listFields=id,firstname,lastname,email,sms_number,f2625,f2626', {
      method: 'GET',
      headers: ontraportHeaders(),
    });

    const searchResult = await searchRes.json();
    const contacts = searchResult?.data || [];

    let sent = 0;
    let failed = 0;

    for (const contact of contacts) {
      const phone = contact.sms_number;
      const name = `${contact.firstname || ''} ${contact.lastname || ''}`.trim();
      const monthlyAmount = contact.f2625;
      const remainingMonths = parseInt(contact.f2626 || '0', 10);

      if (!phone || !monthlyAmount || remainingMonths <= 0) continue;

      const result = await sendPaymentReminder(
        phone,
        name,
        `€${parseFloat(monthlyAmount).toFixed(2)}`,
        paymentDateStr,
      );

      if (result.success) {
        sent++;
      } else {
        failed++;
        console.error(`[Cron] Failed to send reminder to ${name} (${phone}): ${result.error}`);
      }

      // Rate limit: small delay between messages
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`[Cron] Payment reminders sent: ${sent} success, ${failed} failed out of ${contacts.length} contacts`);

    return NextResponse.json({
      success: true,
      paymentDate: paymentDateStr,
      totalContacts: contacts.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error('[Cron] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
