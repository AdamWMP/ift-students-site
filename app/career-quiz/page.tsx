import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import CareerQuizContent from './career-quiz-content'

export const metadata = {
  title: 'Which Fitness Course Is Right for You? | Free 2-Minute Career Quiz',
  description: 'Not sure which fitness course to choose? Take our free 2-minute quiz and discover whether Personal Trainer, Pilates, S&C, or Nutrition coaching is the right path for your career.',
  keywords: [
    'which fitness course ireland',
    'personal trainer or pilates ireland',
    'fitness career quiz ireland',
    'best fitness course ireland',
    'fitness career path ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/career-quiz' },
  openGraph: {
    title: 'Which Fitness Course Is Right for You? | Free Career Quiz | Image Fitness Training',
    description: 'Take our 2-minute quiz and find the perfect fitness qualification for your career.',
    url: 'https://imageft.ie/career-quiz',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}

export default function CareerQuizPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <CareerQuizContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
