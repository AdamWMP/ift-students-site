import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import PilatesCourseContent from './pilates-course-content'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Pilates Instructor Course Ireland | REPs Accredited | Image Fitness Training',
  description: 'Become a certified Pilates instructor in 5-11 weeks. REPs Ireland accredited Mat Pilates course with practical workshops in Dublin, Cork, Galway. Flexible learning options.',
}

export default function PilatesCoursePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <PilatesCourseContent />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
