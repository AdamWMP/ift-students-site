import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import AboutContent from '@/components/about/about-content'

export const metadata = {
  title: 'About Us | Image Fitness Training',
  description: 'Learn about Image Fitness Training - Ireland\'s #1 fitness educator with 15+ years experience and 5,000+ graduates.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <AboutContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
