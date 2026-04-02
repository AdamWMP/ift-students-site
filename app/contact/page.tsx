import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import ContactContent from '@/components/contact/contact-content'

export const metadata = {
  title: 'Contact Image Fitness Training | Dublin +353 1 902 3377 | WhatsApp & Email',
  description: 'Contact Image Fitness Training. Call us on +353 1 902 3377, email hello@imageft.ie, or WhatsApp us directly. Locations across Dublin, Cork, Galway, Limerick, Wexford & Belfast.',
  keywords: [
    'contact image fitness training',
    'imageft contact',
    'image fitness training phone number',
    'fitness course enquiry ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/contact' },
  openGraph: {
    title: 'Contact Image Fitness Training | Ireland\'s #1 Fitness Educator',
    description: 'Call +353 1 902 3377, email hello@imageft.ie or WhatsApp. We\'re here to help you find the right course.',
    url: 'https://imageft.ie/contact',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
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
