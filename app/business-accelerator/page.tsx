import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import BusinessAcceleratorContent from './business-accelerator-content'

export const metadata = {
  title: 'Fitness Business Accelerator | Launch Your Coaching Career | Image Fitness Training',
  description: 'The 7-week career launch program for fitness professionals. Get your first paying clients, build your brand, and grow your coaching business.',
}

export default function BusinessAcceleratorPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <BusinessAcceleratorContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
