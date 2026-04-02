import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import AboutContent from '@/components/about/about-content'

export const metadata = {
  title: 'About Image Fitness Training | Ireland\'s #1 Fitness Educator Since 2008',
  description: 'Image Fitness Training has been Ireland\'s leading fitness educator since 2008. 15+ years experience, 5,000+ graduates, REPs Ireland accredited. Delivering Personal Trainer, Pilates, S&C, Nutrition & Pre-Natal courses nationwide.',
  keywords: [
    'image fitness training ireland',
    'about image fitness training',
    'imageft ireland',
    'fitness education ireland',
    'reps ireland accredited school',
    'personal trainer school ireland',
    'best pt course ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/about' },
  openGraph: {
    title: 'About Image Fitness Training | Ireland\'s #1 Fitness Educator',
    description: 'Ireland\'s leading fitness educator since 2008. 15+ years, 5,000+ graduates, REPs Ireland accredited.',
    url: 'https://imageft.ie/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
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
