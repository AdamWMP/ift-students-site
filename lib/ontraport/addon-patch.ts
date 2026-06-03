/**
 * Bundle add-on tracker — single source of truth.
 *
 * Every paid add-on has a dedicated Ontraport field (or set of fields).
 * Historically the checkout charged for them but didn't write the flags,
 * leaving us blind to what was actually sold. This helper takes the list
 * of selected add-on IDs (plus optional cohort + isFullPayment context)
 * and returns:
 *
 *   - `patch`: object to merge into the Ontraport contact update body
 *   - `tags`: array of Ontraport tag IDs to add to the contact
 *   - `tagLabels`: human-readable labels (used in Slack notifications)
 *
 * Field IDs and tag IDs are pulled from the live Ontraport meta on
 * 2026-05-27 (see timetable-and-addons-fix/02-bundle-addon-tracking.md
 * for the architecture write-up).
 *
 * Idempotent — running it twice produces the same patch; tags are
 * de-duped by Ontraport.
 */

import type { AddOn } from '@/lib/course-data';

export interface AddonCohort {
  locationId: string;
  timetableId: string;
  startDate: string; // YYYY-MM-DD
}

export interface AddonPatchInput {
  selectedAddOns: AddOn[];
  isFullPayment: boolean;
  addonCohorts: Record<string, AddonCohort>;
  paymentPlanText: string;
}

export interface AddonPatchResult {
  patch: Record<string, string>;
  tags: string[];
  tagLabels: string[];
  notes: string[]; // human-readable per-addon trace for logs
}

const ADDON_PRICE = (a: AddOn, isFullPayment: boolean): number =>
  isFullPayment ? a.price : (a.paymentPlanPrice ?? a.price);

/**
 * Build the full Ontraport patch + tag set for the given add-on selection.
 * Call this once after a successful payment, merge `patch` into your
 * Contacts PUT body, and push `tags` into your existing tag-add call.
 */
export function buildAddonPatch(input: AddonPatchInput): AddonPatchResult {
  const { selectedAddOns, isFullPayment, addonCohorts, paymentPlanText } = input;
  const patch: Record<string, string> = {};
  const tags: string[] = [];
  const tagLabels: string[] = [];
  const notes: string[] = [];

  for (const a of selectedAddOns) {
    const price = ADDON_PRICE(a, isFullPayment);
    const cohort = addonCohorts[a.id];

    switch (a.id) {
      // ── Boolean-check workshop / single-day add-ons ────────────────
      case 'ai-for-coaches': {
        patch.f2612 = 'true';                              // AI for Coaches ticked
        tags.push('2359'); tagLabels.push('AI Workshop Sale');
        notes.push(`ai-for-coaches: tick f2612 · price €${price}`);
        break;
      }
      case 'programming-for-success': {
        patch.f2613 = 'true';                              // Programming for Success ticked
        tags.push('2546'); tagLabels.push('Programming for Success Sale');
        notes.push(`programming-for-success: tick f2613 · price €${price}`);
        break;
      }
      case 'brand-launch-photoshoot': {
        patch.f2611 = 'true';                              // Brand Launch Photoshoot ticked
        tags.push('2547'); tagLabels.push('Brand Launch Photoshoot Sale');
        notes.push(`brand-launch-photoshoot: tick f2611 · price €${price}`);
        break;
      }

      // ── Standalone follow-on qualifications (price + course + plan) ──
      case 'nutricert-global': {
        patch.f2329 = '530';                               // AN Course = Advanced Nutrition Course
        patch.f2330 = String(price);                       // AN Price
        patch.f2332 = paymentPlanText;                     // AN Payment Plan
        tags.push('2628'); tagLabels.push('NutriCert Global Sale');
        notes.push(`nutricert-global: f2329=530 · f2330=${price}`);
        break;
      }
      case 'pre-post-natal': {
        patch.f2323 = '529';                               // PPN Course = Pre and Post Natal Online
        patch.f2324 = String(price);                       // PPN Price
        patch.f2326 = paymentPlanText;                     // PPN Payment Plan
        tags.push('2629'); tagLabels.push('Pre & Post Natal Sale');
        notes.push(`pre-post-natal: f2323=529 · f2324=${price}`);
        break;
      }
      case 'strength-conditioning': {
        patch.f2318 = '528';                               // S&C Course = Strength & Conditioning
        patch.f2317 = '589';                               // S&C Qualification = Level 4 (Active IQ)
        patch.f2319 = String(price);                       // S&C Price
        patch.f2321 = paymentPlanText;                     // S&C Payment Plan
        tags.push('2630'); tagLabels.push('S&C Course Sale');
        notes.push(`strength-conditioning: f2318=528 · f2319=${price}`);
        break;
      }

      // ── Cohort-required Pilates add-ons (Mat / Reformer) ───────────
      case 'mat-pilates-cert': {
        if (cohort && cohort.locationId && cohort.timetableId && cohort.startDate) {
          const startUnix = String(Math.floor(new Date(cohort.startDate).getTime() / 1000));
          patch.f2302 = '512';                             // The Cert — Mat Pilates Instructor EQF L4
          patch.f2303 = cohort.locationId;
          patch.f2304 = cohort.timetableId;
          patch.f2305 = startUnix;
          patch.f2306 = String(price);                     // 1800 upfront / 2000 plan
          patch.f2309 = paymentPlanText;
          tags.push('2327'); tagLabels.push('Pilates Skool Enrolment');
          const month = new Date(cohort.startDate).getMonth();
          if (month >= 6) { tags.push('2543'); tagLabels.push('A26 Pilates Course Sale'); }
          else            { tags.push('2521'); tagLabels.push('S26 Pilates Course Sale'); }
          notes.push(`mat-pilates-cert: cohort loc=${cohort.locationId} tt=${cohort.timetableId} start=${cohort.startDate} · price €${price}`);
        } else {
          notes.push(`mat-pilates-cert: ⚠ cohort missing — Pilates fields NOT written`);
        }
        break;
      }
      case 'reformer-pilates-cpd': {
        if (cohort && cohort.locationId && cohort.timetableId && cohort.startDate) {
          const startUnix = String(Math.floor(new Date(cohort.startDate).getTime() / 1000));
          patch.f2592 = '619';                             // Reformer Pilates Instructor (CPD)
          patch.f2593 = cohort.locationId;
          patch.f2594 = cohort.timetableId;
          patch.f2595 = startUnix;
          patch.f2596 = String(price);
          patch.f2598 = paymentPlanText;
          tags.push('2524'); tagLabels.push('Reformer Pilates Skool Enrolment');
          const month = new Date(cohort.startDate).getMonth();
          if (month >= 6) { tags.push('2525'); tagLabels.push('A26 Reformer Pilates Sale'); }
          else            { tags.push('2516'); tagLabels.push('S26 Reformer Pilates Sale'); }
          notes.push(`reformer-pilates-cpd: cohort loc=${cohort.locationId} tt=${cohort.timetableId} start=${cohort.startDate} · price €${price}`);
        } else {
          notes.push(`reformer-pilates-cpd: ⚠ cohort missing — Reformer fields NOT written`);
        }
        break;
      }

      default:
        // Unknown add-on — log it so we know to add the mapping
        notes.push(`${a.id}: ⚠ no Ontraport mapping defined`);
    }
  }

  return { patch, tags, tagLabels, notes };
}
