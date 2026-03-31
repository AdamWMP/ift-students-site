import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import TeamContent from '@/components/team/team-content'

export const metadata = {
  title: 'Meet the Team | Image Fitness Training',
  description: 'Meet our world-class team of fitness educators, tutors, and industry professionals.',
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
