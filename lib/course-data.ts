// ─── Shared Course Data — Image Fitness Training (PT) ────────────────
// Used by: checkout, onboarding, timetable pages
// Source of truth for packages, locations, timetables, and start dates

export interface Package {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  maxMonths: number;
  minDeposit: number;
  popular: boolean;
  features: string[];
  description: string;
  badge?: string;
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
  excludeFromPackages?: string[];
}

// ─── Add-On Courses (upsells during checkout) ──────────────────────
export const addOns: AddOn[] = [
  {
    id: 'nutricert-global',
    name: 'NutriCert Global',
    price: 750,
    description: 'Clients expect nutrition guidance — and pay more for trainers who offer it. This is the qualification that sets you apart.',
    badge: 'Most Added',
    delivery: 'Self-Paced Online · Start Anytime',
    highlights: ['CPD Accredited Diploma', 'Client meal planning templates', 'Lifetime access'],
  },
  {
    id: 'pre-post-natal',
    name: 'Pre & Post Natal Exercise Coaching',
    price: 697,
    description: 'Pre/post natal coaching is one of the fastest-growing niches. Unlock an entire client base most trainers can\'t serve.',
    badge: 'High Demand',
    delivery: 'Self-Paced Online · Start Anytime',
    highlights: ['REPs + PD:Approval Accredited', '16 CPD Points', 'Trimester-specific programming'],
  },
  {
    id: 'strength-conditioning',
    name: 'Strength & Conditioning',
    price: 1500,
    description: 'Train athletes, build champions, and command premium rates. Ireland\'s most comprehensive S&C certification — a natural next step after PT.',
    badge: 'Dublin Only',
    delivery: 'Blended Learning · Dublin',
    highlights: ['REPs Accredited', 'Olympic lifting & periodisation', 'Works with athletes of any level'],
  },
  {
    id: 'ai-for-coaches',
    name: 'AI for Coaches Interactive Webinar',
    price: 200,
    description: 'Get fully booked faster. Work smarter from day one. Create a week of content in 30 minutes, automate admin, and look established from Day 1 — with an AI toolkit worth €1,500+ included.',
    badge: 'Future-Proof',
    delivery: 'Online Webinar',
    highlights: ['Content Creator, Programme Builder & Client Comms GPTs', 'Nutrition Guide, Business Starter GPT + Prompt Playbook', 'Limited to 15 places · Delivered by AIVA'],
    excludeFromPackages: ['fitness-business-coach'],
  },
  {
    id: 'programming-for-success',
    name: 'Programming for Success',
    price: 200,
    description: 'A full-day theory + practical workshop with Kev McCarthy. Assess any client, pick the right tools, and build a programme that gets results — no matter who walks in.',
    delivery: 'Live Workshop · Nationwide',
    highlights: ['10+ templates: fat loss, strength, Hyrox, general pop', '6 periodisation models + assessment → goal → plan system', 'Client avatar workshop — Kev reviews your programmes live'],
    excludeFromPackages: ['fitness-business-coach'],
  },
  {
    id: 'brand-launch-photoshoot',
    name: 'Coach Brand Launch',
    price: 1100,
    description: 'Professional brand photography + 2 short-form video reels, shot at Image Fitness Training HQ by Hourglass Studios. Look credible from Day 1 — no experience needed.',
    badge: 'Dublin Only',
    delivery: 'In-Person · Swords, Dublin',
    highlights: ['15 high-quality brand images (posts, profiles, ads)', '2 professionally edited reels (30–45 sec, vertical format)', 'Fully guided by Hourglass Studios · Limited to 15 places'],
    excludeFromPackages: ['fitness-business-coach'],
  },
];

// ─── Course Packages ────────────────────────────────────────────────
// Ontraport mapping: pro-coach = The Cert, complete-coach = The Career, fitness-business-coach = The Business
export const packages: Package[] = [
  {
    id: 'pro-coach',
    name: 'The Cert',
    price: 2800,
    maxMonths: 8,
    minDeposit: 500,
    popular: false,
    features: [
      'REPs Ireland-approved PT qualification (EQF Level 4)',
      'Fitness Instruction certification',
      'Group Instruction certification',
      'Nutrition Diploma',
      'Flexible delivery: blended, scheduled, or fully online',
      'Free workshops included',
    ],
    description: 'Your qualification. Your foundation. Your starting line.',
  },
  {
    id: 'complete-coach',
    name: 'The Career',
    price: 3500,
    maxMonths: 10,
    minDeposit: 500,
    popular: true,
    features: [
      'Everything in The Cert',
      '3–4 week live job placement (real clients, real environment)',
      'Fitness Business Accelerator Phase 1 — client acquisition, pricing, how to sell',
      "Six months free in The Floor — Ireland's PT graduate community",
      'Graded result: Pass, Merit, or Distinction',
      'Additional workshops',
    ],
    description: 'Qualify. Get placed. Get hired.',
  },
  {
    id: 'fitness-business-coach',
    name: 'The Business',
    price: 4800,
    maxMonths: 12,
    minDeposit: 500,
    popular: false,
    features: [
      'Everything in The Career',
      'Professional brand photoshoot + advertising reels (done for you)',
      'AI for Coaches workshop — automate, optimise, outpace',
      'Programming for Success masterclass',
      'Fitness Business Accelerator Phase 2 — retention systems, scaling strategy',
      'Priority placement through our 200+ hiring partner network',
      'Extended membership in The Floor graduate community',
    ],
    description: 'Build the career. Then build the empire.',
  },
];

// ─── Training Locations ─────────────────────────────────────────────
export const locations: Location[] = [
  { id: 'swords',   name: 'Dublin (Swords)',   address: 'The Castle Shopping Centre, Bridge Street, Swords, Co. Dublin' },
  { id: 'tallaght', name: 'Dublin (Tallaght)', address: 'Belgard Square W, Tallaght, Dublin 24' },
  { id: 'cork',     name: 'Cork City',         address: 'Stapleton House, 10 Oliver Plunkett St, Cork City' },
  { id: 'galway',   name: 'Galway',            address: 'N17 Business Park, Galway Rd, Tuam, Co. Galway' },
  { id: 'limerick', name: 'Limerick',          address: 'Limerick City' },
  { id: 'wexford',  name: 'Wexford',           address: 'Wexford Town' },
  { id: 'clare',    name: 'Clare',             address: 'Unit 19, Ballycasey Craft & Design Centre, Shannon, Co. Clare, V14 EA30' },
  { id: 'online',   name: 'Online',            address: 'Live online sessions — flexible scheduling' },
];

// ─── Timetable Options ──────────────────────────────────────────────
export const timetables: Timetable[] = [
  { id: '16-week-evening-sat', name: '8-Week Part-Time (Evenings + Saturday)', schedule: 'Mon & Wed 7:00–10:00 PM + Sat 10:00 AM–4:30 PM', duration: '8 weeks' },
  { id: '16-week-saturday',    name: '16-Week Part-Time (Saturday)',             schedule: 'Saturday, 10:00 AM–4:30 PM',                    duration: '16 weeks' },
  { id: '8-week-intensive',    name: '8-Week Full Time',                         schedule: 'Thursday & Friday, 10:00 AM–4:30 PM',           duration: '8 weeks' },
  { id: 'online-self-paced',   name: 'Online (Self-Paced)',                      schedule: 'Flexible — study at your own pace',             duration: 'Up to 6 months' },
];

// ─── Course Start Dates ─────────────────────────────────────────────
export const courseStartDates: CourseStartDate[] = [
  // Dublin (Swords & Tallaght) — Evenings + Saturday
  { date: '2026-04-27', label: '27 April 2026', locations: ['swords', 'tallaght'], timetable: '16-week-evening-sat' },
  // Dublin (Swords & Tallaght) — 8-Week Full Time
  { date: '2026-07-02', label: '2 July 2026',   locations: ['swords', 'tallaght'], timetable: '8-week-intensive' },
  // Cork, Galway, Limerick, Wexford — Saturday 16-Week
  { date: '2026-04-25', label: '25 April 2026', locations: ['cork', 'galway', 'limerick', 'wexford', 'clare'], timetable: '16-week-saturday' },
  // Cork, Galway, Limerick, Wexford, Clare — 8-Week Full Time
  { date: '2026-07-02', label: '2 July 2026',   locations: ['cork', 'galway', 'limerick', 'wexford', 'clare'], timetable: '8-week-intensive' },
];

// ─── Welcome Videos (per timetable type) ────────────────────────────
export const welcomeVideos: Record<string, { url: string; embedUrl: string }> = {
  '16-week-saturday': {
    url: 'https://vimeo.com/1072160538/fe53c7acb3',
    embedUrl: 'https://player.vimeo.com/video/1072160538?h=fe53c7acb3',
  },
  '8-week-intensive': {
    url: 'https://vimeo.com/1072160124/23a1c3fe7b',
    embedUrl: 'https://player.vimeo.com/video/1072160124?h=23a1c3fe7b',
  },
  '16-week-evening-sat': {
    url: 'https://vimeo.com/1072160538/fe53c7acb3',
    embedUrl: 'https://player.vimeo.com/video/1072160538?h=fe53c7acb3',
  },
  'online-self-paced': {
    url: 'https://vimeo.com/1072160538/fe53c7acb3',
    embedUrl: 'https://player.vimeo.com/video/1072160538?h=fe53c7acb3',
  },
};

// ─── Special Offers (time-limited) ─────────────────────────────────
// Each offer targets a package by ID, overrides price/minDeposit, and
// expires at a given UTC date-time. After expiry the normal price applies.
export interface SpecialOffer {
  packageId: string;
  price: number;
  originalPrice: number;
  minDeposit: number;
  expires: string; // ISO 8601 date-time (UTC)
  label: string;
}

export const specialOffers: SpecialOffer[] = [
  {
    packageId: 'pro-coach',
    price: 2600,
    originalPrice: 2800,
    minDeposit: 350,
    expires: '2026-04-01T00:00:00+01:00', // midnight IST March 31
    label: 'Special Offer — Today Only',
  },
];

/** Get the active special offer for a package (if any). */
export function getActiveOffer(packageId: string): SpecialOffer | null {
  const now = new Date();
  return (
    specialOffers.find(
      (o) => o.packageId === packageId && new Date(o.expires) > now
    ) ?? null
  );
}

// ─── Helper Functions ───────────────────────────────────────────────

/** Get available timetables for a location */
export function getTimetablesForLocation(locationId: string): Timetable[] {
  if (locationId === 'online') return timetables.filter(t => t.id === 'online-self-paced');
  if (locationId === 'swords' || locationId === 'tallaght') {
    return timetables.filter(t => t.id === '16-week-evening-sat' || t.id === '8-week-intensive');
  }
  return timetables.filter(t => t.id === '16-week-saturday' || t.id === '8-week-intensive');
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
