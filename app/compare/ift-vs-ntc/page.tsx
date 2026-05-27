import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import Link from 'next/link'

export const metadata = {
  title: 'Image Fitness Training vs NTC — Honest 2026 Comparison for Irish PT Students',
  description:
    'Comparing Image Fitness Training and the National Training Centre for personal trainer qualifications in Ireland. Both REPs Ireland approved. Delivery format, fees, mentorship, locations and post-qualification support — side by side, fairly.',
  keywords: [
    'image fitness training vs ntc',
    'ntc vs image fitness training',
    'best personal trainer course dublin',
    'ntc personal trainer course review',
    'pt course comparison ireland',
    'national training centre alternative',
  ],
  alternates: { canonical: 'https://imageft.ie/compare/ift-vs-ntc' },
  openGraph: {
    title: 'IFT vs NTC — Honest 2026 Comparison',
    description: 'Two REPs Ireland approved providers, compared fairly. Which fits your situation?',
    url: 'https://imageft.ie/compare/ift-vs-ntc',
    type: 'article',
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Image Fitness Training vs NTC — Honest 2026 Comparison',
  datePublished: '2026-05-22',
  dateModified: '2026-05-22',
  author: { '@type': 'Organization', name: 'Image Fitness Training' },
  publisher: {
    '@type': 'Organization',
    name: 'Image Fitness Training',
    logo: { '@type': 'ImageObject', url: 'https://imageft.ie/logo-global.png' },
  },
}

const faqs = [
  { question: 'Are both Image Fitness Training and NTC REPs Ireland approved?', answer: 'Yes. Both providers appear on the official REPs Ireland approved education providers register. Both produce Personal Trainer qualifications that meet the EQF Level 4 standard required by Irish gyms and insurance providers.' },
  { question: 'Which has more locations across Ireland?', answer: 'Image Fitness Training delivers across Swords, Tallaght, Cork, Galway, Limerick, Wexford, with Belfast launching in 2026 — seven locations. The National Training Centre is primarily Dublin-based with a Cork hub, plus regional presence in Galway and Donegal.' },
  { question: 'How do the fees compare?', answer: 'Image Fitness Training Personal Trainer Course starts at €2,800 (The Cert) with €500 deposit and monthly payment plans, up to €4,800 for The Business pathway. NTC pricing is comparable; their personal trainer course requires a €550 deposit with payment plan options. Always check both providers directly for the most current fees.' },
  { question: 'Which one is better?', answer: "Neither universally — it depends on your situation. NTC has been Ireland's longest-established health-and-fitness educator and excels for students wanting a broader exercise, health and complementary therapies grounding. Image Fitness Training is more focused on career-launch outcomes with built-in business mentorship via the Fitness Business Accelerator. Pick based on whether you want broader scope (NTC) or faster career deployment (IFT)." },
]

export default function IFTvsNTCPage() {
  return (
    <main className="min-h-screen bg-white text-charcoal-900">
      <MetaViewContent contentId="compare-ift-vs-ntc" contentName="IFT vs NTC Comparison" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Compare', url: 'https://imageft.ie/compare/ift-vs-ntc' },
        { name: 'IFT vs NTC', url: 'https://imageft.ie/compare/ift-vs-ntc' },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <Header />

      <section className="max-w-4xl mx-auto px-6 md:px-8 pt-20 pb-10 text-center">
        <p className="text-gold-600 uppercase tracking-[0.2em] text-xs font-semibold mb-5">Course Comparison · May 2026</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Image Fitness Training vs NTC: An Honest Comparison for 2026 PT Students</h1>
        <p className="text-xl text-charcoal-500 max-w-2xl mx-auto leading-relaxed">Both REPs Ireland approved. Both produce qualified PTs. The right choice between them depends entirely on your situation. Here is where each genuinely fits.</p>
        <p className="text-sm text-charcoal-500 mt-6 pt-4 border-t border-charcoal-200 inline-block">Written by Image Fitness Training · Updated 22 May 2026</p>
      </section>

      <section className="bg-charcoal-50 py-16 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Why this comparison exists</h2>
          <p className="text-lg text-charcoal-700 mb-4 leading-relaxed">If you have searched &ldquo;NTC vs Image Fitness Training&rdquo; or &ldquo;NTC personal trainer course reviews,&rdquo; you are doing the right thing. Both providers are on the official REPs Ireland approved register. The National Training Centre is the longest-established health-and-fitness educator in Ireland. Image Fitness Training has produced over 5,000 coaches across 16+ years. Neither is a bad option — there is only a better-or-worse fit for your specific situation.</p>
          <p className="text-lg text-charcoal-700 leading-relaxed">We have written this page neutrally. Where NTC is the better choice for a particular type of student, we say so plainly. Where IFT is the stronger fit, we show why with evidence. Your job is to decide which description sounds more like you.</p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Side-by-side comparison</h2>
          <div className="overflow-x-auto rounded-2xl shadow-lg border border-charcoal-200 bg-white">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-charcoal-950 text-white text-left p-4 text-xs uppercase tracking-wider"></th>
                  <th className="bg-gold-500 text-charcoal-950 text-left p-4 text-xs uppercase tracking-wider font-bold">Image Fitness Training</th>
                  <th className="bg-charcoal-950 text-white text-left p-4 text-xs uppercase tracking-wider">National Training Centre</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['REPs Ireland accreditation', 'Approved (EQF Level 3 & 4)', 'Approved (EQF Level 4)'],
                  ['Years operating', '16+ years (founded 2008)', '40+ years (longest-established)'],
                  ['Total graduates produced', '5,000+', 'Tens of thousands across all programmes'],
                  ['Primary delivery format', 'Weekend, weekday + evenings, online blended', 'Daytime, evening, weekend options'],
                  ['Locations', 'Swords, Tallaght, Cork, Galway, Limerick, Wexford, Belfast (2026)', 'Dublin (primary), Cork, Galway, Donegal'],
                  ['Course duration', '8–16 weeks (PT Cert)', '12+ months (Nat. Qual. in Exercise, Health Studies & PT)'],
                  ['Scope', 'Focused PT + career launch', 'Broader exercise, health & complementary therapies'],
                  ['Business / client acquisition module', 'Built into core (Fitness Business Accelerator)', 'Not bundled into PT pathway'],
                  ['Post-qualification mentorship', '6–12 months community access', 'Alumni network'],
                  ['Starting fee', 'From €2,800', 'Comparable; deposit €550'],
                  ['Payment plans', 'From €500 deposit, monthly', 'Deposit + payment plan available'],
                  ['Intreo funding eligible', 'Yes (up to €1,000 off)', 'Funding routes available — check directly'],
                  ['Best fit', 'Career changers wanting fast deployment + business support', 'Students wanting broader health-and-fitness grounding'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-charcoal-100 last:border-0">
                    <td className="bg-charcoal-50 p-4 font-semibold text-charcoal-700 text-sm">{row[0]}</td>
                    <td className="p-4 text-charcoal-800 text-sm">{row[1]}</td>
                    <td className="p-4 text-charcoal-800 text-sm">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-charcoal-500 italic mt-4 max-w-3xl">All facts above sourced from the providers&apos; public websites and the REPs Ireland approved education providers register as of May 2026. Always verify directly with each provider for the most current pricing and intake schedules.</p>
        </div>
      </section>

      <section className="bg-charcoal-50 py-16 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Where each provider is the better fit</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-charcoal-200">
              <h3 className="text-2xl font-bold mb-4">NTC is the better fit if…</h3>
              <ul className="space-y-3 text-charcoal-700">
                <li className="flex gap-3"><span className="text-charcoal-400">→</span><span>You want a broader health-and-fitness education spanning exercise, complementary therapies and bodywork</span></li>
                <li className="flex gap-3"><span className="text-charcoal-400">→</span><span>You are based in central Dublin and prefer NTC&apos;s campus location</span></li>
                <li className="flex gap-3"><span className="text-charcoal-400">→</span><span>You value Ireland&apos;s longest-established health-and-fitness educator credentials specifically</span></li>
                <li className="flex gap-3"><span className="text-charcoal-400">→</span><span>You plan to layer multiple therapy/health qualifications and want one provider for all of them</span></li>
              </ul>
            </div>
            <div className="bg-charcoal-950 text-white rounded-2xl p-8 border-2 border-gold-500">
              <h3 className="text-2xl font-bold mb-4 text-gold-500">Image Fitness Training is the better fit if…</h3>
              <ul className="space-y-3 text-charcoal-200">
                <li className="flex gap-3"><span className="text-gold-500">→</span><span>You are changing careers and need live coaching practice plus a path to your first paid client</span></li>
                <li className="flex gap-3"><span className="text-gold-500">→</span><span>You want client acquisition and business-building built into the core curriculum</span></li>
                <li className="flex gap-3"><span className="text-gold-500">→</span><span>You live in Swords, Tallaght, Cork, Galway, Limerick, Wexford or Belfast (closer to a local intake)</span></li>
                <li className="flex gap-3"><span className="text-gold-500">→</span><span>You want flexible payment terms from €500 deposit and Intreo funding eligibility</span></li>
                <li className="flex gap-3"><span className="text-gold-500">→</span><span>You want to be qualified faster (8–16 weeks vs. 12+ month national qualification routes)</span></li>
                <li className="flex gap-3"><span className="text-gold-500">→</span><span>You want 6–12 months of post-qualification community access included</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal-50 py-16 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Common questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="bg-white rounded-xl p-6 group border border-charcoal-200">
                <summary className="font-semibold cursor-pointer flex justify-between items-center list-none">
                  <span>{f.question}</span>
                  <span className="text-gold-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-charcoal-700 mt-4 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal-950 text-white py-20 px-6 md:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Still not sure which fits?</h2>
          <p className="text-charcoal-200 mb-8 text-lg">Book a free 15-minute course consultation. We will talk through your situation honestly — and if NTC is the better fit for you, we will tell you so on the call.</p>
          <Link href="/ptcall-imageft" className="inline-block bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105">Book a Strategy Call</Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
