import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import NutriCertContent from './nutricert-content'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import { ScrollToTop } from '@/components/scroll-to-top'
import { CourseJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'
import MetaViewContent from '@/components/meta-view-content'

export const metadata = {
  title: 'NutriCert Global — Nutrition Coach Certification Ireland | REPs Aligned | €750',
  description: "Ireland's most complete nutrition coaching certification. NutriCert Global combines sports nutrition science, coaching psychology & business. REPs Ireland aligned. 10 units, 100+ lessons, lifetime access. €750 upfront or 3 monthly payments.",
  keywords: [
    'nutrition coach certification ireland',
    'nutrition course ireland',
    'nutricert global',
    'sports nutrition certification ireland',
    'nutrition coaching qualification ireland',
    'online nutrition course ireland',
    'reps ireland nutrition',
    'nutrition coach ireland',
    'nutricert',
  ],
  alternates: { canonical: 'https://imageft.ie/courses/nutricert' },
  openGraph: {
    // Title kept verbatim from page title since it's already strong (keyword + qualifier + price)
    title: 'NutriCert Global — Nutrition Coach Certification Ireland | REPs Aligned | €750',
    description: "Ireland's most complete nutrition certification. Science, coaching psychology & business in one. 100+ lessons, lifetime access. €750 or pay in 3.",
    url: 'https://imageft.ie/courses/nutricert',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'NutriCert Global — Nutrition Coach Certification Ireland (REPs Aligned)' }],
    type: 'website',
  },
}

export default function NutriCertPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <MetaViewContent contentId="nutricert" contentName="NutriCert Global" value={750} />
      <CourseJsonLd
        name="NutriCert Global — Nutrition Coaching Certification Ireland"
        description="Ireland's most complete nutrition coaching certification. Combines sports nutrition science, coaching psychology and business training. REPs Ireland aligned. 10 units, 100+ lessons, lifetime access."
        url="https://imageft.ie/courses/nutricert"
        price="750"
        educationalLevel="Advanced / REPs Aligned"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Post Grad Courses', url: 'https://imageft.ie/courses/nutricert' },
        { name: 'NutriCert Global', url: 'https://imageft.ie/courses/nutricert' },
      ]} />
      <Header />
      <NutriCertContent />
      <section id="checkout">
        <AddonCheckout courseId="nutricert" />
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
