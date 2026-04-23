import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { CheckoutContent } from '@/components/checkout/checkout-content'
import { CheckoutReturn } from '@/components/checkout/checkout-return'
import { ScrollToTop } from '@/components/scroll-to-top'
import { packages } from '@/lib/course-data'

export const metadata = {
  title: 'Book Your Course | Image Fitness Training',
  description: 'Choose your course, customise your payment plan, and secure your place with Image Fitness Training.',
}

export default function CheckoutAllPage({
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
        <CheckoutContent packageList={packages} minDepositOverride={300} />
      )}
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
