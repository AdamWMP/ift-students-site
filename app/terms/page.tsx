import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import TermsContent from './terms-content'

export const metadata = {
  title: 'Terms & Conditions | Image Fitness Training',
  description: 'Terms and conditions for Image Fitness Training courses, enrollment, and services.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <TermsContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
