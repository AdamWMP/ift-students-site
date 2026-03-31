'use client';

import { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  GraduationCap,
  Clock,
} from 'lucide-react';
import { packages, locations, timetables, courseStartDates, addOns, type AddOn } from '@/lib/course-data';

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

// ─── Main Component ──────────────────────────────────────────────────
export function CheckoutContent() {
  return <CheckoutForm />;
}

function CheckoutForm() {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [depositAmount, setDepositAmount] = useState(300);
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
    minDeposit?: number;
  } | null>(null);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === selectedPackageId) ?? null,
    [selectedPackageId]
  );

  // Add-on total
  const addOnsTotal = useMemo(() => {
    return addOns.filter(a => selectedAddOns.has(a.id)).reduce((sum, a) => sum + a.price, 0);
  }, [selectedAddOns]);

  const addOnsSavings = useMemo(() => {
    return addOns.filter(a => selectedAddOns.has(a.id)).reduce((sum, a) => sum + ((a.originalPrice || a.price) - a.price), 0);
  }, [selectedAddOns]);

  // Filter add-ons based on selected package (some are already included in higher packages)
  const filteredAddOns = useMemo(() => {
    if (!selectedPackageId) return addOns;
    return addOns.filter(a => !a.excludeFromPackages?.includes(selectedPackageId));
  }, [selectedPackageId]);

  // Combined total (package + add-ons)
  const combinedPrice = (selectedPackage?.price ?? 0) + addOnsTotal;

  // Recalculate months when package changes
  const effectiveMinDeposit = appliedCoupon?.minDeposit ?? selectedPackage?.minDeposit ?? 500;

  useEffect(() => {
    if (selectedPackage) {
      setMonths((prev) => Math.min(prev, selectedPackage.maxMonths));
      setDepositAmount((prev) => Math.max(prev, effectiveMinDeposit));
    }
  }, [selectedPackage, effectiveMinDeposit]);

  // ─── Coupon Discount Calculation ────────────────────────────────────
  const discount = useMemo(() => {
    if (!appliedCoupon || !selectedPackage) return 0;
    if (appliedCoupon.discountType === 'percent') {
      return Math.round(combinedPrice * (appliedCoupon.discountValue / 100) * 100) / 100;
    }
    return Math.min(appliedCoupon.discountValue, combinedPrice);
  }, [appliedCoupon, selectedPackage, combinedPrice]);

  const discountedPrice = combinedPrice - discount;
  const effectiveDeposit = Math.min(depositAmount, discountedPrice);
  const remaining = discountedPrice - effectiveDeposit;
  const monthlyPayment = months > 0 ? Math.ceil((remaining / months) * 100) / 100 : 0;

  // ─── Coupon Validation ────────────────────────────────────────────
  const validateCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), productId: 97, packageId: selectedPackageId }),
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
    setSelectedAddOns(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ─── Step Navigation ──────────────────────────────────────────────
  const selectPackage = useCallback((id: string) => {
    setSelectedPackageId(id);
    // Remove any selected add-ons that are excluded from this package
    setSelectedAddOns(prev => {
      const excluded = addOns.filter(a => a.excludeFromPackages?.includes(id)).map(a => a.id);
      if (excluded.length === 0) return prev;
      const next = new Set(prev);
      excluded.forEach(eid => next.delete(eid));
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
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.location !== '' &&
      formData.timetable !== '' &&
      (formData.startDate !== '' || formData.timetable === 'online-evenings')
    );
  }, [formData]);

  const confirmDetails = useCallback(() => {
    if (!isFormValid) return;
    setCompletedSteps((prev) => new Set(prev).add('details'));
    setExpandedStep('payment');
  }, [isFormValid]);

  // ─── Payment Submission ───────────────────────────────────────────
  const handlePayment = useCallback(async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedPackage || !isFormValid) return;

    // Read card values from state, with DOM fallback for browser autofill
    const form = e?.target instanceof HTMLFormElement ? e.target : document.querySelector('form');
    const domCardNumber = form?.querySelector<HTMLInputElement>('input[autocomplete="cc-number"]')?.value || '';
    const domCardMonth = form?.querySelector<HTMLSelectElement>('select[autocomplete="cc-exp-month"]')?.value || '';
    const domCardYear = form?.querySelector<HTMLSelectElement>('select[autocomplete="cc-exp-year"]')?.value || '';
    const domCardCvc = form?.querySelector<HTMLInputElement>('input[autocomplete="cc-csc"]')?.value || '';

    const finalCardNumber = (cardNumber || domCardNumber).replace(/\s/g, '');
    const finalExpMonth = cardExpMonth || domCardMonth;
    const finalExpYear = cardExpYear || domCardYear;
    const finalCvc = cardCvc || domCardCvc;

    // Sync state if autofill was used
    if (!cardNumber && domCardNumber) setCardNumber(domCardNumber);
    if (!cardExpMonth && domCardMonth) setCardExpMonth(domCardMonth);
    if (!cardExpYear && domCardYear) setCardExpYear(domCardYear);
    if (!cardCvc && domCardCvc) setCardCvc(domCardCvc);

    // Validate card fields
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
          totalPrice: discountedPrice,
          depositAmount: effectiveDeposit,
          months,
          monthlyPayment,
          cardNumber: finalCardNumber,
          cardExpMonth: finalExpMonth,
          cardExpYear: finalExpYear,
          cardCvc: finalCvc,
          coupon: appliedCoupon ? {
            id: appliedCoupon.id,
            code: appliedCoupon.code,
            discountType: appliedCoupon.discountType,
            discountValue: appliedCoupon.discountValue,
            originalPrice: combinedPrice,
            discount,
          } : null,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Store checkout data for the onboarding page
      if (data.contactId) {
        sessionStorage.setItem(`onboarding_${data.contactId}`, JSON.stringify({
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
        }));
        setCompletedContactId(data.contactId);
      }
      setPaymentSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setPaymentError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPackage, depositAmount, months, monthlyPayment, formData, isFormValid, discountedPrice, effectiveDeposit, selectedAddOns, addOnsTotal, combinedPrice, appliedCoupon, discount, cardNumber, cardExpMonth, cardExpYear, cardCvc]);

  // ─── Render Helpers ───────────────────────────────────────────────
  const stepNumber = (step: Step) => {
    const order: Step[] = ['package', 'addons', 'plan', 'details', 'payment'];
    return order.indexOf(step) + 1;
  };

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
          className={`w-7 h-7 md:w-8 md:h-8 rounded-full font-bold flex items-center justify-center text-xs md:text-sm ${
            completedSteps.has(step) ? 'bg-gold text-black' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {completedSteps.has(step) ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : stepNumber(step)}
        </span>
        <div className="text-left">
          <span className="text-white font-semibold text-sm md:text-base block">{title}</span>
          {subtitle && <span className="text-gold text-xs md:text-sm">{subtitle}</span>}
        </div>
      </div>
      {expandedStep === step ? (
        <ChevronUp className="w-5 h-5 text-zinc-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-zinc-400" />
      )}
    </button>
  );

  // ─── Success → Redirect to Onboarding ────────────────────────────
  useEffect(() => {
    if (paymentSuccess && completedContactId) {
      window.location.href = `/onboarding/${completedContactId}`;
    }
  }, [paymentSuccess, completedContactId]);

  if (paymentSuccess) {
    return (
      <section className="relative pt-20 pb-32 md:py-28 bg-gradient-to-b from-charcoal-950 to-black min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-20"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
            <p className="text-zinc-400 mb-2">
              Thank you, {formData.firstName}. Redirecting you to your onboarding&hellip;
            </p>
            <div className="mt-4">
              <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" />
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────
  return (
    <section className="relative pt-20 pb-40 md:pb-32 md:py-28 bg-gradient-to-b from-charcoal-950 to-black min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-zinc-400 text-xs md:text-sm">500+ Graduates</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
            BOOK YOUR <span className="text-gold">COURSE</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto">
            Choose your package, customise your payment plan, and secure your place
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 md:gap-6 mb-6 md:mb-12 overflow-x-auto pb-2 scrollbar-hide"
        >
          <div className="flex items-center gap-1.5 text-zinc-400 whitespace-nowrap">
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-xs md:text-sm">REPS Accredited</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 whitespace-nowrap">
            <Lock className="w-4 h-4 text-gold" />
            <span className="text-xs md:text-sm">Secure Payment</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 whitespace-nowrap">
            <CreditCard className="w-4 h-4 text-gold" />
            <span className="text-xs md:text-sm">0% Finance</span>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* ──────────── STEP 1: Choose Package ──────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 md:mb-6">
            <StepHeader
              step="package"
              title="Choose Your Pathway"
              subtitle={selectedPackage ? `${selectedPackage.name} — €${selectedPackage.price.toLocaleString()}` : undefined}
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
                  <div className="space-y-3 pt-3">
                    {packages.map((pkg) => {
                      const isComingSoon = pkg.comingSoon;
                      return (
                        <motion.button
                          key={pkg.id}
                          whileTap={isComingSoon ? undefined : { scale: 0.98 }}
                          onClick={() => !isComingSoon && selectPackage(pkg.id)}
                          disabled={isComingSoon}
                          className={`relative w-full p-4 md:p-6 rounded-xl border-2 text-left transition-all ${
                            isComingSoon
                              ? 'border-zinc-800/50 bg-zinc-900/20 opacity-50 cursor-not-allowed'
                              : selectedPackageId === pkg.id
                                ? 'border-gold bg-gold/10'
                                : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                          }`}
                        >
                          {pkg.popular && !isComingSoon && (
                            <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-gold text-black text-[10px] md:text-xs font-bold rounded-full">
                              MOST POPULAR
                            </div>
                          )}
                          {isComingSoon && (
                            <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-zinc-700 text-zinc-300 text-[10px] md:text-xs font-bold rounded-full">
                              COMING SOON
                            </div>
                          )}
                          {pkg.badge && !isComingSoon && (
                            <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-red-500/90 text-white text-[10px] md:text-xs font-bold rounded-full">
                              {pkg.badge}
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className={`text-lg md:text-xl font-bold mb-1 ${isComingSoon ? 'text-zinc-500' : 'text-white'}`}>{pkg.name}</h3>
                              <p className="text-zinc-400 text-xs md:text-sm mb-3">{pkg.description}</p>
                              <ul className="space-y-1.5 mb-3">
                                {pkg.features.map((feature, i) => (
                                  <li key={i} className={`flex items-start gap-2 text-xs md:text-sm ${isComingSoon ? 'text-zinc-600' : 'text-zinc-300'}`}>
                                    <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isComingSoon ? 'text-zinc-600' : 'text-gold'}`} />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              {!isComingSoon && (
                                <p className="text-zinc-500 text-xs">
                                  Up to {pkg.maxMonths} months &bull; Min &euro;{pkg.minDeposit} deposit
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`text-xl md:text-2xl font-bold block ${isComingSoon ? 'text-zinc-600' : 'text-white'}`}>
                                &euro;{pkg.price.toLocaleString()}
                              </span>
                              {!isComingSoon && (
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${
                                    selectedPackageId === pkg.id ? 'bg-gold border-gold' : 'border-zinc-600'
                                  }`}
                                >
                                  {selectedPackageId === pkg.id && <Check className="w-4 h-4 text-black" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ──────────── STEP 2: Enhance Your Package (Add-Ons) ──────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4 md:mb-6">
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
                    {/* Intro text */}
                    <div className="bg-gradient-to-r from-gold/10 to-transparent rounded-xl border border-gold/20 p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-gold" />
                        <h3 className="text-white font-semibold text-sm md:text-base">Add to your bundle — spread the cost</h3>
                      </div>
                      <p className="text-zinc-400 text-xs md:text-sm">
                        Most students add at least one extra qualification. Everything rolls into <span className="text-gold font-semibold">one easy payment plan</span> — no extra upfront cost. The best time to add these is now, while you&apos;re already investing in your career.
                      </p>
                    </div>

                    {/* Add-on Cards */}
                    <div className="space-y-2.5">
                      {filteredAddOns.map((addon) => {
                        const isSelected = selectedAddOns.has(addon.id);
                        return (
                          <motion.button
                            key={addon.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`relative w-full text-left rounded-xl border-2 transition-all overflow-hidden ${
                              isSelected
                                ? 'border-gold bg-gold/5'
                                : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                            }`}
                          >
                            <div className="p-3 md:p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4 className="text-white font-bold text-sm">{addon.name}</h4>
                                    {addon.badge && (
                                      <span className="px-1.5 py-0.5 bg-gold/20 text-gold text-[10px] font-semibold rounded-full whitespace-nowrap">
                                        {addon.badge}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-zinc-500">{addon.delivery}</span>
                                  </div>
                                  <p className="text-zinc-400 text-xs mb-2 leading-relaxed">{addon.description}</p>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    {addon.highlights.map((h, i) => (
                                      <span key={i} className="flex items-center gap-1 text-[11px] text-zinc-300">
                                        <Check className="w-2.5 h-2.5 text-gold flex-shrink-0" />
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
                                      isSelected ? 'bg-gold border-gold' : 'border-zinc-600'
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

                            {/* Selected indicator bar */}
                            {isSelected && (
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                className="h-0.5 bg-gold origin-left"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Add-on Summary + Continue */}
                    <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 md:p-5">
                      {selectedAddOns.size > 0 && (
                        <div className="mb-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">{selectedPackage.name}</span>
                            <span className="text-white">&euro;{selectedPackage.price.toLocaleString()}</span>
                          </div>
                          {addOns.filter(a => selectedAddOns.has(a.id)).map(addon => (
                            <div key={addon.id} className="flex justify-between text-sm">
                              <span className="text-zinc-400 flex items-center gap-1.5">
                                <Plus className="w-3 h-3 text-gold" />
                                {addon.name}
                              </span>
                              <span className="text-white">&euro;{addon.price.toLocaleString()}</span>
                            </div>
                          ))}
                          {addOnsSavings > 0 && (
                            <div className="flex justify-between text-sm pt-1">
                              <span className="text-green-400">Bundle savings</span>
                              <span className="text-green-400">-&euro;{addOnsSavings.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="border-t border-zinc-700 pt-2 flex justify-between">
                            <span className="text-white font-semibold text-sm">New Total</span>
                            <span className="text-gold font-bold text-lg">&euro;{combinedPrice.toLocaleString()}</span>
                          </div>
                          <p className="text-zinc-500 text-[11px] md:text-xs">
                            Spread across your payment plan — no extra upfront cost
                          </p>
                        </div>
                      )}

                      <button
                        onClick={confirmAddOns}
                        className="w-full py-3 md:py-4 rounded-xl bg-gold text-black font-bold text-sm md:text-base hover:bg-gold-400 transition-colors"
                      >
                        {selectedAddOns.size > 0
                          ? `Continue with ${selectedAddOns.size} Add-On${selectedAddOns.size > 1 ? 's' : ''}`
                          : 'No Thanks — Continue'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ──────────── STEP 3: Payment Plan Slider ──────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4 md:mb-6">
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
                    {/* Package Summary */}
                    <div className="text-center">
                      <p className="text-zinc-400 text-sm mb-1">
                        {selectedPackage.name}
                        {selectedAddOns.size > 0 && ` + ${selectedAddOns.size} add-on${selectedAddOns.size > 1 ? 's' : ''}`}
                      </p>
                      {discount > 0 ? (
                        <>
                          <p className="text-zinc-500 text-lg line-through">&euro;{combinedPrice.toLocaleString()}</p>
                          <p className="text-3xl md:text-4xl font-bold text-white">
                            &euro;{discountedPrice.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-3xl md:text-4xl font-bold text-white">
                          &euro;{combinedPrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Deposit Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-white font-semibold text-sm md:text-base">Deposit Amount</label>
                        <span className="text-gold font-bold text-lg md:text-xl">&euro;{depositAmount}</span>
                      </div>
                      <input
                        type="range"
                        min={effectiveMinDeposit}
                        max={discountedPrice}
                        step={50}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-gold slider-gold"
                      />
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>&euro;{effectiveMinDeposit} min</span>
                        <span>&euro;{discountedPrice.toLocaleString()} (pay in full)</span>
                      </div>
                    </div>

                    {/* Months Slider */}
                    {effectiveDeposit < discountedPrice && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-white font-semibold text-sm md:text-base">Number of Months</label>
                          <span className="text-gold font-bold text-lg md:text-xl">
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
                          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-gold slider-gold"
                        />
                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                          <span>1 month</span>
                          <span>{selectedPackage.maxMonths} months</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Coupon Code Input */}
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
                              onChange={(e) => { setCouponCode(e.target.value); setCouponError(null); }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); validateCoupon(); } }}
                              placeholder="Enter code"
                              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:border-gold focus:outline-none transition-colors"
                            />
                            <button
                              type="button"
                              onClick={validateCoupon}
                              disabled={couponLoading || !couponCode.trim()}
                              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
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
                      <h4 className="text-white font-semibold text-sm md:text-base mb-3">Payment Breakdown</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">{selectedPackage.name}</span>
                        <span className="text-white">&euro;{selectedPackage.price.toLocaleString()}</span>
                      </div>
                      {addOns.filter(a => selectedAddOns.has(a.id)).map(addon => (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-zinc-400 flex items-center gap-1.5">
                            <Plus className="w-3 h-3 text-gold" />
                            {addon.name}
                          </span>
                          <span className="text-white">&euro;{addon.price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-zinc-700 pt-2 flex justify-between text-sm">
                        <span className="text-zinc-400">Course Total</span>
                        <span className={`text-white font-semibold ${discount > 0 ? 'line-through text-zinc-500' : ''}`}>&euro;{combinedPrice.toLocaleString()}</span>
                      </div>
                      {discount > 0 && appliedCoupon && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400 flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {appliedCoupon.code}
                              {appliedCoupon.discountType === 'percent'
                                ? ` (${appliedCoupon.discountValue}% off)`
                                : ` (-€${appliedCoupon.discountValue})`}
                            </span>
                            <span className="text-green-400">-&euro;{discount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Discounted Total</span>
                            <span className="text-white font-semibold">&euro;{discountedPrice.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Deposit (today)</span>
                        <span className="text-gold font-semibold">&euro;{depositAmount}</span>
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
                            <span className="text-white font-semibold">&euro;{monthlyPayment.toFixed(2)}/mo</span>
                          </div>
                        </>
                      )}
                      <div className="border-t border-zinc-700 pt-3 flex justify-between">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-gold font-bold text-lg">
                          &euro;{discountedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Confirm Plan Button */}
                    <button
                      onClick={confirmPlan}
                      className="w-full py-3 md:py-4 rounded-xl bg-gold text-black font-bold text-sm md:text-base hover:bg-gold-400 transition-colors"
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

          {/* ──────────── STEP 4: Personal Details ──────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4 md:mb-6">
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
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                          <User className="w-3.5 h-3.5" /> Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+353 86 123 4567"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Training Location *
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value, startDate: '' })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="" className="text-zinc-600">
                          Select a location...
                        </option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timetable */}
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Course Timetable *
                      </label>
                      <select
                        value={formData.timetable}
                        onChange={(e) => setFormData({ ...formData, timetable: e.target.value, startDate: '' })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="" className="text-zinc-600">
                          Select a timetable...
                        </option>
                        {timetables.map((tt) => (
                          <option key={tt.id} value={tt.id}>
                            {tt.name} — {tt.schedule}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Start Date */}
                    {formData.location && formData.timetable && formData.timetable !== 'online-evenings' && (
                      <div>
                        <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Course Start Date *
                        </label>
                        {(() => {
                          const now = new Date();
                          const available = courseStartDates.filter(
                            (sd) =>
                              sd.locations.includes(formData.location) &&
                              sd.timetable === formData.timetable &&
                              new Date(sd.date) > now
                          );
                          if (available.length === 0) {
                            return (
                              <p className="text-zinc-500 text-sm py-2">
                                No upcoming dates for this combination. Please contact us.
                              </p>
                            );
                          }
                          return (
                            <select
                              value={formData.startDate}
                              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                            >
                              <option value="" className="text-zinc-600">
                                Select a start date...
                              </option>
                              {available.map((sd) => (
                                <option key={sd.date} value={sd.date}>
                                  {sd.label}
                                </option>
                              ))}
                            </select>
                          );
                        })()}
                      </div>
                    )}

                    {/* Continue Button */}
                    <button
                      onClick={confirmDetails}
                      disabled={!isFormValid}
                      className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-colors ${
                        isFormValid
                          ? 'bg-gold text-black hover:bg-gold-400'
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

          {/* ──────────── STEP 5: Payment ──────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-4 md:mb-8">
            <StepHeader
              step="payment"
              title="Secure Payment"
              disabled={!completedSteps.has('details')}
            />
            <AnimatePresence>
              {expandedStep === 'payment' && completedSteps.has('details') && selectedPackage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handlePayment} className="pt-3 space-y-4 bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 md:p-6 mt-3">
                    {/* Order Summary */}
                    <div className="bg-zinc-800/50 rounded-xl p-4 space-y-2">
                      <h4 className="text-white font-semibold text-sm mb-3">Order Summary</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">{selectedPackage.name}</span>
                        <span className="text-white">&euro;{selectedPackage.price.toLocaleString()}</span>
                      </div>
                      {addOns.filter(a => selectedAddOns.has(a.id)).map(addon => (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-zinc-400 flex items-center gap-1.5">
                            <Plus className="w-3 h-3 text-gold" />
                            {addon.name}
                          </span>
                          <span className="text-white">&euro;{addon.price.toLocaleString()}</span>
                        </div>
                      ))}
                      {selectedAddOns.size > 0 && (
                        <div className="border-t border-zinc-700 pt-2 flex justify-between text-sm">
                          <span className="text-zinc-400">Total</span>
                          <span className={`text-white ${discount > 0 ? 'line-through text-zinc-500' : ''}`}>
                            &euro;{combinedPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedAddOns.size === 0 && discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Course Price</span>
                          <span className="text-zinc-500 line-through">
                            &euro;{combinedPrice.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Coupon discount line */}
                      {discount > 0 && appliedCoupon && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400 flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {appliedCoupon.code}
                              {appliedCoupon.discountType === 'percent'
                                ? ` (${appliedCoupon.discountValue}% off)`
                                : ` (-\u20AC${appliedCoupon.discountValue})`}
                            </span>
                            <span className="text-green-400">-&euro;{discount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Discounted price</span>
                            <span className="text-white font-semibold">&euro;{discountedPrice.toLocaleString()}</span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Charging today {effectiveDeposit < discountedPrice ? '(deposit)' : ''}</span>
                        <span className="text-gold font-bold">&euro;{effectiveDeposit}</span>
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

                    {/* Card Input Fields */}
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
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors tracking-wider"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <select
                          value={cardExpMonth}
                          onChange={(e) => setCardExpMonth(e.target.value)}
                          autoComplete="cc-exp-month"
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                        >
                          <option value="" className="text-zinc-600">Month</option>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <select
                          value={cardExpYear}
                          onChange={(e) => setCardExpYear(e.target.value)}
                          autoComplete="cc-exp-year"
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                        >
                          <option value="" className="text-zinc-600">Year</option>
                          {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i)).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="CVC"
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Error Message */}
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
                          : 'bg-gold text-black hover:bg-gold-400'
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

          {/* ──────────── Sticky Bottom Bar ──────────── */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            >
              <div className="bg-charcoal-950/98 backdrop-blur-xl border-t border-zinc-800 p-4 shadow-2xl safe-area-bottom">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-400 block truncate">
                      {selectedPackage.name}
                      {selectedAddOns.size > 0 && ` + ${selectedAddOns.size} extra${selectedAddOns.size > 1 ? 's' : ''}`}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">
                        &euro;{discountedPrice.toLocaleString()}
                      </span>
                      {effectiveDeposit < discountedPrice && (
                        <span className="text-gold text-xs">&euro;{monthlyPayment.toFixed(2)}/mo</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-800 rounded-md">
                    &euro;{depositAmount} today
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Custom slider styling */}
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
      `}</style>
    </section>
  );
}
