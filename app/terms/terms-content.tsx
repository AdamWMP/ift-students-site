'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

const sections = [
  {
    title: '1. Enrollment & Payment',
    content: [
      'A non-refundable deposit is required to secure your place on any course.',
      'Full payment or agreed payment plan must be completed before course completion.',
      'Payment plans are available with 2, 4, 6, or 8-month options depending on the course.',
      'Prices are subject to change but locked in at the time of enrollment.',
      'Early bird discounts must be claimed within the specified promotional period.',
    ],
  },
  {
    title: '2. Course Transfers & Deferrals',
    content: [
      'Course transfers may be requested up to 14 days before the course start date.',
      'Deferrals are granted at the discretion of Image Fitness Training management.',
      'A maximum of one deferral per enrollment is permitted.',
      'Deferred places must be taken within 12 months of the original start date.',
      'Transfer requests after the course has commenced are not permitted.',
    ],
  },
  {
    title: '3. Cancellation & Refunds',
    content: [
      'Course deposits are non-refundable under any circumstances.',
      'Cancellations more than 30 days before course start: 75% refund of fees paid (excluding deposit).',
      'Cancellations 15-30 days before course start: 50% refund of fees paid (excluding deposit).',
      'Cancellations less than 14 days before course start: No refund.',
      'Refunds are processed within 14 business days of approved cancellation request.',
    ],
  },
  {
    title: '4. Attendance Requirements',
    content: [
      'Minimum 80% attendance is required for practical sessions.',
      'Missed sessions may need to be made up in the next available intake.',
      'Theory components must be completed within the designated timeframe.',
      'Students are responsible for tracking their own attendance and progress.',
      'Failure to meet attendance requirements may result in delayed certification.',
    ],
  },
  {
    title: '5. Assessment & Certification',
    content: [
      'All assessments must be passed to receive certification.',
      'One free re-sit is included for failed assessments.',
      'Additional re-sits may incur extra fees.',
      'Certificates are issued within 4-6 weeks of successful course completion.',
      'REPs Ireland registration is the student\'s responsibility after certification.',
    ],
  },
  {
    title: '6. Code of Conduct',
    content: [
      'Students must conduct themselves professionally at all times.',
      'Respect for tutors, staff, and fellow students is mandatory.',
      'Any form of harassment or discrimination will result in immediate removal.',
      'Course materials are for personal use only and may not be shared or sold.',
      'Social media conduct representing Image Fitness Training must be professional.',
    ],
  },
  {
    title: '7. Intellectual Property',
    content: [
      'All course materials remain the intellectual property of Image Fitness Training.',
      'Photography and video recording during sessions requires permission.',
      'Student testimonials may be used for marketing with consent.',
      'Graduates may not use Image Fitness Training branding without permission.',
    ],
  },
  {
    title: '8. Liability',
    content: [
      'Students participate in practical training at their own risk.',
      'Image Fitness Training is not liable for injuries during training.',
      'Students must declare any medical conditions before enrollment.',
      'Professional indemnity insurance is recommended for all practicing trainers.',
    ],
  },
  {
    title: '9. Changes to Terms',
    content: [
      'Image Fitness Training reserves the right to modify these terms.',
      'Changes will be communicated via email to enrolled students.',
      'Continued enrollment constitutes acceptance of updated terms.',
      'Material changes affecting current students will not be applied retrospectively.',
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
              Last updated: February 2026
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
                  <a href="mailto:info@imageft.ie" className="text-gold hover:underline">
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
