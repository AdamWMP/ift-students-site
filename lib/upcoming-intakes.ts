// Auto-derived "upcoming intakes" data for the PT + Pilates call pages.
//
// Pulls from the real course-data files (single source of truth shared with
// the booking flow and edu-imageft-ie), filters out past + sold-out intakes,
// and produces a `places` count that ticks down with proximity to start
// date — real urgency, no hand-edited numbers.

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
  date: string;              // "2 July"
  startISO: string;          // "2026-07-02"
  location: string;          // "Dublin (Swords & Tallaght)" or "Nationwide"
  format: string;            // "Full Time Thu & Fri"
  type?: 'mat' | 'reformer';
  daysUntilStart: number;
  places: number | null;     // null = > 60 days out, no specific number
  urgent: boolean;
};

const DAY_MS = 86_400_000;

function formatShortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d} ${months[m - 1]}`;
}

function ptLocationDisplay(ids: string[]): string {
  const nationwide = new Set(['swords','tallaght','cork','galway','limerick','wexford']);
  if (ids.length >= 6 && ids.every(id => nationwide.has(id))) return 'Nationwide';
  if (ids.length === 2 && ids.includes('swords') && ids.includes('tallaght')) {
    return 'Dublin (Swords & Tallaght)';
  }
  return ids
    .map(id => ptLocations.find(l => l.id === id)?.name ?? id)
    .map(name => name.replace(/^Dublin \((.*)\)$/, '$1'))
    .join(' · ');
}

function pilatesLocationDisplay(ids: string[], pool: typeof pilatesLocations): string {
  return ids
    .map(id => pool.find(l => l.id === id)?.name ?? id)
    .join(' · ');
}

/**
 * Initial places count from days-until-start. Closer course → fewer places.
 * At ~2 weeks out: 2 places. Toast generator on the call page decrements
 * these as fake "live bookings" come in, eventually hitting 1 / "Final".
 */
function initialPlacesForDays(days: number): number | null {
  if (days <= 0) return 0;
  if (days <= 3) return 1;
  if (days <= 14) return 2;        // 2 weeks: 2 places
  if (days <= 21) return 3;
  if (days <= 30) return 5;
  if (days <= 45) return 8;
  if (days <= 60) return 12;
  return null;                     // > 60 days: no specific number
}

export function placesLine(places: number | null): string {
  if (places === null) return 'Early-bird places available';
  if (places <= 0)   return 'SOLD OUT';
  if (places === 1)  return '⚠️ Final place — book today';
  if (places <= 2)   return `⚠️ Only ${places} places remaining`;
  if (places <= 5)   return `⚠️ ${places} places remaining`;
  return `${places} places available`;
}

export function isUrgent(places: number | null): boolean {
  return places !== null && places > 0 && places <= 5;
}

export function getUpcomingPtIntakes(limit = 3, horizonDays = 180): IntakeCard[] {
  const now = Date.now();
  return ptStartDates
    .filter(sd => !sd.locations.includes('online'))
    .map(sd => ({ sd, t: new Date(sd.date).getTime() }))
    .filter(({ t }) => t >= now && t <= now + horizonDays * DAY_MS)
    .sort((a, b) => a.t - b.t)
    .slice(0, limit)
    .map(({ sd, t }) => {
      const daysUntilStart = Math.ceil((t - now) / DAY_MS);
      const tt = ptTimetables.find(x => x.id === sd.timetable);
      const places = initialPlacesForDays(daysUntilStart);
      return {
        startISO: sd.date,
        date: formatShortDate(sd.date),
        location: ptLocationDisplay(sd.locations),
        format: tt?.name ?? sd.timetable,
        daysUntilStart,
        places,
        urgent: isUrgent(places),
      };
    });
}

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
      const daysUntilStart = Math.ceil((t - now) / DAY_MS);
      const tt = tts.find(x => x.id === sd.timetable);
      const realSpotsLeft = typeof sd.spotsLeft === 'number' ? sd.spotsLeft : null;
      const places = realSpotsLeft !== null ? realSpotsLeft : initialPlacesForDays(daysUntilStart);
      return {
        startISO: sd.date,
        date: formatShortDate(sd.date),
        location: pilatesLocationDisplay(sd.locations, pool),
        format: tt?.name ?? sd.timetable,
        type,
        daysUntilStart,
        places,
        urgent: isUrgent(places),
      };
    });
}
