import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import SCCourseContent from '@/components/courses/sc-course-content'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import { ScrollToTop } from '@/components/scroll-to-top'
import { CourseJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'
import MetaViewContent from '@/components/meta-view-content'

export const metadata = {
  title: 'Strength & Conditioning Course Ireland | Active IQ Level 4 | REPs Accredited',
  description: 'Become a certified Strength & Conditioning Coach in Ireland. Active IQ Level 4, REPs Ireland accredited. 12-week intensive programme. Live online theory + practical weekends in Dublin. €1,500.',
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
    title: 'Strength & Conditioning Course Ireland | Active IQ Level 4 | Image Fitness Training',
    description: 'REPs Ireland accredited S&C Coach certification. 12-week intensive. Live online theory + Dublin practicals. €1,500.',
    url: 'https://imageft.ie/courses/strength-conditioning',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
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
