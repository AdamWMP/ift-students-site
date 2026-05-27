import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'
import { CourseJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import Link from 'next/link'

export const metadata = {
  title: 'The S&C Pro Coach Pathway | REPs Accredited Strength & Conditioning Postgrad | Image Fitness Training',
  description:
    "For qualified PTs ready to coach athletes. The S&C Pro Coach Pathway is Image Fitness Training's postgraduate strength & conditioning programme. REPs Ireland accredited, structured around real placement, business deployment and the Fitness Business Accelerator. Cork, Galway, Dublin, Limerick intakes 2026.",
  keywords: [
    'strength and conditioning course ireland',
    's&c course ireland postgrad',
    'reps ireland s&c qualification',
    'strength conditioning coach ireland',
    'become an s&c coach ireland',
    'postgrad strength conditioning ireland',
    'sport performance course ireland',
  ],
  alternates: { canonical: 'https://imageft.ie/sc-pro-coach-pathway' },
  openGraph: {
    title: 'The S&C Pro Coach Pathway — REPs Accredited Strength & Conditioning Postgrad',
    description: 'For qualified PTs ready to coach athletes. Structured around placement, not paperwork.',
    url: 'https://imageft.ie/sc-pro-coach-pathway',
    images: [{ url: '/logo-dark.jpg', width: 1600, height: 1066, alt: 'S&C Pro Coach Pathway — Image Fitness Training' }],
    type: 'website',
  },
}

const faqs = [
  { question: 'Do I need a PT qualification before I start the S&C Pro Coach Pathway?', answer: 'Yes — REPs Ireland Level 4 or equivalent. This is a postgraduate-level pathway designed for already-qualified Personal Trainers, sports coaches or related-discipline graduates adding a strength & conditioning specialism.' },
  { question: 'What sports does the placement cover?', answer: 'Placement options span GAA (hurling and football), rugby (academy and senior club level), soccer, athletics, combat sports, and individual Olympic-discipline coaching. You will be matched to a placement that fits your specialism track and geographic location.' },
  { question: 'Can I keep my current PT business running during the pathway?', answer: 'Yes — the pathway is delivered weekend-first to accommodate full-time PTs already running a client book. Most students continue their private PT clients throughout, then increase their S&C-rate work as placements deepen.' },
  { question: 'How does this compare to an MSc in Sport Performance or Sport Science degree?', answer: 'An MSc is academically deeper and takes 1–2 years. The S&C Pro Coach Pathway is practitioner-focused and structured around placement and deployment, designed to make you employable as an S&C coach. Many graduates pursue both — this pathway first, MSc later for academic depth.' },
  { question: 'What if I miss a weekend?', answer: 'One missed weekend can be made up at a different location or via recorded session plus a 1:1 catch-up with your tutor. Missing more than one triggers a conversation about cohort transfer — we will work it out.' },
  { question: 'What is the refund window?', answer: 'Full refund after weekend one. We would rather you leave on weekend one than complete a programme that is not the right fit for you.' },
]

export default function SCProCoachPathway() {
  return (
    <main className="min-h-screen bg-charcoal-950 text-white">
      <MetaViewContent contentId="sc-pro-coach-pathway" contentName="S&C Pro Coach Pathway" value={4200} />
      <CourseJsonLd
        name="S&C Pro Coach Pathway — Strength & Conditioning Postgraduate Programme"
        description="A postgraduate strength & conditioning programme for qualified PTs ready to coach athletes. Built around live placement with partner clubs, business deployment, and post-qualification mentorship."
        url="https://imageft.ie/sc-pro-coach-pathway"
        price="4200"
        duration="P18W"
        educationalLevel="Postgraduate"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'S&C Pro Coach Pathway', url: 'https://imageft.ie/sc-pro-coach-pathway' },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <Header />

      <div className="bg-gold-500 text-charcoal-950 text-center py-2.5 px-6 text-xs uppercase tracking-[0.3em] font-bold">For Qualified PTs Ready to Coach Athletes</div>

      <section className="relative overflow-hidden pt-24 pb-20 px-6 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">The S&amp;C Qualification That Actually Gets You<br /><span className="text-gold-500 italic">Coaching in Pro Sport</span></h1>
          <p className="text-lg md:text-xl text-charcoal-200 max-w-3xl mx-auto mb-10 leading-relaxed">18 weekends. Four cities. Real teams. Real mentorship. The only postgrad S&amp;C pathway in Ireland built around placement, not paperwork.</p>
          <Link href="#offer" className="inline-block bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 shadow-2xl shadow-gold-500/20">Get the Course Pack</Link>
          <p className="text-xs text-charcoal-400 mt-4">No spam · Sent immediately · 5,000+ coaches in our graduate community</p>
        </div>
      </section>

      <section className="bg-charcoal-900 py-10 px-6 md:px-12 border-y border-charcoal-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400 font-semibold mb-5">Our graduates coach across Ireland in</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-charcoal-300 italic">
            <span>GAA Inter-County Setups</span><span>·</span>
            <span>Rugby Academy Programmes</span><span>·</span>
            <span>Premier Division Soccer</span><span>·</span>
            <span>Olympic-Discipline Athletes</span><span>·</span>
            <span>Pro MMA &amp; Combat</span>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">Why most S&amp;C courses <span className="text-gold-500 italic">leave you stuck</span></h2>
          <p className="text-charcoal-300 text-center max-w-2xl mx-auto mb-14">If you have already qualified as a PT and tried to make the jump into S&amp;C, you have probably hit one of these three walls.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Wall 1 · All theory, no athletes', b: 'Online S&C diplomas hand you a certificate without ever putting you in front of a real team. Clubs notice immediately — you cannot bluff a session plan with athletes who train daily.' },
              { t: 'Wall 2 · No placement pathway', b: 'You qualify, you message 30 clubs, you hear back from none. The qualification opens the door technically, but with no warm intro you stay outside it.' },
              { t: 'Wall 3 · Tutors who have never coached pro', b: 'If the person teaching you S&C has never programmed for a county team or pro athlete, you are learning from a textbook. Athletes can tell within 5 minutes.' },
            ].map((w) => (
              <div key={w.t} className="bg-charcoal-900 p-7 rounded-2xl border-t-2 border-red-500/60">
                <h3 className="text-xl font-bold mb-3">{w.t}</h3>
                <p className="text-charcoal-300 leading-relaxed">{w.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal-900 py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">The IFT method: <span className="text-gold-500 italic">Programme · Coach · Deploy</span></h2>
          <p className="text-charcoal-300 text-center max-w-2xl mx-auto mb-14">A three-stage framework built backwards from one outcome: you walk into a club interview with case studies, not just a certificate.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Programme', b: 'Weeks 1–6. Master sport-specific periodisation — strength, speed, power, conditioning blocks for individual and team sport. You build three real programmes for real athletes by week 6.' },
              { n: '02', t: 'Coach', b: 'Weeks 7–12. Live placement with one of our partner clubs. You coach real sessions under supervision. By the end of week 12 you will have delivered 40+ hours of athlete contact time.' },
              { n: '03', t: 'Deploy', b: 'Weeks 13–18. Job-readiness sprint. CV, interview prep, club introductions through our network, and a documented case study from your placement to hand to any future employer.' },
            ].map((s) => (
              <div key={s.n} className="bg-charcoal-950 p-7 rounded-2xl border-l-4 border-gold-500">
                <div className="text-gold-500 text-4xl font-bold mb-3">{s.n}</div>
                <h3 className="text-2xl font-bold mb-3">{s.t}</h3>
                <p className="text-charcoal-300 leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-14">What you walk away <span className="text-gold-500 italic">actually able to do</span></h2>
          {[
            { t: 'Programme an inter-county team for a full season by week 12', b: 'Not a worksheet exercise. A real periodised plan, reviewed by a working S&C coach, ready to deploy.' },
            { t: 'Walk into a club interview with documented case studies', b: 'Most candidates show a CV. Our graduates show 40+ hours of supervised athlete coaching with measurable outcomes.' },
            { t: 'Charge €60–€90/hr instead of €25–€40/hr', b: 'S&C-qualified coaches typically command 2–3x the hourly rate of general PTs because they serve a higher-paying market.' },
            { t: 'Build a referral pipeline through our partner club network', b: 'You join a community of working coaches across Ireland. Placements come from inside the room, not from cold-emailing.' },
            { t: 'Hold your own in any technical conversation with a head coach', b: 'Sport-specific physiology, return-to-play protocols, load management — fluency that gets you taken seriously.' },
          ].map((b) => (
            <div key={b.t} className="flex gap-5 py-6 border-b border-charcoal-800">
              <div className="text-gold-500 text-3xl leading-none">✓</div>
              <div>
                <h4 className="text-lg md:text-xl font-bold mb-1">{b.t}</h4>
                <p className="text-charcoal-300">{b.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-charcoal-900 py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">What graduates have <span className="text-gold-500 italic">built</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[['16+', 'Years educating'], ['5,000+', 'Coaches graduated'], ['€44k+', 'Senior PT avg salary'], ['12mo', 'Post-qual community']].map(([n, l]) => (
              <div key={l} className="bg-charcoal-950 rounded-xl p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold-500">{n}</div>
                <div className="text-xs uppercase tracking-wider text-charcoal-300 mt-2">{l}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-charcoal-400 text-center mb-12 max-w-2xl mx-auto">Senior PT salary figure: ERI SalaryExpert Ireland 2026. Graduate counts are aggregate across all Image Fitness Training pathways since 2008.</p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">The <span className="text-gold-500 italic">18-weekend</span> curriculum</h2>
          {[
            ['Weekends 1–3', 'Foundations of S&C', 'Movement screen, force production, energy systems, periodisation models. Build your first athlete programme by weekend 3.'],
            ['Weekends 4–6', 'Programme Design Mastery', 'Strength, speed, power, conditioning blocks. Sport-specific demands analysis. Three full programmes built and peer-reviewed.'],
            ['Weekends 7–9', 'Placement Block A', 'Live coaching with partner club. Supervised by working S&C coach. 20 hours minimum of athlete contact time.'],
            ['Weekends 10–12', 'Placement Block B + Return-to-Play', 'Second placement rotation. Injury reduction, load management, return-to-play protocols. Real case study documented.'],
            ['Weekends 13–15', 'Specialism Track', 'Pick: team-sport S&C, individual-sport, youth development, or tactical/military. Deep dive in your chosen lane.'],
            ['Weekends 16–18', 'Deploy · Job-Ready Sprint', 'CV, case study packaging, club introductions through our network, mock interviews, final assessment.'],
          ].map(([w, t, b]) => (
            <details key={w} className="bg-charcoal-900 rounded-xl p-6 mb-2.5 group">
              <summary className="font-semibold cursor-pointer flex justify-between items-center list-none">
                <span><span className="text-gold-500 text-xs uppercase tracking-widest mr-3">{w}</span>{t}</span>
                <span className="text-gold-500 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-charcoal-300 mt-3 leading-relaxed">{b}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="offer" className="bg-charcoal-900 py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">The <span className="text-gold-500 italic">September 2026</span> intake</h2>
          <div className="bg-charcoal-950 border-2 border-gold-500 rounded-2xl p-8 md:p-10">
            <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-bold mb-4">What is included</p>
            <ul className="space-y-2.5 mb-8">
              {[
                ['18 weekends of in-person instruction', '€4,800 value'],
                ['Live placement with partner club', '€1,200 value'],
                ['12 months post-qualification mentorship community', '€1,800 value'],
                ['All course materials, assessment, REPs registration', '€600 value'],
                ['Lifetime access to the IFT S&C alumni community', 'Priceless'],
              ].map(([item, value]) => (
                <li key={item} className="flex justify-between items-baseline border-b border-charcoal-800 pb-2">
                  <span><span className="text-gold-500 mr-2">✓</span>{item}</span>
                  <span className="text-xs text-charcoal-400 ml-3">{value}</span>
                </li>
              ))}
            </ul>
            <div className="text-center pt-6 border-t-2 border-gold-500/40">
              <p className="text-xs uppercase tracking-widest text-charcoal-400 mb-1">Total programme fee</p>
              <p className="text-5xl md:text-6xl font-bold text-gold-500 leading-none">€4,200</p>
              <p className="text-charcoal-300 text-sm my-2">or 18 monthly payments of €245 · €0 deposit</p>
              <Link href="/ptcall-imageft" className="inline-block bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 mt-3">Reserve Your Seat</Link>
            </div>
            <div className="bg-gold-500/10 border-l-4 border-gold-500 p-5 rounded-r-lg mt-7">
              <p className="text-xs uppercase tracking-widest text-gold-500 font-bold mb-1">Refund window</p>
              <p className="text-charcoal-100 text-sm leading-relaxed">Sit the first weekend. If it is not the right fit, full refund — no questions, no friction. We would rather have you leave on weekend one than complete a programme that was not right for you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Common <span className="text-gold-500 italic">questions</span></h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="bg-charcoal-900 rounded-xl p-6 group">
                <summary className="font-semibold cursor-pointer flex justify-between items-center list-none">
                  <span>{f.question}</span>
                  <span className="text-gold-500 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-charcoal-300 mt-4 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-charcoal-900 to-charcoal-950 py-24 px-6 md:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-gold-500/10 border border-gold-500/40 px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] text-gold-500 font-bold mb-6">⚡ 12 of 24 seats remaining · Sept 2026 Cork intake</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Reserve your seat for September 2026</h2>
          <p className="text-charcoal-300 mb-8 text-lg max-w-xl mx-auto">€0 deposit on monthly plan. Refundable through weekend one. The next intake after this is March 2027.</p>
          <Link href="/ptcall-imageft" className="inline-block bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105">Reserve Your Seat</Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
