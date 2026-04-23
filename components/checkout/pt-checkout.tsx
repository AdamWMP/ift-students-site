'use client';

import { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';
import Image from 'next/image';
import { Check, Lock, Shield, CreditCard, Loader2, AlertCircle, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { packages, locations, timetables, courseStartDates, getActiveOffer } from '@/lib/course-data';

// ─── Types ─────────────────────────────────────────────────────────────
type Step = 'course' | 'payment' | 'details' | 'pay';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// ─── Step config ────────────────────────────────────────────────────
const STEPS: { key: Step; label: string }[] = [
  { key: 'course',  label: 'Course'  },
  { key: 'payment', label: 'Payment' },
  { key: 'details', label: 'Details' },
  { key: 'pay',     label: 'Pay'     },
];

function stepIndex(step: Step) {
  return STEPS.findIndex(s => s.key === step);
}

// ─── Sidebar ─────────────────────────────────────────────────────────
function OrderSidebar({
  packageId,
  depositAmount,
  isFullPayment,
}: {
  packageId: string | null;
  depositAmount: number;
  isFullPayment: boolean;
}) {
  const pkg = useMemo(() => {
    if (!packageId) return packages.find(p => p.id === 'complete-coach') ?? packages[0];
    const base = packages.find(p => p.id === packageId) ?? packages[0];
    const offer = getActiveOffer(base.id);
    return offer ? { ...base, price: offer.price } : base;
  }, [packageId]);

  const remaining = pkg.price - depositAmount;

  return (
    <aside className="w-72 shrink-0">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden sticky top-6">
        {/* Header */}
        <div className="bg-zinc-800/60 px-5 py-4 flex items-center gap-3 border-b border-zinc-800">
          <div className="w-9 h-9 bg-gold/20 rounded-lg flex items-center justify-center text-lg">💪</div>
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">IFT Personal Training</p>
            <p className="text-white font-bold">{pkg.name}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="px-5 py-4 space-y-2 border-b border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Course fee</span>
            <span className="text-white font-medium">€{pkg.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Due today {!isFullPayment ? '(deposit)' : ''}</span>
            <span className="text-gold font-bold">€{depositAmount.toLocaleString()}</span>
          </div>
          {!isFullPayment && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Remaining balance</span>
              <span className="text-white">€{remaining.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="px-5 py-4 space-y-2.5 border-b border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Includes</p>
          {pkg.features.slice(0, 5).map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
              <span className="text-zinc-300 text-xs leading-relaxed">{f}</span>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="px-5 py-4 flex items-start gap-2">
          <Shield className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
          <p className="text-zinc-500 text-xs leading-relaxed">
            Secured by Stripe. Card details never touch our servers.
          </p>
        </div>
      </div>
    </aside>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export function PtCheckout() {
  const [currentStep, setCurrentStep] = useState<Step>('course');
  const completedSteps = useMemo(() => {
    const idx = stepIndex(currentStep);
    return new Set(STEPS.slice(0, idx).map(s => s.key));
  }, [currentStep]);

  // Course step state
  const [selectedPackageId, setSelectedPackageId] = useState<string>('complete-coach');
  const [selectedLocation, setSelectedLocation]   = useState('');
  const [selectedTimetable, setSelectedTimetable] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [courseError, setCourseError]             = useState('');

  // Payment step state
  const [paymentType, setPaymentType] = useState<'deposit' | 'full'>('deposit');

  // Details step state
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
  });
  const [detailsError, setDetailsError] = useState('');

  // Pay step state
  const [cardNumber, setCardNumber]     = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear]   = useState('');
  const [cardCvc, setCardCvc]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedContactId, setCompletedContactId] = useState<string | null>(null);

  // Derived values
  const selectedPackage = useMemo(() => {
    const base = packages.find(p => p.id === selectedPackageId) ?? packages[0];
    const offer = getActiveOffer(base.id);
    return offer ? { ...base, price: offer.price, minDeposit: offer.minDeposit } : base;
  }, [selectedPackageId]);

  const depositAmount  = paymentType === 'full' ? selectedPackage.price : selectedPackage.minDeposit;
  const isFullPayment  = paymentType === 'full';
  const months         = selectedPackage.maxMonths;
  const remaining      = selectedPackage.price - depositAmount;
  const monthlyPayment = isFullPayment ? 0 : Math.ceil((remaining / months) * 100) / 100;

  // Available start dates for selected location + timetable
  const availableStartDates = useMemo(() => {
    if (!selectedLocation || !selectedTimetable) return [];
    const now = new Date();
    return courseStartDates.filter(
      sd => sd.locations.includes(selectedLocation) &&
            sd.timetable === selectedTimetable &&
            new Date(sd.date) > now
    );
  }, [selectedLocation, selectedTimetable]);

  // Available timetables for location
  const availableTimetables = useMemo(() => {
    if (!selectedLocation) return timetables;
    if (selectedLocation === 'online') return timetables.filter(t => t.id === 'online-self-paced');
    if (selectedLocation === 'swords' || selectedLocation === 'tallaght') {
      return timetables.filter(t => t.id === '16-week-evening-sat' || t.id === '8-week-intensive');
    }
    return timetables.filter(t => t.id === '16-week-saturday' || t.id === '8-week-intensive');
  }, [selectedLocation]);

  // Reset timetable + start date when location changes
  useEffect(() => {
    setSelectedTimetable('');
    setSelectedStartDate('');
  }, [selectedLocation]);

  // Reset start date when timetable changes
  useEffect(() => {
    setSelectedStartDate('');
  }, [selectedTimetable]);

  // Redirect to onboarding on success
  useEffect(() => {
    if (paymentSuccess && completedContactId) {
      window.location.href = `/onboarding/${completedContactId}`;
    }
  }, [paymentSuccess, completedContactId]);

  // ─── Step navigation ────────────────────────────────────────────
  const goToStep = useCallback((step: Step) => setCurrentStep(step), []);

  const handleContinueCourse = useCallback(() => {
    if (!selectedLocation) { setCourseError('Please select a training location.'); return; }
    if (!selectedTimetable) { setCourseError('Please select a course timetable.'); return; }
    if (selectedTimetable !== 'online-self-paced' && !selectedStartDate) {
      setCourseError('Please select a start date.'); return;
    }
    setCourseError('');
    setCurrentStep('payment');
  }, [selectedLocation, selectedTimetable, selectedStartDate]);

  const handleContinuePayment = useCallback(() => {
    setCurrentStep('details');
  }, []);

  const handleContinueDetails = useCallback(() => {
    const { firstName, lastName, email, phone } = formData;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setDetailsError('Please fill in all required fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setDetailsError('Please enter a valid email address.');
      return;
    }
    setDetailsError('');
    setCurrentStep('pay');
  }, [formData]);

  // ─── Payment submission ──────────────────────────────────────────
  const handlePayment = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    const clean = cardNumber.replace(/\s/g, '');
    if (!clean || clean.length < 13) { setPaymentError('Please enter a valid card number.'); return; }
    if (!cardExpMonth || !cardExpYear) { setPaymentError('Please enter your card expiry date.'); return; }
    if (!cardCvc || cardCvc.length < 3) { setPaymentError('Please enter your card CVC.'); return; }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId:    selectedPackage.id,
          packageName:  selectedPackage.name,
          packagePrice: selectedPackage.price,
          depositAmount,
          months:       isFullPayment ? 1 : months,
          monthlyPayment,
          firstName:    formData.firstName,
          lastName:     formData.lastName,
          email:        formData.email,
          phone:        formData.phone,
          location:     selectedLocation,
          timetable:    selectedTimetable,
          startDate:    selectedStartDate,
          cardNumber:   clean,
          cardExpMonth,
          cardExpYear,
          cardCvc,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      if (data.contactId) {
        sessionStorage.setItem(`onboarding_${data.contactId}`, JSON.stringify({
          packageId: selectedPackage.id, packageName: selectedPackage.name,
          packagePrice: selectedPackage.price, depositAmount, months, monthlyPayment,
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          location: selectedLocation, timetable: selectedTimetable, startDate: selectedStartDate,
        }));
        setCompletedContactId(data.contactId);
      }

      setPaymentSuccess(true);
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPackage, depositAmount, isFullPayment, months, monthlyPayment, formData, selectedLocation, selectedTimetable, selectedStartDate, cardNumber, cardExpMonth, cardExpYear, cardCvc]);

  // ─── Success screen ──────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h2>
          <p className="text-zinc-400 mb-4">Thank you, {formData.firstName}. Redirecting to your onboarding&hellip;</p>
          <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* ── Nav bar ── */}
      <header className="h-12 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="IFT" width={28} height={28} className="rounded" />
        </div>
        <span className="text-zinc-400 text-sm">Secure Checkout</span>
      </header>

      {/* ── Steps bar ── */}
      <div className="bg-zinc-950 border-b border-zinc-900 py-4 px-6 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-0">
          {STEPS.map((step, i) => {
            const isDone    = completedSteps.has(step.key);
            const isCurrent = currentStep === step.key;
            return (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => isDone && goToStep(step.key)}
                  disabled={!isDone}
                  className="flex flex-col items-center gap-1 group"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isDone    ? 'bg-gold text-black cursor-pointer' :
                    isCurrent ? 'bg-gold text-black' :
                                'bg-zinc-800 text-zinc-500'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : i + 1}
                  </span>
                  <span className={`text-xs ${isCurrent ? 'text-gold font-semibold' : isDone ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {step.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 md:w-24 h-px mx-2 mb-4 ${isDone ? 'bg-gold/50' : 'bg-zinc-800'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto flex gap-8 items-start">

          {/* Left — step content */}
          <div className="flex-1 min-w-0">

            {/* ── STEP 1: Course ── */}
            {currentStep === 'course' && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Choose your course</h1>
                <p className="text-zinc-400 text-sm mb-6">All courses are REPs Ireland recognised. Select to continue.</p>

                {/* Package selection */}
                <div className="space-y-3 mb-8">
                  {packages.map(basePkg => {
                    const offer = getActiveOffer(basePkg.id);
                    const pkg   = offer ? { ...basePkg, price: offer.price } : basePkg;
                    const sel   = selectedPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`relative w-full text-left p-4 rounded-xl border-2 transition-all ${
                          sel ? 'border-gold bg-gold/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-zinc-700 text-zinc-200 text-[10px] font-bold rounded-full uppercase tracking-wide">
                            Most Popular
                          </span>
                        )}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              sel ? 'border-gold bg-gold' : 'border-zinc-600'
                            }`}>
                              {sel && <span className="w-2 h-2 rounded-full bg-black" />}
                            </span>
                            <div>
                              <p className="text-white font-semibold">{pkg.name}</p>
                              <p className="text-zinc-400 text-sm">{pkg.description}</p>
                            </div>
                          </div>
                          <span className="text-white font-bold text-lg shrink-0">&euro;{pkg.price.toLocaleString()}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Booking details */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-5 mb-6">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    Course Schedule
                  </h2>

                  {/* Location */}
                  <div>
                    <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
                      <MapPin className="w-3.5 h-3.5" /> Training Location *
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={e => setSelectedLocation(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="">Select a location…</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Timetable */}
                  {selectedLocation && (
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
                        <Calendar className="w-3.5 h-3.5" /> Course Timetable *
                      </label>
                      <select
                        value={selectedTimetable}
                        onChange={e => setSelectedTimetable(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="">Select a timetable…</option>
                        {availableTimetables.map(tt => (
                          <option key={tt.id} value={tt.id}>{tt.name} — {tt.schedule}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Start Date */}
                  {selectedTimetable && selectedTimetable !== 'online-self-paced' && (
                    <div>
                      <label className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
                        <Calendar className="w-3.5 h-3.5" /> Course Start Date *
                      </label>
                      {availableStartDates.length === 0 ? (
                        <p className="text-zinc-500 text-sm py-2">No upcoming dates for this combination. Please contact us.</p>
                      ) : (
                        <select
                          value={selectedStartDate}
                          onChange={e => setSelectedStartDate(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                        >
                          <option value="">Select a start date…</option>
                          {availableStartDates.map(sd => (
                            <option key={sd.date} value={sd.date}>{sd.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>

                {courseError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {courseError}
                  </div>
                )}

                <button
                  onClick={handleContinueCourse}
                  className="w-full py-3.5 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {currentStep === 'payment' && (
              <div>
                <button onClick={() => setCurrentStep('course')} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
                  ← Back
                </button>
                <h1 className="text-2xl font-bold text-white mb-1">How would you like to pay?</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  Choose your payment preference for <strong className="text-white">{selectedPackage.name}</strong>.
                </p>

                <div className="space-y-3 mb-8">
                  {/* Deposit option */}
                  <button
                    onClick={() => setPaymentType('deposit')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      paymentType === 'deposit' ? 'border-gold bg-gold/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentType === 'deposit' ? 'border-gold bg-gold' : 'border-zinc-600'
                        }`}>
                          {paymentType === 'deposit' && <span className="w-2 h-2 rounded-full bg-black" />}
                        </span>
                        <div>
                          <p className="text-white font-semibold">Pay deposit today</p>
                          <p className="text-zinc-400 text-sm">
                            Secure your place with a &euro;{selectedPackage.minDeposit.toLocaleString()} deposit.
                            Pay the remaining &euro;{(selectedPackage.price - selectedPackage.minDeposit).toLocaleString()} in flexible monthly instalments.
                          </p>
                        </div>
                      </div>
                      <span className="text-gold font-bold text-lg shrink-0">&euro;{selectedPackage.minDeposit.toLocaleString()}</span>
                    </div>
                  </button>

                  {/* Full payment option */}
                  <button
                    onClick={() => setPaymentType('full')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      paymentType === 'full' ? 'border-gold bg-gold/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentType === 'full' ? 'border-gold bg-gold' : 'border-zinc-600'
                        }`}>
                          {paymentType === 'full' && <span className="w-2 h-2 rounded-full bg-black" />}
                        </span>
                        <div>
                          <p className="text-white font-semibold">Pay in full</p>
                          <p className="text-zinc-400 text-sm">One payment. Nothing more to think about.</p>
                        </div>
                      </div>
                      <span className="text-white font-bold text-lg shrink-0">&euro;{selectedPackage.price.toLocaleString()}</span>
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleContinuePayment}
                  className="w-full py-3.5 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP 3: Details ── */}
            {currentStep === 'details' && (
              <div>
                <button onClick={() => setCurrentStep('payment')} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
                  ← Back
                </button>
                <h1 className="text-2xl font-bold text-white mb-1">Your details</h1>
                <p className="text-zinc-400 text-sm mb-6">We need these to set up your enrolment.</p>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5">First name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                        placeholder="Ciarán"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5">Last name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                        placeholder="O'Brien"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs mb-1.5">Email address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="ciaran@example.com"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs mb-1.5">Phone number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="087 123 4567"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {detailsError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {detailsError}
                  </div>
                )}

                <button
                  onClick={handleContinueDetails}
                  className="w-full py-3.5 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Continue to payment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP 4: Pay ── */}
            {currentStep === 'pay' && (
              <div>
                <button onClick={() => setCurrentStep('details')} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
                  ← Back
                </button>
                <h1 className="text-2xl font-bold text-white mb-1">Secure payment</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  {isFullPayment
                    ? `Paying €${selectedPackage.price.toLocaleString()} in full today.`
                    : `Paying €${depositAmount.toLocaleString()} deposit today. Remaining €${remaining.toLocaleString()} across ${months} monthly instalments.`
                  }
                </p>

                <form onSubmit={handlePayment} className="space-y-4">
                  {/* Card number */}
                  <div>
                    <label className="block text-zinc-400 text-xs mb-1.5 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" /> Card number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setCardNumber(v.replace(/(\d{4})(?=\d)/g, '$1 '));
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors tracking-wider"
                    />
                  </div>

                  {/* Expiry + CVC */}
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={cardExpMonth}
                      onChange={e => setCardExpMonth(e.target.value)}
                      autoComplete="cc-exp-month"
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={cardExpYear}
                      onChange={e => setCardExpYear(e.target.value)}
                      autoComplete="cc-exp-year"
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i)).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="CVC"
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm placeholder:text-zinc-600 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  {paymentError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                      isSubmitting ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-gold hover:bg-yellow-500 text-black'
                    }`}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                    ) : (
                      <><Lock className="w-4 h-4" /> Pay &euro;{depositAmount.toLocaleString()} Now</>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-5 text-xs text-zinc-500 pt-1">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Encrypted</span>
                    <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Powered by Stripe</span>
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> PCI Compliant</span>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right — sidebar */}
          <OrderSidebar
            packageId={selectedPackageId}
            depositAmount={depositAmount}
            isFullPayment={isFullPayment}
          />
        </div>
      </main>
    </div>
  );
}
