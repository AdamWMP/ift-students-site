// ─── Onboarding Progress Tracking ───────────────────────────────────
// Dual storage: localStorage (instant UI) + Ontraport field (cross-device)

export type OnboardingStep = 'contract' | 'video' | 'profile' | 'timetable' | 'payment';

export const ONBOARDING_STEPS: { key: OnboardingStep; label: string; description: string }[] = [
  { key: 'contract', label: 'Sign T&C Contract', description: 'Review and sign your course agreement' },
  { key: 'profile', label: 'Complete Your Profile', description: 'Share your details for your welcome pack & certificate' },
  { key: 'timetable', label: 'View Your Timetable', description: 'Check your schedule and add to calendar' },
  { key: 'video', label: 'Watch Welcome Video', description: 'Get introduced to your course' },
  { key: 'payment', label: 'Review Payment Plan', description: 'Understand your payment schedule' },
];

const STORAGE_KEY_PREFIX = 'onboarding_progress_';

/** Get completed steps from localStorage */
export function getProgress(contactId: string): Set<OnboardingStep> {
  if (typeof window === 'undefined') return new Set();
  const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${contactId}`);
  if (!raw) return new Set();
  try {
    const steps = JSON.parse(raw) as OnboardingStep[];
    return new Set(steps);
  } catch {
    return new Set();
  }
}

/** Mark a step as complete in localStorage */
export function setStepComplete(contactId: string, step: OnboardingStep): Set<OnboardingStep> {
  const current = getProgress(contactId);
  current.add(step);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${contactId}`, JSON.stringify([...current]));
  return current;
}

/** Restore progress from Ontraport field value (comma-separated string) */
export function restoreFromOntraport(contactId: string, progressField: string): Set<OnboardingStep> {
  if (!progressField) return getProgress(contactId);
  const steps = progressField.split(',').filter(Boolean) as OnboardingStep[];
  const merged = getProgress(contactId);
  steps.forEach(s => merged.add(s));
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${contactId}`, JSON.stringify([...merged]));
  return merged;
}

/** Sync progress to Ontraport via API */
export async function syncProgressToOntraport(contactId: string, steps: Set<OnboardingStep>): Promise<void> {
  try {
    await fetch('/api/onboarding/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, progress: [...steps].join(',') }),
    });
  } catch (err) {
    console.error('[Onboarding] Failed to sync progress:', err);
  }
}

/** Calculate progress percentage */
export function getProgressPercent(completedSteps: Set<OnboardingStep>): number {
  return Math.round((completedSteps.size / ONBOARDING_STEPS.length) * 100);
}
