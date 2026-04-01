import Header from '@/components/header'
import Footer from '@/components/footer'
import ThankYouContent from './thank-you-content'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Thank You | Image Fitness Training',
  description: 'Your enquiry has been received. Here\'s what happens next.',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <ThankYouContent />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
