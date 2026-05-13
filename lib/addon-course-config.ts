// ─── Addon Course Config — Single Source of Truth ───────────────────────────
// Both course content pages and the checkout read from here.
// To add a new location/intake: add an entry to the `intakes` array — it
// will appear automatically on both the course page and checkout.

export type AddonCourseId = 'sc' | 'ppn' | 'nutricert'

// ── Ontraport dropdown option IDs ────────────────────────────────────────────
export const ONTRAPORT_LOCATION_IDS: Record<string, string> = {
  swords:   '503',
  tallaght: '502',
  cork:     '501',
  galway:   '500',
  limerick: '499',
  wexford:  '498',
  belfast:  '563',
  online:   '544',
}

// Term IDs — matches the main checkout
export const ONTRAPORT_TERM_IDS = {
  A26: '492',  // Autumn 2026 (Aug–Jan)
  S26: '494',  // Spring 2026 (Feb–Jul)
  A27: '492',  // Reuse Autumn ID until A27 is created
} as const

// Enrolment status — 586 = Enrolled (same as main PT checkout)
export const ONTRAPORT_ENROLLED_ID = '586'

// ─── Intake ──────────────────────────────────────────────────────────────────
export interface Intake {
  id: string              // unique key e.g. 'sc-sept-2026-dublin'
  label: string           // shown in checkout dropdown
  location: string        // short location key (maps to ONTRAPORT_LOCATION_IDS)
  locationLabel: string   // display label e.g. "Dublin (Swords)"
  startDate: string       // ISO date e.g. "2026-09-07" — used for Ontraport f2293
  term: keyof typeof ONTRAPORT_TERM_IDS
  timetableLabel: string  // shown on course page e.g. "Sept–Nov 2026"
}

// ─── Course Config ────────────────────────────────────────────────────────────
// Per-course Ontraport field mapping. These are the *course-specific* dropdown /
// tick fields that live alongside the generic enrolment fields (f1428, f1834,
// f2291, f2293, f2294, f2296, etc.). They are populated whenever the course is
// purchased — directly or as an add-on — except `priceField`, which is only set
// when the course is purchased *directly* (not as part of a bundle).
//
// Ontraport tick fields are stored as booleans (CSV export shows `true`/`false`),
// so we write the literal string "true".
export interface CourseSpecificOntraportFields {
  startDateField?: string       // e.g. f2315 (S&C Start Date)
  locationField?: string        // e.g. f2316 (S&C Location) — receives the
                                // standard Ontraport location option ID
  qualificationField?: string   // e.g. f2317 (S&C Qualification)
  qualificationOptionId?: string // option ID written into the qualification field
  courseField?: string          // e.g. f2318 (S&C Course) — boolean tick
  priceField?: string           // e.g. f2319 (S&C Price) — direct-sale only
}

export interface AddonCourseConfig {
  id: AddonCourseId
  name: string
  fullName: string
  badge: string
  price: number             // upfront / full-payment price
  paymentPlanPrice?: number // total when paying in installments (may be higher)
  minDeposit: number
  maxMonths: number
  productId: string
  courseOptionId: string   // Ontraport f1834 dropdown value
  saleTagId: string
  features: string[]
  intakes: Intake[]
  ontraport?: CourseSpecificOntraportFields
}

// ─── Courses ──────────────────────────────────────────────────────────────────
// ↓↓ ADD / UPDATE intakes here — both the page and checkout will reflect it ↓↓

export const ADDON_COURSES: Record<AddonCourseId, AddonCourseConfig> = {

  sc: {
    id: 'sc',
    name: 'Strength & Conditioning',
    fullName: 'Level 4 S&C Coach Certification',
    badge: 'Active IQ · RQF Level 4',
    price: 1500,
    minDeposit: 300,
    maxMonths: 6,
    productId: '88',
    courseOptionId: '308',
    saleTagId: '2530',  // "A26 S&C Sale"
    ontraport: {
      // S&C-specific Ontraport fields — set on every S&C sale (direct or add-on)
      startDateField:        'f2315',
      locationField:         'f2316',
      qualificationField:    'f2317',
      qualificationOptionId: '308',  // S&C course option (same dropdown as f1834)
      courseField:           'f2318',
      priceField:            'f2319',  // direct-sale only
    },
    features: [
      '12-week intensive programme',
      'Live online theory sessions (Mon 7–9pm)',
      'Practical coaching weekends in Dublin',
      'Active IQ Level 4 — internationally recognised',
      'REPs Ireland accredited',
      'Full assessment & certification',
    ],
    intakes: [
      {
        id: 'sc-sept-2026-dublin',
        label: 'September 2026 — Dublin (Swords)',
        location: 'swords',
        locationLabel: 'Dublin (Swords)',
        startDate: '2026-09-07',
        term: 'A26',
        timetableLabel: 'Sept–Nov 2026',
      },
      // ── To add Cork intake, uncomment and fill in: ──────────────────
      // {
      //   id: 'sc-sept-2026-cork',
      //   label: 'September 2026 — Cork',
      //   location: 'cork',
      //   locationLabel: 'Cork',
      //   startDate: '2026-09-07',
      //   term: 'A26',
      //   timetableLabel: 'Sept–Nov 2026',
      // },
    ],
  },

  ppn: {
    id: 'ppn',
    name: 'Pre & Post Natal',
    fullName: 'Pre & Post Natal Exercise Coaching Certification',
    badge: 'REPs Ireland · PD:Approval · EQF Level 4',
    price: 697,
    paymentPlanPrice: 897,
    minDeposit: 199,
    maxMonths: 3,
    productId: '98',
    courseOptionId: '420',
    saleTagId: '2266',  // "Pre And Post Natal Online Course Sale"
    ontraport: {
      // PPN-specific Ontraport fields
      courseField: 'f2323',  // PPN Course tick
    },
    features: [
      '11 comprehensive learning modules',
      'REPs Ireland + PD:Approval dual accreditation',
      '16 CPD points for your portfolio',
      '200+ page digital course manual',
      'Full video exercise library',
      'Lifetime access — start anytime',
    ],
    intakes: [
      {
        id: 'ppn-online',
        label: 'Online — Start Immediately',
        location: 'online',
        locationLabel: 'Online (Self-Paced)',
        startDate: '',   // empty = today's date at time of purchase
        term: 'A26',     // updated dynamically at checkout time
        timetableLabel: 'Online · Start Anytime',
      },
    ],
  },

  nutricert: {
    id: 'nutricert',
    name: 'NutriCert Global',
    fullName: 'NutriCert Global — Advanced Nutrition Coach Certificate',
    badge: 'REPs Ireland Aligned · Advanced Level',
    price: 750,
    paymentPlanPrice: 900,
    minDeposit: 199,
    maxMonths: 3,
    productId: '103',
    courseOptionId: '441',
    saleTagId: '2306',  // "NutriCert Global Sale"
    ontraport: {
      // NutriCert (Advanced Nutrition) specific Ontraport fields
      courseField: 'f2329',  // AN Course tick
    },
    features: [
      '10 comprehensive units',
      '23+ coaching psychology lessons',
      '7 marketing & ads modules',
      '13+ recipe videos for clients',
      'Mock + final theory examination',
      'Lifetime access — study at your own pace',
    ],
    intakes: [
      {
        id: 'nutricert-online',
        label: 'Online — Start Immediately',
        location: 'online',
        locationLabel: 'Online (Self-Paced)',
        startDate: '',
        term: 'A26',
        timetableLabel: 'Online · Start Anytime',
      },
    ],
  },
}

// ── Helper: resolve the correct term ID based on purchase date ───────────────
export function getCurrentTermId(): string {
  const month = new Date().getMonth() + 1 // 1–12
  return month >= 2 && month <= 7
    ? ONTRAPORT_TERM_IDS.S26
    : ONTRAPORT_TERM_IDS.A26
}
