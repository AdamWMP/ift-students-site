import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import ReformerPilatesCourseContent from './reformer-pilates-content'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'

export const metadata = {
  // Title rewrite per high-intent formula: [Keyword + Location] | [Qualifier] | [Benefit + Offer]
  title: 'Reformer Pilates Course Ireland | 6-Day Teacher Training | Mat-Qualified Add-On, From €700',
  description: 'Become a confident Reformer Pilates instructor in just 6 days. Add-on course for Mat Pilates qualified instructors. Workshops in Dublin & Cork. Early bird from €700.',
  keywords: [
    'reformer pilates course ireland',
    'reformer pilates teacher training ireland',
    'reformer pilates instructor course',
    'reformer pilates certification ireland',
    'reformer pilates course dublin',
    'reformer pilates course cork',
    'reformer pilates add on ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/courses/reformer-pilates' },
  openGraph: {
    title: 'Reformer Pilates Course Ireland | 6-Day Teacher Training | From €700',
    description: 'Become a Reformer Pilates instructor in 6 days. Add-on for Mat-qualified instructors. Dublin & Cork. Early bird from €700.',
    url: 'https://imageft.ie/courses/reformer-pilates',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'Reformer Pilates Course Ireland — 6-Day Teacher Training' }],
    type: 'website',
  },
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
