import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReminder } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const { name, amount, paymentDate, phone } = await request.json();

    if (!name || !amount || !paymentDate || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendPaymentReminder(phone, name, amount, paymentDate);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send reminder' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp] Error:', error);
    return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 });
  }
}
