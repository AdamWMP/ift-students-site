'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, Loader2, AlertTriangle } from 'lucide-react';
import type { ContactData } from './onboarding-content';

const CONTRACT_SECTIONS = [
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
      'REPs Ireland registration is the student\'s responsibility after certification.',
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

interface ContractStepProps {
  contact: ContactData;
  onComplete: () => void;
  isCompleted: boolean;
}

export function ContractStep({ contact, onComplete, isCompleted }: ContractStepProps) {
  const [signatureName, setSignatureName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isCompleted) {
    return (
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6 text-center">
        <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <p className="text-green-400 font-semibold">Contract Signed</p>
        <p className="text-zinc-500 text-sm mt-1">
          Signed by {contact.tcSignatureName || signatureName} on{' '}
          {contact.tcSignedDate
            ? new Date(Number(contact.tcSignedDate) * 1000).toLocaleDateString('en-IE')
            : new Date().toLocaleDateString('en-IE')}
        </p>
      </div>
    );
  }

  const handleSign = async () => {
    if (!signatureName.trim() || !agreed) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: contact.id,
          signatureName: signatureName.trim(),
          signedAt: Math.floor(Date.now() / 1000),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save contract');
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-zinc-800 flex items-center gap-3">
        <FileText className="w-5 h-5 text-gold flex-shrink-0" />
        <div>
          <h3 className="text-white font-semibold">Terms & Conditions Contract</h3>
          <p className="text-zinc-500 text-xs">Please read carefully before signing</p>
        </div>
      </div>

      {/* Contract body */}
      <div className="p-4 md:p-6 max-h-[400px] overflow-y-auto space-y-6 border-b border-zinc-800">
        <p className="text-zinc-400 text-sm">
          These terms and conditions govern your enrollment in and participation in courses offered by
          Image Fitness Training Global. By signing below, you agree to be bound by these terms.
        </p>

        {CONTRACT_SECTIONS.map((section, i) => (
          <div key={i}>
            <h4 className="text-gold font-semibold text-sm mb-2">{section.title}</h4>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="text-zinc-400 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Key warnings highlighted */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-400 font-semibold mb-1">Important Payment Terms</p>
              <ul className="text-amber-200/70 space-y-1">
                <li>Your certificate is released once 50% of total fees are paid</li>
                <li>You are liable for full course fees once enrolled</li>
                <li>Non-engagement on overdue payments may result in legal proceedings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Signature section */}
      <div className="p-4 md:p-6 space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Your Full Name (as signature)</label>
          <input
            type="text"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder={`${contact.firstName} ${contact.lastName}`}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-zinc-600 text-gold focus:ring-gold bg-zinc-800"
          />
          <span className="text-sm text-zinc-300">
            I have read, understood, and agree to the above Terms & Conditions of Image Fitness Training Global
          </span>
        </label>

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-600">
            Date: {new Date().toLocaleDateString('en-IE')}
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSign}
            disabled={!signatureName.trim() || !agreed || submitting}
            className="px-6 py-3 bg-gold text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Sign Contract
          </motion.button>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
