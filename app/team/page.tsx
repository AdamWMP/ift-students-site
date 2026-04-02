import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import TeamContent from '@/components/team/team-content'

export const metadata = {
  title: 'Meet the Team | Expert Fitness Educators & Tutors | Image Fitness Training',
  description: 'Meet the expert tutors and educators behind Image Fitness Training. Ireland\'s most experienced fitness education team with 15+ years delivering REPs-accredited Personal Trainer and Pilates courses.',
  keywords: [
    'image fitness training team',
    'fitness educators ireland',
    'personal trainer tutors ireland',
    'pilates tutors ireland',
    'fitness course instructors ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/team' },
  openGraph: {
    title: 'Meet the Team | Image Fitness Training',
    description: "Ireland's most experienced fitness education team. 15+ years. 5,000+ graduates.",
    url: 'https://imageft.ie/team',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <TeamContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
