import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { CheckoutContent } from '@/components/checkout/checkout-content'
import { CheckoutReturn } from '@/components/checkout/checkout-return'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Book Your Course | Image Fitness Training',
  description: 'Choose your Personal Trainer course package, customise your payment plan, and secure your place with Image Fitness Training.',
  robots: 'noindex, nofollow',
}

const PRICE_OVERRIDES = {
  'pro-coach': {
    price: 2600,
    originalPrice: 2800,
    minDeposit: 350,
  },
  'complete-coach': {
    price: 3200,
    originalPrice: 3500,
    minDeposit: 350,
  },
}

export default function SpecialCheckoutPage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string; session_id?: string }
}) {
  const isSuccess = searchParams.success === 'true';

  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      {isSuccess ? (
        <CheckoutReturn sessionId={searchParams.session_id} />
      ) : (
        <CheckoutContent priceOverrides={PRICE_OVERRIDES} />
      )}
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
