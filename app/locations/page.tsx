import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import LocationsContent from './locations-content'

export const metadata = {
  title: 'PT Course Locations Ireland | Dublin, Cork, Galway, Limerick, Wexford, Belfast',
  description: 'Image Fitness Training operates across 7 locations in Ireland and Northern Ireland. Personal Trainer courses available in Dublin (Swords & Tallaght), Cork, Galway, Limerick, Wexford, and Belfast. Find your nearest academy.',
  keywords: [
    'personal trainer course locations ireland',
    'fitness course dublin swords',
    'fitness course dublin tallaght',
    'fitness course cork',
    'fitness course galway',
    'fitness course limerick',
    'fitness course wexford',
    'fitness course belfast',
    'pt course near me ireland',
    'image fitness training locations',
  ],
  alternates: { canonical: 'https://imageft.ie/locations' },
  openGraph: {
    title: 'PT Course Locations Ireland | Image Fitness Training',
    description: 'Personal Trainer courses across 7 locations: Dublin, Cork, Galway, Limerick, Wexford & Belfast.',
    url: 'https://imageft.ie/locations',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
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
