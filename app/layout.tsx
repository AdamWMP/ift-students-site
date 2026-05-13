import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { MetaPixel } from '@/components/meta-pixel'
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
  description: 'Get qualified as a Personal Trainer or Pilates Instructor in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates. Locations in Dublin, Cork, Galway, Limerick & more.',
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
    description: 'Get qualified as a Personal Trainer in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates across Dublin, Cork, Galway, Limerick & more.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Image Fitness Training — Ireland\'s #1 Fitness Educator' }],
    type: 'website',
    locale: 'en_IE',
    url: 'https://imageft.ie',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Fitness Training | Ireland\'s #1 Personal Trainer Course',
    description: 'Get qualified as a Personal Trainer in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates.',
    images: [{ url: '/og-image.png', alt: 'Image Fitness Training — Ireland\'s #1 Fitness Educator' }],
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
        {/* Preconnect + prefetch OnceHub CDN so the calendar modal opens instantly */}
        <link rel="preconnect" href="https://cdn.oncehub.com" crossOrigin="" />
        <link rel="preconnect" href="https://go.oncehub.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.oncehub.com" />
        <script src="https://cdn.oncehub.com/cal/embed.js" async defer />
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" async defer />
        <LocalBusinessJsonLd />
      </head>
      <body className="bg-charcoal-950 text-white antialiased" suppressHydrationWarning>
        <MetaPixel />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
