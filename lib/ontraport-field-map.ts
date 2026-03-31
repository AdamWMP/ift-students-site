// ─── Ontraport Custom Field Mappings ────────────────────────────────
// Maps form field names to Ontraport custom field IDs
// Confirmed field IDs from the existing Ontraport student profile form

export const ONTRAPORT_FIELDS = {
  // ── Course fields (already mapped in create-payment) ──────────────
  course: 'f1834',
  courseYear: 'f2288',
  courseTerm: 'f2289',
  courseQualifications: 'f2290',
  courseLocation: 'f2291',
  courseTimetable: 'f2292',
  courseStartDate: 'f2293',
  coursePrice: 'f2294',
  coursePaymentPlan: 'f2296',
  courseFees: 'f2456',
  paymentMethod: 'f2537',
  packageName: 'f1428',
  totalCost: 'f1544',
  paymentPlanDetails: 'f1612',

  // ── Student Profile — EXISTING FIELDS ─────────────────────────────
  // These already exist from the Ontraport student profile form
  dateOfBirth: 'birthday',          // Built-in birthday field
  gender: 'f1775',                  // Gender (dropdown)
  tshirtSize: 'f1682',              // T Shirt Size (dropdown)
  nextOfKinName: 'f1429',           // Next of kin
  nextOfKinPhone: 'f1431',          // Next of kin phone number
  nextOfKinRelationship: 'f1430',   // Relationship to next of kin
  medicalConditions: 'f1432',       // Do you have any medical conditions?
  industry: 'f2087',                // Industry You Work
  occupation: 'f1774',              // Occupation (Optional)
  referralSource: 'f1683',          // Where did you hear about us? (dropdown)
  referralName: 'f2086',            // Heard About Us Other (Optional)
  motivation: 'f1999',              // What motivated you to do the course (dropdown)
  additionalNotes: 'f1523',         // Anything else you think we should know about you?

  // ── Shipping / Certificate address ────────────────────────────────
  // Using the existing address fields + certificate address field
  shippingAddress: 'f1772',         // Address for Certificates (longtext — stores full address)
  // Also store in standard address fields for CRM use
  addressLine1: 'address',          // Built-in Address field
  addressLine2: 'address2',         // Built-in Address 2 field
  city: 'city',                     // Built-in City field
  state: 'state',                   // Built-in State field (used for County)
  zip: 'zip',                       // Built-in Zip field (used for Eircode)

  // ── Contract ──────────────────────────────────────────────────────
  contractSigned: 'f2344',          // Contracted Signed (existing text field)

  // ── NEW FIELDS — need to be created in Ontraport ──────────────────
  // These will get auto-assigned IDs when created.
  // For now, use these placeholder IDs. After creating the fields in
  // Ontraport admin, update with the real IDs.
  certificateFirstName: 'f2601',    // NEEDS CREATION — Certificate First Name
  certificateLastName: 'f2602',     // NEEDS CREATION — Certificate Last Name
  onboardingProgress: 'f2603',      // NEEDS CREATION — Onboarding Progress (text)
  depositAmount: 'f2604',           // NEEDS CREATION — Deposit Amount (numeric)
  monthlyAmount: 'f2605',           // NEEDS CREATION — Monthly Payment Amount (numeric)
  paymentMonths: 'f2606',           // NEEDS CREATION — Payment Months Remaining (numeric)
  firstInstalmentDate: 'f2607',     // NEEDS CREATION — First Instalment Date (text)
} as const;

// Tag IDs
export const ONTRAPORT_TAGS = {
  customers: '50',
  tcContractSigned: '2526',         // "T&C Contract Signed" — CREATED via API
  s26ComboCoursSale: '2505',
  eightWeekSkool: '2337',
  sixteenWeekSkool: '2336',
} as const;
