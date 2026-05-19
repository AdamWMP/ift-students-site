import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import PilatesCourseContent from './pilates-course-content'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'

export const metadata = {
  // Title rewrite per high-intent formula: [Keyword + Location] | [Qualifier] | [Benefit + Offer]
  title: 'Pilates Instructor Course Ireland | REPs Accredited | Mat + Reformer, From €1,800',
  description: 'Become a certified Pilates instructor in 5–11 weeks. REPs Ireland accredited Mat Pilates course with practical workshops in Swords, Tallaght, Cork, Galway, Tuam and Clare. Derry launching September 2026. Mat from €1,800; Mat + Reformer pathway available. Flexible learning options.',
  keywords: [
    'pilates instructor course ireland',
    'pilates teacher training ireland',
    'mat pilates course ireland',
    'reformer pilates course ireland',
    'pilates course dublin',
    'pilates course cork',
    'pilates course galway',
    'pilates course tuam',
    'pilates course clare',
    'pilates course derry',
    'reps ireland pilates',
    'become a pilates instructor ireland',
    'pilates qualification ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/courses/pilates' },
  openGraph: {
    title: 'Pilates Instructor Course Ireland | REPs Accredited | Mat + Reformer, From €1,800',
    description: 'Become a certified Pilates instructor in 5–11 weeks. REPs Ireland accredited. Mat + Reformer pathway. Workshops across Ireland.',
    url: 'https://imageft.ie/courses/pilates',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'Pilates Instructor Course Ireland — Image Fitness Training (REPs Accredited)' }],
    type: 'website',
  },
}

export default function PilatesCoursePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <MetaViewContent contentId="pilates" contentName="Pilates Instructor Course" />
      <Header />
      <PilatesCourseContent />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
