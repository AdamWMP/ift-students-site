import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import PTCourseContent from '@/components/courses/pt-course-content'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'
import { CourseJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'

export const metadata = {
  title: 'Personal Trainer Course Ireland | REPs Accredited | Get Qualified in 8 Weeks',
  description: 'Become a certified Personal Trainer in 8–16 weeks with Image Fitness Training. REPs Ireland & EQF Level 3 & 4 accredited. The Cert from €2,800. Locations in Dublin, Cork, Galway, Limerick, Wexford & Belfast.',
  keywords: [
    'personal trainer course ireland',
    'personal trainer course dublin',
    'personal trainer qualification ireland',
    'pt course ireland',
    'fitness instructor course ireland',
    'reps ireland personal trainer',
    'eqf level 4 personal trainer',
    'personal trainer certification ireland',
    'become a personal trainer ireland',
    'pt course dublin',
    'personal trainer course cork',
  ],
  alternates: { canonical: 'https://imageft.ie/courses/personal-trainer' },
  openGraph: {
    title: 'Personal Trainer Course Ireland | REPs Accredited | Image Fitness Training',
    description: 'Get qualified as a Personal Trainer in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates. The Cert from €2,800.',
    url: 'https://imageft.ie/courses/personal-trainer',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}

export default function PTCoursePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <MetaViewContent contentId="personal-trainer" contentName="Personal Trainer Course" value={2800} />
      <CourseJsonLd
        name="Personal Trainer Course Ireland"
        description="Become a certified Personal Trainer in 8–16 weeks. REPs Ireland accredited, EQF Level 3 & 4 certified. Delivered across Dublin, Cork, Galway, Limerick, Wexford and Belfast."
        url="https://imageft.ie/courses/personal-trainer"
        price="2800"
        duration="P8W"
        educationalLevel="EQF Level 3 & 4"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Courses', url: 'https://imageft.ie/courses/personal-trainer' },
        { name: 'Personal Trainer Course', url: 'https://imageft.ie/courses/personal-trainer' },
      ]} />
      <FAQJsonLd faqs={[
        { question: 'How long does the Personal Trainer course take?', answer: 'The Personal Trainer course with Image Fitness Training takes 8–16 weeks depending on whether you study full-time or part-time. The intensive 8-week option is available in Dublin (Swords & Tallaght), Cork, Galway, Limerick, Wexford and Belfast.' },
        { question: 'Is the PT course accredited in Ireland?', answer: 'Yes. Image Fitness Training\'s Personal Trainer course is accredited by REPs Ireland (Register of Exercise Professionals) and is EQF Level 3 & 4 certified — the gold standard for fitness qualifications in Ireland and internationally.' },
        { question: 'How much does the Personal Trainer course cost?', answer: 'The Cert package starts from €2,800. The Career package starts from €3,500 and includes the Fitness Business Accelerator. Payment plans are available from a deposit of €350 spread over up to 10 months.' },
        { question: 'Can I work as a Personal Trainer in Ireland after this course?', answer: 'Yes. Our REPs Ireland accredited qualification is recognised by gyms and employers across Ireland and internationally. Most of our graduates secure their first paying clients within weeks of completing the course.' },
        { question: 'Where are the Personal Trainer course locations?', answer: 'Image Fitness Training delivers PT courses across 7 locations: Dublin (Swords & Tallaght), Cork, Galway, Limerick, Wexford, and Belfast. Theory is delivered online and practical workshops take place at each location.' },
      ]} />
      <Header />
      <PTCourseContent />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}