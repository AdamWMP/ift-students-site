// Single source of truth for the T&C contract students sign during onboarding.
// Mirrored by components/onboarding/contract-step.tsx and app/terms/terms-content.tsx.
// (Future cleanup: import this in those two so there's only one copy.)

export const CONTRACT_LAST_UPDATED = 'May 2026';

export interface ContractSection {
  title: string;
  items: string[];
}

export const CONTRACT_SECTIONS: ContractSection[] = [
  {
    title: '1. Enrollment & Payment',
    items: [
      'A non-refundable deposit is required to secure your place on any course.',
      'Full payment or agreed payment plan must be completed before course completion.',
      'Payment plans are available with options depending on the course selected.',
      'Prices are locked in at the time of enrollment.',
    ],
  },
  {
    title: '2. Certificate Release',
    items: [
      'Your certificate will be released once 50% of your total course fees have been paid.',
      'Upon passing your exams, a letter of completion can be provided on request, but the physical certificate will only be issued once the payment threshold is met.',
    ],
  },
  {
    title: '3. Payment Liability',
    items: [
      'You are liable for the full course fees once enrolled. Failure to maintain agreed payment schedules or dropping out of the course does not absolve you of this liability.',
      'Payments are automatically charged to the card used for your deposit on the 30th of each month at approximately 11am.',
      'If you need to amend your payment date or plan, contact education@imageft.ie before the payment is due.',
    ],
  },
  {
    title: '4. Non-Payment & Legal Proceedings',
    items: [
      'If payments are not maintained and you do not engage with Image Fitness Training to resolve outstanding fees, legal proceedings will be initiated to recover the full amount owed.',
      'All costs associated with debt recovery, including legal fees, will be added to the outstanding balance.',
      'Image Fitness Training reserves the right to suspend access to course materials and community platforms for students with overdue payments.',
    ],
  },
  {
    title: '5. Course Transfers & Deferrals',
    items: [
      'Course transfers may be requested up to 14 days before the course start date.',
      'Deferrals are granted at the discretion of Image Fitness Training management.',
      'A maximum of one deferral per enrollment is permitted.',
      'Deferred places must be taken within 12 months of the original start date.',
    ],
  },
  {
    title: '6. Cancellation & Refunds',
    items: [
      'Course deposits are non-refundable under any circumstances.',
      'Cancellations more than 30 days before course start: 75% refund of fees paid (excluding deposit).',
      'Cancellations 15-30 days before course start: 50% refund of fees paid (excluding deposit).',
      'Cancellations less than 14 days before course start: No refund.',
    ],
  },
  {
    title: '7. Attendance Requirements',
    items: [
      'Minimum 80% attendance is required for practical sessions.',
      'Missed sessions may need to be made up in the next available intake.',
      'Failure to meet attendance requirements may result in delayed certification.',
    ],
  },
  {
    title: '8. Assessment & Certification',
    items: [
      'All assessments must be passed to receive certification.',
      'One free re-sit is included for failed assessments. Additional re-sits may incur extra fees.',
      "REPs Ireland registration is the student's responsibility after certification.",
    ],
  },
  {
    title: '9. Code of Conduct',
    items: [
      'Students must conduct themselves professionally at all times.',
      'Any form of harassment or discrimination will result in immediate removal without refund.',
      'Course materials are for personal use only and may not be shared or sold.',
    ],
  },
  {
    title: '10. Liability',
    items: [
      'Students participate in practical training at their own risk.',
      'Image Fitness Training is not liable for injuries during training.',
      'Students must declare any medical conditions before enrollment.',
    ],
  },
];
