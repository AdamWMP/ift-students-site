import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import { UnifiedCheckout } from '@/components/checkout/unified-checkout';
import { CheckoutReturn } from '@/components/checkout/checkout-return';
import { ScrollToTop } from '@/components/scroll-to-top';

export const metadata: Metadata = {
  title: 'Enrol | Image Fitness Training',
  description:
    'Enrol on any Image Fitness Training course — choose your pathway, customise your payment plan, apply a coupon, and secure your place.',
};

export const dynamic = 'force-dynamic';

export default function EnrolPage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string; session_id?: string };
}) {
  const isSuccess = searchParams.success === 'true';

  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      {isSuccess ? (
        <CheckoutReturn sessionId={searchParams.session_id} />
      ) : (
        <UnifiedCheckout />
      )}
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
