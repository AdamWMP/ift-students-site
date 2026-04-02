import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import BusinessAcceleratorContent from './business-accelerator-content'

export const metadata = {
  title: 'Fitness Business Accelerator Ireland | Launch Your PT Business in 7 Weeks',
  description: 'The Fitness Business Accelerator is the 7-week business launch programme for qualified PTs. Get paying clients, build your brand, and grow your fitness business. By Image Fitness Training.',
  keywords: [
    'fitness business accelerator ireland',
    'personal trainer business ireland',
    'fitness business course ireland',
    'how to get pt clients ireland',
    'fitness coaching business ireland',
    'launch fitness business ireland',
    'fitness entrepreneur ireland',
    'personal trainer marketing ireland',
    'fitness business mentorship ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/business-accelerator' },
  openGraph: {
    title: 'Fitness Business Accelerator | Launch Your PT Business | Image Fitness Training',
    description: '7-week business launch programme for qualified PTs. Get clients, build your brand, grow your income.',
    url: 'https://imageft.ie/business-accelerator',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
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
