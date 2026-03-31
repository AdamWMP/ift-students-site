'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, AlertTriangle, MessageCircle, Mail } from 'lucide-react';
import { addMonths, format, lastDayOfMonth, setDate } from 'date-fns';
import type { ContactData } from './onboarding-content';

interface PaymentPlanStepProps {
  contact: ContactData;
  checkoutData: Record<string, string> | null;
  onComplete: () => void;
  isCompleted: boolean;
}

export function PaymentPlanStep({ contact, checkoutData, onComplete, isCompleted }: PaymentPlanStepProps) {
  const [reviewed, setReviewed] = useState(isCompleted);

  // Parse payment data from checkout or Ontraport
  const deposit = parseFloat(checkoutData?.depositAmount || contact.depositAmount || '0');
  const monthly = parseFloat(checkoutData?.monthlyPayment || contact.monthlyAmount || '0');
  const months = parseInt(checkoutData?.months || contact.paymentMonths || '0', 10);
  const totalPrice = parseFloat(checkoutData?.packagePrice || contact.totalCost || '0');
  const packageName = checkoutData?.packageName || contact.packageName || 'Course';
  const isFullPayment = deposit >= totalPrice;

  // Generate upcoming payment dates (30th of each month)
  const paymentDates = useMemo(() => {
    if (isFullPayment || months <= 0) return [];

    const dates: { date: string; amount: string; month: number }[] = [];
    const now = new Date();
    const dayOfMonth = now.getDate();

    // Billing anchor: pay 1st-14th → 30th same month, pay 15th+ → 30th next month
    let startMonth = dayOfMonth >= 15 ? 1 : 0;

    for (let i = 0; i < months; i++) {
      const target = addMonths(now, startMonth + i);
      // Clamp to 30th or last day of month
      let payDate: Date;
      const lastDay = lastDayOfMonth(target);
      if (lastDay.getDate() < 30) {
        payDate = lastDay; // February
      } else {
        payDate = setDate(target, 30);
      }
      dates.push({
        date: format(payDate, 'd MMMM yyyy'),
        amount: `€${monthly.toFixed(2)}`,
        month: i + 1,
      });
    }

    return dates;
  }, [isFullPayment, months, monthly]);

  const handleReviewed = () => {
    if (!reviewed) {
      setReviewed(true);
      onComplete();
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-5 h-5 text-gold" />
          <h3 className="text-white font-semibold">Your Payment Plan</h3>
        </div>
        <p className="text-zinc-500 text-sm">{packageName}</p>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/30 rounded-lg p-3">
            <p className="text-zinc-500 text-xs mb-0.5">Total Course Fee</p>
            <p className="text-white font-bold text-lg">&euro;{totalPrice.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3">
            <p className="text-zinc-500 text-xs mb-0.5">Deposit Paid</p>
            <p className="text-green-400 font-bold text-lg">&euro;{deposit.toFixed(2)}</p>
          </div>
        </div>

        {!isFullPayment && months > 0 && (
          <>
            <div className="bg-zinc-800/30 rounded-lg p-3">
              <p className="text-zinc-500 text-xs mb-0.5">Monthly Payment</p>
              <p className="text-white font-bold">&euro;{monthly.toFixed(2)} &times; {months} months</p>
              <p className="text-zinc-500 text-xs mt-1">Billed on the 30th of each month</p>
            </div>

            {/* Payment schedule */}
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">Upcoming Payments</p>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {paymentDates.map((pd, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-zinc-800/20 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-zinc-700 text-zinc-400 text-xs flex items-center justify-center">{pd.month}</span>
                      <span className="text-zinc-300">{pd.date}</span>
                    </div>
                    <span className="text-white font-medium">{pd.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {isFullPayment && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
            <Check className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-green-400 font-semibold">Paid in Full</p>
            <p className="text-zinc-400 text-sm">No further payments required.</p>
          </div>
        )}

        {/* Important notes */}
        {!isFullPayment && (
          <div className="space-y-3">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/80 space-y-1">
                  <p>Payments come off the card you used for your deposit at approximately <strong className="text-white">11am</strong> on the day.</p>
                  <p>Set a reminder for funds to be available if you use separate accounts or pockets.</p>
                  <p>Your certificate will be released once <strong className="text-white">50% of your fees</strong> are paid.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support links */}
        <div className="flex items-center gap-3 pt-2">
          <a
            href="https://wa.me/353866003667"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Adam
          </a>
          <a
            href="mailto:education@imageft.ie?subject=Payment Plan Amendment"
            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Amend Payment Plan
          </a>
        </div>

        {/* Completion */}
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" /> <span className="text-sm font-semibold">Payment plan reviewed</span>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReviewed}
            className="w-full py-3 bg-gold text-black font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            I Understand My Payment Plan
          </motion.button>
        )}
      </div>
    </div>
  );
}
