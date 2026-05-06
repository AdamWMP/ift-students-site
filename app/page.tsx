import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personal Trainer & Pilates Courses Ireland | Get Qualified in 8–16 Weeks | Image Fitness Training',
  description: 'Ireland\'s #1 fitness educator. Become a certified Personal Trainer or Pilates Instructor in 8–16 weeks. REPs Ireland accredited. 5,000+ graduates. Locations in Dublin, Cork, Galway, Limerick, Wexford & Belfast.',
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Image Fitness Training — Ireland\'s #1 Fitness Educator' }],
    type: 'website',
  },
}

import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import HeroSection from '@/components/home/hero-section'
import StatsSection from '@/components/home/stats-section'
import QuoteSection from '@/components/home/quote-section'
import PathwaysSection from '@/components/home/pathways-section'
import JourneySection from '@/components/home/journey-section'
import ResultsSection from '@/components/home/results-section'
import InvestmentSection from '@/components/home/investment-section'
import GraduateCommunitySection from '@/components/home/graduate-community-section'
import FinalCtaSection from '@/components/home/final-cta-section'
import TeamPreviewSection from '@/components/home/team-preview-section'
// Reputation/review-heavy panels imported from the iftstudents.com layout.
// JourneyVideoSection has been replaced by EducationProviderSection (laptop
// mockup with the better-laid-out video).
import GraduatesBanner from '@/components/graduates-banner'
import GoogleReviewsSlider from '@/components/google-reviews-slider'
import ReputationSection from '@/components/home/reputation-section'
import { EducationProviderSection } from '@/components/home/education-provider-section'
import { CourseCarouselSection } from '@/components/home/course-carousel-section'
import { ScrollToTop } from '@/components/scroll-to-top'

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
