import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import ContactContent from '@/components/contact/contact-content'

export const metadata = {
  title: 'Contact Us | Image Fitness Training',
  description: 'Get in touch with Image Fitness Training. Find our locations, send us a message, or chat with us on WhatsApp.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <ContactContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
