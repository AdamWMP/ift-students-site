import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import CareerQuizContent from './career-quiz-content'

export const metadata = {
  title: 'Coaching Career Quiz | Find Your Perfect Course | Image Fitness Training',
  description: 'Take our 2-minute quiz to discover which fitness qualification is right for you. Personal Trainer, Pilates Instructor, S&C Coach, or Nutrition specialist.',
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
