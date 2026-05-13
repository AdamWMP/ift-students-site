'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, PartyPopper, Lock } from 'lucide-react';
import Image from 'next/image';
import { ContractStep } from './contract-step';
import { WelcomeVideoStep } from './welcome-video-step';
import { StudentProfileForm } from './student-profile-form';
import { TimetableStep } from './timetable-step';
import { PaymentPlanStep } from './payment-plan-step';
import {
  type OnboardingStep,
  ONBOARDING_STEPS,
  getProgress,
  setStepComplete,
  restoreFromOntraport,
  syncProgressToOntraport,
  getProgressPercent,
} from '@/lib/onboarding-progress';

export interface ContactData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseLocation: string;
  courseTimetable: string;
  courseStartDate: string;
  coursePrice: string;
  coursePaymentPlan: string;
  courseFees: string;
  packageName: string;
  totalCost: string;
  courseQualifications: string;
  onboardingProgress: string;
  tcSignedDate: string;
  tcSignatureName: string;
  depositAmount: string;
  monthlyAmount: string;
  paymentMonths: string;
  firstInstalmentDate: string;
}

interface OnboardingContentProps {
  contact: ContactData;
}

export function OnboardingContent({ contact }: OnboardingContentProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set());
  const [expandedStep, setExpandedStep] = useState<OnboardingStep | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Restore progress from Ontraport + localStorage on mount
  useEffect(() => {
    const restored = restoreFromOntraport(contact.id, contact.onboardingProgress);
    // If contract was already signed (from Ontraport data), ensure it's marked
    if (contact.tcSignedDate) {
      restored.add('contract');
    }
    setCompletedSteps(new Set(restored));

    // Show confetti on first visit
    const hasVisited = sessionStorage.getItem(`onboarding_visited_${contact.id}`);
    if (!hasVisited) {
      setShowConfetti(true);
      sessionStorage.setItem(`onboarding_visited_${contact.id}`, 'true');
      setTimeout(() => setShowConfetti(false), 4000);
    }

    // Auto-expand first incomplete step
    const firstIncomplete = ONBOARDING_STEPS.find(s => !restored.has(s.key));
    if (firstIncomplete) setExpandedStep(firstIncomplete.key);
  }, [contact.id, contact.onboardingProgress, contact.tcSignedDate]);

  const handleStepComplete = useCallback((step: OnboardingStep) => {
    const updated = setStepComplete(contact.id, step);
    setCompletedSteps(new Set(updated));
    syncProgressToOntraport(contact.id, updated);

    // Auto-expand next incomplete step
    const nextIncomplete = ONBOARDING_STEPS.find(s => !updated.has(s.key));
    if (nextIncomplete) {
      setTimeout(() => setExpandedStep(nextIncomplete.key), 500);
    } else {
      setExpandedStep(null);
    }
  }, [contact.id]);

  const progressPercent = getProgressPercent(completedSteps);
  const contractSigned = completedSteps.has('contract');

  const toggleStep = (step: OnboardingStep) => {
    // Contract must be signed before accessing other steps
    if (step !== 'contract' && !contractSigned) return;
    setExpandedStep(expandedStep === step ? null : step);
  };

  // Get sessionStorage checkout data for enrichment
  const [checkoutData, setCheckoutData] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem(`onboarding_${contact.id}`);
    if (raw) {
      try { setCheckoutData(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, [contact.id]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-charcoal-950 to-black">
      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center"
            >
              <PartyPopper className="w-20 h-20 text-gold mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-black text-white">Welcome, {contact.firstName}!</h1>
              <p className="text-xl text-gold mt-2">Your journey starts here</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="pt-8 pb-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-3">
          <Image src="/logo-global.png" alt="Image Fitness Training" width={40} height={40} className="rounded" />
          <span className="text-white/60 text-sm">Image Fitness Training Global</span>
        </div>
      </div>

      {/* Welcome + Progress */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome, {contact.firstName}!
          </h1>
          <p className="text-zinc-400 mb-6">
            Complete these steps to get ready for your <strong className="text-gold">{contact.packageName || 'course'}</strong>.
          </p>

          {/* Progress bar */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-zinc-400">Your progress</span>
            <span className="text-sm font-semibold text-gold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-gradient-to-r from-gold to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {progressPercent === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
            >
              <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-semibold">All steps complete! You&apos;re all set.</p>
              <p className="text-zinc-400 text-sm mt-1">We&apos;ll see you on your first day. If you need anything, WhatsApp Adam.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Steps */}
        <div className="space-y-3">
          {ONBOARDING_STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(step.key);
            const isExpanded = expandedStep === step.key;
            const isLocked = step.key !== 'contract' && !contractSigned;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                {/* Step header */}
                <button
                  onClick={() => toggleStep(step.key)}
                  disabled={isLocked}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-green-500/5 border-green-500/20'
                      : isLocked
                      ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50 cursor-not-allowed'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isLocked
                          ? 'bg-zinc-800 text-zinc-600'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : isLocked ? <Lock className="w-3 h-3" /> : index + 1}
                    </span>
                    <div className="text-left">
                      <span className={`font-semibold text-sm block ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                        {step.label}
                      </span>
                      <span className="text-zinc-500 text-xs">{step.description}</span>
                    </div>
                  </div>
                  {!isLocked && (
                    isExpanded
                      ? <ChevronUp className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                  )}
                </button>

                {/* Step content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-1 px-1">
                        {step.key === 'contract' && (
                          <ContractStep
                            contact={contact}
                            onComplete={() => handleStepComplete('contract')}
                            isCompleted={isCompleted}
                          />
                        )}
                        {step.key === 'video' && (
                          <WelcomeVideoStep
                            contact={contact}
                            checkoutData={checkoutData}
                            onComplete={() => handleStepComplete('video')}
                            isCompleted={isCompleted}
                          />
                        )}
                        {step.key === 'profile' && (
                          <StudentProfileForm
                            contact={contact}
                            onComplete={() => handleStepComplete('profile')}
                            isCompleted={isCompleted}
                          />
                        )}
                        {step.key === 'timetable' && (
                          <TimetableStep
                            contact={contact}
                            checkoutData={checkoutData}
                            onComplete={() => handleStepComplete('timetable')}
                            isCompleted={isCompleted}
                          />
                        )}
                        {step.key === 'payment' && (
                          <PaymentPlanStep
                            contact={contact}
                            checkoutData={checkoutData}
                            onComplete={() => handleStepComplete('payment')}
                            isCompleted={isCompleted}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Support footer */}
        <div className="mt-10 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm mb-3">Need help? We&apos;re here for you.</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://wa.me/353866003667"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              WhatsApp Adam
            </a>
            <span className="text-zinc-700">|</span>
            <a
              href="mailto:education@imageft.ie"
              className="text-sm text-gold hover:text-yellow-400 transition-colors"
            >
              education@imageft.ie
            </a>
          </div>
          <p className="text-zinc-600 text-xs mt-4">Image Fitness Training Global</p>
        </div>
      </div>
    </main>
  );
}
