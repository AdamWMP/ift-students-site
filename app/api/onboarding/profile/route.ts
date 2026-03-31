import { NextRequest, NextResponse } from 'next/server';
import { ONTRAPORT_FIELDS } from '@/lib/ontraport-field-map';

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId } = body;

    if (!contactId) {
      return NextResponse.json({ error: 'Missing contact ID' }, { status: 400 });
    }

    // Map form fields to Ontraport custom field IDs
    const updateData: Record<string, string> = {
      id: contactId,
    };

    // Certificate name
    if (body.certificateFirstName) updateData[ONTRAPORT_FIELDS.certificateFirstName] = body.certificateFirstName;
    if (body.certificateLastName) updateData[ONTRAPORT_FIELDS.certificateLastName] = body.certificateLastName;

    // Contact (update main fields too)
    if (body.phone) updateData.sms_number = body.phone;

    // Shipping address — store as combined text in certificate address field + standard address fields
    const addressParts = [body.shippingFullName, body.shippingLine1, body.shippingLine2, body.shippingCity, body.shippingCounty, body.shippingEircode].filter(Boolean);
    if (addressParts.length > 0) {
      updateData[ONTRAPORT_FIELDS.shippingAddress] = addressParts.join('\n');
    }
    if (body.shippingLine1) updateData[ONTRAPORT_FIELDS.addressLine1] = body.shippingLine1;
    if (body.shippingLine2) updateData[ONTRAPORT_FIELDS.addressLine2] = body.shippingLine2;
    if (body.shippingCity) updateData[ONTRAPORT_FIELDS.city] = body.shippingCity;
    if (body.shippingCounty) updateData[ONTRAPORT_FIELDS.state] = body.shippingCounty;
    if (body.shippingEircode) updateData[ONTRAPORT_FIELDS.zip] = body.shippingEircode;

    // Personal
    if (body.dateOfBirth) updateData[ONTRAPORT_FIELDS.dateOfBirth] = String(Math.floor(new Date(body.dateOfBirth).getTime() / 1000));
    if (body.gender) updateData[ONTRAPORT_FIELDS.gender] = body.gender;
    if (body.tshirtSize) updateData[ONTRAPORT_FIELDS.tshirtSize] = body.tshirtSize;

    // Emergency contact
    if (body.nextOfKinName) updateData[ONTRAPORT_FIELDS.nextOfKinName] = body.nextOfKinName;
    if (body.nextOfKinPhone) updateData[ONTRAPORT_FIELDS.nextOfKinPhone] = body.nextOfKinPhone;
    if (body.nextOfKinRelationship) updateData[ONTRAPORT_FIELDS.nextOfKinRelationship] = body.nextOfKinRelationship;

    // Medical
    if (body.medicalConditions) updateData[ONTRAPORT_FIELDS.medicalConditions] = body.medicalConditions;

    // Background
    if (body.industry) updateData[ONTRAPORT_FIELDS.industry] = body.industry;
    if (body.occupation) updateData[ONTRAPORT_FIELDS.occupation] = body.occupation;
    if (body.referralSource) updateData[ONTRAPORT_FIELDS.referralSource] = body.referralSource;
    if (body.referralName) updateData[ONTRAPORT_FIELDS.referralName] = body.referralName;
    if (body.motivation) updateData[ONTRAPORT_FIELDS.motivation] = body.motivation;
    if (body.additionalNotes) updateData[ONTRAPORT_FIELDS.additionalNotes] = body.additionalNotes;

    const res = await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify(updateData),
    });

    const result = await res.json();

    if (result.code !== 0) {
      console.error('[Profile] Failed to update contact:', result);
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }

    console.log(`[Profile] Profile updated for contact ${contactId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Profile] Error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
