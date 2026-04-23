import type { Metadata } from 'next';
import { PtCheckout } from '@/components/checkout/pt-checkout';

export const metadata: Metadata = {
  title: 'Book Your PT Course | Image Fitness Training',
  description: 'Choose your Personal Trainer course package, customise your payment plan, and secure your place.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * Standalone PT checkout — served at ptcheckout.imageft.ie
 * Wizard-style layout: Course → Payment → Details → Pay
 */
export default function PtCheckoutPage() {
  return <PtCheckout />;
}
