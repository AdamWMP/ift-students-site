import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import PTCourseContent from '@/components/courses/pt-course-content'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Personal Trainer Course | Image Fitness Training',
  description: 'Become a certified Personal Trainer in just 8 weeks. REPs accredited, EQF Level 3 & 4 certified. The Cert from €2,800, The Career from €3,500.',
}

export default function PTCoursePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <PTCourseContent />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}