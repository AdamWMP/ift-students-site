import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import CoursePathwayQuizContent from './course-pathway-quiz-content'

export const metadata = {
  title: 'Course Pathway Quiz | Career or Business? | Image Fitness Training',
  description: 'Take our free 60-second pathway quiz and find out whether you should start a new fitness career or launch your own fitness business. Personalised results in under 2 minutes.',
  keywords: [
    'fitness career or business quiz',
    'should i start a fitness business',
    'fitness career path ireland',
    'personal trainer vs business owner',
    'fitness business accelerator quiz',
  ],
  alternates: { canonical: 'https://imageft.ie/course-pathway-quiz' },
  openGraph: {
    title: 'Course Pathway Quiz | Career or Business? | Image Fitness Training',
    description: 'Find your perfect path in 60 seconds — a new fitness career or launching your own business.',
    url: 'https://imageft.ie/course-pathway-quiz',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}

export default function CoursePathwayQuizPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <CoursePathwayQuizContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
