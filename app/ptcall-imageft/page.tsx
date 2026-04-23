import PtCallContent from './pt-call-content'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Book a Free Strategy Call | Image Fitness Training',
  description: 'Book a free 15-minute strategy call with the Image team. Get clear on which PT course is right for you, hear about upcoming intakes, and ask any questions.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Book Your Free PT Career Strategy Call',
    description: 'Choose your date. We\'ll map out your fastest path to becoming a qualified personal trainer in Ireland.',
    images: ['/og-ptcall.jpg'],
  },
}

export default function PtCallPage() {
  return (
    <>
      <PtCallContent />
      <ScrollToTop />
    </>
  )
}
