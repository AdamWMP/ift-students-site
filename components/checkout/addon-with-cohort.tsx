'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, ChevronDown } from 'lucide-react';
import type { AddOn } from '@/lib/course-data';

// ─── Cohort data for the two requiresCohort add-ons ──────────────────
// Values = Ontraport dropdown option IDs (not strings) so the API route
// can write them straight into the relevant Pilates / Reformer fields:
//
//   Mat:      f2303 location · f2304 timetable · f2305 start date (unix)
//   Reformer: f2593 location · f2594 timetable · f2595 start date (unix)
//
// Locations + timetables are filtered cascade-style; start dates are
// filtered by `${locationId}-${timetableId}`. Sourced from
// edu.imageft.ie/timetable on 2026-05-27.

export interface CohortSelection {
  locationId: string;
  timetableId: string;
  startDate: string; // YYYY-MM-DD (converted to unix in API route)
}

type Field = 'pilates' | 'reformer';

const LOCATION_NAMES: Record<string, string> = {
  // Pilates / Mat
  '515': 'Dublin — Tallaght',
  '516': 'Dublin — Swords',
  '514': 'Cork City',
  '513': 'Galway',
  '635': 'Derry / L\'Derry',
  '634': 'Online (live Zoom)',
  // Reformer
  '621': 'Dublin — Tallaght',
  '622': 'Dublin — Swords',
  '620': 'Cork City',
  '630': 'Clare (Shannon)',
  '632': 'Killarney, Kerry',
  '631': 'Derry / L\'Derry',
};

const PILATES_LOCATIONS: Array<{ id: string; label: string }> = [
  { id: '515', label: 'Dublin — Tallaght' },
  { id: '516', label: 'Dublin — Swords' },
  { id: '514', label: 'Cork City' },
  { id: '513', label: 'Galway' },
  { id: '635', label: 'Derry / L\'Derry' },
  { id: '634', label: 'Online (live Zoom)' },
];

const REFORMER_LOCATIONS: Array<{ id: string; label: string }> = [
  { id: '621', label: 'Dublin — Tallaght' },
  { id: '622', label: 'Dublin — Swords' },
  { id: '620', label: 'Cork City' },
  { id: '630', label: 'Clare (Shannon — Pilates Playground)' },
  { id: '632', label: 'Killarney, Kerry' },
  { id: '631', label: 'Derry / L\'Derry (Gateway Studio)' },
];

const MAT_TIMETABLES: Record<string, Array<{ id: string; label: string }>> = {
  '515': [
    { id: '517', label: 'Bi-Weekly Saturdays · 10am–4:30pm · 11 weeks' },
    { id: '625', label: 'Bi-Weekly Sats + 3-Weekend Intensive (Mat + Reformer)' },
  ],
  '516': [
    { id: '517', label: 'Bi-Weekly Saturdays · 10am–4:30pm · 11 weeks' },
    { id: '601', label: '3-Weekend Intensive (Sat & Sun)' },
    { id: '625', label: 'Bi-Weekly Sats + 3-Weekend Intensive' },
  ],
  '514': [
    { id: '517', label: 'Bi-Weekly Saturdays · 10am–4:30pm · 11 weeks' },
  ],
  '513': [
    { id: '601', label: '3-Weekend Intensive (Sat & Sun) · 10am–4:30pm' },
  ],
  '635': [
    { id: '601', label: '3-Weekend Intensive (Sat & Sun) · Gateway Studio' },
  ],
  '634': [
    { id: '598', label: 'Tue & Thu Evenings Online · 7–10pm · 14 sessions' },
  ],
};

const MAT_STARTS: Record<string, Array<{ value: string; label: string; disabled?: boolean }>> = {
  '515-517': [{ value: '2026-09-19', label: 'Saturday 19 September 2026 · ends 28 November' }],
  '515-625': [{ value: '2026-09-19', label: 'Saturday 19 September 2026 · 11 wks + 3 wknds' }],
  '516-517': [
    { value: '2026-04-25', label: 'Saturday 25 April 2026 · ends 11 July' },
    { value: '2026-09-19', label: 'Saturday 19 September 2026 · ends 28 November' },
  ],
  '516-601': [{ value: '2026-07-25', label: 'Sat 25 Jul – Sun 30 Aug 2026 · 3 weekends' }],
  '516-625': [{ value: '2026-09-19', label: 'Saturday 19 September 2026 · combined Mat + Reformer' }],
  '514-517': [
    { value: '2026-06-06', label: 'Saturday 6 June 2026 · ends 22 August' },
    { value: '2026-09-19', label: 'Saturday 19 September 2026 · ends 28 November' },
  ],
  '513-601': [{ value: '2026-09-05', label: 'Sat 5 Sep – Sun 27 Sep 2026 · 3 weekends' }],
  '635-601': [{ value: '2026-09-05', label: 'Sat 5 Sep – Sun 4 Oct 2026 · Gateway Studio' }],
  '634-598': [{ value: '2026-06-23', label: 'Tuesday 23 June 2026 · ends 6 August (7 weeks)' }],
};

const REFORMER_TIMETABLES: Record<string, Array<{ id: string; label: string }>> = {
  '621': [{ id: '623', label: 'Bi-Weekly Sat & Sun · 10am–6pm · 4 weekends' }],
  '622': [{ id: '623', label: 'Bi-Weekly Sat & Sun · 10am–6pm · 4 weekends' }],
  '620': [{ id: '623', label: 'Bi-Weekly Sat & Sun · 10am–6pm · 4 weekends' }],
  '630': [{ id: '623', label: 'Bi-Weekly Sat & Sun · 10am–6pm · 4 weekends (Pilates Playground)' }],
  '632': [{ id: '623', label: 'Bi-Weekly Sat & Sun · 10am–6pm · 4 weekends (Killarney)' }],
  '631': [{ id: '623', label: 'Bi-Weekly Sat & Sun · 10am–6pm · 4 weekends (Gateway Studio)' }],
};

const REFORMER_STARTS: Record<string, Array<{ value: string; label: string; disabled?: boolean }>> = {
  '622-623': [
    { value: '2026-07-04', label: 'Sat 4 Jul – Sun 2 Aug 2026 · SOLD OUT', disabled: true },
    { value: '2026-09-12', label: 'Sat 12 Sep – Sun 25 Oct 2026 · alternate weekend pattern' },
  ],
  '621-623': [{ value: '2026-09-12', label: 'Sat 12 Sep – Sun 25 Oct 2026 · 4 weekends' }],
  '620-623': [{ value: '2026-09-05', label: 'Sat 5 Sep – Sun 4 Oct 2026 · 4 weekends' }],
  '630-623': [{ value: '2026-10-10', label: 'Sat 10 Oct – Sun 8 Nov 2026 · The Pilates Playground' }],
  '632-623': [{ value: '2026-06-06', label: 'Sat 6 Jun – Sun 5 Jul 2026 · Killarney' }],
  '631-623': [{ value: '2026-10-24', label: 'Sat 24 Oct – Sun 29 Nov 2026 · final exam wknd 28–29 Nov' }],
};

// ─── Helpers ─────────────────────────────────────────────────────────

function getLocations(field: Field) {
  return field === 'reformer' ? REFORMER_LOCATIONS : PILATES_LOCATIONS;
}

function getTimetables(field: Field, locationId: string) {
  if (!locationId) return [];
  return (field === 'reformer' ? REFORMER_TIMETABLES : MAT_TIMETABLES)[locationId] ?? [];
}

function getStarts(field: Field, locationId: string, timetableId: string) {
  if (!locationId || !timetableId) return [];
  return (field === 'reformer' ? REFORMER_STARTS : MAT_STARTS)[`${locationId}-${timetableId}`] ?? [];
}

function formatDate(d: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Component ───────────────────────────────────────────────────────

interface Props {
  addon: AddOn;
  selected: boolean;
  cohort: CohortSelection | null;
  onToggle: () => void;
  onCohortChange: (c: CohortSelection | null) => void;
}

export function AddOnWithCohort({ addon, selected, cohort, onToggle, onCohortChange }: Props) {
  const field: Field = addon.cohortFieldSet === 'reformer' ? 'reformer' : 'pilates';
  const isMat = field === 'pilates';

  // Local working copy — committed up to the parent only when all three are picked
  const [draft, setDraft] = useState<CohortSelection>({
    locationId: cohort?.locationId ?? '',
    timetableId: cohort?.timetableId ?? '',
    startDate: cohort?.startDate ?? '',
  });

  const commit = (next: CohortSelection) => {
    setDraft(next);
    if (next.locationId && next.timetableId && next.startDate) {
      onCohortChange(next);
    } else {
      onCohortChange(null);
    }
  };

  const onLocation = (locationId: string) => {
    commit({ locationId, timetableId: '', startDate: '' });
  };
  const onTimetable = (timetableId: string) => {
    commit({ ...draft, timetableId, startDate: '' });
  };
  const onStart = (startDate: string) => {
    commit({ ...draft, startDate });
  };

  const timetables = getTimetables(field, draft.locationId);
  const starts = getStarts(field, draft.locationId, draft.timetableId);
  const fullyConfigured = !!(draft.locationId && draft.timetableId && draft.startDate);

  const badgeClass = isMat
    ? 'bg-[#F2C5C5]/15 text-[#F2C5C5]'
    : 'bg-[#9CD095]/15 text-[#9CD095]';

  const selectCls =
    'w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm font-medium ' +
    'appearance-none cursor-pointer focus:outline-none focus:border-[#D4A836] focus:ring-2 focus:ring-[#D4A836]/15 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <motion.div
      whileTap={{ scale: 0.995 }}
      className={`relative w-full text-left rounded-xl border-2 overflow-hidden transition-colors ${
        selected
          ? 'border-[#D4A836] bg-[#D4A836]/5'
          : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
      }`}
    >
      {/* Header — clickable to toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-3 md:p-4 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-white font-bold text-sm">{addon.name}</h4>
              {addon.badge && (
                <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full whitespace-nowrap ${badgeClass}`}>
                  {addon.badge}
                </span>
              )}
              <span className="text-[10px] text-zinc-500">{addon.delivery}</span>
            </div>
            <p className="text-zinc-400 text-xs mb-2 leading-relaxed">{addon.description}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {addon.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1 text-[11px] text-zinc-300">
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
            {addon.paymentPlanPrice && addon.paymentPlanPrice !== addon.price && (
              <span className="text-[10px] text-zinc-400 block leading-tight mt-0.5">
                or &euro;{addon.paymentPlanPrice.toLocaleString()} on a plan
              </span>
            )}
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-1.5 ml-auto transition-colors ${
                selected ? 'bg-[#D4A836] border-[#D4A836]' : 'border-zinc-600'
              }`}
            >
              {selected ? (
                <Check className="w-4 h-4 text-black" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Cohort sub-menu — only when selected */}
      <AnimatePresence initial={false}>
        {selected && (
          <motion.div
            key="cohort"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden bg-black/30 border-t border-[#D4A836]/25"
          >
            <div className="p-4 md:p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A836]" />
                <p className="text-[10px] font-bold text-[#D4A836] uppercase tracking-[0.18em]">
                  Pick your {isMat ? 'Mat Pilates' : 'Reformer'} cohort
                </p>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {isMat
                  ? 'Every Mat Pilates qualification has a fixed cohort — pick where, when, and how you\'d like to study.'
                  : 'Reformer runs as a 4-weekend intensive (Sat & Sun, 10am–6pm). Pick the studio and weekend block that suits your calendar.'}
              </p>

              {/* Location */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 font-bold mb-1.5">
                  {isMat ? 'Studio Location' : 'Studio'}
                </label>
                <div className="relative">
                  <select
                    value={draft.locationId}
                    onChange={(e) => onLocation(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Choose a {isMat ? 'location' : 'studio'}…</option>
                    {getLocations(field).map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#D4A836] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Timetable / Format */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 font-bold mb-1.5">
                  {isMat ? 'Schedule' : 'Format'}
                </label>
                <div className="relative">
                  <select
                    value={draft.timetableId}
                    onChange={(e) => onTimetable(e.target.value)}
                    disabled={!draft.locationId}
                    className={selectCls}
                  >
                    <option value="">
                      {draft.locationId ? `Choose a ${isMat ? 'schedule' : 'format'}…` : `Pick a ${isMat ? 'location' : 'studio'} first…`}
                    </option>
                    {timetables.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#D4A836] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Start date / Weekend block */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 font-bold mb-1.5">
                  {isMat ? 'Start date' : 'Weekend block'}
                </label>
                <div className="relative">
                  <select
                    value={draft.startDate}
                    onChange={(e) => onStart(e.target.value)}
                    disabled={!draft.timetableId}
                    className={selectCls}
                  >
                    <option value="">
                      {draft.timetableId ? `Choose a ${isMat ? 'start date' : 'weekend block'}…` : `Pick a ${isMat ? 'schedule' : 'format'} first…`}
                    </option>
                    {starts.map((s) => (
                      <option key={s.value} value={s.value} disabled={s.disabled}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#D4A836] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Confirmation or warning */}
              {fullyConfigured ? (
                <div className="bg-[#D4A836]/8 border border-dashed border-[#D4A836]/35 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed">
                  You&apos;ve chosen: <strong className="text-[#D4A836] font-semibold">
                    {LOCATION_NAMES[draft.locationId]} — {timetables.find(t => t.id === draft.timetableId)?.label}, starting {formatDate(draft.startDate)}
                  </strong>.
                  This add-on rolls into your existing payment plan — no extra deposit, just one combined monthly payment.
                </div>
              ) : (
                <div className="bg-amber-500/8 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 leading-relaxed">
                  Pick a {isMat ? 'location, schedule, and start date' : 'studio, format, and weekend block'} to add this to your booking.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-0.5 bg-[#D4A836] origin-left"
        />
      )}
    </motion.div>
  );
}
