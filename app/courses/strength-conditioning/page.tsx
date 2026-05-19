import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import SCCourseContent from '@/components/courses/sc-course-content'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import { ScrollToTop } from '@/components/scroll-to-top'
import { CourseJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'
import MetaViewContent from '@/components/meta-view-content'

export const metadata = {
  // Title rewrite per high-intent formula: [Keyword + Location] | [Qualifier] | [Benefit + Offer]
  title: 'Strength & Conditioning Course Ireland | Active IQ Level 4 | 12 Weeks, €1,500',
  description: 'Become a certified Strength & Conditioning Coach in Ireland. Active IQ Level 4 + REPs Ireland accredited. 12-week intensive: live online theory + practical weekends in Dublin. €1,500, pay monthly.',
  keywords: [
    'strength and conditioning course ireland',
    'strength conditioning certification ireland',
    'sc coach ireland',
    'active iq level 4 ireland',
    'reps ireland strength conditioning',
    'strength and conditioning coach ireland',
    'performance coach certification ireland',
    'athletic training course ireland',
    's&c course ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/courses/strength-conditioning' },
  openGraph: {
    title: 'Strength & Conditioning Course Ireland | Active IQ Level 4 | 12 Weeks, €1,500',
    description: 'REPs Ireland accredited S&C Coach certification. 12-week intensive. Live online theory + Dublin practicals. €1,500, pay monthly.',
    url: 'https://imageft.ie/courses/strength-conditioning',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'Strength & Conditioning Course Ireland — Active IQ Level 4 (REPs Accredited)' }],
    type: 'website',
  },
}

export default function SCCoursePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <MetaViewContent contentId="strength-conditioning" contentName="Strength & Conditioning Course" value={1500} />
      <CourseJsonLd
        name="Strength & Conditioning Coach Certification Ireland"
        description="Active IQ Level 4 Strength & Conditioning Coach certification. REPs Ireland accredited. 12-week intensive programme with live online theory and practical weekends in Dublin."
        url="https://imageft.ie/courses/strength-conditioning"
        price="1500"
        duration="P12W"
        educationalLevel="Active IQ Level 4"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Post Grad Courses', url: 'https://imageft.ie/courses/strength-conditioning' },
        { name: 'Strength & Conditioning', url: 'https://imageft.ie/courses/strength-conditioning' },
      ]} />
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
