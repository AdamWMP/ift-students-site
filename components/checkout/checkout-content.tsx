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
import { packages, locations, timetables, courseStartDates, addOns, getActiveOffer, type AddOn, type Package } from '@/lib/course-data';
import { track, newEventId } from '@/lib/meta/events';

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

// ─── Coupon deposit overrides ─────────────────────────────────────────
// Coupon codes that lower the minimum deposit below the package default
const COUPON_DEPOSIT_OVERRIDES: Record<string, number> = {
  THECERT200: 350,
};

// ─── Main Component ──────────────────────────────────────────────────
export function CheckoutContent({ packageList, minDepositOverride }: { packageList?: Package[]; minDepositOverride?: number }) {
  return <CheckoutForm packageList={packageList} minDepositOverride={minDepositOverride} />;
}

function CheckoutForm({ packageList, minDepositOverride }: { packageList?: Package[]; minDepositOverride?: number }) {
  const availablePackages = packageList ?? packages;

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

  const selectedPackage = useMemo(() => {
    const pkg = availablePackages.find((p) => p.id === selectedPackageId) ?? null;
    if (!pkg) return null;
    const offer = getActiveOffer(pkg.id);
    if (offer) {
      return { ...pkg, price: offer.price, originalPrice: offer.originalPrice, minDeposit: offer.minDeposit };
    }
    return pkg;
  }, [selectedPackageId]);

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

  // Combined total (package + add-ons) — uses upfront/full-payment price
  const combinedPrice = (selectedPackage?.price ?? 0) + addOnsTotal;

  // Payment-plan total — may be higher than upfront price for some packages
  const combinedPlanPrice = (selectedPackage?.paymentPlanPrice ?? selectedPackage?.price ?? 0) + addOnsTotal;

  // Effective minimum deposit — minDepositOverride > coupon override > package default
  const effectiveMinDeposit = useMemo(() => {
    if (minDepositOverride !== undefined) return minDepositOverride;
    if (appliedCoupon?.code && COUPON_DEPOSIT_OVERRIDES[appliedCoupon.code] !== undefined) {
      return COUPON_DEPOSIT_OVERRIDES[appliedCoupon.code];
    }
    return selectedPackage?.minDeposit ?? 500;
  }, [minDepositOverride, appliedCoupon, selectedPackage]);

  // Snap deposit to the effective minimum whenever package or coupon changes
  useEffect(() => {
    if (selectedPackage) {
      setMonths((prev) => Math.min(prev, selectedPackage.maxMonths));
      setDepositAmount(effectiveMinDeposit);
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

  // discountedPrice = upfront price (slider max / full-payment amount)
  const discountedPrice = combinedPrice - discount;
  const effectiveDeposit = Math.min(depositAmount, discountedPrice);
  // isFullPayment = paying the full upfront price at once
  const isFullPayment = effectiveDeposit >= discountedPrice;
  // For installment plans, remaining is calculated from the plan total (may be higher)
  const planPriceAfterDiscount = combinedPlanPrice - discount;
  const remaining = isFullPayment ? 0 : planPriceAfterDiscount - effectiveDeposit;
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
    // Self-paced bundles (Launch Pad / Online Coaching): auto-fill location,
    // timetable and start date to today's date — there is no fixed schedule.
    const picked = availablePackages.find(p => p.id === id);
    if (picked?.selfPaced) {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      setFormData(prev => ({
        ...prev,
        location: 'online',
        timetable: 'online-self-paced',
        startDate: today,
      }));
    }
    setCompletedSteps((prev) => new Set(prev).add('package'));
    setExpandedStep('addons');
  }, [availablePackages]);

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

    track('InitiateCheckout', {
      userData: { email: formData.email, phone: formData.phone, firstName: formData.firstName, lastName: formData.lastName },
      customData: {
        currency: 'EUR',
        value: discountedPrice,
        content_ids: [selectedPackage.id],
        content_name: selectedPackage.name,
        content_category: 'course',
        content_type: 'product',
        num_items: 1 + selectedAddOns.size,
      },
    });

    try {
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          packagePrice: discountedPrice,       // upfront / full-payment price (after any coupon)
          planPrice: planPriceAfterDiscount,   // total if paying by instalments (may differ)
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
      track('Purchase', {
        eventId: data?.eventId || newEventId(),
        userData: { email: formData.email, phone: formData.phone, firstName: formData.firstName, lastName: formData.lastName, externalId: data?.contactId ?? null },
        customData: {
          currency: 'EUR',
          value: effectiveDeposit,
          content_ids: [selectedPackage.id],
          content_name: selectedPackage.name,
          content_category: 'course',
          content_type: 'product',
          num_items: 1 + selectedAddOns.size,
        },
      });
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
                    {availablePackages.filter(p => !p.deemphasized).map((basePkg) => {
                      const offer = getActiveOffer(basePkg.id);
                      const pkg = offer ? { ...basePkg, price: offer.price, originalPrice: offer.originalPrice, minDeposit: offer.minDeposit } : basePkg;
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
                          {offer && !isComingSoon && (
                            <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-red-500/90 text-white text-[10px] md:text-xs font-bold rounded-full animate-pulse">
                              {offer.label}
                            </div>
                          )}
                          {pkg.badge && !offer && !isComingSoon && (
                            <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-red-500/90 text-white text-[10px] md:text-xs font-bold rounded-full">
                              {pkg.badge}
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className={`text-lg md:text-xl font-bold mb-1 ${isComingSoon ? 'text-zinc-500' : 'text-white'}`}>{pkg.name}</h3>
                              <p className="text-zinc-400 text-xs md:text-sm mb-3">{pkg.description}</p>
                              {pkg.prerequisites && (
                                <p className="text-amber-300/80 text-[11px] md:text-xs mb-2 italic">
                                  Prerequisite: {pkg.prerequisites}
                                </p>
                              )}
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
                                  {pkg.paymentPlanPrice && pkg.paymentPlanPrice !== pkg.price && (
                                    <> &bull; Plan total &euro;{pkg.paymentPlanPrice.toLocaleString()}</>
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              {offer && (
                                <span className="text-sm text-zinc-500 line-through block">
                                  &euro;{offer.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <span className={`text-xl md:text-2xl font-bold block ${isComingSoon ? 'text-zinc-600' : offer ? 'text-gold' : 'text-white'}`}>
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

                    {/* ── De-emphasised online self-paced bundles (only if a location/timetable doesn't suit) ── */}
                    {availablePackages.some(p => p.deemphasized) && (
                      <div className="pt-6 mt-2 border-t border-zinc-800">
                        <p className="text-zinc-500 text-[11px] md:text-xs mb-3 italic">
                          Can&apos;t make it to a location or timetable above? These fully-online self-paced bundles
                          are available — but you&apos;ll lose the live in-person experience and graduate community
                          benefits, so consider them a last resort.
                        </p>
                        <div className="space-y-2">
                          {availablePackages.filter(p => p.deemphasized).map((basePkg) => {
                            const pkg = basePkg;
                            return (
                              <motion.button
                                key={pkg.id}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => selectPackage(pkg.id)}
                                className={`relative w-full p-3 md:p-4 rounded-lg border text-left transition-all ${
                                  selectedPackageId === pkg.id
                                    ? 'border-gold/70 bg-gold/5'
                                    : 'border-zinc-800/70 bg-zinc-900/15 hover:border-zinc-700'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm md:text-base font-semibold mb-0.5 ${selectedPackageId === pkg.id ? 'text-white' : 'text-zinc-300'}`}>
                                      {pkg.name}
                                    </h4>
                                    <p className="text-zinc-500 text-[11px] md:text-xs leading-snug">
                                      {pkg.description}
                                    </p>
                                    <p className="text-zinc-600 text-[10px] md:text-[11px] mt-1.5">
                                      Up to {pkg.maxMonths} months &bull; Min &euro;{pkg.minDeposit} deposit
                                      {pkg.paymentPlanPrice && pkg.paymentPlanPrice !== pkg.price && (
                                        <> &bull; Plan total &euro;{pkg.paymentPlanPrice.toLocaleString()}</>
                                      )}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className={`text-base md:text-lg font-semibold block ${selectedPackageId === pkg.id ? 'text-gold' : 'text-zinc-400'}`}>
                                      &euro;{pkg.price.toLocaleString()}
                                    </span>
                                    <div
                                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1.5 ml-auto ${
                                        selectedPackageId === pkg.id ? 'bg-gold border-gold' : 'border-zinc-600'
                                      }`}
                                    >
                                      {selectedPackageId === pkg.id && <Check className="w-3 h-3 text-black" />}
                                    </div>
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
                                  {addon.paymentPlanTotal && addon.paymentPlanMonths && (
                                    <span className="text-[10px] text-zinc-500 block leading-tight">
                                      or &euro;{Math.round(addon.paymentPlanTotal / addon.paymentPlanMonths)}/mo &times; {addon.paymentPlanMonths}
                                    </span>
                                  )}
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

                      {/* Upfront-discount packages: show plan price crossed out, upfront price highlighted */}
                      {selectedPackage.paymentPlanPrice && !discount ? (
                        isFullPayment ? (
                          <>
                            <p className="text-zinc-500 text-lg line-through">&euro;{combinedPlanPrice.toLocaleString()}</p>
                            <p className="text-3xl md:text-4xl font-bold text-white">&euro;{combinedPrice.toLocaleString()}</p>
                            <p className="text-green-400 text-xs mt-1 font-semibold">Save &euro;{(combinedPlanPrice - combinedPrice).toLocaleString()} — paying in full</p>
                          </>
                        ) : (
                          <>
                            <p className="text-3xl md:text-4xl font-bold text-white">&euro;{planPriceAfterDiscount.toLocaleString()}</p>
                            <p className="text-gold text-xs mt-1 font-semibold">Pay &euro;{combinedPrice.toLocaleString()} upfront &amp; save &euro;{(combinedPlanPrice - combinedPrice).toLocaleString()}</p>
                          </>
                        )
                      ) : discount > 0 ? (
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
                        {selectedPackage.paymentPlanPrice && !discount ? (
                          <span className="text-gold">&euro;{discountedPrice.toLocaleString()} — pay in full &amp; save</span>
                        ) : (
                          <span>&euro;{discountedPrice.toLocaleString()} (pay in full)</span>
                        )}
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
                          &euro;{(effectiveDeposit >= discountedPrice ? discountedPrice : planPriceAfterDiscount).toLocaleString()}
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
                          const lateBookingCutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                          const available = courseStartDates.filter(
                            (sd) =>
                              sd.locations.includes(formData.location) &&
                              sd.timetable === formData.timetable &&
                              new Date(sd.date) > lateBookingCutoff
                          );
                          if (available.length === 0) {
                            return (
                              <p className="text-zinc-500 text-sm py-2">
                                No upcoming dates for this combination. Please contact us.
                              </p>
                            );
                          }
                          const selectedSd = available.find((sd) => sd.date === formData.startDate);
                          const selectedIsLate = selectedSd ? new Date(selectedSd.date) < now : false;
                          return (
                            <>
                              <select
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                              >
                                <option value="" className="text-zinc-600">
                                  Select a start date...
                                </option>
                                {available.map((sd) => {
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
                                const sd = available.find((s) => s.date === formData.startDate);
                                if (!sd) return null;
                                const m = new Date(sd.date).getMonth() + 1;
                                const isLatePicked = new Date(sd.date) < now;
                                if (isLatePicked) return null;
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
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-center space-y-3">
                        <p className="text-red-400">{paymentError}</p>
                        <div className="flex flex-col items-center gap-1.5 pt-1">
                          <p className="text-red-300/70 text-xs">Don&apos;t worry — our accounts team can sort it in minutes.</p>
                          <a
                            href="https://wa.me/353866003667?text=Hi%20IFT%2C%20my%20payment%20just%20failed%20on%20checkout%20and%20I%20need%20help%20completing%20my%20order."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1fb859] text-white text-sm font-semibold rounded-lg transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.887-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.588 5.355l-.999 3.648 3.9-1.022zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.017-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            Contact Accounts on WhatsApp
                          </a>
                        </div>
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
