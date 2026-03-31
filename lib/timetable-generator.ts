// ─── Timetable Generator ────────────────────────────────────────────
// Generates week-by-week course timetables from a start date + schedule type

import { addDays, addWeeks, format, getDay, nextDay } from 'date-fns';

export interface TimetableSession {
  day: string;       // e.g. "Thursday"
  date: string;      // e.g. "2026-04-27"
  dateFormatted: string; // e.g. "27 Apr 2026"
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "16:30"
}

export interface TimetableWeek {
  week: number;
  sessions: TimetableSession[];
}

// Day name to date-fns day index (0=Sun, 1=Mon, ..., 6=Sat)
const DAY_INDEX: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

interface SchedulePattern {
  totalWeeks: number;
  days: { dayName: string; startTime: string; endTime: string }[];
}

const SCHEDULE_PATTERNS: Record<string, SchedulePattern> = {
  '8-week-intensive': {
    totalWeeks: 8,
    days: [
      { dayName: 'Thursday', startTime: '10:00', endTime: '16:30' },
      { dayName: 'Friday', startTime: '10:00', endTime: '16:30' },
    ],
  },
  '16-week-evening-sat': {
    totalWeeks: 8,
    days: [
      { dayName: 'Monday', startTime: '19:00', endTime: '22:00' },
      { dayName: 'Wednesday', startTime: '19:00', endTime: '22:00' },
      { dayName: 'Saturday', startTime: '10:00', endTime: '16:30' },
    ],
  },
  '16-week-saturday': {
    totalWeeks: 16,
    days: [
      { dayName: 'Saturday', startTime: '10:00', endTime: '16:30' },
    ],
  },
};

/**
 * Generate a full course timetable from start date and schedule type.
 * The start date is the first session day — we align to the correct weekday.
 */
export function generateTimetable(startDateStr: string, scheduleType: string): TimetableWeek[] {
  const pattern = SCHEDULE_PATTERNS[scheduleType];
  if (!pattern) return [];

  const startDate = new Date(startDateStr);
  const weeks: TimetableWeek[] = [];

  for (let w = 0; w < pattern.totalWeeks; w++) {
    const weekStart = addWeeks(startDate, w);
    // Go back to Sunday of this week to calculate each day correctly
    const sundayOfWeek = addDays(weekStart, -getDay(weekStart));

    const sessions: TimetableSession[] = pattern.days.map(day => {
      const dayIdx = DAY_INDEX[day.dayName.toLowerCase()];
      let sessionDate = addDays(sundayOfWeek, dayIdx);

      // For the first week, if the day is before the start date, push forward
      if (w === 0 && sessionDate < startDate) {
        sessionDate = nextDay(startDate, dayIdx);
      }

      return {
        day: day.dayName,
        date: format(sessionDate, 'yyyy-MM-dd'),
        dateFormatted: format(sessionDate, 'd MMM yyyy'),
        startTime: day.startTime,
        endTime: day.endTime,
      };
    });

    weeks.push({ week: w + 1, sessions });
  }

  return weeks;
}

/** Get schedule pattern info */
export function getSchedulePattern(scheduleType: string): SchedulePattern | undefined {
  return SCHEDULE_PATTERNS[scheduleType];
}
