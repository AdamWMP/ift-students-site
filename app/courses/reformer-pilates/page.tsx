import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import ReformerPilatesCourseContent from './reformer-pilates-content'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'

export const metadata = {
  title: 'Reformer Pilates Course Ireland | 6-Day Teacher Training | Image Fitness Training',
  description: 'Become a confident Reformer Pilates instructor in just 6 days. Add-on course for Mat Pilates qualified instructors. Dublin & Cork locations. Early bird €700.',
}

export default function ReformerPilatesCoursePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <MetaViewContent contentId="reformer-pilates" contentName="Reformer Pilates Teacher Training" value={700} />
      <Header />
      <ReformerPilatesCourseContent />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
