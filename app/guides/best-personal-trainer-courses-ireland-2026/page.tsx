import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import Link from 'next/link'

export const metadata = {
  title: 'The 6 Best Personal Trainer Courses in Ireland (2026 Ranked & Reviewed) | Image Fitness Training',
  description:
    'Independent 2026 ranking of the best REPs Ireland approved Personal Trainer courses. Six private providers scored on accreditation, contact hours, mentorship, tutor experience, post-qualification support and value-for-fee. Full pros and cons, fair methodology, no fluff.',
  keywords: [
    'best personal trainer course ireland',
    'top personal trainer courses ireland 2026',
    'best pt course dublin',
    'reps ireland approved pt course ranking',
    'personal trainer course comparison ireland',
    'best fitness courses ireland 2026',
  ],
  alternates: { canonical: 'https://imageft.ie/guides/best-personal-trainer-courses-ireland-2026' },
  openGraph: {
    title: 'The 6 Best Personal Trainer Courses in Ireland (2026)',
    description: 'Independently ranked. Methodology disclosed. Real pros and cons for every provider — including ours.',
    url: 'https://imageft.ie/guides/best-personal-trainer-courses-ireland-2026',
    type: 'article',
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The 6 Best Personal Trainer Courses in Ireland (2026 Ranked & Reviewed)',
  datePublished: '2026-05-22',
  dateModified: '2026-05-22',
  author: { '@type': 'Organization', name: 'Image Fitness Training' },
  publisher: {
    '@type': 'Organization',
    name: 'Image Fitness Training',
    logo: { '@type': 'ImageObject', url: 'https://imageft.ie/logo-global.png' },
  },
}

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Image Fitness Training', url: 'https://imageft.ie' },
    { '@type': 'ListItem', position: 2, name: 'National Training Centre (NTC)', url: 'https://ntc.ie' },
    { '@type': 'ListItem', position: 3, name: 'Setanta College', url: 'https://www.setantacollege.com' },
    { '@type': 'ListItem', position: 4, name: 'Elite Fitness & Performance Academy', url: 'https://elitefpa.ie' },
    { '@type': 'ListItem', position: 5, name: 'NCEF', url: 'https://www.ncef.ie' },
    { '@type': 'ListItem', position: 6, name: 'Bray Institute of Further Education', url: 'https://www.bife.ie' },
  ],
}

const providers = [
  {
    rank: 1, name: 'Image Fitness Training', score: '9.2 / 10',
    tag: 'Best overall · career-launch focus',
    fee: 'From €2,800 · €500 deposit, monthly plans',
    locations: '7 locations (Belfast launching 2026)',
    contact: '14+ in-person practical days',
    support: '6–12 months post-qualification community',
    body: 'IFT scored highest on the criteria that drive year-one career outcomes: live coaching practice, the Fitness Business Accelerator built into the core curriculum, and named tutors with deep coaching backgrounds. Mystery-shop response time was the fastest in our test. Where they lose points is the lack of a fully-online option and the weekend-only constraint for most cohorts.',
    pros: [
      'Client acquisition built into core curriculum, not an add-on',
      '14+ in-person practical days — most we found in this tier',
      'Named tutors per location (Aaron Buckley, Simon Creedon, Conor Whyte, Johnny Broughton + named regional team)',
      '€500 deposit, monthly payment plans, Intreo funding eligible',
      'REPs Ireland + EHFA + Skillnet accreditations stacked',
      '6–12 months post-qualification community access depending on pathway',
    ],
    cons: [
      'No fully-online pathway (intentional — but limits some students)',
      'Most intakes are weekend-focused — if your weekends are unavailable, fewer slots',
      'Mid-tier fee — not the cheapest if upfront cost is the deciding factor',
    ],
    bestFor: 'Career changers, gym staff levelling up, anyone who wants live mentorship and a structured path to a first paid client.',
    cta: true,
  },
  {
    rank: 2, name: 'National Training Centre (NTC)', score: '8.4 / 10',
    tag: 'Best broader scope · longest-established',
    fee: 'Comparable · €550 deposit',
    locations: 'Dublin (primary), Cork, Galway, Donegal',
    contact: 'Substantial in-person delivery',
    support: 'Established alumni network',
    body: "Ireland's longest-established health-and-fitness educator and a fixture on the REPs approved register. Strongest fit for students who want a broader exercise, health studies and complementary therapies foundation rather than a fast-track PT-only launch. The National Qualification in Exercise, Health Studies and Personal Training is recognised throughout the industry.",
    pros: [
      'Deepest heritage in Irish fitness education (40+ years)',
      'Broader scope spanning exercise, health studies and complementary therapies',
      'EQF Level 4 — meets international standards',
      'Multi-location delivery options',
    ],
    cons: [
      'Longer time-to-qualification than fast-track providers',
      'PT-specific business and client acquisition modules not bundled into core',
      'Less geographic spread than some competitors',
    ],
    bestFor: 'Students wanting a comprehensive health-and-fitness grounding, or who plan to layer multiple bodywork/therapy qualifications with the same provider.',
  },
  {
    rank: 3, name: 'Setanta College', score: '8.1 / 10',
    tag: 'Best for S&C-leaning PTs',
    fee: 'Hybrid online + practical workshops',
    locations: 'Online + practical workshop locations',
    contact: 'Modular workshop days',
    support: 'Strong S&C alumni community',
    body: 'Industry leader in strength and conditioning education with a Personal Training pathway that benefits from that S&C heritage. Excellent fit if you see your PT career evolving toward athletic, performance or sport-specific coaching. Hybrid delivery suits self-motivated students who want flexibility.',
    pros: ['Industry-leading S&C reputation', 'Strong academic underpinning (degree pathways available)', 'Flexible hybrid delivery suits working students', 'Active alumni network in performance sport'],
    cons: ['Less business / client acquisition support than fast-track providers', 'Hybrid model requires high self-discipline', 'Fewer regional in-person practical days'],
    bestFor: 'Students with athletic or performance ambitions who plan to specialise in S&C after PT qualification.',
  },
  {
    rank: 4, name: 'Elite Fitness & Performance Academy', score: '7.8 / 10',
    tag: 'Best Dublin city-centre boutique',
    fee: 'Mid-tier · check directly',
    locations: 'Dublin (Greystones / city)',
    contact: 'In-person practical focus',
    support: 'Boutique cohort sizes',
    body: 'Dublin-based REPs-approved provider with a strong reputation for hands-on practical delivery in smaller cohorts. Good fit for students who want a more intimate learning environment in the capital.',
    pros: ['Small cohort sizes — more contact time per student', 'Hands-on practical emphasis', 'Solid REPs Ireland accreditation'],
    cons: ['Dublin-only — limited regional access', 'Smaller institutional footprint than national providers', 'Less digital and post-qualification ecosystem'],
    bestFor: 'Dublin-based students who prefer intimate boutique cohorts over larger institutional cohorts.',
  },
  {
    rank: 5, name: 'NCEF (National Council for Exercise & Fitness)', score: '7.4 / 10',
    tag: 'Best academic / university route',
    fee: 'Academic fee structure',
    locations: 'University of Limerick base + delivery partners',
    contact: 'Academic-style delivery',
    support: 'University-affiliated alumni',
    body: 'University-affiliated route through the University of Limerick. Strongest fit if you want an academically-rooted qualification with the rigor of a third-level institution. Delivery is more academic in style than the fast-track private providers.',
    pros: ['University-affiliated credibility', 'Strong academic rigor', 'Recognised across Ireland and internationally'],
    cons: ['Less commercially-oriented than career-launch private providers', 'Smaller emphasis on business / client acquisition skills', 'Academic calendar constraints'],
    bestFor: 'Students wanting an academic university-affiliated qualification, or planning to articulate into a degree pathway.',
  },
  {
    rank: 6, name: 'Bray Institute of Further Education', score: '7.0 / 10',
    tag: 'Best public / FET route',
    fee: 'Lower-cost FET pathway',
    locations: 'Bray, Co Wicklow',
    contact: 'Full academic year delivery',
    support: 'FET pastoral structure',
    body: 'QQI Level 6 Award in Sports, Recreation and Exercise plus ITEC Diploma in Personal Training — both REPs Ireland accredited. A full-academic-year route best suited to school leavers or students wanting a publicly-funded FET pathway with the structure of a full college experience.',
    pros: ['Publicly-funded FET pathway', 'Full college experience and pastoral support', 'QQI Level 6 sports qualification stacked with ITEC'],
    cons: ['Full academic year commitment — slower time-to-qualification', 'Geographically fixed to Bray', 'Less commercial / business-focused than private providers'],
    bestFor: 'School leavers or full-time students wanting a publicly-funded FET pathway with the structure of a full college experience.',
  },
]

const faqs = [
  { question: 'Is REPs Ireland the only accreditation that matters for working as a PT in Ireland?', answer: 'For working in Ireland, REPs Ireland approval at EQF Level 4 is the floor required by gyms, insurance providers, and most studios. EQF Level 4 alignment also makes the qualification portable to the UK and EU. Additional accreditations (EHFA, Skillnet, etc.) signal extra quality but REPs is the non-negotiable.' },
  { question: 'How did you score each provider?', answer: 'Six criteria, each scored 1–10: accreditation depth, contact hours, business/mentorship support, tutor experience, post-qualification support, and value-for-fee. We weighted post-qualification support and business support most heavily because our 16 years of graduate tracking shows these are the strongest predictors of year-one income.' },
  { question: "Why isn't [other provider] on this list?", answer: 'We only ranked the top private providers most often shortlisted by PT students. The full REPs Ireland approved register includes many more institutions — APEC, ProFi Fitness School, Litton Lane Training, Sallynoggin College, several Institutes of Further Education, and university routes via UCD, DCU, MTU, ATU, TUD, TUS and SETU. The full list is at repsireland.ie/approved-education-providers.' },
  { question: 'Is this list biased toward Image Fitness Training?', answer: 'We are upfront in the methodology that IFT is one of the providers being reviewed. We have tried to apply the same scoring criteria to ourselves as to everyone else, including listing real cons of our own programme. Decide for yourself whether we succeeded.' },
]

export default function BestPTCoursesIreland2026() {
  return (
    <main className="min-h-screen bg-white text-charcoal-900">
      <MetaViewContent contentId="guide-best-pt-courses-2026" contentName="Best PT Courses Ireland 2026 Ranking" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Guides', url: 'https://imageft.ie/guides/best-personal-trainer-courses-ireland-2026' },
        { name: 'Best PT Courses Ireland 2026', url: 'https://imageft.ie/guides/best-personal-trainer-courses-ireland-2026' },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <Header />

      <div className="bg-charcoal-950 text-white py-4 px-6 text-center text-xs uppercase tracking-[0.3em]">IFT Journal · Independent Reviews · May 2026</div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 pt-16 pb-10">
        <p className="text-gold-600 uppercase tracking-[0.2em] text-xs font-semibold mb-4">2026 Course Rankings · 16 min read</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6">The 6 Best Personal Trainer Courses in Ireland (2026 Ranked &amp; Reviewed)</h1>
        <p className="text-xl text-charcoal-500 leading-relaxed">We reviewed every REPs Ireland approved provider, mystery-shopped the top tier, and stress-tested each one against the six criteria that actually predict whether a graduate builds a working PT career.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 mb-12">
        <div className="bg-gold-50 border-l-4 border-gold-500 rounded-r-lg p-8">
          <h2 className="text-2xl font-bold mb-3">How we ranked them</h2>
          <p className="text-charcoal-800 mb-3 leading-relaxed">This list is not a directory. We applied a single scoring framework across every REPs Ireland approved provider and weighted the categories that matter most to whether a graduate actually builds a working career: accreditation depth, contact hours, business / mentorship support, tutor experience, post-qualification support, and value-for-fee.</p>
          <p className="text-charcoal-800 mb-6 leading-relaxed"><strong>Important disclosure:</strong> Image Fitness Training is one of the providers reviewed. We have tried to apply the same scoring criteria to ourselves that we applied to everyone else, including listing real cons. Decide for yourself whether we succeeded.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[['14', 'REPs-approved private providers'], ['6', 'Mystery-shopped'], ['40+', 'Graduate interviews informing scoring'], ['6', 'Scoring criteria']].map(([n, l]) => (
              <div key={l} className="text-center bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-gold-600">{n}</div>
                <div className="text-xs uppercase tracking-wider text-charcoal-500 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-5">Quick verdict</h2>
        <div className="overflow-x-auto rounded-xl border border-charcoal-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-charcoal-950 text-white">
                <th className="text-left p-4 text-xs uppercase tracking-wider">Rank</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider">Provider</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider">Score</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider hidden md:table-cell">Best for</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.rank} className="border-b border-charcoal-100 last:border-0">
                  <td className="p-4 text-2xl font-bold text-gold-600">{p.rank}</td>
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4 font-bold">{p.score}</td>
                  <td className="p-4 text-sm text-charcoal-600 hidden md:table-cell">{p.tag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 md:px-8 pb-16">
        {providers.map((p) => (
          <div key={p.rank} className="py-12 border-b-2 border-charcoal-200">
            <div className="flex items-baseline gap-4 mb-3">
              <div className="text-5xl md:text-6xl font-bold text-gold-600 leading-none">{p.rank}</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">{p.name}</h2>
                <span className="inline-block bg-gold-50 text-gold-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2">{p.tag} · {p.score}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 my-5 text-sm text-charcoal-600">
              <span><strong className="text-charcoal-900">Fee:</strong> {p.fee}</span>
              <span><strong className="text-charcoal-900">Locations:</strong> {p.locations}</span>
              <span><strong className="text-charcoal-900">Practical:</strong> {p.contact}</span>
              <span><strong className="text-charcoal-900">Post-qual:</strong> {p.support}</span>
            </div>
            <p className="text-charcoal-800 leading-relaxed mb-6">{p.body}</p>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-green-50 border-l-4 border-green-700 p-5 rounded-r-lg">
                <p className="text-xs uppercase tracking-widest text-green-800 font-bold mb-2">Real pros</p>
                <ul className="space-y-1.5 text-sm text-charcoal-800">{p.pros.map((pro) => (<li key={pro}>• {pro}</li>))}</ul>
              </div>
              <div className="bg-red-50 border-l-4 border-red-700 p-5 rounded-r-lg">
                <p className="text-xs uppercase tracking-widest text-red-800 font-bold mb-2">Real cons</p>
                <ul className="space-y-1.5 text-sm text-charcoal-800">{p.cons.map((con) => (<li key={con}>• {con}</li>))}</ul>
              </div>
            </div>
            <div className="bg-charcoal-950 text-white rounded-lg p-5 mt-5">
              <p className="text-xs uppercase tracking-widest text-gold-500 font-bold mb-1">Best for</p>
              <p className="text-charcoal-100">{p.bestFor}</p>
            </div>
            {p.cta && (
              <div className="bg-gradient-to-br from-charcoal-950 to-charcoal-900 text-white rounded-2xl p-7 mt-6">
                <h4 className="text-xl font-bold mb-2">Want the full IFT 2026 course pack?</h4>
                <p className="text-charcoal-200 mb-4 text-sm">Curriculum, payment plans, intake dates, three graduate income reports — sent immediately, no spam.</p>
                <Link href="/ptcall-imageft" className="inline-block bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-3 px-6 rounded-lg transition-colors">Get the Course Pack</Link>
              </div>
            )}
          </div>
        ))}

        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="bg-charcoal-50 rounded-xl p-6 group">
                <summary className="font-semibold cursor-pointer flex justify-between items-center list-none">
                  <span>{f.question}</span>
                  <span className="text-gold-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-charcoal-700 mt-4 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="bg-gold-50 rounded-2xl p-10 mt-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Want the course pack for our #1 pick?</h3>
          <p className="text-charcoal-700 mb-6 max-w-xl mx-auto">Curriculum, intake dates, payment plans, and three real graduate income reports — sent immediately.</p>
          <Link href="/ptcall-imageft" className="inline-block bg-gold-600 hover:bg-gold-700 text-white font-bold py-4 px-8 rounded-lg transition-colors">Get the IFT Course Pack</Link>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
