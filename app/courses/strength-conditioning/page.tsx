import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import SCCourseContent from '@/components/courses/sc-course-content'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Strength & Conditioning Course | Image Fitness Training',
  description: 'Become a certified S&C Coach with Active IQ Level 4 certification. Train athletes, build champions. 12-week program.',
}

export default function SCCoursePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <SCCourseContent />
      <section id="checkout">
        <AddonCheckout courseId="sc" />
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
