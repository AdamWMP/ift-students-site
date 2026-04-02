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
import JourneyVideoSection from '@/components/home/journey-video-section'
import { ScrollToTop } from '@/components/scroll-to-top'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-charcoal-950">
      <Header />
      <HeroSection />
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
      <JourneySection />
      <ResultsSection />
      <JourneyVideoSection />
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
