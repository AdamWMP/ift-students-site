import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Image Fitness Training | Ireland\'s #1 Fitness Educator',
  description: 'Become a certified Personal Trainer or S&C Coach. 15+ years experience, 5000+ graduates, REPs accredited. Start your fitness career today.',
  keywords: 'personal trainer course ireland, fitness instructor course, strength and conditioning, pt course dublin, fitness certification ireland',
  openGraph: {
    title: 'Image Fitness Training | Ireland\'s #1 Fitness Educator',
    description: 'Become a certified Personal Trainer or S&C Coach. 15+ years experience, 5000+ graduates.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Fitness Training',
    description: 'Ireland\'s #1 Fitness Educator',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className="bg-charcoal-950 text-white antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
