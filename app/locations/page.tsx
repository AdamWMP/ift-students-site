import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import LocationsContent from './locations-content'

export const metadata = {
  title: 'Training Locations Ireland | Dublin Cork Galway Limerick | Image Fitness Training',
  description: 'Train at our 7 locations across Ireland: Dublin (Swords & Tallaght), Cork, Galway, Limerick, Wexford, and Belfast. Find your nearest training center.',
}

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <LocationsContent />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
