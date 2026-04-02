'use client';

import { useState, useMemo, useCallback, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Shield, CreditCard, Lock, Loader2, ArrowRight,
  User, Mail, Phone, ChevronDown, ChevronUp, Tag, X, MapPin,
} from 'lucide-react';
import { ADDON_COURSES, type AddonCourseId, type Intake } from '@/lib/addon-course-config';

type CourseId = AddonCourseId;
type Step = 'plan' | 'details' | 'payment';

interface Props {
  courseId: CourseId;
}

export function AddonCheckout({ courseId }: Props) {
  const course = ADDON_COURSES[courseId];

  // ─── State ────────────────────────────────────────────────────────
  const [selectedIntake, setSelectedIntake] = useState<Intake>(course.intakes[0]);
  const [depositAmount, setDepositAmount] = useState(course.minDeposit);
  const [months, setMonths] = useState(3);
  const [expandedStep, setExpandedStep] = useState<Step>('plan');
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');

  // ─── Coupon ────────────────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string; code: string; name: string;
    discountType: 'flat' | 'percent'; discountValue: number;
  } | null>(null);

  // ─── Calculations ─────────────────────────────────────────────────
  const discountedPrice = useMemo(() => {
    if (!appliedCoupon) return course.price;
    if (appliedCoupon.discountType === 'percent') {
      return Math.max(0, Math.round(course.price * (1 - appliedCoupon.discountValue / 100) * 100) / 100);
    }
    return Math.max(0, course.price - appliedCoupon.discountValue);
  }, [appliedCoupon, course.price]);

  const discountAmount = course.price - discountedPrice;

  // When a payment plan premium exists (installments cost more than upfront),
  // use paymentPlanPrice as the installment total. Coupons bypass the premium.
  const installmentTotal = useMemo(() => {
    if (appliedCoupon || !course.paymentPlanPrice) return discountedPrice;
    return course.paymentPlanPrice;
  }, [appliedCoupon, course.paymentPlanPrice, discountedPrice]);

  const isFullPayment = depositAmount >= discountedPrice;
  const effectiveDeposit = Math.min(depositAmount, discountedPrice);
  // If paying in installments, use the (potentially higher) installment total
  const planTotal = isFullPayment ? discountedPrice : installmentTotal;
  const remaining = planTotal - effectiveDeposit;
  const monthlyPayment = months > 0 && !isFullPayment
    ? Math.ceil((remaining / months) * 100) / 100
    : 0;

  const planSummary = useMemo(() => {
    if (isFullPayment) return `Paid in Full — €${discountedPrice.toLocaleString()}`;
    return `€${effectiveDeposit} today + €${monthlyPayment.toFixed(2)}/mo × ${months} months`;
  }, [isFullPayment, effectiveDeposit, monthlyPayment, months, discountedPrice]);

  const isDetailsValid = firstName.trim() && lastName.trim() && email.trim() && phone.trim();

  // ─── Scroll to section if #checkout in URL ───────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#checkout') {
      const el = document.getElementById('checkout');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, []);

  // ─── Step helpers ─────────────────────────────────────────────────
  const confirmPlan = useCallback(() => {
    setCompletedSteps(prev => new Set(prev).add('plan'));
    setExpandedStep('details');
  }, []);

  const confirmDetails = useCallback(() => {
    if (!isDetailsValid) return;
    setCompletedSteps(prev => new Set(prev).add('details'));
    setExpandedStep('payment');
  }, [isDetailsValid]);

  const stepNum = (s: Step) => ({ plan: 1, details: 2, payment: 3 }[s]);

  // ─── Coupon apply ─────────────────────────────────────────────────
  const applyCoupon = useCallback(async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), productId: course.productId }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponInput('');
        // Reset deposit slider to min so it stays within new discounted range
        setDepositAmount(course.minDeposit);
      }
    } catch {
      setCouponError('Could not validate coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponInput, course.productId, course.minDeposit]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError(null);
    setDepositAmount(course.minDeposit);
  }, [course.minDeposit]);

  // ─── Payment ──────────────────────────────────────────────────────
  const handlePayment = useCallback(async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setPaymentError(null);

    const form = e?.target instanceof HTMLFormElement ? e.target : document.querySelector('form');
    const domCardNumber = form?.querySelector<HTMLInputElement>('input[autocomplete="cc-number"]')?.value || '';
    const domCardMonth = form?.querySelector<HTMLSelectElement>('select[autocomplete="cc-exp-month"]')?.value || '';
    const domCardYear = form?.querySelector<HTMLSelectElement>('select[autocomplete="cc-exp-year"]')?.value || '';
    const domCardCvc = form?.querySelector<HTMLInputElement>('input[autocomplete="cc-csc"]')?.value || '';

    const finalCardNumber = (cardNumber || domCardNumber).replace(/\s/g, '');
    const finalExpMonth = cardExpMonth || domCardMonth;
    const finalExpYear = cardExpYear || domCardYear;
    const finalCvc = cardCvc || domCardCvc;

    if (!finalCardNumber || finalCardNumber.length < 13) {
      setPaymentError('Please enter a valid card number.');
      setIsSubmitting(false);
      return;
    }
    if (!finalExpMonth || !finalExpYear) {
      setPaymentError('Please enter your card expiry date.');
      setIsSubmitting(false);
      return;
    }
    if (!finalCvc || finalCvc.length < 3) {
      setPaymentError('Please enter your card security code (CVC).');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout/create-addon-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          intakeId: selectedIntake.id,
          location: selectedIntake.location,
          startDate: selectedIntake.startDate,
          term: selectedIntake.term,
          depositAmount: effectiveDeposit,
          months,
          monthlyPayment,
          discountedPrice: planTotal,
          couponCode: appliedCoupon?.code || null,
          couponId: appliedCoupon?.id || null,
          firstName,
          lastName,
          email,
          phone,
          cardNumber: finalCardNumber,
          cardExpMonth: finalExpMonth,
          cardExpYear: finalExpYear,
          cardCvc: finalCvc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      setSuccessName(firstName);
      setPaymentSuccess(true);
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [course.id, effectiveDeposit, months, monthlyPayment, firstName, lastName, email, phone, cardNumber, cardExpMonth, cardExpYear, cardCvc]);

  // ─── Success Screen ───────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-charcoal-950 to-black flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">You&apos;re Enrolled!</h2>
          <p className="text-zinc-400 text-lg mb-2">
            Welcome, {successName}. Your place on the <span className="text-gold">{course.name}</span> course is confirmed.
          </p>
          <p className="text-zinc-500 text-sm">A confirmation email is on its way to {email}.</p>
        </motion.div>
      </section>
    );
  }

  // ─── Step Header ──────────────────────────────────────────────────
  const StepHeader = ({
    step, title, subtitle, disabled,
  }: { step: Step; title: string; subtitle?: string; disabled?: boolean }) => (
    <button
      onClick={() => !disabled && setExpandedStep(step)}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-3 md:p-4 rounded-xl border transition-colors ${
        disabled
          ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50 cursor-not-allowed'
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm ${
          completedSteps.has(step) ? 'bg-gold text-black' : 'bg-zinc-800 text-zinc-400'
        }`}>
          {completedSteps.has(step) ? <Check className="w-4 h-4" /> : stepNum(step)}
        </span>
        <div className="text-left">
          <span className="text-white font-semibold text-sm md:text-base block">{title}</span>
          {subtitle && <span className="text-gold text-xs md:text-sm">{subtitle}</span>}
        </div>
      </div>
      {expandedStep === step
        ? <ChevronUp className="w-5 h-5 text-zinc-400" />
        : <ChevronDown className="w-5 h-5 text-zinc-400" />}
    </button>
  );

  // ─── Main Render ──────────────────────────────────────────────────
  return (
    <section className="relative pt-20 pb-40 md:pb-32 md:py-28 bg-gradient-to-b from-charcoal-950 to-black min-h-screen">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-full mb-4">
            <span className="text-gold text-xs font-semibold tracking-wide uppercase">{course.badge}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Enrol — <span className="text-gold">{course.name}</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto">{course.fullName}</p>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex justify-center gap-4 md:gap-8 mb-8 md:mb-12"
        >
          {[
            { icon: Shield, label: 'REPs Accredited' },
            { icon: Lock, label: 'Secure Payment' },
            { icon: CreditCard, label: '0% Finance' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-zinc-400">
              <Icon className="w-4 h-4 text-gold" />
              <span className="text-xs md:text-sm">{label}</span>
            </div>
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6 items-start">

          {/* ── Left: Course summary ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:sticky lg:top-28"
          >
            <p className="text-gold text-xs font-mono uppercase tracking-wider mb-2">What&apos;s included</p>
            <h3 className="text-white font-bold text-lg mb-1">{course.name}</h3>
            <p className="text-zinc-500 text-xs flex items-center gap-1 mb-4">
              <MapPin className="w-3 h-3 text-gold flex-shrink-0" />
              {selectedIntake.locationLabel}
              {selectedIntake.startDate && (
                <> · {new Date(selectedIntake.startDate + 'T00:00:00').toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}</>
              )}
            </p>
            <ul className="space-y-2.5">
              {course.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-zinc-800">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">€{course.price.toLocaleString()}</span>
                <span className="text-zinc-500 text-sm">upfront</span>
              </div>
              {course.paymentPlanPrice ? (
                <p className="text-zinc-500 text-xs mt-1">
                  or €{Math.ceil(course.paymentPlanPrice / course.maxMonths)}/mo × {course.maxMonths} (€{course.paymentPlanPrice} total)
                </p>
              ) : (
                <p className="text-zinc-500 text-xs mt-1">Payment plans from €{course.minDeposit} deposit</p>
              )}
            </div>
          </motion.div>

          {/* ── Right: Checkout steps ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* STEP 1: Payment Plan Slider */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <StepHeader
                step="plan"
                title="Choose Your Payment Plan"
                subtitle={completedSteps.has('plan') ? planSummary : undefined}
              />
              <AnimatePresence>
                {expandedStep === 'plan' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 md:p-6 mt-3 space-y-8">

                      {/* Price display */}
                      <div className="text-center">
                        <p className="text-zinc-400 text-sm mb-1">{course.fullName}</p>
                        {appliedCoupon ? (
                          <div className="flex items-center justify-center gap-3">
                            <p className="text-2xl text-zinc-500 line-through">€{course.price.toLocaleString()}</p>
                            <p className="text-4xl font-bold text-gold">€{discountedPrice.toLocaleString()}</p>
                          </div>
                        ) : (
                          <p className="text-4xl font-bold text-white">€{course.price.toLocaleString()}</p>
                        )}
                      </div>

                      {/* Intake / Location selector — only shown when > 1 intake */}
                      {course.intakes.length > 1 && (
                        <div>
                          <label className="text-white font-semibold text-sm md:text-base flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-gold" /> Choose Your Intake
                          </label>
                          <div className="space-y-2">
                            {course.intakes.map((intake) => (
                              <button
                                key={intake.id}
                                type="button"
                                onClick={() => setSelectedIntake(intake)}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm ${
                                  selectedIntake.id === intake.id
                                    ? 'bg-gold/10 border-gold text-white'
                                    : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                                }`}
                              >
                                <span className="font-semibold">{intake.label}</span>
                                {selectedIntake.id === intake.id && (
                                  <Check className="w-4 h-4 text-gold inline ml-2" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pay in Full / Installment toggle */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDepositAmount(discountedPrice)}
                          className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                            isFullPayment
                              ? 'bg-gold text-black border-gold'
                              : 'bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                          <span className="block text-xs opacity-70 mb-0.5">Pay in Full</span>
                          <span className="block font-bold">€{discountedPrice.toLocaleString()}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (isFullPayment) setDepositAmount(course.minDeposit); }}
                          className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                            !isFullPayment
                              ? 'bg-gold/10 text-gold border-gold'
                              : 'bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                          <span className="block text-xs opacity-70 mb-0.5">Payment Plan</span>
                          {course.paymentPlanPrice ? (
                            <span className="block font-bold">€{Math.ceil(course.paymentPlanPrice / course.maxMonths)}/mo × {course.maxMonths}</span>
                          ) : (
                            <span className="block font-bold">From €{course.minDeposit}</span>
                          )}
                        </button>
                      </div>

                      {/* Deposit Slider — only shown in installment mode */}
                      {!isFullPayment && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-white font-semibold text-sm md:text-base">Deposit Amount</label>
                            <span className="text-gold font-bold text-lg md:text-xl">€{effectiveDeposit}</span>
                          </div>
                          <input
                            type="range"
                            min={course.minDeposit}
                            max={discountedPrice - 1}
                            step={50}
                            value={Math.min(depositAmount, discountedPrice - 1)}
                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-gold slider-gold"
                          />
                          <div className="flex justify-between text-xs text-zinc-500 mt-1">
                            <span>€{course.minDeposit} min deposit</span>
                            <span>Drag to adjust</span>
                          </div>
                        </div>
                      )}

                      {/* Months Slider */}
                      {!isFullPayment && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-white font-semibold text-sm md:text-base">Number of Months</label>
                            <span className="text-gold font-bold text-lg md:text-xl">{months} month{months !== 1 ? 's' : ''}</span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={course.maxMonths}
                            step={1}
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-gold slider-gold"
                          />
                          <div className="flex justify-between text-xs text-zinc-500 mt-1">
                            <span>1 month</span>
                            <span>{course.maxMonths} months</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Coupon Code */}
                      <div>
                        <p className="text-zinc-400 text-xs font-medium mb-2 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Have a coupon code?
                        </p>
                        {appliedCoupon ? (
                          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2.5">
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-green-300 font-semibold">{appliedCoupon.code}</span>
                              <span className="text-zinc-400">— {appliedCoupon.discountType === 'percent'
                                ? `${appliedCoupon.discountValue}% off`
                                : `€${appliedCoupon.discountValue} off`}
                              </span>
                            </div>
                            <button onClick={removeCoupon} className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                              onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                              placeholder="Enter code"
                              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors font-mono tracking-wider uppercase"
                            />
                            <button
                              onClick={applyCoupon}
                              disabled={!couponInput.trim() || isApplyingCoupon}
                              className="px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                            </button>
                          </div>
                        )}
                        {couponError && (
                          <p className="text-red-400 text-xs mt-1.5">{couponError}</p>
                        )}
                      </div>

                      {/* Summary box */}
                      <div className="bg-zinc-800/50 rounded-xl p-4 space-y-2 text-sm">
                        {appliedCoupon && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Original price</span>
                              <span className="text-zinc-500 line-through">€{course.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-400">Discount ({appliedCoupon.code})</span>
                              <span className="text-green-400 font-semibold">−€{discountAmount.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Due today</span>
                          <span className="text-white font-semibold">€{effectiveDeposit}</span>
                        </div>
                        {!isFullPayment && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Monthly ({months} months, billed 30th)</span>
                              <span className="text-white font-semibold">€{monthlyPayment.toFixed(2)}/mo</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-700 pt-2">
                              <span className="text-zinc-400">Total</span>
                              <span className="text-gold font-bold">€{planTotal.toLocaleString()}</span>
                            </div>
                          </>
                        )}
                        {isFullPayment && (
                          <div className="flex justify-between border-t border-zinc-700 pt-2">
                            <span className="text-zinc-400">Total (paid in full)</span>
                            <span className="text-gold font-bold">€{discountedPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={confirmPlan}
                        className="w-full bg-gold hover:bg-yellow-400 text-black font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* STEP 2: Your Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <StepHeader
                step="details"
                title="Your Details"
                subtitle={completedSteps.has('details') ? `${firstName} ${lastName} · ${email}` : undefined}
                disabled={!completedSteps.has('plan')}
              />
              <AnimatePresence>
                {expandedStep === 'details' && completedSteps.has('plan') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 md:p-6 mt-3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-zinc-400 text-xs mb-1.5 block">First Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="John"
                              autoComplete="given-name"
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-3 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-zinc-400 text-xs mb-1.5 block">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Smith"
                              autoComplete="family-name"
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-3 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 text-xs mb-1.5 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            autoComplete="email"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-3 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 text-xs mb-1.5 block">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+353 87 123 4567"
                            autoComplete="tel"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-3 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <button
                        onClick={confirmDetails}
                        disabled={!isDetailsValid}
                        className="w-full bg-gold hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* STEP 3: Card Payment */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <StepHeader
                step="payment"
                title="Card Payment"
                subtitle={completedSteps.has('payment') ? 'Paid' : undefined}
                disabled={!completedSteps.has('details')}
              />
              <AnimatePresence>
                {expandedStep === 'payment' && completedSteps.has('details') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handlePayment}>
                      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 md:p-6 mt-3 space-y-4">

                        {/* Card Number */}
                        <div>
                          <label className="text-zinc-400 text-xs mb-1.5 block">Card Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                              type="text"
                              inputMode="numeric"
                              value={cardNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                setCardNumber(val.replace(/(.{4})/g, '$1 ').trim());
                              }}
                              placeholder="1234 5678 9012 3456"
                              autoComplete="cc-number"
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-3 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors font-mono tracking-wider"
                            />
                          </div>
                        </div>

                        {/* Expiry + CVC */}
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-zinc-400 text-xs mb-1.5 block">Month</label>
                            <select
                              value={cardExpMonth}
                              onChange={(e) => setCardExpMonth(e.target.value)}
                              autoComplete="cc-exp-month"
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => {
                                const m = String(i + 1).padStart(2, '0');
                                return <option key={m} value={m}>{m}</option>;
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="text-zinc-400 text-xs mb-1.5 block">Year</label>
                            <select
                              value={cardExpYear}
                              onChange={(e) => setCardExpYear(e.target.value)}
                              autoComplete="cc-exp-year"
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                            >
                              <option value="">YYYY</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                const y = String(new Date().getFullYear() + i);
                                return <option key={y} value={y}>{y}</option>;
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="text-zinc-400 text-xs mb-1.5 block">CVC</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                              <input
                                type="text"
                                inputMode="numeric"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="CVC"
                                autoComplete="cc-csc"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-3 py-3 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Payment error */}
                        {paymentError && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm"
                          >
                            {paymentError}
                          </motion.div>
                        )}

                        {/* Charge summary */}
                        <div className="bg-zinc-800/40 rounded-xl p-4 text-sm space-y-1.5">
                          {appliedCoupon && (
                            <div className="flex justify-between text-green-400 text-xs pb-1 border-b border-zinc-700">
                              <span>Coupon: {appliedCoupon.code}</span>
                              <span>−€{discountAmount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Charging today</span>
                            <span className="text-white font-semibold">€{effectiveDeposit}</span>
                          </div>
                          {!isFullPayment && (
                            <div className="flex justify-between text-zinc-500">
                              <span>Then €{monthlyPayment.toFixed(2)}/mo × {months} months</span>
                              <span>from 30th</span>
                            </div>
                          )}
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gold hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Pay €{effectiveDeposit} — Secure Enrolment
                            </>
                          )}
                        </button>

                        <div className="flex justify-center gap-6 text-xs text-zinc-600 pt-1">
                          {['Secure 256-bit SSL', 'No hidden fees', 'Cancel anytime'].map((t) => (
                            <span key={t} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-gold" />{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
