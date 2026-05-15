import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { MetaPixel } from '@/components/meta-pixel'
import BookingModalRoot from '@/components/booking-modal-root'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://imageft.ie'),
  title: {
    default: 'Image Fitness Training | Ireland\'s #1 Personal Trainer & Pilates Course',
    template: '%s | Image Fitness Training',
  },
  description: 'Get qualified as a Personal Trainer or Pilates Instructor in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates. Courses in Swords, Tallaght, Cork, Galway, Tuam, Limerick, Wexford. Derry launching September 2026.',
  keywords: [
    'personal trainer course ireland',
    'personal trainer course dublin',
    'fitness instructor course ireland',
    'pt course ireland',
    'pilates instructor course ireland',
    'strength and conditioning course ireland',
    'nutrition coach certification ireland',
    'fitness certification ireland',
    'image fitness training',
    'imageft',
    'reps ireland accredited',
    'pre and post natal course ireland',
    'fitness business accelerator',
  ],
  authors: [{ name: 'Image Fitness Training', url: 'https://imageft.ie' }],
  creator: 'Image Fitness Training',
  publisher: 'Image Fitness Training',
  category: 'Education',
  openGraph: {
    siteName: 'Image Fitness Training',
    title: 'Image Fitness Training | Ireland\'s #1 Personal Trainer Course',
    description: 'Get qualified as a Personal Trainer in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates across Swords, Tallaght, Cork, Galway, Tuam, Limerick, Wexford. Derry launching September 2026.',
    // Canonical share image: dark IFT logo (1600×1066) — used consistently
    // across all 4 properties for brand recognition. The previous og-image.png
    // (1200×630) is kept in public/ as a fallback.
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'Image Fitness Training — Ireland\'s #1 Fitness Educator (REPs Ireland Accredited)' }],
    type: 'website',
    locale: 'en_IE',
    url: 'https://imageft.ie',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Fitness Training | Ireland\'s #1 Personal Trainer Course',
    description: 'Get qualified as a Personal Trainer in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates.',
    images: [{ url: '/logo-dark.jpg', alt: 'Image Fitness Training — Ireland\'s #1 Fitness Educator' }],
    site: '@imageft',
    creator: '@imageft',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: { canonical: 'https://imageft.ie' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect + prefetch OnceHub CDN so the calendar modal opens instantly.
            embed.js itself is injected by BookingModalRoot on idle / first user
            interaction — loading it eagerly here wasted bandwidth for visitors
            who never open the booking modal. */}
        <link rel="preconnect" href="https://cdn.oncehub.com" crossOrigin="" />
        <link rel="preconnect" href="https://go.oncehub.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.oncehub.com" />
        <link rel="dns-prefetch" href="https://go.oncehub.com" />
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" async defer />
        <LocalBusinessJsonLd />
      </head>
      <body className="bg-charcoal-950 text-white antialiased" suppressHydrationWarning>
        <MetaPixel />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        {/* Singleton booking modal — one pre-warmed OnceHub iframe shared by
            every "Book Strategy Call" button. Pure visibility flip on open. */}
        <BookingModalRoot />
      </body>
    </html>
  )
}
