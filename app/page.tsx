import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personal Trainer & Pilates Courses Ireland | Get Qualified in 8–16 Weeks | Image Fitness Training',
  description: 'Ireland\'s #1 fitness educator. Become a certified Personal Trainer or Pilates Instructor in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates. Courses in Swords, Tallaght, Cork, Galway, Tuam, Limerick, Wexford. Derry launching September 2026.',
  keywords: [
    'personal trainer course ireland',
    'pilates instructor course ireland',
    'fitness instructor course ireland',
    'become a personal trainer ireland',
    'pt course ireland',
    'image fitness training',
    'imageft',
    'fitness certification ireland',
    'reps ireland accredited',
    'personal trainer qualification ireland',
  ],
  alternates: { canonical: 'https://imageft.ie' },
  openGraph: {
    title: 'Personal Trainer & Pilates Courses Ireland | Image Fitness Training',
    description: 'Ireland\'s #1 fitness educator. Get qualified in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates.',
    url: 'https://imageft.ie',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'Image Fitness Training — Ireland\'s #1 Fitness Educator (REPs Ireland Accredited)' }],
    type: 'website',
  },
}

import dynamic from 'next/dynamic'
import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import HeroSection from '@/components/home/hero-section'
import StatsSection from '@/components/home/stats-section'
import QuoteSection from '@/components/home/quote-section'
import PathwaysSection from '@/components/home/pathways-section'
import GraduatesBanner from '@/components/graduates-banner'
import { ScrollToTop } from '@/components/scroll-to-top'

// Below-the-fold sections are heavy (CourseCarousel: 418 LoC, ReputationSection:
// 287 LoC, EducationProviderSection: 211 LoC with autoplay video) and aren't
// visible during initial paint. Lazy-loading them cuts the initial JS+CSS
// shipped to mobile by ~60% — the visitor sees the hero + pathways instantly
// and the rest hydrates as they scroll.
const JourneySection = dynamic(() => import('@/components/home/journey-section'), { ssr: true })
const ResultsSection = dynamic(() => import('@/components/home/results-section'), { ssr: true })
const InvestmentSection = dynamic(() => import('@/components/home/investment-section'), { ssr: true })
const GraduateCommunitySection = dynamic(() => import('@/components/home/graduate-community-section'), { ssr: true })
const FinalCtaSection = dynamic(() => import('@/components/home/final-cta-section'), { ssr: true })
const TeamPreviewSection = dynamic(() => import('@/components/home/team-preview-section'), { ssr: true })
const GoogleReviewsSlider = dynamic(() => import('@/components/google-reviews-slider'), { ssr: true })
const ReputationSection = dynamic(() => import('@/components/home/reputation-section'), { ssr: true })
const EducationProviderSection = dynamic(
  () => import('@/components/home/education-provider-section').then(m => m.EducationProviderSection),
  { ssr: true },
)
const CourseCarouselSection = dynamic(
  () => import('@/components/home/course-carousel-section').then(m => m.CourseCarouselSection),
  { ssr: true },
)

export default function HomePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <HeroSection />
      {/* iftstudents.com graduates trust strip (avatars + "Join Ireland's largest...") */}
      <section className="py-8 sm:py-12 bg-charcoal-950 border-b border-charcoal-800/50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <GraduatesBanner />
        </div>
      </section>
      <QuoteSection
        lines={[
          { text: "Every fitness school in this country will take your money," },
          { text: "hand you a qualification, and disappear." },
        ]}
      />
      <div className="py-8 sm:py-12 bg-charcoal-950 border-y border-charcoal-800/30">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white">
            That&apos;s where <span className="text-gold">Image</span> gets going.
          </h3>
        </div>
      </div>
      <StatsSection />
      <PathwaysSection />
      {/* iftstudents.com "Most Popular Courses" carousel — sits right after the pathway pick */}
      <CourseCarouselSection />
      <JourneySection />
      <ResultsSection />
      {/* iftstudents.com reputation + Google reviews block (review-heavy) */}
      <ReputationSection />
      <GoogleReviewsSlider />
      <TeamPreviewSection />
      {/* Replaces the old JourneyVideoSection with the iftstudents.com laptop-mockup
          video layout — same /education-provider-video-compressed.mp4 asset. */}
      <EducationProviderSection />
      <InvestmentSection />
      <QuoteSection
        lines={[
          { text: "Others certify trainers." },
          { text: "We craft fitness entrepreneurs.", gold: true },
        ]}
      />
      <GraduateCommunitySection />
      <FinalCtaSection />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
