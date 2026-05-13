import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IFT · 3 Days To Go',
  robots: { index: false, follow: false },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className={montserrat.className}>{children}</div>
}
