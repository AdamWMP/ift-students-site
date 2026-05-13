// Auto-derived "upcoming intakes" data for the PT + Pilates call pages.
//
// Pulls from the real course-data files (single source of truth shared with
// the booking flow and edu-imageft-ie), filters out past + sold-out intakes,
// and computes an urgency tag based on days-until-start so the call page's
// "places remaining" countdown always reflects the real timeline without
// anyone having to hand-edit dates.

import {
  courseStartDates as ptStartDates,
  locations as ptLocations,
  timetables as ptTimetables,
} from './course-data';
import {
  courseStartDates as pilatesMatStartDates,
  reformerStartDates as pilatesReformerStartDates,
  locations as pilatesLocations,
  reformerLocations as pilatesReformerLocations,
  timetables as pilatesTimetables,
  reformerTimetables as pilatesReformerTimetables,
} from './pilates-course-data';

export type IntakeCard = {
  date: string;         // "2 July"
  startISO: string;     // "2026-07-02" (for sorting / debugging)
  location: string;     // "Dublin (Swords & Tallaght)" or "Nationwide"
  format: string;       // "Full Time Thu & Fri"
  type?: 'mat' | 'reformer';
  urgent: boolean;
  spotsLine: string;    // derived "places remaining" text
};

const DAY_MS = 86_400_000;

// Format a YYYY-MM-DD as "D Month" (e.g. "2 July")
function formatShortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d} ${months[m - 1]}`;
}

// Map an array of PT location IDs to a human-readable string.
// "Nationwide" if all 6 regions are present, otherwise comma-joined.
function ptLocationDisplay(ids: string[]): string {
  const nationwide = new Set(['swords','tallaght','cork','galway','limerick','wexford']);
  if (ids.length >= 6 && ids.every(id => nationwide.has(id))) return 'Nationwide';
  if (ids.length === 2 && ids.includes('swords') && ids.includes('tallaght')) {
    return 'Dublin (Swords & Tallaght)';
  }
  return ids
    .map(id => ptLocations.find(l => l.id === id)?.name ?? id)
    .map(name => name.replace(/^Dublin \((.*)\)$/, '$1'))   // 'Dublin (Cork)' → 'Cork', etc
    .join(' · ');
}

function pilatesLocationDisplay(ids: string[], pool: typeof pilatesLocations): string {
  return ids
    .map(id => pool.find(l => l.id === id)?.name ?? id)
    .join(' · ');
}

// Map days-until-start to urgency label + text.
// Real spotsLeft (if set on source data) overrides the date-derived text.
function spotsFor(daysUntilStart: number, opts: { spotsLeft?: number; highDemand?: boolean }): { urgent: boolean; spotsLine: string } {
  if (typeof opts.spotsLeft === 'number') {
    return { urgent: opts.spotsLeft <= 5, spotsLine: `⚠️ ${opts.spotsLeft} places remaining` };
  }
  if (opts.highDemand) return { urgent: true, spotsLine: '⚠️ High demand — book soon' };
  if (daysUntilStart <= 7)  return { urgent: true,  spotsLine: '⚠️ Final places — book this week' };
  if (daysUntilStart <= 14) return { urgent: true,  spotsLine: '⚠️ Filling fast — places limited' };
  if (daysUntilStart <= 30) return { urgent: false, spotsLine: 'Places filling — secure your spot' };
  if (daysUntilStart <= 60) return { urgent: false, spotsLine: 'Places available — booking now' };
  return { urgent: false, spotsLine: 'Early-bird places available' };
}

// Returns the next N upcoming PT intakes for the call page.
// Hides anything that's started, anything > horizonDays in the future, and
// any 'online' fallback (no urgency).
export function getUpcomingPtIntakes(limit = 3, horizonDays = 180): IntakeCard[] {
  const now = Date.now();
  return ptStartDates
    .filter(sd => !sd.locations.includes('online'))
    .map(sd => ({ sd, t: new Date(sd.date).getTime() }))
    .filter(({ t }) => t >= now && t <= now + horizonDays * DAY_MS)
    .sort((a, b) => a.t - b.t)
    .slice(0, limit)
    .map(({ sd, t }) => {
      const daysUntil = Math.ceil((t - now) / DAY_MS);
      const tt = ptTimetables.find(x => x.id === sd.timetable);
      const { urgent, spotsLine } = spotsFor(daysUntil, {});
      return {
        startISO: sd.date,
        date: formatShortDate(sd.date),
        location: ptLocationDisplay(sd.locations),
        format: tt?.name ?? sd.timetable,
        urgent,
        spotsLine,
      };
    });
}

// Returns the next N upcoming Pilates intakes (mat + reformer merged).
// Hides past, sold-out, coming-soon entries.
export function getUpcomingPilatesIntakes(limit = 4, horizonDays = 180): IntakeCard[] {
  const now = Date.now();

  const matCards = pilatesMatStartDates
    .filter(sd => !sd.soldOut && !sd.comingSoon && !sd.locations.includes('online'))
    .map(sd => ({ sd, t: new Date(sd.date).getTime(), pool: pilatesLocations, tts: pilatesTimetables, type: 'mat' as const }));

  const reformerCards = pilatesReformerStartDates
    .filter(sd => !sd.soldOut && !sd.comingSoon)
    .map(sd => ({ sd, t: new Date(sd.date).getTime(), pool: pilatesReformerLocations, tts: pilatesReformerTimetables, type: 'reformer' as const }));

  return [...matCards, ...reformerCards]
    .filter(({ t }) => t >= now && t <= now + horizonDays * DAY_MS)
    .sort((a, b) => a.t - b.t)
    .slice(0, limit)
    .map(({ sd, t, pool, tts, type }) => {
      const daysUntil = Math.ceil((t - now) / DAY_MS);
      const tt = tts.find(x => x.id === sd.timetable);
      const { urgent, spotsLine } = spotsFor(daysUntil, { spotsLeft: sd.spotsLeft, highDemand: sd.highDemand });
      return {
        startISO: sd.date,
        date: formatShortDate(sd.date),
        location: pilatesLocationDisplay(sd.locations, pool),
        format: tt?.name ?? sd.timetable,
        type,
        urgent,
        spotsLine,
      };
    });
}
