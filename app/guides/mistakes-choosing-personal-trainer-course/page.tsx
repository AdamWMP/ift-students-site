import Header from '@/components/header'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import MetaViewContent from '@/components/meta-view-content'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import Link from 'next/link'

export const metadata = {
  title: '7 Mistakes People Make Choosing a PT Course in Ireland (and How to Avoid Them) | IFT Journal',
  description:
    'Most people who quit personal training in year one did not pick the wrong career — they picked the wrong course. Here are the 7 mistakes I see repeatedly across 16 years of Irish fitness education, and the simple checks that prevent each one.',
  keywords: [
    'mistakes choosing personal trainer course ireland',
    'how to pick a pt course ireland',
    'best personal trainer course ireland',
    'pt course mistakes to avoid',
    'reps ireland approved providers list',
    'is online pt course worth it',
  ],
  alternates: { canonical: 'https://imageft.ie/guides/mistakes-choosing-personal-trainer-course' },
  openGraph: {
    title: '7 Mistakes People Make Choosing a PT Course in Ireland',
    description: 'The 7 mistakes that send 60% of new PTs back to office work — and how to avoid each one.',
    url: 'https://imageft.ie/guides/mistakes-choosing-personal-trainer-course',
    type: 'article',
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '7 Mistakes People Make Choosing a PT Course in Ireland (and How to Avoid Them)',
  datePublished: '2026-05-22',
  dateModified: '2026-05-22',
  author: { '@type': 'Organization', name: 'Image Fitness Training', url: 'https://imageft.ie' },
  publisher: {
    '@type': 'Organization',
    name: 'Image Fitness Training',
    logo: { '@type': 'ImageObject', url: 'https://imageft.ie/logo-global.png' },
  },
  mainEntityOfPage: 'https://imageft.ie/guides/mistakes-choosing-personal-trainer-course',
}

const mistakes = [
  { id: 'm1', num: '01', title: 'Choosing the cheapest provider', body: 'A €399 online course looks like a steal next to a €2,800 in-person one — until you realise the €399 course does not get you insured, does not get you hired by any reputable Irish gym, and does not get you a paying client. Cost-per-certificate is the wrong metric. Cost-per-first-€5k-earned is the right one.', fix: 'Ask every provider: "What is your graduate income at 12 months?" If they do not track it or will not share it, that tells you everything.' },
  { id: 'm2', num: '02', title: 'Ignoring REPs Ireland accreditation', body: 'If the course is not on the REPs Ireland approved provider list, you cannot get PT insurance, cannot work in any reputable gym, and cannot transfer to the UK or EU. The certificate is real — it just does not unlock the doors you need it to.', fix: 'Check repsireland.ie/approved-education-providers before you put down a deposit on anything. Three minutes saves you €1,000 and a year.' },
  { id: 'm3', num: '03', title: 'Picking online-only with no practical assessment', body: 'Coaching is a contact skill. You can read about cueing a squat 100 times and still mis-cue your first client. Courses without in-person practical assessment graduate qualified-on-paper coaches who freeze the moment a real human is in front of them.', fix: 'Insist on at least 8 in-person practical days with structured supervisor feedback. Anything less and you will learn the hard way on a paying client.' },
  { id: 'm4', num: '04', title: 'Assuming the qualification equals clients', body: 'This is the single biggest reason new PTs go back to office work. The qualification gets you permission to coach. It does nothing to teach you how to find people who will pay you to coach. Of graduates who quit the industry inside 18 months, the dominant reason cited is "could not build a client base."', fix: 'Pick a course that includes — not as an add-on, but built into the core curriculum — client acquisition, pricing, and a structured first-client plan. If the course ends at "you are qualified, good luck," you are doing the hard part alone.' },
  { id: 'm5', num: '05', title: 'Skipping nutrition CPD', body: 'Roughly 70% of the questions a new client asks are food-related. If your answer is "I am not qualified to talk about that," they will find someone who can — and that someone usually becomes their PT.', fix: "Stack a Level 4 or Level 5 nutrition CPD on top of your PT qualification. Image Fitness Training's NutriCert is one option; standalone CPDs from other accredited providers work too." },
  { id: 'm6', num: '06', title: 'Not checking who actually teaches the course', body: 'The brochure photo is not always the tutor. Some providers use a single famous coach for marketing and a rotating roster of contractors for actual delivery. You are paying for the people who will be in the room with you on a Saturday — not for the website.', fix: 'Ask for the named tutors at your specific intake location. Ask how many years each has been coaching, not just teaching. Look them up.' },
  { id: 'm7', num: '07', title: 'Forgetting the post-qualification support gap', body: 'Months 4 to 8 after qualification are the loneliest part of a new PT career. Initial momentum has faded, client base is thin, and the course you paid for has stopped returning your messages. Most providers consider their job done at the certificate. The result: a meaningful share of qualified PTs are out of the industry within 18 months.', fix: 'Pick a provider that includes at least 6–12 months of post-qualification mentorship community. Community matters more than curriculum once you are out in the field.' },
]

const faqs = [
  { question: 'Which PT course providers in Ireland are REPs Ireland approved?', answer: 'As of May 2026 the approved private providers include Image Fitness Training, National Training Centre (NTC), Setanta College, Elite Fitness & Performance Academy, ProFi Fitness School, Litton Lane Training, NCEF, NCEHS, and APEC. University and FET routes include UCD, DCU, MTU, ATU, TUD, TUS, SETU and several Institutes of Further Education. The full updated list is at repsireland.ie/approved-education-providers.' },
  { question: 'Is an online-only PT course worth it in Ireland?', answer: 'Only if it is on the REPs Ireland approved list AND includes in-person practical assessment days. Pure online courses without practical assessment leave you qualified on paper but unprepared the first time you coach a real client. Most graduates who took the online-only route and switched to in-person tell us they felt unready.' },
  { question: 'Can I claim funding or tax relief for a PT course in Ireland?', answer: 'If you are on social welfare and signing on with the Department of Social Protection, you may be eligible for up to €1,000 off via the Intreo Office. Skillnet Ireland funding applies in some cases. Tax relief on tuition fees may apply through Revenue.ie depending on the qualification level. Always check directly with Revenue and Intreo for your individual eligibility.' },
]

export default function MistakesListicle() {
  return (
    <main className="min-h-screen bg-white text-charcoal-900">
      <MetaViewContent contentId="guide-mistakes-pt-course" contentName="7 Mistakes Choosing PT Course Listicle" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://imageft.ie' },
        { name: 'Guides', url: 'https://imageft.ie/guides/mistakes-choosing-personal-trainer-course' },
        { name: '7 Mistakes Choosing a PT Course', url: 'https://imageft.ie/guides/mistakes-choosing-personal-trainer-course' },
      ]} />
      <FAQJsonLd faqs={faqs} />

      <Header />

      <div className="bg-charcoal-950 text-white py-4 px-6 text-center text-xs uppercase tracking-[0.3em]">
        IFT Journal · Course Selection · Updated 22 May 2026
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-16 pb-8">
        <p className="text-gold-600 uppercase tracking-[0.2em] text-xs font-semibold mb-4">Course Selection · 9 min read</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6">
          7 Mistakes People Make Choosing a PT Course in Ireland (and How to Avoid Them)
        </h1>
        <p className="text-xl text-charcoal-500 italic leading-relaxed mb-8">
          Most people who quit personal training in year one did not pick the wrong career — they picked the
          wrong course. Here are the 7 mistakes we see repeatedly, and the simple checks that prevent each
          one.
        </p>
        <div className="flex items-center gap-3 text-sm text-charcoal-500 py-4 border-y border-charcoal-200">
          <strong className="text-charcoal-900">Image Fitness Training</strong>
          <span>·</span>
          <span>5,000+ graduates · 16 years in Irish fitness education</span>
        </div>

        <div className="bg-charcoal-50 rounded-xl p-6 mt-8">
          <p className="text-xs uppercase tracking-wider text-charcoal-500 mb-3 font-semibold">Jump to a mistake</p>
          <ol className="space-y-1.5">
            {mistakes.map((m, idx) => (
              <li key={m.id}>
                <a href={`#${m.id}`} className="text-charcoal-800 hover:text-gold-600 transition-colors">
                  <span className="text-gold-600 font-bold mr-2">{idx + 1}.</span>
                  {m.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 md:px-8 pb-16">
        {mistakes.map((m, idx) => (
          <div key={m.id} id={m.id} className="py-14 border-b border-charcoal-200 scroll-mt-20">
            <span className="inline-block bg-charcoal-950 text-gold-500 px-4 py-1.5 text-xs uppercase tracking-widest font-bold rounded mb-4">Mistake {m.num}</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{m.title}</h2>
            <p className="text-lg text-charcoal-700 leading-relaxed mb-5">{m.body}</p>
            <div className="bg-gold-50 border-l-4 border-gold-500 p-5 rounded-r-lg">
              <p className="text-xs uppercase tracking-widest text-gold-700 font-bold mb-1">The fix</p>
              <p className="text-charcoal-800">{m.fix}</p>
            </div>

            {idx === 3 && (
              <div className="bg-charcoal-950 text-white rounded-2xl p-8 mt-12">
                <h4 className="text-2xl font-bold mb-2">The course we built to solve mistake #4</h4>
                <p className="text-charcoal-200 mb-5">Image Fitness Training builds client acquisition into the core curriculum, not as a paid add-on. Your first paid client by week 6 via the Fitness Business Accelerator, then 6–12 months of post-qualification mentorship community access depending on pathway. REPs Ireland accredited. From €2,800, €500 deposit, pay monthly.</p>
                <Link href="/courses/personal-trainer" className="inline-block bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-3 px-7 rounded-lg transition-colors">See the Pathway →</Link>
              </div>
            )}
          </div>
        ))}

        <div className="bg-charcoal-50 rounded-2xl p-10 mt-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">The course we built to avoid all seven</h3>
          <p className="text-charcoal-700 mb-5">After watching the same mistakes recur for 16 years, we built one programme that addresses each directly:</p>
          <ul className="space-y-2 mb-6 text-charcoal-800">
            <li><span className="text-gold-600 font-bold">✓</span> REPs Ireland accredited · EQF Level 3 &amp; 4 <em className="text-charcoal-500">(fixes 2)</em></li>
            <li><span className="text-gold-600 font-bold">✓</span> Weekend or weekday delivery with 14+ in-person practical days <em className="text-charcoal-500">(fixes 3)</em></li>
            <li><span className="text-gold-600 font-bold">✓</span> Fitness Business Accelerator built into core <em className="text-charcoal-500">(fixes 4)</em></li>
            <li><span className="text-gold-600 font-bold">✓</span> NutriCert nutrition CPD pathway <em className="text-charcoal-500">(fixes 5)</em></li>
            <li><span className="text-gold-600 font-bold">✓</span> Named tutors per location, 8+ years coaching each <em className="text-charcoal-500">(fixes 6)</em></li>
            <li><span className="text-gold-600 font-bold">✓</span> 6–12 month post-qualification community access <em className="text-charcoal-500">(fixes 7)</em></li>
            <li><span className="text-gold-600 font-bold">✓</span> €500 deposit, pay monthly, Intreo funding eligible <em className="text-charcoal-500">(fixes 1)</em></li>
          </ul>
          <Link href="/courses/personal-trainer" className="inline-block bg-gold-600 hover:bg-gold-700 text-white font-bold py-3 px-7 rounded-lg transition-colors">Compare 2026 Intakes →</Link>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  )
}
