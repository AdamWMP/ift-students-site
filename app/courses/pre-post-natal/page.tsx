import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import PrePostNatalContent from './pre-post-natal-content'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Pre & Post Natal Exercise Instructor Course Ireland | REPs Accredited | Image Fitness Training',
  description: 'Specialize in pre and postnatal fitness. Online certification with 16 CPD points. Dual accredited by REPs Ireland and PD:Approval. Start anytime.',
}

export default function PrePostNatalPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <PrePostNatalContent />
      <section id="checkout">
        <AddonCheckout courseId="ppn" />
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
