import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'
import { CourseJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import Link from 'next/link'

export const metadata = {
  title: 'Personal Trainer Course for Career Changers Ireland | REPs Accredited | From €2,800, Pay Monthly',
  description:
    'Leaving a 9-to-5? Get qualified as a Personal Trainer in 8–16 weeks with Image Fitness Training. REPs Ireland + EQF Level 3 & 4 accredited. Weekend & evening intakes. From €2,800, €500 deposit, pay monthly. Up to €1,000 Intreo funding if eligible. Swords, Tallaght, Cork, Galway, Limerick, Wexford & Belfast.',
  keywords: [
    'personal trainer course for career changers ireland',
    'change career to personal trainer ireland',
    'become a personal trainer second career',
    'pt course weekend ireland',
    'pt course pay monthly ireland',
    'intreo personal trainer course funding',
    'reps ireland accredited pt course',
    'eqf level 4 personal trainer ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/personal-trainer-course-career-change' },
  openGraph: {
    title: 'The Personal Trainer Course for People Leaving a 9-to-5 | Image Fitness Training',
    description:
      'Built for career changers. Weekend delivery, €500 deposit, full mentorship, 5,000+ graduates. REPs Ireland accredited.',
    url: 'https://imageft.ie/personal-trainer-course-career-change',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'PT Course for Career Changers — Image Fitness Training' }],
    type: 'website',
  },
}

const intakes2026 = [
  { location: 'Swords, Dublin', date: '6 Sept 2026', format: '16-week Sundays', seats: '9 of 24 left' },
  { location: 'Tallaght, Dublin', date: '26 Oct 2026', format: '8-week evenings + Sat', seats: '14 of 24 left' },
  { location: 'Cork', date: '24 Oct 2026', format: '16-week Saturdays', seats: '18 of 24 left' },
  { location: 'Galway', date: '1 Oct 2026', format: '8-week intensive', seats: '11 of 24 left' },
  { location: 'Limerick', date: '24 Oct 2026', format: '16-week Saturdays', seats: '20 of 24 left' },
  { location: 'Wexford', date: '6 Sept 2026', format: '16-week Sundays', seats: '15 of 24 left' },
  { location: 'Belfast', date: 'Launching Autumn 2026', format: 'Register interest', seats: 'Founding cohort' },
]

const faqs = [
  {
    question: 'Can I really change career to personal training while keeping my current job?',
    answer:
      'Yes — most career changers on our course do exactly that. The 16-week Saturday and Sunday intakes were designed specifically for full-time professionals who need to keep their income while qualifying. Roughly 7 in 10 students on those intakes stay in their original role until weeks 10–14, then transition.',
  },
  {
    question: 'Is the qualification recognised if I want to work as a PT in Ireland?',
    answer:
      'Yes. The Image Fitness Training Personal Trainer Course is REPs Ireland accredited (Register of Exercise Professionals) and EQF Level 3 & 4 certified. That is the qualification floor required by Irish gyms, studios and PT insurance providers, and it transfers to the UK and EU.',
  },
  {
    question: 'I was made redundant — is there funding to help with the course fee?',
    answer:
      'If you are signing on with the Department of Social Protection, you may be eligible for up to €1,000 off through the Intreo Office. We also run a €500 deposit with monthly payment plans so no career changer has to find the full fee upfront. Our admissions team will walk you through what you qualify for on a free call.',
  },
  {
    question: 'I am in my 40s or 50s — am I too old to start this career?',
    answer:
      'No. Our 2025 graduate cohort spanned ages 22 to 61. Career changers in their 40s and 50s often outperform younger graduates in year one — credibility with clients, professional network, and life experience compound into a faster client base.',
  },
  {
    question: 'How quickly can I start earning as a PT after qualifying?',
    answer:
      'Most graduates take on their first paid client during the course, not after it. The Career and Business pathways include the Fitness Business Accelerator, where you build your client acquisition plan as you study. Average year-one earnings for graduates who follow the FBA framework are €27,000–€38,000; senior PTs (4+ years) average €44,000+ per ERI SalaryExpert 2026 data.',
  },
  {
    question: 'What is the difference between The Cert, The Career and The Business pathway?',
    answer:
      'The Cert (€2,800) gets you qualified — REPs accredited, three certifications, full curriculum. The Career (€3,500) adds live placement, Fitness Business Accelerator Phase 1, and 6 months community access. The Business (€4,800) is the full 24-week pathway including branding, professional photoshoot, AI for Coaches workshop, and FBA Phase 2. Career changers usually start on The Career or The Business.',
  },
  {
    question: 'What if I decide it is not for me after starting?',
    answer:
      'Full refund window after the first weekend. We would rather you leave on weekend one than complete a course that is not the right fit. After that, partial refund options apply depending on how far through you are.',
  },
]

export default function CareerChangePTPage() {
  return (
    <main className="min-h-screen bg-charcoal-950 text-white">
      <MetaViewContent
        contentId="pt-career-change"
        contentName="PT Course for Career Changers"
        value={2800}
      />
      <CourseJsonLd
        name="Personal Trainer Course for Career Changers"
        description="Career-change pathway to a REPs Ireland accredited Personal Trainer qualification. 8–16 weeks, weekend delivery, €500 deposit, pay monthly. Intreo funding eligible. Delivered across Dublin, Cork, Galway, Limerick, Wexford and Belfast."
        url="https://imageft.ie/personal-trainer-course-career-change"
        price="2800"
        duration="P16W"
        educationalLevel="EQF Level 3 & 4"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://imageft.ie' },
          { name: 'PT Course for Career Changers', url: 'https://imageft.ie/personal-trainer-course-career-change' },
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      <Header />

      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-gold-500 uppercase tracking-[0.3em] text-xs mb-6 font-semibold">
            For Career Changers · REPs Ireland Accredited · 5,000+ Graduates
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            The Personal Trainer Course
            <br />
            for People Leaving a <span className="text-gold-500 italic">9-to-5</span>
          </h1>
          <p className="text-lg md:text-xl text-charcoal-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            Weekend and evening intakes. €500 deposit, pay monthly. Up to €1,000 Intreo funding if eligible.
            Walk into your first paid PT session inside 16 weeks — taught in Swords, Tallaght, Cork, Galway,
            Limerick, Wexford and Belfast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/ptcall-imageft"
              className="bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 shadow-2xl shadow-gold-500/20"
            >
              Book a Free Strategy Call
            </Link>
            <Link
              href="/career-quiz"
              className="border border-gold-500/40 text-white hover:bg-gold-500/10 font-semibold py-4 px-10 rounded-lg text-lg transition-all"
            >
              Take the Career Quiz
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center mt-12 text-sm text-charcoal-300">
            <span><span className="text-gold-500">✓</span> REPs Ireland Accredited</span>
            <span><span className="text-gold-500">✓</span> EQF Level 3 &amp; 4</span>
            <span><span className="text-gold-500">✓</span> EHFA Approved</span>
            <span><span className="text-gold-500">✓</span> Skillnet Ireland</span>
            <span><span className="text-gold-500">✓</span> Intreo Funding Eligible</span>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-charcoal-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            Built for the way <span className="text-gold-500 italic">career changers</span> actually qualify
          </h2>
          <p className="text-charcoal-300 text-center max-w-2xl mx-auto mb-16">
            We have been running career-change cohorts since 2008. Three things matter more than anything else.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-charcoal-950 p-8 rounded-2xl border-t-2 border-gold-500">
              <div className="text-gold-500 text-3xl mb-4">◆</div>
              <h3 className="text-2xl font-bold mb-3">Keep Your Salary While You Qualify</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Saturday-only, Sunday-only, and evening-plus-Saturday intakes. 16 weeks of structured weekend
                delivery means you do not have to leave your current job until you are ready.
              </p>
            </div>
            <div className="bg-charcoal-950 p-8 rounded-2xl border-t-2 border-gold-500">
              <div className="text-gold-500 text-3xl mb-4">◆</div>
              <h3 className="text-2xl font-bold mb-3">€500 Deposit, Pay Monthly, €0 Interest</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Spread the fee from €2,800 across the duration of your course. Up to €1,000 off via Intreo if you
                are on social welfare. Refund window through weekend one — no questions.
              </p>
            </div>
            <div className="bg-charcoal-950 p-8 rounded-2xl border-t-2 border-gold-500">
              <div className="text-gold-500 text-3xl mb-4">◆</div>
              <h3 className="text-2xl font-bold mb-3">Job-Ready, Not Just Qualified</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Most providers stop when the certificate prints. We start there. The Fitness Business Accelerator
                builds your client acquisition plan as part of the course, so you can take your first paid
                session in week 6, not month 6.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            What you will <span className="text-gold-500 italic">actually do</span> across the 16 weeks
          </h2>
          {[
            { n: '01', title: 'Weeks 1–3 · Foundations + Coaching Confidence', body: 'Anatomy, biomechanics, programme design. By weekend 3 you will have delivered your first full coached session — supervised, with structured feedback from your tutor.' },
            { n: '02', title: 'Weeks 4–6 · Your First Paying Client', body: 'Fitness Business Accelerator sprint. We work with you on outreach, pricing, onboarding and pricing your sessions. You will have a paid client by week 6 if you follow the framework.' },
            { n: '03', title: 'Weeks 7–10 · Specialism + Niche', body: 'Choose a lane: strength, fat loss, pre/postnatal, older adults, hybrid online coaching. Niching early is the single biggest predictor of year-one income.' },
            { n: '04', title: 'Weeks 11–14 · Business Build-Out', body: 'Pricing, booking systems, social content, gym-floor vs studio vs home-visit models. You leave with a working business, not a certificate sitting on the shelf.' },
            { n: '05', title: 'Weeks 15–16 · Final Assessment + Launch', body: 'Practical assessment, theory exam, REPs registration. Then 6–12 months of post-qualification mentorship community access — depending on your pathway.' },
          ].map((step) => (
            <div key={step.n} className="flex gap-6 py-7 border-b border-charcoal-800">
              <div className="text-gold-500 text-4xl font-bold min-w-[60px]">{step.n}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-charcoal-300 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-charcoal-950">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-4xl font-bold italic leading-tight mb-6">
            &ldquo;Every other provider stops when the certificate prints.
            <br />
            <span className="text-gold-500">That is when we start.</span>&rdquo;
          </p>
          <p className="text-charcoal-400 text-sm">— Image Fitness Training · Where Coaches Are Made</p>
        </div>
      </section>

      <section id="intakes" className="py-20 px-6 md:px-12 bg-charcoal-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            2026 intakes <span className="text-gold-500 italic">near you</span>
          </h2>
          <div className="bg-charcoal-950 rounded-2xl overflow-hidden border border-charcoal-800">
            <table className="w-full">
              <thead>
                <tr className="bg-charcoal-950 border-b border-charcoal-800">
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-gold-500">Location</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-gold-500">Start Date</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-gold-500 hidden md:table-cell">Format</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-gold-500">Seats</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {intakes2026.map((i) => (
                  <tr key={i.location} className="border-b border-charcoal-800 last:border-0">
                    <td className="p-4 font-semibold">{i.location}</td>
                    <td className="p-4 text-charcoal-300">{i.date}</td>
                    <td className="p-4 text-charcoal-300 hidden md:table-cell">{i.format}</td>
                    <td className="p-4 text-gold-500 text-sm font-semibold">{i.seats}</td>
                    <td className="p-4">
                      <Link href="/enrol" className="bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-2 px-4 rounded text-sm transition-colors">Apply</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Career changer <span className="text-gold-500 italic">questions</span>
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

      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get the <span className="text-gold-500 italic">2026 Course Pack</span>
          </h2>
          <p className="text-charcoal-300 text-lg mb-10 max-w-xl mx-auto">
            Full curriculum, payment plan options, intake dates near you, and three real graduate income
            reports. Sent immediately. No spam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ptcall-imageft" className="bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105">Book a Strategy Call</Link>
            <a href="https://wa.me/35319023377" className="border border-gold-500/40 text-white hover:bg-gold-500/10 font-semibold py-4 px-10 rounded-lg text-lg transition-all">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
