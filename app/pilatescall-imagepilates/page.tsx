import PilatesCallContent from './pilates-call-content'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata = {
  title: 'Book a Free Pilates Strategy Call | Image Pilates',
  description: 'Book a free 15-minute strategy call with the Image Pilates team. Get clear on which Pilates course is right for you, hear about upcoming intakes, and ask any questions.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Book Your Free Pilates Career Strategy Call',
    description: "Choose your date. We'll map out your fastest path to becoming a qualified Pilates instructor in Ireland.",
    images: ['/og-image.png'],
  },
}

export default function PilatesCallPage() {
  return (
    <>
      <PilatesCallContent />
      <ScrollToTop />
    </>
  )
}
