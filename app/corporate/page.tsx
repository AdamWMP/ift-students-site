import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import Link from 'next/link'
import CorporateInquiryForm from '@/components/corporate-inquiry-form'

export const metadata = {
  title: 'Corporate & On-Site Course Delivery | Workshops, Retreats & Team Training',
  description:
    'Bring Image Fitness Training to your team. On-site Personal Trainer and Strength & Conditioning courses, bespoke workshops, international wellness retreats (Spain, Portugal, UK) and corporate CPD programmes delivered by Ireland\'s longest-running fitness educator. Register your interest.',
  keywords: [
    'corporate fitness training ireland',
    'on-site personal trainer course delivery',
    'corporate wellness programmes ireland',
    'bespoke fitness workshops ireland',
    'international wellness retreat delivery',
    'gym staff training ireland',
    'personal trainer cpd workshops',
    'corporate team training provider ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/corporate' },
  openGraph: {
    title: 'Corporate & On-Site Delivery | Image Fitness Training',
    description:
      'On-site courses, bespoke workshops, international retreats, corporate wellness. Delivered to your team at your location — Ireland, UK, Spain or wherever your team is.',
    url: 'https://imageft.ie/corporate',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'IFT Corporate & On-Site Delivery' }],
    type: 'website',
  },
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Corporate and On-Site Course Delivery',
  provider: {
    '@type': 'EducationalOrganization',
    name: 'Image Fitness Training',
    url: 'https://imageft.ie',
    telephone: '+353-1-902-3377',
    email: 'sales@imageft.ie',
  },
  areaServed: [
    { '@type': 'Country', name: 'Ireland' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Spain' },
    { '@type': 'Country', name: 'Portugal' },
  ],
  description:
    'Bespoke on-site delivery of REPs Ireland accredited fitness qualifications, standalone CPD workshops, and international wellness retreats for gym chains, hospitality groups, corporate teams and private clients.',
  serviceType: ['Corporate Training', 'On-Site Course Delivery', 'Wellness Retreat', 'CPD Workshop'],
}

const faqs = [
  {
    question: 'What exactly do you deliver on-site?',
    answer:
      'Three main engagement types. (1) Full REPs Ireland accredited Personal Trainer or Strength & Conditioning qualifications delivered at your location to your staff. (2) Standalone CPD workshops — nutrition, movement screening, pre/postnatal, programme design — typically one to three days. (3) International wellness retreats — multi-day residential programmes in locations such as Spain, Portugal and the UK, blending teacher training with retreat experience.',
  },
  {
    question: 'What is the minimum and maximum group size you can accommodate?',
    answer:
      'Our smallest bespoke engagements run with 4–6 participants (typically single-studio or small-team CPD). Full REPs qualifications work best with 10–20 participants per cohort. Retreats and conference-style workshops have hosted groups of 50+. There is no hard upper limit — larger engagements simply split into managed cohorts with multiple tutors.',
  },
  {
    question: 'How much does on-site delivery cost?',
    answer:
      'Pricing is proposal-based because it depends on three factors: qualification scope, group size, and whether the engagement is a one-off workshop or multi-weekend programme. For a baseline: single-day CPD workshops typically start from €2,500 all-in; full REPs PT qualifications delivered on-site start from €1,800 per participant (minimum cohort), with volume discounts above 15 participants. International retreats are priced individually.',
  },
  {
    question: 'Can you deliver internationally — including Spain?',
    answer:
      'Yes. We regularly deliver workshops and retreats across the UK, Spain, Portugal and other European locations. International delivery includes tutor travel and setup, retreat venue coordination (we have partner venues in the Costa del Sol and Algarve), and all REPs Ireland accredited materials. Lead time is typically 8–12 weeks for international engagements.',
  },
  {
    question: 'Is the qualification still REPs Ireland accredited when delivered on-site?',
    answer:
      "Yes. Every on-site qualification pathway we deliver is REPs Ireland accredited, EQF Level 3 and 4 certified, and includes the same practical and theory assessment as our standard public cohorts. Participants graduate with the same formally recognised qualification and are eligible to register with REPs Ireland on completion.",
  },
  {
    question: 'What is the typical lead time to get an on-site programme running?',
    answer:
      'Standalone one-day workshops: 3–4 weeks lead time. Multi-weekend CPD series: 6–8 weeks. Full REPs qualifications on-site: 10–12 weeks (to secure tutor allocation, accreditation paperwork, and participant onboarding). International retreats: 12 weeks minimum. If timing is urgent, flag it on the form — we will tell you honestly what is achievable.',
  },
  {
    question: 'Who are typical clients?',
    answer:
      'Gym chains and hotel groups wanting to upskill in-house staff, corporate wellness managers running employee programmes, private studios professionalising their team, hospitality groups building spa or retreat offerings, and private groups organising milestone residential training (hen weekends with a wellness angle, personal-development retreats, etc.). We can share redacted engagement examples on request.',
  },
]

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-charcoal-950 text-white">
      <MetaViewContent contentId="corporate-inquiry" contentName="Corporate &amp; On-Site Delivery" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Corporate', url: 'https://imageft.ie/corporate' },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-gold-500 uppercase tracking-[0.3em] text-xs mb-6 font-semibold">
            Corporate · On-Site Delivery · International Retreats
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            Bring Image Fitness Training
            <br />
            <span className="text-gold-500 italic">to your team</span>.
          </h1>
          <p className="text-lg md:text-xl text-charcoal-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            REPs Ireland accredited Personal Trainer and Strength &amp; Conditioning courses, bespoke
            workshops, international wellness retreats and corporate CPD — delivered on-site in Ireland,
            the UK, Spain, Portugal, or wherever your team is.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#inquiry" className="bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 shadow-2xl shadow-gold-500/20">
              Register Your Interest
            </Link>
            <a href="mailto:sales@imageft.ie?subject=Corporate%20enquiry" className="border border-gold-500/40 text-white hover:bg-gold-500/10 font-semibold py-4 px-10 rounded-lg text-lg transition-all">
              Email sales@imageft.ie
            </a>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center mt-12 text-sm text-charcoal-300">
            <span><span className="text-gold-500">✓</span> REPs Ireland Accredited</span>
            <span><span className="text-gold-500">✓</span> 16+ Years Delivering</span>
            <span><span className="text-gold-500">✓</span> 5,000+ Coaches Produced</span>
            <span><span className="text-gold-500">✓</span> International Delivery</span>
          </div>
        </div>
      </section>

      {/* FOUR SERVICE TYPES */}
      <section className="py-20 px-6 md:px-12 bg-charcoal-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            Four ways we work with <span className="text-gold-500 italic">organisations</span>
          </h2>
          <p className="text-charcoal-300 text-center max-w-2xl mx-auto mb-16">
            Every engagement is bespoke. These are the four shapes most of them take.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                tag: '01 · On-site qualifications',
                title: 'Full REPs qualifications, delivered at your location',
                body:
                  'A complete REPs Ireland accredited Personal Trainer or Strength & Conditioning qualification run on-site for your staff. Same accreditation, same assessments, same tutors — delivered on your floor instead of ours. Best for gym chains, hospitality groups and studio networks professionalising in-house teams.',
              },
              {
                tag: '02 · CPD workshops',
                title: 'One-day and weekend CPD workshops',
                body:
                  'Standalone upskilling — nutrition for personal trainers, movement screening, pre & post natal programming, business accelerator, AI for coaches. Typically 1 to 3 days on-site. Ideal for already-qualified teams who need a specific capability added.',
              },
              {
                tag: '03 · International retreats',
                title: 'Multi-day residential workshops in Spain, Portugal and beyond',
                body:
                  'Blend of teacher training and retreat experience, delivered at partner venues across the Costa del Sol, Algarve and other European locations. Suits studios building a signature annual event, corporate wellness programmes, and private groups organising milestone residential training.',
              },
              {
                tag: '04 · Corporate wellness',
                title: 'Ongoing corporate wellness programming',
                body:
                  'Multi-month engagements delivering regular workshops, group coaching, and 1-to-1 PT access for corporate teams. Best for mid-size and large employers running a serious employee wellness or benefits strategy.',
              },
            ].map((card) => (
              <div key={card.tag} className="bg-charcoal-950 p-8 rounded-2xl border-t-2 border-gold-500">
                <p className="text-gold-500 text-xs uppercase tracking-widest font-bold mb-3">{card.tag}</p>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-charcoal-300 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-14">
            Who <span className="text-gold-500 italic">we work with</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Gym chains &amp; studio groups', b: 'Upskill your in-house team to the REPs Ireland Level 4 standard without rotating staff through our public cohorts. Keep continuity, reduce overhead, strengthen retention.' },
              { t: 'Hotels &amp; hospitality', b: 'Build or deepen your spa, wellness or retreat offering with properly-qualified instructors and bespoke resident programming.' },
              { t: 'Corporate wellness', b: 'Deliver evidence-based workshops, group coaching and 1-to-1 PT access as part of your employee benefits or wellness strategy.' },
              { t: 'National sporting bodies', b: 'Train internal strength & conditioning coaches to a professional standard, delivered at your HQ with your athletes as the live context.' },
              { t: 'Private residential groups', b: 'Milestone residential wellness experiences — hen trips, 40th birthday retreats, friends-group training weeks, delivered in Spain, Portugal or Ireland.' },
              { t: 'Education providers', b: 'White-label or partner with us to offer REPs Ireland accredited pathways alongside your existing curriculum.' },
            ].map((c) => (
              <div key={c.t} className="bg-charcoal-900 rounded-2xl p-7 border border-charcoal-800">
                <h3 className="text-xl font-bold mb-3" dangerouslySetInnerHTML={{ __html: c.t }} />
                <p className="text-charcoal-300 text-sm leading-relaxed">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 px-6 md:px-12 bg-charcoal-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-14">
            How a corporate engagement <span className="text-gold-500 italic">actually works</span>
          </h2>
          {[
            { n: '01', t: 'Register your interest', b: 'Fill in the form below. One of our corporate team will come back within 1 business day with next-step options.' },
            { n: '02', t: 'Discovery call', b: 'A 30-minute conversation to understand what you are trying to achieve, who the audience is, and the practical constraints — budget, timeframe, location, group size.' },
            { n: '03', t: 'Scoping &amp; proposal', b: 'We write a bespoke proposal with scope, tutor allocation, delivery schedule, pricing and milestones. You review and shape it before anything is agreed.' },
            { n: '04', t: 'Delivery', b: 'Signed scope. Deposit. Tutor team confirmed. Participant onboarding. Delivery dates locked in and the engagement runs.' },
            { n: '05', t: 'Certification &amp; wrap', b: 'Participants complete assessments and receive their REPs Ireland accredited qualifications or workshop CPD certification. We hold a wrap debrief with your lead stakeholder on what worked and what to plan next.' },
          ].map((step) => (
            <div key={step.n} className="flex gap-6 py-7 border-b border-charcoal-800">
              <div className="text-gold-500 text-4xl font-bold min-w-[60px]">{step.n}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2" dangerouslySetInnerHTML={{ __html: step.t }} />
                <p className="text-charcoal-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.b }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="inquiry" className="py-24 px-6 md:px-12 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Register your <span className="text-gold-500 italic">interest</span>
            </h2>
            <p className="text-charcoal-300 text-lg max-w-xl mx-auto">
              Fill in the form and our corporate team will respond within 1 business day. Prefer to email?{' '}
              <a href="mailto:sales@imageft.ie?subject=Corporate%20enquiry" className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
                sales@imageft.ie
              </a>
              .
            </p>
          </div>

          <CorporateInquiryForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Corporate <span className="text-gold-500 italic">questions</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="bg-charcoal-900 rounded-xl p-6 group">
                <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center list-none">
                  <span>{f.question}</span>
                  <span className="text-gold-500 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-charcoal-300 mt-4 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
