import { Metadata } from 'next';
import { OnboardingContent } from '@/components/onboarding/onboarding-content';

export const metadata: Metadata = {
  title: 'Welcome | Image Fitness Training',
  description: 'Complete your onboarding to get started with Image Fitness Training.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { contactId: string };
}

async function fetchContact(contactId: string) {
  const apiKey = process.env.ONTRAPORT_API_KEY;
  const appId = process.env.ONTRAPORT_APP_ID;

  if (!apiKey || !appId) return null;

  try {
    const res = await fetch(`https://api.ontraport.com/1/Contact?id=${contactId}`, {
      headers: {
        'Api-Key': apiKey,
        'Api-Appid': appId,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const text = await res.text();
    let result;
    try { result = JSON.parse(text); } catch { return null; }
    if (result.code !== 0 || !result.data) return null;

    const c = result.data;
    return {
      id: c.id,
      firstName: c.firstname || '',
      lastName: c.lastname || '',
      email: c.email || '',
      phone: c.sms_number || '',
      courseLocation: c.f2291 || '',
      courseTimetable: c.f2292 || '',
      courseStartDate: c.f2293 || '',
      coursePrice: c.f2294 || '',
      coursePaymentPlan: c.f2296 || '',
      courseFees: c.f2456 || '',
      packageName: c.f1428 || '',
      totalCost: c.f1544 || '',
      courseQualifications: c.f2290 || '',
      onboardingProgress: c.f2603 || '',
      tcSignedDate: c.f2344 || '',       // "Contracted Signed" — existing field
      tcSignatureName: '',                // Extracted from tcSignedDate text
      depositAmount: c.f2604 || '',
      monthlyAmount: c.f2605 || '',
      paymentMonths: c.f2606 || '',
      firstInstalmentDate: c.f2607 || '',
    };
  } catch (error) {
    console.error('[Onboarding] Failed to fetch contact:', error);
    return null;
  }
}

export default async function OnboardingPage({ params }: PageProps) {
  const contact = await fetchContact(params.contactId);

  if (!contact) {
    return (
      <main className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-zinc-400">This onboarding link may have expired or is invalid.</p>
          <a href="https://www.imageft.ie" className="text-gold hover:underline mt-4 inline-block">
            Return to Image Fitness Training
          </a>
        </div>
      </main>
    );
  }

  return <OnboardingContent contact={contact} />;
}
