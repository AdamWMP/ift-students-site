// ─── Shared Course Data — Image Pilates ─────────────────────────────
// Used by: checkout, onboarding, timetable pages
// Source of truth for packages, locations, timetables, and start dates

export interface Package {
  id: string;
  name: string;
  price: number;
  paymentPlanPrice?: number; // Higher price when paying in instalments
  originalPrice?: number;
  maxMonths: number;
  minDeposit: number;
  popular: boolean;
  features: string[];
  description: string;
  badge?: string; // e.g. "Limited Offer"
  comingSoon?: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface Timetable {
  id: string;
  name: string;
  schedule: string;
  duration: string;
}

export interface CourseStartDate {
  date: string;
  label: string;
  locations: string[];
  timetable: string;
  soldOut?: boolean;
  highDemand?: boolean;
  spotsLeft?: number;
  comingSoon?: boolean;
  sessions?: string[]; // Specific session dates for locations page display
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  badge?: string;
  delivery: string;
  highlights: string[];
  excludeFromPackages?: string[]; // Package IDs where this add-on shouldn't show (already included)
}

// ─── Add-On Courses (upsells during checkout) ──────────────────────
// Full price — no discounts. Sales psychology copy drives conversion.
// Spread across the same payment plan so no extra upfront cost.
export const addOns: AddOn[] = [
  {
    id: 'nutricert-global',
    name: 'NutriCert Global',
    price: 750,
    description: 'Clients expect nutrition guidance — and pay more for instructors who offer it. This is the qualification that sets you apart.',
    badge: 'Most Added',
    delivery: 'Self-Paced Online · Start Anytime',
    highlights: ['CPD Accredited Diploma', 'Client meal planning templates', 'Lifetime access'],
  },
  {
    id: 'pre-post-natal',
    name: 'Pre & Post Natal Exercise Coaching',
    price: 697,
    description: 'Pre/post natal Pilates is one of the fastest-growing niches. Unlock an entire client base most instructors can\'t serve.',
    badge: 'High Demand',
    delivery: 'Self-Paced Online · Start Anytime',
    highlights: ['REPs + PD:Approval Accredited', '16 CPD Points', 'Trimester-specific programming'],
  },
];

// ─── Course Packages ────────────────────────────────────────────────
// Ontraport mapping: pilates-cert = The Cert, pilates-career = The Career, pilates-studio = The Studio
export const packages: Package[] = [
  {
    id: 'pilates-cert',
    name: 'The Cert',
    price: 1800,
    paymentPlanPrice: 2000,
    maxMonths: 6,
    minDeposit: 200,
    popular: false,
    features: [
      'Mat Pilates Instructor — REPs Ireland EQF Level 4 Aligned',
      'Body-Flow Method certification',
      '38+ mat exercises — classical and contemporary',
      'Special populations module',
      'Pregnancy Pilates workshop',
    ],
    description: 'REPs-approved Mat Pilates Instructor qualification. Your foundation starts here.',
  },
  {
    id: 'pilates-career',
    name: 'The Career',
    // Before April 1 2026: €2,500 upfront / €2,700 plan (promo)
    // From April 1 2026: €2,800 upfront / €3,000 plan (standard)
    price: new Date() < new Date('2026-04-01') ? 2500 : 2800,
    paymentPlanPrice: new Date() < new Date('2026-04-01') ? 2700 : 3000,
    originalPrice: new Date() < new Date('2026-04-01') ? 3000 : undefined,
    maxMonths: 10,
    minDeposit: 200,
    popular: true,
    badge: new Date() < new Date('2026-04-01') ? 'Offer ends 31st March' : undefined,
    features: [
      'Everything in The Cert (Mat Pilates Instructor)',
      'Reformer Pilates Instructor — REPs Ireland Approved · PD:Approval Aligned',
      'Align–Flow–Empower Reformer framework — beginner to intermediate repertoire, ready to teach from day one',
      'Real-world placement hours with paying clients',
      'Access to the Image-Approved Studio Network',
      '6 months FREE in The Circle — Ireland\'s Pilates graduate community',
      'Graded result: Pass, Merit, or Distinction',
    ],
    description: 'Mat + Reformer Pilates Instructor qualifications. Teach real classes. Build a career you love.',
  },
  {
    id: 'reformer-only',
    name: 'Reformer Pilates',
    // €1,000 upfront / €1,200 plan (coupon reduces upfront to €700, plan to €900)
    price: 1000,
    paymentPlanPrice: 1200,
    originalPrice: undefined,
    maxMonths: 4,
    minDeposit: 200,
    popular: false,
    badge: undefined,
    features: [
      'Reformer Pilates Instructor — REPs Ireland Approved · PD:Approval Aligned',
      'Align–Flow–Empower Reformer framework — beginner to intermediate repertoire',
      '8 full days across 4 weekends of practical training, plus a dedicated exam weekend',
      'You\'ll be ready to hit the ground running from day one',
      'Entry requirement: Mat Pilates qualification',
    ],
    description: 'Mat Pilates qualified? Add Reformer to your toolkit — covering beginner to intermediate repertoire so you\'re ready to teach from day one.',
  },
  {
    id: 'pilates-studio',
    name: 'The Studio',
    price: 3200,
    maxMonths: 12,
    minDeposit: 300,
    popular: false,
    comingSoon: true,
    features: [
      'Everything in The Career (Mat + Reformer qualifications)',
      'Pilates Business Accelerator — pricing, insurance, client acquisition & marketing',
      'How to set up your own studio or go independent',
      '6 months in The Circle (free), then €9.99/month',
      'Priority placement with 200+ hiring partners',
      'Graded result — your Distinction is your competitive edge',
    ],
    description: 'Mat + Reformer qualifications plus full business ecosystem. From your first mat class to your own studio.',
  },
];

// ─── Training Locations ─────────────────────────────────────────────
export const locations: Location[] = [
  { id: 'dublin-swords', name: 'Dublin (Swords)', address: 'The Castle Shopping Centre, Bridge Street, Swords, Co. Dublin' },
  { id: 'dublin-tallaght', name: 'Dublin (Tallaght)', address: 'Belgard Square W, Tallaght, Dublin 24' },
  { id: 'galway', name: 'Galway (Tuam)', address: 'N17 Business Park, Galway Rd, Tuam, Co. Galway' },
  { id: 'cork', name: 'Cork City', address: 'Stapleton House, 10 Oliver Plunkett St, Cork City' },
  { id: 'derry', name: 'Co. Derry / L\'Derry', address: 'Gateway Studio, Co. Derry / L\'Derry' },
  { id: 'online', name: 'Online', address: 'Tuesdays & Thursdays evenings' },
];

// ─── Timetable Options ──────────────────────────────────────────────
export const timetables: Timetable[] = [
  { id: 'every-second-saturday', name: 'Every Second Saturday', schedule: 'Saturday, 10:00 AM – 4:30 PM', duration: '5–11 weeks' },
  { id: '3-weekend-intensive', name: '3 Weekend Intensive', schedule: 'Saturday & Sunday, 10:00 AM – 4:30 PM', duration: '3 weekends (6 full days)' },
  { id: 'online-evenings', name: 'Online (Evenings)', schedule: 'Tuesdays & Thursdays, 7:00 PM – 10:00 PM', duration: '7 weeks · 14 sessions' },
];

// ─── Course Start Dates ─────────────────────────────────────────────
export const courseStartDates: CourseStartDate[] = [
  // Dublin (Swords & Tallaght) — Every second Saturday
  { date: '2026-04-25', label: '25 April 2026', locations: ['dublin-swords', 'dublin-tallaght'], timetable: 'every-second-saturday' },
  // Galway (Tuam) — 3 Weekend Intensive (Sept–Oct 2026)
  {
    date: '2026-09-05',
    label: '5 September 2026',
    locations: ['galway'],
    timetable: '3-weekend-intensive',
    sessions: [
      'Weekend 1: Sat 5 & Sun 6 September',
      'Weekend 2: Sat 26 & Sun 27 September',
      'Weekend 3: Sat 10 & Sun 11 October',
    ],
  },
  // Online — Evenings (23 Jun – 6 Aug 2026)
  {
    date: '2026-06-23',
    label: '23 June 2026',
    locations: ['online'],
    timetable: 'online-evenings',
    sessions: [
      'Tue 23 Jun', 'Thu 25 Jun',
      'Tue 30 Jun', 'Thu 2 Jul',
      'Tue 7 Jul', 'Thu 9 Jul',
      'Tue 14 Jul', 'Thu 16 Jul',
      'Tue 21 Jul', 'Thu 23 Jul',
      'Tue 28 Jul', 'Thu 30 Jul',
      'Tue 4 Aug', 'Thu 6 Aug',
    ],
  },
  // Cork City — Every second Saturday (Summer)
  { date: '2026-06-06', label: '6 June 2026', locations: ['cork'], timetable: 'every-second-saturday' },
  // Autumn intake — Dublin Swords & Tallaght + Cork (every 2nd Saturday)
  { date: '2026-09-19', label: '19 September 2026', locations: ['dublin-swords', 'dublin-tallaght', 'cork'], timetable: 'every-second-saturday' },
  // Dublin (Swords) — 3 Weekend Intensive (Summer 2026)
  {
    date: '2026-07-25',
    label: '25 July 2026 — IFT Swords Academy (Practical Exam Weekend: 29–30 August)',
    locations: ['dublin-swords'],
    timetable: '3-weekend-intensive',
    sessions: [
      'Weekend 1: Sat 25 & Sun 26 July',
      'Weekend 2: Sat 15 & Sun 16 August',
      'Weekend 3: Sat 29 & Sun 30 August — Practical Exam',
    ],
  },
  // Derry (Gateway Studio) — 3 Weekend Intensive (Autumn 2026)
  {
    date: '2026-09-05',
    label: '5 September 2026 — Gateway Studio, Co. Derry / L\'Derry',
    locations: ['derry'],
    timetable: '3-weekend-intensive',
    sessions: [
      'Weekend 1: Sat 5 & Sun 6 September',
      'Weekend 2: Sat 19 & Sun 20 September',
      'Weekend 3: Sat 3 & Sun 4 October',
    ],
  },
];

// ─── Welcome Videos (per timetable type) ────────────────────────────
export const welcomeVideos: Record<string, { url: string; embedUrl: string; isYouTube?: boolean }> = {
  'every-second-saturday': {
    url: 'https://vimeo.com/1072160538/fe53c7acb3',
    embedUrl: 'https://player.vimeo.com/video/1072160538?h=fe53c7acb3',
  },
  '3-weekend-intensive': {
    url: 'https://vimeo.com/1072160124/23a1c3fe7b',
    embedUrl: 'https://player.vimeo.com/video/1072160124?h=23a1c3fe7b',
  },
  'online-evenings': {
    url: 'https://vimeo.com/1072160538/fe53c7acb3',
    embedUrl: 'https://player.vimeo.com/video/1072160538?h=fe53c7acb3',
  },
  // Reformer Pilates welcome video
  'reformer-3-weekend': {
    url: 'https://youtu.be/eK5dQQ1JFzE',
    embedUrl: 'https://www.youtube.com/embed/eK5dQQ1JFzE?rel=0&modestbranding=1',
    isYouTube: true,
  },
};

// ─── Reformer Course Data (for Career & Studio bookings) ────────────
// Structure: 8 Full Days (4 Weekends) on Alternating Sat & Sun, 10am–6pm — Weekend 4 is Final Exam
// All at IFT Swords Academy (Dublin) only
export const reformerLocations: Location[] = [
  { id: 'dublin-swords', name: 'IFT Swords Academy (Dublin)', address: 'The Castle Shopping Centre, Bridge Street, Swords, Co. Dublin' },
  { id: 'cork', name: 'Himalaya Yoga Valley (Cork City)', address: 'Himalaya Yoga Valley, Cork City' },
  { id: 'clare', name: 'The Pilates Playground (Co. Clare)', address: 'Unit 19, Ballycasey Craft & Design Centre, Shannon, Co. Clare, V14 EA30' },
  { id: 'kerry', name: 'Halo Reformer Pilates Studio (Co. Kerry)', address: 'Halo Reformer Pilates Studio, Co. Kerry' },
  { id: 'derry', name: 'Gateway Studio (Co. Derry / L\'Derry)', address: 'Gateway Studio, Co. Derry / L\'Derry' },
];

export const reformerTimetables: Timetable[] = [
  { id: 'reformer-3-weekend', name: '4 Weekends + Exam Weekend', schedule: 'Saturdays & Sundays, 10:00 AM – 6:00 PM — Final Exam on Weekend 5', duration: '8 full days (4 weekends) + exam weekend' },
];

export const reformerStartDates: CourseStartDate[] = [
  // Intake 1: 28 Feb + 1 Mar, 14 + 15 Mar, 28 Mar + 29 Mar · Exam 4 + 5 Apr
  { date: '2026-02-28', label: '28 February 2026 (Final Exam Weekend: 29 March)', locations: ['dublin-swords'], timetable: 'reformer-3-weekend' },
  // Intake 2: 11 + 12 Apr, 18 + 19 Apr, 2 + 3 May · Exam 9 + 10 May
  { date: '2026-04-11', label: '11 April 2026 (Final Exam Weekend: 9–10 May) — SOLD OUT', locations: ['dublin-swords'], timetable: 'reformer-3-weekend', soldOut: true },
  // Intake 3: Follows 25th April Mat Start — 4 + 5 Jul, 18 + 19 Jul, 1 + 2 Aug · Exam 8 + 9 Aug
  {
    date: '2026-07-04',
    label: '4 July 2026 — follows 25th April Mat start (Final Exam Weekend: 8–9 August)',
    locations: ['dublin-swords'],
    timetable: 'reformer-3-weekend',
    highDemand: true,
    spotsLeft: 3,
    sessions: [
      'Weekend 1: Sat 4 & Sun 5 July',
      'Weekend 2: Sat 18 & Sun 19 July',
      'Weekend 3: Sat 1 & Sun 2 August',
      'Weekend 4: Sat 8 & Sun 9 August — Final Exam',
    ],
  },
  // (No October Dublin Swords intake — date brought forward to 12 September below)
  // Cork — Himalaya Yoga Valley — follows 6th June Mat start
  { date: '2026-09-05', label: '5 September 2026 — follows 6th June Mat start', locations: ['cork'], timetable: 'reformer-3-weekend' },
  // Cork (Sept 5) noted above; adding extra Dublin Swords September intake here
  { date: '2026-09-12', label: '12 September 2026 — IFT Swords Academy, Dublin', locations: ['dublin-swords'], timetable: 'reformer-3-weekend' },
  // Clare — The Pilates Playground — dates TBC
  { date: '2026-12-31', label: 'Dates coming soon', locations: ['clare'], timetable: 'reformer-3-weekend', comingSoon: true },
  // Kerry — Halo Reformer Pilates Studio — 4 weekends Jun–Jul 2026
  {
    date: '2026-06-06',
    label: '6 June 2026',
    locations: ['kerry'],
    timetable: 'reformer-3-weekend',
    highDemand: true,
    sessions: [
      'Weekend 1: Sat 6 & Sun 7 June',
      'Weekend 2: Sat 13 & Sun 14 June',
      'Weekend 3: Sat 27 & Sun 28 June',
      'Weekend 4: Sat 4 & Sun 5 July',
    ],
  },
  // Derry — Gateway Studio — 4 Weekends Oct–Nov 2026 (final weekend = exam)
  {
    date: '2026-10-24',
    label: '24 October 2026 — Gateway Studio, Co. Derry / L\'Derry (Final Exam Weekend: 28–29 November)',
    locations: ['derry'],
    timetable: 'reformer-3-weekend',
    sessions: [
      'Weekend 1: Sat 24 & Sun 25 October',
      'Weekend 2: Sat 7 & Sun 8 November',
      'Weekend 3: Sat 14 & Sun 15 November',
      'Weekend 4: Sat 28 & Sun 29 November — Final Exam',
    ],
  },
];

// Packages that include reformer (show reformer fields in details step)
export const REFORMER_PACKAGES = new Set(['pilates-career', 'pilates-studio', 'reformer-only']);

// Packages that are reformer-only (use reformer locations/dates instead of mat ones)
export const REFORMER_ONLY_PACKAGES = new Set(['reformer-only']);

// ─── Helper Functions ───────────────────────────────────────────────

/** Get available timetables for a location */
export function getTimetablesForLocation(locationId: string): Timetable[] {
  if (locationId === 'online') return timetables.filter(t => t.id === 'online-evenings');
  if (locationId === 'galway' || locationId === 'derry') return timetables.filter(t => t.id === '3-weekend-intensive');
  if (locationId === 'dublin-swords') {
    return timetables.filter(t => t.id === 'every-second-saturday' || t.id === '3-weekend-intensive');
  }
  return timetables.filter(t => t.id === 'every-second-saturday');
}

/** Get available start dates filtered by location + timetable */
export function getStartDatesForSelection(locationId: string, timetableId: string): CourseStartDate[] {
  return courseStartDates.filter(
    sd => sd.locations.includes(locationId) && sd.timetable === timetableId
  );
}

/** Get location by ID */
export function getLocationById(id: string): Location | undefined {
  return locations.find(l => l.id === id);
}

/** Get timetable by ID */
export function getTimetableById(id: string): Timetable | undefined {
  return timetables.find(t => t.id === id);
}
