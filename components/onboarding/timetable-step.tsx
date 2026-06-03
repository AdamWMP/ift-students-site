'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Check, ExternalLink, CalendarPlus } from 'lucide-react';
import { generateTimetable } from '@/lib/timetable-generator';
import { generateICSFile, generateSingleSessionICS } from '@/lib/ics-generator';
import { locations, timetables, courseStartDates } from '@/lib/course-data';
import type { ContactData } from './onboarding-content';

// Map Ontraport option IDs back to internal keys.
// Pulled from get_object_meta(0) on 2026-05-27 — covers EVERY active
// option in f2291 (PT Course Location) and f2292 (PT Course Timetable).
// Historical incompleteness was the cause of blank-screen onboarding
// timetables for Sunday-cohort + Mon/Tue + Mon/Wed Evening students.
const LOCATION_ID_TO_KEY: Record<string, string> = {
  // PT Course Location (f2291) — full set
  '498': 'wexford',
  '499': 'limerick',
  '500': 'galway',
  '501': 'cork',
  '502': 'tallaght',
  '503': 'swords',
  '544': 'online',
  '563': 'belfast',
};
const TIMETABLE_ID_TO_KEY: Record<string, string> = {
  // PT Course Timetable (f2292) — full set
  '504': '16-week-saturday',           // Saturday (16 Weeks)
  '505': '8-week-intensive',           // Thursday & Friday (8 Weeks)
  '506': '8-week-mon-tue',             // Monday & Tuesday (8 Weeks)
  '539': '16-week-mon-wed-eve',        // Monday & Wednesday Evenings (16 Weeks)
  '597': '8-week-eve-weekend',         // Evening & Weekend — Mon + Wed + Sat (8 Weeks)
  '633': 'pt-sun16',                   // Sunday (16 Weeks)
};

interface TimetableStepProps {
  contact: ContactData;
  checkoutData: Record<string, string> | null;
  onComplete: () => void;
  isCompleted: boolean;
}

export function TimetableStep({ contact, checkoutData, onComplete, isCompleted }: TimetableStepProps) {
  const [viewed, setViewed] = useState(isCompleted);

  const locationKey = checkoutData?.location || LOCATION_ID_TO_KEY[contact.courseLocation] || '';
  const timetableKey = checkoutData?.timetable || TIMETABLE_ID_TO_KEY[contact.courseTimetable] || '';

  const location = locations.find(l => l.id === locationKey);
  const timetable = timetables.find(t => t.id === timetableKey);

  // Find start date
  const startDateStr = checkoutData?.startDate
    || (contact.courseStartDate ? new Date(Number(contact.courseStartDate) * 1000).toISOString().split('T')[0] : '');

  const startDateEntry = courseStartDates.find(
    sd => sd.locations.includes(locationKey) && sd.timetable === timetableKey
  );

  const effectiveStartDate = startDateStr || startDateEntry?.date || '';

  const weeks = useMemo(() => {
    if (!effectiveStartDate || !timetableKey || timetableKey === 'online-self-paced') return [];
    return generateTimetable(effectiveStartDate, timetableKey);
  }, [effectiveStartDate, timetableKey]);

  const handleDownloadAll = () => {
    if (!weeks.length) return;
    const courseName = contact.packageName || 'PT Course';
    const locationName = location?.name || '';
    const icsContent = generateICSFile(weeks, courseName, locationName);

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IFT-${courseName.replace(/\s+/g, '-')}-Timetable.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSession = (weekNum: number, session: { date: string; day: string; startTime: string; endTime: string }) => {
    const courseName = contact.packageName || 'PT Course';
    const locationName = location?.name || '';
    const icsContent = generateSingleSessionICS(session, weekNum, courseName, locationName);

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IFT-Week${weekNum}-${session.day}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewed = () => {
    if (!viewed) {
      setViewed(true);
      onComplete();
    }
  };

  // ─── Fallback: contact data didn't resolve to a known cohort ─────
  // Triggers when (a) the Ontraport location/timetable IDs aren't in the
  // maps above, (b) the start date can't be resolved against the timetable
  // generator, or (c) the resulting weeks list is empty. Previously this
  // path silently rendered nothing; now we show a friendly hand-off panel
  // pointing to education@imageft.ie + WhatsApp so the student isn't stuck.
  const couldNotResolve =
    timetableKey !== 'online-self-paced' &&
    (!location || !timetable || !effectiveStartDate || weeks.length === 0);

  if (couldNotResolve) {
    const debugReason = !timetableKey
      ? `timetable id "${contact.courseTimetable}" not in map`
      : !locationKey
      ? `location id "${contact.courseLocation}" not in map`
      : !effectiveStartDate
      ? 'no start date on contact'
      : 'week generator returned empty';
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold">We need a moment to finalise your timetable</h3>
        </div>
        <p className="text-zinc-300 text-sm mb-3 leading-relaxed">
          Your booking is confirmed, but we can&apos;t auto-generate your week-by-week schedule
          yet — your cohort assignment isn&apos;t fully linked on our end.
        </p>
        <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
          Message us on{' '}
          <a href="https://wa.me/353866003667" className="text-gold hover:text-yellow-400 underline">
            WhatsApp (+353 86 600 3667)
          </a>{' '}
          or email{' '}
          <a href="mailto:education@imageft.ie" className="text-gold hover:text-yellow-400 underline">
            education@imageft.ie
          </a>
          {' '}— quote student no.{' '}
          <strong className="text-white">#{contact.id}</strong>
          {' '}and we&apos;ll send your full schedule within one working day.
        </p>
        {process.env.NODE_ENV !== 'production' && (
          <p className="text-zinc-600 text-xs italic mb-3">[dev] reason: {debugReason}</p>
        )}
        {!isCompleted && (
          <motion.button whileTap={{ scale: 0.98 }} onClick={handleViewed} className="w-full py-3 bg-gold text-black font-bold rounded-lg">
            I&apos;ve Reached Out — Mark Step Done
          </motion.button>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" /> <span className="text-sm font-semibold">Noted</span>
          </div>
        )}
      </div>
    );
  }

  // Online courses don't have a fixed timetable
  if (timetableKey === 'online-self-paced') {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gold" />
          <h3 className="text-white font-semibold">Your Schedule</h3>
        </div>
        <p className="text-zinc-400 text-sm mb-4">
          As an online/self-paced student, you can study at your own pace. Your course content is available 24/7 in Skool.
        </p>
        {!isCompleted && (
          <motion.button whileTap={{ scale: 0.98 }} onClick={handleViewed} className="w-full py-3 bg-gold text-black font-bold rounded-lg">
            Got It
          </motion.button>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" /> <span className="text-sm font-semibold">Noted</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            <h3 className="text-white font-semibold">Your Timetable</h3>
          </div>
          {weeks.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 text-xs text-gold hover:text-yellow-400 transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              Add All to Calendar
            </button>
          )}
        </div>
        <p className="text-zinc-400 text-sm">
          {location?.name} &mdash; {timetable?.name}
          {effectiveStartDate && ` &mdash; Starting ${new Date(effectiveStartDate).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        </p>
      </div>

      {/* Timetable grid - show first 4 weeks preview */}
      {weeks.length > 0 && (
        <div className="p-4 md:p-6 max-h-[400px] overflow-y-auto">
          <div className="space-y-3">
            {weeks.map((week) => (
              <div key={week.week} className="bg-zinc-800/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gold text-xs font-semibold">Week {week.week}</span>
                </div>
                <div className="space-y-1.5">
                  {week.sessions.map((session, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium w-24">{session.day}</span>
                        <span className="text-zinc-400">{session.dateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 text-xs">{session.startTime} - {session.endTime}</span>
                        <button
                          onClick={() => handleDownloadSession(week.week, session)}
                          className="text-zinc-600 hover:text-gold transition-colors"
                          title="Add to calendar"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 md:p-6 border-t border-zinc-800 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadAll}
            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Print Timetable
          </button>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" /> <span className="text-sm font-semibold">Timetable viewed</span>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewed}
            className="w-full py-3 bg-gold text-black font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            I&apos;ve Reviewed My Timetable
          </motion.button>
        )}
      </div>
    </div>
  );
}
