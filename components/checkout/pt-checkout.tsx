'use client';

import { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  CreditCard,
  Star,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Lock,
  Tag,
  X,
  Loader2,
  Plus,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  packages as ALL_PACKAGES,
  locations,
  addOns,
  getTimetablesForLocation,
  getStartDatesForSelection,
  getEffectivePackage,
  getNextOfferExpiry,
  type AddOn,
} from '@/lib/course-data';
import { AddOnWithCohort, type CohortSelection } from './addon-with-cohort';

// ptcheckout.imageft.ie shows ONLY the three flagship packages.
// The four standalone/bundle packages (PT-only, Group-only, Launch Pad,
// Online Coaching) are unique to checkout.imageft.ie/enrol.
const PTCHECKOUT_PACKAGE_IDS = new Set(['pro-coach', 'complete-coach', 'fitness-business-coach']);
const RAW_PACKAGES = ALL_PACKAGES.filter((p) => PTCHECKOUT_PACKAGE_IDS.has(p.id));
// Apply any currently-active special offer (price, originalPrice, minDeposit,
// badge). Re-evaluated at module load; auto-reverts to base price once the
// offer's `expires` timestamp passes.
const packages = RAW_PACKAGES.map((p) => getEffectivePackage(p.id) ?? p);

// ─── Types ─────────────────────────────────────────────────────────────
type Step = 'package' | 'addons' | 'plan' | 'details' | 'payment';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timetable: string;
  startDate: string;
}

// ─── Bank Holiday Offer Countdown ────────────────────────────────────
// Shows a live countdown banner until the soonest-expiring special offer
// runs out. Renders nothing once all offers have expired — so leaving
// this in the tree after Bank Holiday Monday is safe.
function CountdownCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-black/50 rounded px-2 py-1 min-w-[2.4rem] md:min-w-[2.75rem]">
      <span className="text-base md:text-xl font-bold text-white tabular-nums leading-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-wider leading-none mt-0.5">
        {label}
      </span>
    </div>
  );
}

function BankHolidayCountdown({ compact = false }: { compact?: boolean }) {
  const expiry = useMemo(() => getNextOfferExpiry(), []);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!expiry) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [expiry]);

  if (!expiry) return null;
  const diffMs = expiry.getTime() - now.getTime();
  if (diffMs <= 0) return null;

  const days = Math.floor(diffMs / 86_400_000);
  const hours = Math.floor((diffMs / 3_600_000) % 24);
  const minutes = Math.floor((diffMs / 60_000) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-white/90">
        <Sparkles className="w-3 h-3 text-red-300" />
        <span className="font-semibold">Offer ends in</span>
        <span className="tabular-nums font-bold text-red-200">
          {days}d {hours.toString().padStart(2, '0')}h{' '}
          {minutes.toString().padStart(2, '0')}m {seconds.toString().padStart(2, '0')}s
        </span>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-xl border-2 border-red-500/50 bg-gradient-to-r from-red-600/20 via-amber-500/15 to-red-600/20 p-3 md:p-4 shadow-[0_0_24px_rgba(239,68,68,0.15)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-red-300 flex-shrink-0 animate-pulse" />
          <div>
            <p className="text-sm md:text-base font-bold text-white leading-tight">
              Bank Holiday Offer
            </p>
            <p className="text-[11px] md:text-xs text-zinc-300 leading-tight">
              €300 off The Cert, The Career & The Business — secure your place with €199.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 self-start md:self-auto">
          <CountdownCell value={days} label="Days" />
          <span className="text-red-300 font-bold text-lg md:text-xl pb-2">:</span>
          <CountdownCell value={hours} label="Hrs" />
          <span className="text-red-300 font-bold text-lg md:text-xl pb-2">:</span>
          <CountdownCell value={minutes} label="Min" />
          <span className="text-red-300 font-bold text-lg md:text-xl pb-2">:</span>
          <CountdownCell value={seconds} label="Sec" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────
export function PtCheckout() {
  return <CheckoutForm />;
}

function CheckoutForm() {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  // Cohort selections for add-ons that require one (Mat / Reformer Pilates).
  // Keyed by addon id. Cleared automatically when the add-on is toggled off
  // so a re-selection forces the student to re-pick (prevents stale data).
  const [addonCohorts, setAddonCohorts] = useState<Record<string, CohortSelection>>({});
  const [depositAmount, setDepositAmount] = useState(500);
  const [months, setMonths] = useState(6);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    timetable: '',
    startDate: '',
  });
  const [expandedStep, setExpandedStep] = useState<Step>('package');
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedContactId, setCompletedContactId] = useState<string | null>(null);

  // ─── Card Fields ────────────────────────────────────────────────────
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // ─── Coupon State ─────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    name: string;
    discountType: 'flat' | 'percent';
    discountValue: number;
    description: string;
  } | null>(null);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === selectedPackageId) ?? null,
    [selectedPackageId]
  );

  // Add-on totals — addons may be dual-priced (e.g. Mat Pilates: €1,800
  // upfront / €2,000 plan). The slider's max uses the UPFRONT total so a
  // student dragging to the top pays the discounted price. The plan total
  // is used to compute monthly instalments (so monthly × months sums to
  // the higher plan total). The €200 delta is the cost of the plan.
  const addOnsTotal = useMemo(() => {
    // Upfront total — sum of addon.price (lower / discounted)
    return addOns.filter((a) => selectedAddOns.has(a.id)).reduce((sum, a) => sum + a.price, 0);
  }, [selectedAddOns]);

  const addOnsTotalPlan = useMemo(() => {
    // Plan total — uses paymentPlanPrice when present, else falls back to price
    return addOns
      .filter((a) => selectedAddOns.has(a.id))
      .reduce((sum, a) => sum + (a.paymentPlanPrice ?? a.price), 0);
  }, [selectedAddOns]);

  const addOnsSavings = useMemo(() => {
    return addOns
      .filter((a) => selectedAddOns.has(a.id))
      .reduce((sum, a) => sum + ((a.originalPrice || a.price) - a.price), 0);
  }, [selectedAddOns]);

  // Filter add-ons based on selected package
  const filteredAddOns = useMemo(() => {
    if (!selectedPackageId) return addOns;
    return addOns.filter((a) => !a.excludeFromPackages?.includes(selectedPackageId));
  }, [selectedPackageId]);

  // combinedPrice = upfront total (slider max). combinedPricePlan = what
  // the customer pays across deposit + monthly instalments if they don't
  // drag the slider to the top.
  const combinedPrice = (selectedPackage?.price ?? 0) + addOnsTotal;
  const combinedPricePlan = (selectedPackage?.price ?? 0) + addOnsTotalPlan;

  // Coupon discount
  const discount = useMemo(() => {
    if (!appliedCoupon || !selectedPackage) return 0;
    if (appliedCoupon.discountType === 'percent') {
      return Math.round(combinedPrice * (appliedCoupon.discountValue / 100) * 100) / 100;
    }
    return Math.min(appliedCoupon.discountValue, combinedPrice);
  }, [appliedCoupon, selectedPackage, combinedPrice]);

  // Apply coupon to both totals — discount is whichever path the customer chooses
  const discountedPrice = combinedPrice - discount;
  const discountedPricePlan = combinedPricePlan - discount;

  const effectiveDeposit = Math.min(depositAmount, discountedPrice);
  // isFullPayment: deposit has been dragged to the slider's max → student
  // pays the upfront price in full, gets the €200 (or whatever) discount.
  const isFullPayment = effectiveDeposit >= discountedPrice;
  // When on a plan, the total paid across deposit + instalments equals the
  // plan price (higher). When in full, it equals the upfront price (lower).
  const effectiveTotal = isFullPayment ? discountedPrice : discountedPricePlan;
  const remaining = isFullPayment ? 0 : (discountedPricePlan - effectiveDeposit);
  const monthlyPayment = months > 0 && !isFullPayment ? Math.ceil((remaining / months) * 100) / 100 : 0;
  // Upfront savings — shown to the student as a "save €X by paying upfront" hint
  const planVsUpfrontSavings = Math.max(0, combinedPricePlan - combinedPrice);

  // Reset deposit/months when package changes
  useEffect(() => {
    if (selectedPackage) {
      setDepositAmount(selectedPackage.minDeposit);
      setMonths((prev) => Math.min(prev, selectedPackage.maxMonths));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackageId]);

  // Available timetables & start dates based on location selection
  const availableTimetables = useMemo(() => {
    if (!formData.location) return [];
    return getTimetablesForLocation(formData.location);
  }, [formData.location]);

  const availableStartDates = useMemo(() => {
    if (!formData.location || !formData.timetable) return [];
    const now = new Date();
    const lateBookingCutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    return getStartDatesForSelection(formData.location, formData.timetable).filter(
      (sd) => new Date(sd.date) > lateBookingCutoff
    );
  }, [formData.location, formData.timetable]);

  // ─── Coupon Validation ────────────────────────────────────────────
  const validateCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), productId: 107 }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError(null);
  }, []);

  // ─── Add-On Toggle ──────────────────────────────────────────────────
  const toggleAddOn = useCallback((id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // If toggling OFF a cohort-required add-on, drop its cohort data too
    setAddonCohorts((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // ─── Cohort setter for Mat / Reformer add-ons ────────────────────────
  const setAddonCohort = useCallback((id: string, cohort: CohortSelection | null) => {
    setAddonCohorts((prev) => {
      const next = { ...prev };
      if (cohort) next[id] = cohort;
      else delete next[id];
      return next;
    });
  }, []);

  // Continue-button gate: every selected cohort-required add-on must have
  // location + timetable + start-date all filled before payment can proceed.
  const cohortAddOnsResolved = useMemo(() => {
    return addOns
      .filter((a) => a.requiresCohort && selectedAddOns.has(a.id))
      .every((a) => {
        const c = addonCohorts[a.id];
        return !!(c && c.locationId && c.timetableId && c.startDate);
      });
  }, [selectedAddOns, addonCohorts]);

  // ─── Step Navigation ──────────────────────────────────────────────
  const selectPackage = useCallback((id: string) => {
    setSelectedPackageId(id);
    setSelectedAddOns((prev) => {
      const excluded = addOns.filter((a) => a.excludeFromPackages?.includes(id)).map((a) => a.id);
      if (excluded.length === 0) return prev;
      const next = new Set(prev);
      excluded.forEach((eid) => next.delete(eid));
      return next;
    });
    setCompletedSteps((prev) => new Set(prev).add('package'));
    setExpandedStep('addons');
  }, []);

  const confirmAddOns = useCallback(() => {
    setCompletedSteps((prev) => new Set(prev).add('addons'));
    setExpandedStep('plan');
  }, []);

  const confirmPlan = useCallback(() => {
    setCompletedSteps((prev) => new Set(prev).add('plan'));
    setExpandedStep('details');
  }, []);

  const isFormValid = useMemo(() => {
    const contactValid =
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '';
    const isOnline = formData.timetable === 'online-self-paced';
    const scheduleValid =
      formData.location !== '' &&
      formData.timetable !== '' &&
      (isOnline || formData.startDate !== '');
    return contactValid && scheduleValid;
  }, [formData]);

  const confirmDetails = useCallback(() => {
    if (!isFormValid) return;
    setCompletedSteps((prev) => new Set(prev).add('details'));
    setExpandedStep('payment');
  }, [isFormValid]);

  // ─── Payment Submission ───────────────────────────────────────────
  const handlePayment = useCallback(
    async (e?: FormEvent) => {
      if (e) e.preventDefault();
      if (!selectedPackage || !isFormValid) return;

      const form = e?.target instanceof HTMLFormElement ? e.target : document.querySelector('form');
      const domCardNumber =
        form?.querySelector<HTMLInputElement>('input[autocomplete="cc-number"]')?.value || '';
      const domCardMonth =
        form?.querySelector<HTMLSelectElement>('select[autocomplete="cc-exp-month"]')?.value || '';
      const domCardYear =
        form?.querySelector<HTMLSelectElement>('select[autocomplete="cc-exp-year"]')?.value || '';
      const domCardCvc =
        form?.querySelector<HTMLInputElement>('input[autocomplete="cc-csc"]')?.value || '';

      const finalCardNumber = (cardNumber || domCardNumber).replace(/\s/g, '');
      const finalExpMonth = cardExpMonth || domCardMonth;
      const finalExpYear = cardExpYear || domCardYear;
      const finalCvc = cardCvc || domCardCvc;

      if (!finalCardNumber || finalCardNumber.length < 13) {
        setPaymentError('Please enter a valid card number.');
        return;
      }
      if (!finalExpMonth || !finalExpYear) {
        setPaymentError('Please enter your card expiry date.');
        return;
      }
      if (!finalCvc || finalCvc.length < 3) {
        setPaymentError('Please enter your card security code (CVC).');
        return;
      }

      setIsSubmitting(true);
      setPaymentError(null);

      try {
        const res = await fetch('/api/checkout/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            packagePrice: selectedPackage.price,
            addOns: Array.from(selectedAddOns),
            addOnsTotal,
            addOnsTotalPlan,
            addonCohorts,
            isFullPayment,
            totalPrice: discountedPrice,
            depositAmount: effectiveDeposit,
            months,
            monthlyPayment,
            cardNumber: finalCardNumber,
            cardExpMonth: finalExpMonth,
            cardExpYear: finalExpYear,
            cardCvc: finalCvc,
            coupon: appliedCoupon
              ? {
                  id: appliedCoupon.id,
                  code: appliedCoupon.code,
                  discountType: appliedCoupon.discountType,
                  discountValue: appliedCoupon.discountValue,
                  originalPrice: combinedPrice,
                  discount,
                }
              : null,
            ...formData,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Payment failed');

        if (data.contactId) {
          sessionStorage.setItem(
            `onboarding_${data.contactId}`,
            JSON.stringify({
              packageId: selectedPackage.id,
              packageName: selectedPackage.name,
              packagePrice: selectedPackage.price,
              addOns: Array.from(selectedAddOns),
              addOnsTotal,
              totalPrice: discountedPrice,
              depositAmount: effectiveDeposit,
              months,
              monthlyPayment,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              location: formData.location,
              timetable: formData.timetable,
              startDate: formData.startDate,
            })
          );
          setCompletedContactId(data.contactId);
        }

        setPaymentSuccess(true);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setPaymentError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      selectedPackage,
      isFormValid,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      selectedAddOns,
      addOnsTotal,
      discountedPrice,
      effectiveDeposit,
      months,
      monthlyPayment,
      appliedCoupon,
      combinedPrice,
      discount,
      formData,
    ]
  );

  // ─── Redirect on success ──────────────────────────────────────────
  useEffect(() => {
    if (paymentSuccess && completedContactId) {
      window.location.href = `/onboarding/${completedContactId}`;
    }
  }, [paymentSuccess, completedContactId]);

  // ─── Render Helpers ───────────────────────────────────────────────
  const stepOrder: Step[] = ['package', 'addons', 'plan', 'details', 'payment'];
  const stepNumber = (step: Step) => stepOrder.indexOf(step) + 1;

  const StepHeader = ({
    step,
    title,
    subtitle,
    disabled,
  }: {
    step: Step;
    title: string;
    subtitle?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={() => !disabled && setExpandedStep(step)}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-3 md:p-4 rounded-xl border transition-colors ${
        disabled
          ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50 cursor-not-allowed'
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-2 md:gap-3">
        <span
          className={`w-7 h-7 md:w-8 md:h-8 rounded-full font-bold flex items-center justify-center text-xs md:text-sm flex-shrink-0 ${
            completedSteps.has(step) ? 'bg-[#D4A836] text-black' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {completedSteps.has(step) ? (
            <Check className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            stepNumber(step)
          )}
        </span>
        <div className="text-left">
          <span className="text-white font-semibold text-sm md:text-base block">{title}</span>
          {subtitle && <span className="text-[#D4A836] text-xs md:text-sm">{subtitle}</span>}
        </div>
      </div>
      {expandedStep === step ? (
        <ChevronUp className="w-5 h-5 text-zinc-400 flex-shrink-0" />
      ) : (
        <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0" />
      )}
    </button>
  );

  // ─── Success screen ───────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <section className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center py-20"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
          <p className="text-zinc-400 mb-2">
            Thank you, {formData.firstName}. Redirecting you to your onboarding&hellip;
          </p>
          <div className="mt-4">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4A836] mx-auto" />
          </div>
        </motion.div>
      </section>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────
  return (
    <section className="relative pt-8 pb-36 md:pb-16 md:pt-16 min-h-screen bg-[#0d0d0d]">
      <div className="container mx-auto px-3 sm:px-4">

        {/* Logo / Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10 max-w-4xl mx-auto">
          <Image
            src="/logo-light.png"
            alt="Image Fitness Training"
            width={140}
            height={40}
            className="h-8 md:h-10 w-auto"
          />
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Lock className="w-3.5 h-3.5 text-[#D4A836]" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-10 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#D4A836] text-[#D4A836]" />
              ))}
            </div>
            <span className="text-zinc-400 text-xs md:text-sm">
              500+ PT Graduates &middot; Ireland&apos;s Leading PT Educator
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
            BOOK YOUR <span className="text-[#D4A836]">PT COURSE</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto">
            Choose your pathway, customise your payment plan, and secure your place
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 mb-6 md:mb-10 max-w-4xl mx-auto"
        >
          {[
            { icon: <Shield className="w-3.5 h-3.5 text-[#D4A836] flex-shrink-0" />, label: 'REPs Accredited' },
            { icon: <Shield className="w-3.5 h-3.5 text-[#D4A836] flex-shrink-0" />, label: 'QQI Recognised' },
            { icon: <Lock className="w-3.5 h-3.5 text-[#D4A836] flex-shrink-0" />, label: 'Secure Payment' },
            { icon: <CreditCard className="w-3.5 h-3.5 text-[#D4A836] flex-shrink-0" />, label: '0% Finance' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-1.5 text-zinc-400 bg-zinc-900/40 border border-zinc-800 rounded-lg px-3 py-2"
            >
              {icon}
              <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">{label}</span>
            </div>
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto">

          {/* ──────────── STEP 1: Choose Package ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 md:mb-6"
          >
            <StepHeader
              step="package"
              title="Choose Your Pathway"
              subtitle={
                selectedPackage
                  ? `${selectedPackage.name} — €${selectedPackage.price.toLocaleString()}`
                  : undefined
              }
            />
            <AnimatePresence>
              {expandedStep === 'package' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <BankHolidayCountdown />
                  </div>
                  <div className="space-y-3 pt-1">
                    {packages.map((pkg) => (
                      <motion.button
                        key={pkg.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectPackage(pkg.id)}
                        className={`relative w-full p-4 md:p-6 rounded-xl border-2 text-left transition-all ${
                          selectedPackageId === pkg.id
                            ? 'border-[#D4A836] bg-[#D4A836]/10'
                            : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#D4A836] text-black text-[10px] md:text-xs font-bold rounded-full">
                            MOST POPULAR
                          </div>
                        )}
                        {pkg.badge && (
                          <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-red-500/90 text-white text-[10px] md:text-xs font-bold rounded-full">
                            {pkg.badge}
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                              {pkg.name}
                            </h3>
                            <p className="text-zinc-400 text-xs md:text-sm mb-3">
                              {pkg.description}
                            </p>
                            <ul className="space-y-1.5 mb-3">
                              {pkg.features.map((feature, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs md:text-sm text-zinc-300"
                                >
                                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#D4A836]" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-zinc-500 text-xs">
                              Up to {pkg.maxMonths} months &bull; Min &euro;{pkg.minDeposit} deposit
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {pkg.originalPrice && (
                              <span className="text-zinc-500 text-sm line-through block">
                                &euro;{pkg.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-xl md:text-2xl font-bold text-white block">
                              &euro;{pkg.price.toLocaleString()}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${
                                selectedPackageId === pkg.id
                                  ? 'bg-[#D4A836] border-[#D4A836]'
                                  : 'border-zinc-600'
                              }`}
                            >
                              {selectedPackageId === pkg.id && (
                                <Check className="w-4 h-4 text-black" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ──────────── STEP 2: Enhance Your Package (Add-Ons) ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4 md:mb-6"
          >
            <StepHeader
              step="addons"
              title="Enhance Your Package"
              subtitle={
                completedSteps.has('addons')
                  ? selectedAddOns.size > 0
                    ? `${selectedAddOns.size} add-on${selectedAddOns.size > 1 ? 's' : ''} — +€${addOnsTotal.toLocaleString()}`
                    : 'No add-ons selected'
                  : undefined
              }
              disabled={!selectedPackage}
            />
            <AnimatePresence>
              {expandedStep === 'addons' && selectedPackage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-4">
                    {/* Intro */}
                    <div className="bg-gradient-to-r from-[#D4A836]/10 to-transparent rounded-xl border border-[#D4A836]/20 p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[#D4A836]" />
                        <h3 className="text-white font-semibold text-sm md:text-base">
                          Add to your bundle — spread the cost
                        </h3>
                      </div>
                      <p className="text-zinc-400 text-xs md:text-sm">
                        Most students add at least one extra qualification. Everything rolls into{' '}
                        <span className="text-[#D4A836] font-semibold">one easy payment plan</span>{' '}
                        — no extra upfront cost.
                      </p>
                    </div>

                    {/* Add-on Cards */}
                    <div className="space-y-2.5">
                      {filteredAddOns.map((addon: AddOn) => {
                        const isSelected = selectedAddOns.has(addon.id);
                        // Mat Pilates + Reformer Pilates use the cohort-picker
                        // variant so the student locks in location/timetable/
                        // start-date before they can continue.
                        if (addon.requiresCohort) {
                          return (
                            <AddOnWithCohort
                              key={addon.id}
                              addon={addon}
                              selected={isSelected}
                              cohort={addonCohorts[addon.id] ?? null}
                              onToggle={() => toggleAddOn(addon.id)}
                              onCohortChange={(c) => setAddonCohort(addon.id, c)}
                            />
                          );
                        }
                        return (
                          <motion.button
                            key={addon.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`relative w-full text-left rounded-xl border-2 transition-all overflow-hidden ${
                              isSelected
                                ? 'border-[#D4A836] bg-[#D4A836]/5'
                                : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                            }`}
                          >
                            <div className="p-3 md:p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4 className="text-white font-bold text-sm">{addon.name}</h4>
                                    {addon.badge && (
                                      <span className="px-1.5 py-0.5 bg-[#D4A836]/20 text-[#D4A836] text-[10px] font-semibold rounded-full whitespace-nowrap">
                                        {addon.badge}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-zinc-500">
                                      {addon.delivery}
                                    </span>
                                  </div>
                                  <p className="text-zinc-400 text-xs mb-2 leading-relaxed">
                                    {addon.description}
                                  </p>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    {addon.highlights.map((h, i) => (
                                      <span
                                        key={i}
                                        className="flex items-center gap-1 text-[11px] text-zinc-300"
                                      >
                                        <Check className="w-2.5 h-2.5 text-[#D4A836] flex-shrink-0" />
                                        {h}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  {addon.originalPrice && (
                                    <span className="text-zinc-500 text-[11px] line-through block">
                                      &euro;{addon.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                  <span className="text-lg font-bold text-white block">
                                    &euro;{addon.price.toLocaleString()}
                                  </span>
                                  <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-1.5 ml-auto transition-colors ${
                                      isSelected
                                        ? 'bg-[#D4A836] border-[#D4A836]'
                                        : 'border-zinc-600'
                                    }`}
                                  >
                                    {isSelected ? (
                                      <Check className="w-4 h-4 text-black" />
                                    ) : (
                                      <Plus className="w-3.5 h-3.5 text-zinc-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                className="h-0.5 bg-[#D4A836] origin-left"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Summary + Continue */}
                    <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 md:p-5">
                      {selectedAddOns.size > 0 && (
                        <div className="mb-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">{selectedPackage.name}</span>
                            <span className="text-white">
                              &euro;{selectedPackage.price.toLocaleString()}
                            </span>
                          </div>
                          {addOns
                            .filter((a) => selectedAddOns.has(a.id))
                            .map((addon) => (
                              <div key={addon.id} className="flex justify-between text-sm">
                                <span className="text-zinc-400 flex items-center gap-1.5">
                                  <Plus className="w-3 h-3 text-[#D4A836]" />
                                  {addon.name}
                                </span>
                                <span className="text-white">
                                  &euro;{addon.price.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          {addOnsSavings > 0 && (
                            <div className="flex justify-between text-sm pt-1">
                              <span className="text-green-400">Bundle savings</span>
                              <span className="text-green-400">
                                -&euro;{addOnsSavings.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="border-t border-zinc-700 pt-2 flex justify-between">
                            <span className="text-white font-semibold text-sm">New Total</span>
                            <span className="text-[#D4A836] font-bold text-lg">
                              &euro;{combinedPrice.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-zinc-500 text-[11px] md:text-xs">
                            Spread across your payment plan — no extra upfront cost
                          </p>
                        </div>
                      )}
                      <button
                        onClick={confirmAddOns}
                        disabled={!cohortAddOnsResolved}
                        className="w-full py-3 md:py-4 rounded-xl bg-[#D4A836] text-black font-bold text-sm md:text-base hover:bg-[#c49830] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#D4A836]"
                      >
                        {!cohortAddOnsResolved
                          ? 'Finish picking your Mat / Reformer cohort →'
                          : selectedAddOns.size > 0
                            ? `Continue with ${selectedAddOns.size} Add-On${selectedAddOns.size > 1 ? 's' : ''}`
                            : 'No Thanks — Continue'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ──────────── STEP 3: Payment Plan ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 md:mb-6"
          >
            <StepHeader
              step="plan"
              title="Customise Payment Plan"
              subtitle={
                selectedPackage && completedSteps.has('addons')
                  ? effectiveDeposit >= discountedPrice
                    ? `Paid in Full — €${discountedPrice.toLocaleString()}`
                    : `€${effectiveDeposit} deposit + €${monthlyPayment.toFixed(2)}/mo × ${months} months`
                  : undefined
              }
              disabled={!completedSteps.has('addons')}
            />
            <AnimatePresence>
              {expandedStep === 'plan' && selectedPackage && completedSteps.has('addons') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-8 bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 md:p-6 mt-3">
                    {/* Package Summary — headline price reflects the CURRENT mode:
                        plan mode shows the plan total (e.g. €4,800), full-payment
                        mode shows the upfront total (e.g. €4,600). Pre-coupon
                        strikethrough also uses the mode-correct base. */}
                    <div className="text-center">
                      <p className="text-zinc-400 text-sm mb-1">
                        {selectedPackage.name}
                        {selectedAddOns.size > 0 &&
                          ` + ${selectedAddOns.size} add-on${selectedAddOns.size > 1 ? 's' : ''}`}
                      </p>
                      {discount > 0 ? (
                        <>
                          <p className="text-zinc-500 text-lg line-through">
                            &euro;{(isFullPayment ? combinedPrice : combinedPricePlan).toLocaleString()}
                          </p>
                          <p className="text-3xl md:text-4xl font-bold text-white">
                            &euro;{effectiveTotal.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-3xl md:text-4xl font-bold text-white">
                          &euro;{effectiveTotal.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Deposit Slider */}
                    <div>
                      <div className="mb-2 px-3 py-1.5 rounded-md bg-[#D4A836]/10 border border-[#D4A836]/30 text-[#D4A836] text-xs md:text-sm font-medium flex items-center justify-center gap-2">
                        <span>Pull slider to the top if you want to pay in full</span>
                        <span className="relative inline-block w-10 h-1.5 bg-[#D4A836]/25 rounded-full overflow-hidden flex-shrink-0">
                          <span className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D4A836] shadow-[0_0_4px_rgba(212,168,54,0.7)] slider-hint-dot" />
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-white font-semibold text-sm md:text-base">
                          Deposit Amount
                        </label>
                        <span className="text-[#D4A836] font-bold text-lg md:text-xl">
                          &euro;{depositAmount}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={selectedPackage.minDeposit}
                        max={discountedPrice}
                        step={50}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#D4A836] slider-gold"
                      />
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>&euro;{selectedPackage.minDeposit} min</span>
                        <span>&euro;{discountedPrice.toLocaleString()} (pay in full)</span>
                      </div>
                    </div>

                    {/* Months Slider */}
                    {effectiveDeposit < discountedPrice && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-white font-semibold text-sm md:text-base">
                            Number of Months
                          </label>
                          <span className="text-[#D4A836] font-bold text-lg md:text-xl">
                            {months} month{months !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={selectedPackage.maxMonths}
                          step={1}
                          value={months}
                          onChange={(e) => setMonths(Number(e.target.value))}
                          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#D4A836] slider-gold"
                        />
                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                          <span>1 month</span>
                          <span>{selectedPackage.maxMonths} months</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Coupon Code */}
                    <div>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                          <span className="text-green-400 text-sm flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            {appliedCoupon.code} applied
                            {appliedCoupon.discountType === 'percent'
                              ? ` (${appliedCoupon.discountValue}% off)`
                              : ` (-€${appliedCoupon.discountValue})`}
                          </span>
                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="text-zinc-400 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-zinc-400 text-xs">Have a coupon code?</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value);
                                setCouponError(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  validateCoupon();
                                }
                              }}
                              placeholder="Enter code"
                              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm placeholder-zinc-500 focus:border-[#D4A836] focus:outline-none transition-colors"
                            />
                            <button
                              type="button"
                              onClick={validateCoupon}
                              disabled={couponLoading || !couponCode.trim()}
                              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              {couponLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                'Apply'
                              )}
                            </button>
                          </div>
                          {couponError && (
                            <p className="text-red-400 text-xs">{couponError}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment Breakdown */}
                    <div className="bg-zinc-800/50 rounded-xl p-4 md:p-5 space-y-3">
                      <h4 className="text-white font-semibold text-sm md:text-base mb-3">
                        Payment Breakdown
                      </h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">{selectedPackage.name}</span>
                        <span className="text-white">
                          &euro;{selectedPackage.price.toLocaleString()}
                        </span>
                      </div>
                      {addOns
                        .filter((a) => selectedAddOns.has(a.id))
                        .map((addon) => (
                          <div key={addon.id} className="flex justify-between text-sm">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                              <Plus className="w-3 h-3 text-[#D4A836]" />
                              {addon.name}
                            </span>
                            <span className="text-white">
                              &euro;{addon.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      <div className="border-t border-zinc-700 pt-2 flex justify-between text-sm">
                        <span className="text-zinc-400">Course Total</span>
                        <span
                          className={`font-semibold ${discount > 0 ? 'line-through text-zinc-500' : 'text-white'}`}
                        >
                          &euro;{combinedPrice.toLocaleString()}
                        </span>
                      </div>
                      {discount > 0 && appliedCoupon && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400 flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {appliedCoupon.code}
                            </span>
                            <span className="text-green-400">
                              -&euro;{discount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Discounted Total</span>
                            <span className="text-white font-semibold">
                              &euro;{discountedPrice.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Deposit (today)</span>
                        <span className="text-[#D4A836] font-semibold">&euro;{depositAmount}</span>
                      </div>
                      {effectiveDeposit < discountedPrice && (
                        <>
                          <div className="border-t border-zinc-700 pt-3 flex justify-between text-sm">
                            <span className="text-zinc-400">Remaining Balance</span>
                            <span className="text-white">&euro;{remaining.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">
                              Monthly Payment ({months} month{months !== 1 ? 's' : ''})
                            </span>
                            <span className="text-white font-semibold">
                              &euro;{monthlyPayment.toFixed(2)}/mo
                            </span>
                          </div>
                        </>
                      )}
                      <div className="border-t border-zinc-700 pt-3 flex justify-between">
                        <span className="text-white font-bold">
                          {isFullPayment ? 'Total (paid in full)' : 'Total (across plan)'}
                        </span>
                        <span className="text-[#D4A836] font-bold text-lg">
                          &euro;{effectiveTotal.toLocaleString()}
                        </span>
                      </div>
                      {!isFullPayment && planVsUpfrontSavings > 0 && (
                        <div className="mt-1 px-2 py-1.5 rounded-md bg-[#D4A836]/8 border border-[#D4A836]/25 text-[#D4A836] text-[11px] text-center">
                          💡 Save &euro;{planVsUpfrontSavings.toLocaleString()} by dragging the slider to the top &amp; paying upfront
                        </div>
                      )}
                    </div>

                    {/* Confirm Plan Button */}
                    <button
                      onClick={confirmPlan}
                      className="w-full py-3 md:py-4 rounded-xl bg-[#D4A836] text-black font-bold text-sm md:text-base hover:bg-[#c49830] transition-colors"
                    >
                      {effectiveDeposit >= discountedPrice
                        ? `Pay €${discountedPrice.toLocaleString()} in Full — Continue`
                        : `€${effectiveDeposit} Deposit + €${monthlyPayment.toFixed(2)}/mo — Continue`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ──────────── STEP 4: Your Details ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 md:mb-6"
          >
            <StepHeader
              step="details"
              title="Your Details"
              subtitle={
                completedSteps.has('details')
                  ? `${formData.firstName} ${formData.lastName}`
                  : undefined
              }
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
                  <div className="pt-3 space-y-4 bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 md:p-6 mt-3">

                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                          <User className="w-3.5 h-3.5" /> First Name *
                        </label>
                        <input
                          type="text"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          placeholder="First name"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm placeholder:text-zinc-600 focus:border-[#D4A836] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                          <User className="w-3.5 h-3.5" /> Last Name *
                        </label>
                        <input
                          type="text"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          placeholder="Last name"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm placeholder:text-zinc-600 focus:border-[#D4A836] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email Address *
                      </label>
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm placeholder:text-zinc-600 focus:border-[#D4A836] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+353 86 123 4567"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm placeholder:text-zinc-600 focus:border-[#D4A836] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Training Location */}
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Training Location *
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                            timetable: '',
                            startDate: '',
                          })
                        }
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm focus:border-[#D4A836] focus:outline-none transition-colors"
                      >
                        <option value="">Select a location...</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timetable */}
                    {formData.location && (
                      <div>
                        <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Course Timetable *
                        </label>
                        <select
                          value={formData.timetable}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              timetable: e.target.value,
                              startDate: '',
                            })
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm focus:border-[#D4A836] focus:outline-none transition-colors"
                        >
                          <option value="">Select a timetable...</option>
                          {availableTimetables.map((tt) => (
                            <option key={tt.id} value={tt.id}>
                              {tt.name} — {tt.schedule}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Start Date */}
                    {formData.location &&
                      formData.timetable &&
                      formData.timetable !== 'online-self-paced' && (
                        <div>
                          <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Course Start Date *
                          </label>
                          {availableStartDates.length === 0 ? (
                            <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>
                                No upcoming dates for this combination.{' '}
                                <a
                                  href="mailto:info@imageft.ie"
                                  className="text-[#D4A836] hover:underline"
                                >
                                  Contact us
                                </a>{' '}
                                to register interest.
                              </span>
                            </div>
                          ) : (
                            (() => {
                              const now = new Date();
                              const selectedSd = availableStartDates.find(
                                (sd) => sd.date === formData.startDate
                              );
                              const selectedIsLate = selectedSd
                                ? new Date(selectedSd.date) < now
                                : false;
                              return (
                                <>
                                  <select
                                    value={formData.startDate}
                                    onChange={(e) =>
                                      setFormData({ ...formData, startDate: e.target.value })
                                    }
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-[16px] md:text-sm focus:border-[#D4A836] focus:outline-none transition-colors"
                                  >
                                    <option value="">Select a start date...</option>
                                    {availableStartDates.map((sd) => {
                                      const isLate = new Date(sd.date) < now;
                                      const m = new Date(sd.date).getMonth() + 1;
                                      const sellingFast = !isLate && (m === 6 || m === 7);
                                      const startTheory = !isLate && (m === 9 || m === 10);
                                      return (
                                        <option key={sd.date} value={sd.date}>
                                          {sd.label}
                                          {isLate ? ' — ⚡ Late booking still available!' : ''}
                                          {sellingFast ? ' — 🔥 Selling Fast: Limited Places' : ''}
                                          {startTheory ? ' — 📚 Book Now: Start Theory Now' : ''}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  {selectedIsLate && (
                                    <p className="mt-2 text-xs font-semibold text-orange-400">
                                      ⚡ Late booking — this course has just started, but you can still join now!
                                    </p>
                                  )}
                                  {(() => {
                                    const sd = availableStartDates.find((s) => s.date === formData.startDate);
                                    if (!sd) return null;
                                    const m = new Date(sd.date).getMonth() + 1;
                                    if (new Date(sd.date) < now) return null;
                                    if (m === 6 || m === 7) {
                                      return <p className="mt-2 text-xs font-semibold text-red-400">🔥 Selling fast — limited places remaining for this intake.</p>;
                                    }
                                    if (m === 9 || m === 10) {
                                      return <p className="mt-2 text-xs font-semibold text-emerald-400">📚 Book now and start the theory portion early — get a head start before classes begin.</p>;
                                    }
                                    return null;
                                  })()}
                                </>
                              );
                            })()
                          )}
                        </div>
                      )}

                    {/* Continue Button */}
                    <button
                      onClick={confirmDetails}
                      disabled={!isFormValid}
                      className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-colors ${
                        isFormValid
                          ? 'bg-[#D4A836] text-black hover:bg-[#c49830]'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ──────────── STEP 5: Secure Payment ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 md:mb-8"
          >
            <StepHeader
              step="payment"
              title="Secure Payment"
              disabled={!completedSteps.has('details')}
            />
            <AnimatePresence>
              {expandedStep === 'payment' &&
                completedSteps.has('details') &&
                selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <form
                      id="checkout-payment-form"
                      onSubmit={handlePayment}
                      className="pt-3 space-y-4 bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 md:p-6 mt-3"
                    >
                      {/* Order Summary */}
                      <div className="bg-zinc-800/50 rounded-xl p-4 space-y-2">
                        <h4 className="text-white font-semibold text-sm mb-3">Order Summary</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">{selectedPackage.name}</span>
                          <span className="text-white">
                            &euro;{selectedPackage.price.toLocaleString()}
                          </span>
                        </div>
                        {addOns
                          .filter((a) => selectedAddOns.has(a.id))
                          .map((addon) => (
                            <div key={addon.id} className="flex justify-between text-sm">
                              <span className="text-zinc-400 flex items-center gap-1.5">
                                <Plus className="w-3 h-3 text-[#D4A836]" />
                                {addon.name}
                              </span>
                              <span className="text-white">
                                &euro;{addon.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        {discount > 0 && appliedCoupon && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-zinc-400">Subtotal</span>
                              <span className="text-zinc-500 line-through">
                                &euro;{combinedPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-green-400 flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {appliedCoupon.code}
                              </span>
                              <span className="text-green-400">
                                -&euro;{discount.toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between text-sm pt-1">
                          <span className="text-zinc-400">
                            Charging today{effectiveDeposit < discountedPrice ? ' (deposit)' : ''}
                          </span>
                          <span className="text-[#D4A836] font-bold">&euro;{effectiveDeposit}</span>
                        </div>
                        {effectiveDeposit < discountedPrice && (
                          <div className="flex justify-between text-xs text-zinc-500 pt-1">
                            <span>
                              Then &euro;{monthlyPayment.toFixed(2)}/mo for {months} months
                            </span>
                            <span>auto-billed monthly</span>
                          </div>
                        )}
                      </div>

                      {/* Card Fields */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-1.5 text-zinc-400 text-xs">
                          <CreditCard className="w-3.5 h-3.5" /> Card Details
                        </label>
                        <div>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            value={cardNumber}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                              setCardNumber(v.replace(/(\d{4})(?=\d)/g, '$1 '));
                            }}
                            placeholder="Card number"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3.5 text-white text-[16px] md:text-sm placeholder:text-zinc-600 focus:border-[#D4A836] focus:outline-none transition-colors tracking-wider"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          <select
                            value={cardExpMonth}
                            onChange={(e) => setCardExpMonth(e.target.value)}
                            autoComplete="cc-exp-month"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 sm:px-3 py-3.5 text-white text-[16px] md:text-sm focus:border-[#D4A836] focus:outline-none transition-colors"
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) =>
                              String(i + 1).padStart(2, '0')
                            ).map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <select
                            value={cardExpYear}
                            onChange={(e) => setCardExpYear(e.target.value)}
                            autoComplete="cc-exp-year"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 sm:px-3 py-3.5 text-white text-[16px] md:text-sm focus:border-[#D4A836] focus:outline-none transition-colors"
                          >
                            <option value="">YY</option>
                            {Array.from({ length: 10 }, (_, i) =>
                              String(new Date().getFullYear() + i)
                            ).map((y) => (
                              <option key={y} value={y}>
                                {String(y).slice(-2)}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={cardCvc}
                            onChange={(e) =>
                              setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))
                            }
                            placeholder="CVC"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 sm:px-3 py-3.5 text-white text-[16px] md:text-sm placeholder:text-zinc-600 focus:border-[#D4A836] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Error */}
                      {paymentError && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                          {paymentError}
                        </div>
                      )}

                      {/* Pay Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold text-base md:text-lg transition-all flex items-center justify-center gap-2 ${
                          isSubmitting
                            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                            : 'bg-[#D4A836] text-black hover:bg-[#c49830]'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            {effectiveDeposit >= discountedPrice
                              ? `Pay €${discountedPrice.toLocaleString()} Now`
                              : `Pay €${effectiveDeposit} Deposit Now`}
                          </>
                        )}
                      </button>

                      {/* Trust Footer */}
                      <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500 pt-2">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" /> SSL Encrypted
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> Powered by Stripe
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" /> PCI Compliant
                        </span>
                      </div>
                    </form>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

          {/* ──────────── Sticky Mobile Bar ──────────── */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            >
              <div className="bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-zinc-400 block truncate">
                      {selectedPackage.name}
                      {selectedAddOns.size > 0 &&
                        ` + ${selectedAddOns.size} add-on${selectedAddOns.size > 1 ? 's' : ''}`}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">
                        &euro;{discountedPrice.toLocaleString()}
                      </span>
                      {effectiveDeposit < discountedPrice && (
                        <span className="text-[#D4A836] text-xs">
                          &euro;{monthlyPayment.toFixed(2)}/mo
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-zinc-500 block">Due today</span>
                    <span className="text-[#D4A836] font-bold text-base">&euro;{depositAmount}</span>
                  </div>
                </div>
                {expandedStep === 'payment' && completedSteps.has('details') && (
                  <button
                    form="checkout-payment-form"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg bg-[#D4A836] text-black font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Processing...' : `Pay €${effectiveDeposit} Now`}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Slider styling */}
      <style jsx global>{`
        .slider-gold::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #D4A836;
          cursor: pointer;
          border: 3px solid #0d0d0d;
          box-shadow: 0 0 0 3px rgba(212, 168, 54, 0.3);
        }
        .slider-gold::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #D4A836;
          cursor: pointer;
          border: 3px solid #0d0d0d;
          box-shadow: 0 0 0 3px rgba(212, 168, 54, 0.3);
        }
        .slider-gold::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
        }
        .slider-gold::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #3f3f46;
        }
        @keyframes slider-hint-slide {
          0%   { left: 0;                opacity: 0.4; }
          15%  { opacity: 1; }
          70%  { left: calc(100% - 8px); opacity: 1; }
          85%  { left: calc(100% - 8px); opacity: 0; }
          100% { left: 0;                opacity: 0; }
        }
        .slider-hint-dot {
          animation: slider-hint-slide 1.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
