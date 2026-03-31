import { NextRequest, NextResponse } from 'next/server';
import { ONTRAPORT_FIELDS, ONTRAPORT_TAGS } from '@/lib/ontraport-field-map';

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export async function POST(request: NextRequest) {
  try {
    const { contactId, signatureName, signedAt } = await request.json();

    if (!contactId || !signatureName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const timestamp = signedAt || Math.floor(Date.now() / 1000);

    // Update contact with contract signature fields
    const updateRes = await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({
        id: contactId,
        [ONTRAPORT_FIELDS.contractSigned]: `Signed by ${signatureName} on ${new Date(timestamp * 1000).toISOString().split('T')[0]}`,
      }),
    });

    const updateResult = await updateRes.json();
    if (updateResult.code !== 0) {
      console.error('[Contract] Failed to update contact:', updateResult);
      return NextResponse.json({ error: 'Failed to save contract' }, { status: 500 });
    }

    // Add "T&C Contract Signed" tag
    await fetch('https://api.ontraport.com/1/Contacts/tag', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({
        ids: String(contactId),
        add_list: ONTRAPORT_TAGS.tcContractSigned,
      }),
    });

    console.log(`[Contract] Contract signed by contact ${contactId}: "${signatureName}" at ${timestamp}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contract] Error:', error);
    return NextResponse.json({ error: 'Failed to process contract' }, { status: 500 });
  }
}
