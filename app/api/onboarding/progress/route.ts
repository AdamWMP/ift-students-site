import { NextRequest, NextResponse } from 'next/server';
import { ONTRAPORT_FIELDS } from '@/lib/ontraport-field-map';

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export async function PUT(request: NextRequest) {
  try {
    const { contactId, progress } = await request.json();

    if (!contactId || progress === undefined) {
      return NextResponse.json({ error: 'Missing contactId or progress' }, { status: 400 });
    }

    await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({
        id: contactId,
        [ONTRAPORT_FIELDS.onboardingProgress]: progress,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Onboarding] Failed to sync progress:', error);
    return NextResponse.json({ error: 'Failed to sync progress' }, { status: 500 });
  }
}
