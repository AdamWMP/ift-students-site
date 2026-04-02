import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import PrePostNatalContent from './pre-post-natal-content'
import { AddonCheckout } from '@/components/checkout/addon-checkout'
import { ScrollToTop } from '@/components/scroll-to-top'
import { CourseJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export const metadata = {
  title: 'Pre & Post Natal Exercise Instructor Course Ireland | REPs Accredited | 16 CPD Points',
  description: 'Become a qualified Pre & Post Natal Exercise Instructor. Dual accredited by REPs Ireland & PD:Approval. 11 modules, 16 CPD points, 200+ page manual. Online, self-paced. Start anytime. €697 or 3 payments of €299.',
  keywords: [
    'pre and post natal course ireland',
    'prenatal exercise instructor ireland',
    'postnatal fitness certification ireland',
    'pre natal exercise course ireland',
    'post natal personal trainer ireland',
    'reps ireland pre postnatal',
    'pre post natal qualification ireland',
    'pregnancy fitness instructor ireland',
    'cpd points ireland fitness',
  ],
  alternates: { canonical: 'https://imageft.ie/courses/pre-post-natal' },
  openGraph: {
    title: 'Pre & Post Natal Exercise Instructor Course Ireland | Image Fitness Training',
    description: 'REPs Ireland & PD:Approval dual accredited. 11 modules, 16 CPD points. Online, self-paced. €697.',
    url: 'https://imageft.ie/courses/pre-post-natal',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}

export default function PrePostNatalPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <CourseJsonLd
        name="Pre & Post Natal Exercise Instructor Course Ireland"
        description="Become a qualified Pre & Post Natal Exercise Instructor. Dual accredited by REPs Ireland and PD:Approval. 11 comprehensive modules, 16 CPD points, 200+ page digital manual. Fully online, self-paced."
        url="https://imageft.ie/courses/pre-post-natal"
        price="697"
        educationalLevel="EQF Level 4 / REPs Ireland"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Post Grad Courses', url: 'https://imageft.ie/courses/pre-post-natal' },
        { name: 'Pre & Post Natal', url: 'https://imageft.ie/courses/pre-post-natal' },
      ]} />
      <Header />
      <PrePostNatalContent />
      <section id="checkout">
        <AddonCheckout courseId="ppn" />
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
