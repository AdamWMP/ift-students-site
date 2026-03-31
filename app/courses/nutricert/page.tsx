import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import NutriCertContent from './nutricert-content'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'NutriCert Global — Advanced Nutrition Coach Certification Ireland | Image Fitness Training',
  description: "Ireland's only nutrition certification that combines science, coaching psychology, and business training. 10 units, 100+ lessons, lifetime access. €750 or pay in 3.",
}

export default function NutriCertPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <NutriCertContent />
      <section id="checkout">
        <AddonCheckout courseId="nutricert" />
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
