'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

// Mirrors the 10-section binding agreement students sign during onboarding
// (source of truth: components/onboarding/contract-step.tsx). Keep in sync.
const sections = [
  {
    title: '1. Enrollment & Payment',
    content: [
      'A non-refundable deposit is required to secure your place on any course.',
      'Full payment or agreed payment plan must be completed before course completion.',
      'Payment plans are available with options depending on the course selected.',
      'Prices are locked in at the time of enrollment.',
    ],
  },
  {
    title: '2. Certificate Release',
    content: [
      'Your certificate will be released once 50% of your total course fees have been paid.',
      'Upon passing your exams, a letter of completion can be provided on request, but the physical certificate will only be issued once the payment threshold is met.',
    ],
  },
  {
    title: '3. Payment Liability',
    content: [
      'You are liable for the full course fees once enrolled. Failure to maintain agreed payment schedules or dropping out of the course does not absolve you of this liability.',
      'Payments are automatically charged to the card used for your deposit on the 30th of each month at approximately 11am.',
      'If you need to amend your payment date or plan, contact education@imageft.ie before the payment is due.',
    ],
  },
  {
    title: '4. Non-Payment & Legal Proceedings',
    content: [
      'If payments are not maintained and you do not engage with Image Fitness Training to resolve outstanding fees, legal proceedings will be initiated to recover the full amount owed.',
      'All costs associated with debt recovery, including legal fees, will be added to the outstanding balance.',
      'Image Fitness Training reserves the right to suspend access to course materials and community platforms for students with overdue payments.',
    ],
  },
  {
    title: '5. Course Transfers & Deferrals',
    content: [
      'Course transfers may be requested up to 14 days before the course start date.',
      'Deferrals are granted at the discretion of Image Fitness Training management.',
      'A maximum of one deferral per enrollment is permitted.',
      'Deferred places must be taken within 12 months of the original start date.',
    ],
  },
  {
    title: '6. Cancellation & Refunds',
    content: [
      'Course deposits are non-refundable under any circumstances.',
      'Cancellations more than 30 days before course start: 75% refund of fees paid (excluding deposit).',
      'Cancellations 15-30 days before course start: 50% refund of fees paid (excluding deposit).',
      'Cancellations less than 14 days before course start: No refund.',
    ],
  },
  {
    title: '7. Attendance Requirements',
    content: [
      'Minimum 80% attendance is required for practical sessions.',
      'Missed sessions may need to be made up in the next available intake.',
      'Failure to meet attendance requirements may result in delayed certification.',
    ],
  },
  {
    title: '8. Assessment & Certification',
    content: [
      'All assessments must be passed to receive certification.',
      'One free re-sit is included for failed assessments. Additional re-sits may incur extra fees.',
      'REPs Ireland registration is the student\'s responsibility after certification.',
    ],
  },
  {
    title: '9. Code of Conduct',
    content: [
      'Students must conduct themselves professionally at all times.',
      'Any form of harassment or discrimination will result in immediate removal without refund.',
      'Course materials are for personal use only and may not be shared or sold.',
    ],
  },
  {
    title: '10. Liability',
    content: [
      'Students participate in practical training at their own risk.',
      'Image Fitness Training is not liable for injuries during training.',
      'Students must declare any medical conditions before enrollment.',
    ],
  },
]

export default function TermsContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-950">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
              <FileText className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium">Legal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Terms & <span className="text-gold">Conditions</span>
            </h1>

            <p className="text-white/60">
              Last updated: May 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 bg-charcoal-950">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="bg-charcoal-800/30 rounded-2xl p-8 sm:p-12 border border-charcoal-700/50">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/70 mb-8 leading-relaxed">
                These terms and conditions govern your enrollment in and participation in courses offered by Image Fitness Training. By enrolling in any of our courses, you agree to be bound by these terms.
              </p>

              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-10"
                >
                  <h2 className="text-xl font-bold text-gold mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="text-white/70 leading-relaxed flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}

              <div className="mt-12 pt-8 border-t border-charcoal-700">
                <h2 className="text-xl font-bold text-gold mb-4">Contact Us</h2>
                <p className="text-white/70">
                  If you have any questions about these terms, please contact us at{' '}
                  <a href="mailto:sales@imageft.ie" className="text-gold hover:underline">
                    info@imageft.ie
                  </a>
                  {' '}or via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
