// ─── ICS Calendar File Generator ────────────────────────────────────
// Generates valid iCalendar (.ics) files from timetable data

import type { TimetableWeek } from './timetable-generator';

function formatICSDate(dateStr: string, time: string): string {
  // Convert "2026-04-27" + "10:00" to "20260427T100000"
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = time.split(':');
  return `${year}${month}${day}T${hour}${minute}00`;
}

function escapeICS(text: string): string {
  return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
}

/**
 * Generate a complete .ics file content for the full timetable
 */
export function generateICSFile(
  weeks: TimetableWeek[],
  courseName: string,
  locationName: string,
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Image Fitness Training//Course Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(courseName)}`,
  ];

  for (const week of weeks) {
    for (const session of week.sessions) {
      const uid = `ift-${session.date}-${session.startTime.replace(':', '')}@imageft.ie`;
      const summary = `IFT ${courseName} - Week ${week.week} (${session.day})`;

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uid}`);
      lines.push(`DTSTART:${formatICSDate(session.date, session.startTime)}`);
      lines.push(`DTEND:${formatICSDate(session.date, session.endTime)}`);
      lines.push(`SUMMARY:${escapeICS(summary)}`);
      lines.push(`LOCATION:${escapeICS(locationName)}`);
      lines.push(`DESCRIPTION:${escapeICS(`Image Fitness Training - ${courseName}\\nWeek ${week.week}`)}`);
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    }
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Generate .ics for a single session
 */
export function generateSingleSessionICS(
  session: { date: string; day: string; startTime: string; endTime: string },
  week: number,
  courseName: string,
  locationName: string,
): string {
  const uid = `ift-${session.date}-${session.startTime.replace(':', '')}@imageft.ie`;
  const summary = `IFT ${courseName} - Week ${week} (${session.day})`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Image Fitness Training//Course Timetable//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${formatICSDate(session.date, session.startTime)}`,
    `DTEND:${formatICSDate(session.date, session.endTime)}`,
    `SUMMARY:${escapeICS(summary)}`,
    `LOCATION:${escapeICS(locationName)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
