import { NextRequest, NextResponse } from 'next/server';

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get('id');

  if (!contactId) {
    return NextResponse.json({ error: 'Contact ID required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.ontraport.com/1/Contact?id=${contactId}`, {
      method: 'GET',
      headers: ontraportHeaders(),
    });

    const result = await res.json();

    if (result.code !== 0 || !result.data) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const contact = result.data;

    return NextResponse.json({
      id: contact.id,
      firstName: contact.firstname || '',
      lastName: contact.lastname || '',
      email: contact.email || '',
      phone: contact.sms_number || '',
      // Course fields
      course: contact.f1834 || '',
      courseLocation: contact.f2291 || '',
      courseTimetable: contact.f2292 || '',
      courseStartDate: contact.f2293 || '',
      coursePrice: contact.f2294 || '',
      coursePaymentPlan: contact.f2296 || '',
      courseFees: contact.f2456 || '',
      packageName: contact.f1428 || '',
      totalCost: contact.f1544 || '',
      courseQualifications: contact.f2290 || '',
      // Onboarding progress
      onboardingProgress: contact.f2621 || '',
      // Contract
      tcSignedDate: contact.f2622 || '',
      tcSignatureName: contact.f2623 || '',
      // Structured payment data
      depositAmount: contact.f2624 || '',
      monthlyAmount: contact.f2625 || '',
      paymentMonths: contact.f2626 || '',
      firstInstalmentDate: contact.f2627 || '',
    });
  } catch (error) {
    console.error('[Onboarding] Failed to fetch contact:', error);
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
  }
}
