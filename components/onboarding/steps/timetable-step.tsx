'use client';

import { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Check, CalendarPlus, Printer } from 'lucide-react';
import { generateTimetable } from '@/lib/timetable-generator';
import { generateICSFile, generateSingleSessionICS } from '@/lib/ics-generator';
import { locations, timetables, courseStartDates } from '@/lib/course-data';
import type { ContactData } from '../onboarding-content';

// Map Ontraport option IDs back to keys
const LOCATION_ID_TO_KEY: Record<string, string> = {
  '503': 'swords', '502': 'tallaght', '501': 'cork', '500': 'galway',
  '499': 'limerick', '498': 'wexford', '563': 'belfast', '544': 'online',
};
const TIMETABLE_ID_TO_KEY: Record<string, string> = {
  '505': '8-week-intensive', '597': '16-week-evening-sat',
  '504': '16-week-saturday', '544': 'online-self-paced',
};

// Schedule display names
const SCHEDULE_DISPLAY: Record<string, string> = {
  '8-week-intensive': '8-Week Intensive (Thu & Fri 10am–4:30pm)',
  '16-week-evening-sat': '8-Week Part-Time (Mon & Wed 7pm–10pm + Sat 10am–4:30pm)',
  '16-week-saturday': '16-Week Part-Time (Saturday 10am–4:30pm)',
  'online-self-paced': 'Online / Self-Paced',
};

interface TimetableStepProps {
  contact: ContactData;
  checkoutData: Record<string, string> | null;
  onComplete: () => void;
  isCompleted: boolean;
}

export function TimetableStep({ contact, checkoutData, onComplete, isCompleted }: TimetableStepProps) {
  const [viewed, setViewed] = useState(isCompleted);
  const [showA4, setShowA4] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  // Calculate exam week (last week)
  const examWeek = weeks.length > 0 ? weeks[weeks.length - 1] : null;
  const lastSessionDate = examWeek?.sessions[examWeek.sessions.length - 1];

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

  const handlePrint = () => {
    setShowA4(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadPDF = () => {
    setShowA4(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleViewed = () => {
    if (!viewed) {
      setViewed(true);
      onComplete();
    }
  };

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

  const startFormatted = effectiveStartDate
    ? new Date(effectiveStartDate).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  const endFormatted = lastSessionDate?.date
    ? new Date(lastSessionDate.date).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
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
            {startFormatted && ` &mdash; Starting ${startFormatted}`}
          </p>
        </div>

        {/* A4 Timetable Preview — scrollable in the card */}
        {weeks.length > 0 && (
          <div className="p-4 md:p-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-4 md:p-6 max-h-[500px] overflow-y-auto">
                {/* Header band */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-amber-500">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">
                      COURSE TIMETABLE
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Image Fitness Training Global</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-700">{contact.firstName} {contact.lastName}</p>
                    <p className="text-xs text-gray-500">{contact.packageName}</p>
                  </div>
                </div>

                {/* Key info cards */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Location</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">{location?.name || 'TBC'}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Schedule</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">{timetable?.name || 'TBC'}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Duration</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">{weeks.length} Weeks</p>
                  </div>
                </div>

                {/* Date range */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-4 text-xs">
                  <div>
                    <span className="text-gray-500">Start: </span>
                    <span className="font-semibold text-gray-900">{startFormatted}</span>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div>
                    <span className="text-gray-500">End: </span>
                    <span className="font-semibold text-gray-900">{endFormatted}</span>
                  </div>
                </div>

                {/* Week-by-week table */}
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1.5 px-2 text-gray-500 font-semibold w-16">WEEK</th>
                      <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">DAY</th>
                      <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">DATE</th>
                      <th className="text-right py-1.5 px-2 text-gray-500 font-semibold">TIME</th>
                      <th className="w-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeks.map((week, wIdx) => (
                      week.sessions.map((session, sIdx) => {
                        const isExamWeek = wIdx === weeks.length - 1;
                        return (
                          <tr
                            key={`${week.week}-${sIdx}`}
                            className={`border-b border-gray-100 ${isExamWeek ? 'bg-red-50' : wIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                          >
                            {sIdx === 0 && (
                              <td
                                className={`py-1.5 px-2 font-bold ${isExamWeek ? 'text-red-600' : 'text-amber-600'}`}
                                rowSpan={week.sessions.length}
                              >
                                {isExamWeek ? `W${week.week} EXAM` : `W${week.week}`}
                              </td>
                            )}
                            <td className="py-1.5 px-2 font-medium text-gray-800">{session.day}</td>
                            <td className="py-1.5 px-2 text-gray-600">{session.dateFormatted}</td>
                            <td className="py-1.5 px-2 text-right text-gray-600">{session.startTime}–{session.endTime}</td>
                            <td className="py-1.5 px-1">
                              <button
                                onClick={() => handleDownloadSession(week.week, session)}
                                className="text-gray-400 hover:text-amber-600 transition-colors"
                                title="Add to calendar"
                              >
                                <CalendarPlus className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ))}
                  </tbody>
                </table>

                {/* Exam note */}
                {examWeek && (
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs font-semibold text-red-700">
                      Exam Week — Week {examWeek.week}
                    </p>
                    <p className="text-[11px] text-red-600 mt-0.5">
                      Theory & practical exams. Dates: {examWeek.sessions.map(s => s.dateFormatted).join(' & ')}
                    </p>
                  </div>
                )}

                {/* Footer info */}
                <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Image Fitness Training Global &mdash; imageft.ie</span>
                  <span>Generated {new Date().toLocaleDateString('en-IE')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 md:p-6 border-t border-zinc-800 space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Save as PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
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
              I've Reviewed My Timetable
            </motion.button>
          )}
        </div>
      </div>

      {/* Hidden A4 print layout — only shown when printing */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-timetable, #print-timetable * { visibility: visible !important; }
          #print-timetable {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 12mm !important;
            background: white !important;
            z-index: 99999 !important;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      {/* Print-only A4 timetable */}
      <div id="print-timetable" className="hidden print:block" ref={printRef}>
        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #d97706', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>COURSE TIMETABLE</h1>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0' }}>Image Fitness Training Global</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>{contact.firstName} {contact.lastName}</p>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>{contact.packageName}</p>
            </div>
          </div>

          {/* Key info */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <div style={{ flex: 1, background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '9px', color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Location</p>
              <p style={{ fontSize: '12px', fontWeight: 700, margin: '3px 0 0' }}>{location?.name || 'TBC'}</p>
            </div>
            <div style={{ flex: 1, background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '9px', color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Schedule</p>
              <p style={{ fontSize: '12px', fontWeight: 700, margin: '3px 0 0' }}>{SCHEDULE_DISPLAY[timetableKey] || timetable?.name}</p>
            </div>
            <div style={{ flex: 1, background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '9px', color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Duration</p>
              <p style={{ fontSize: '12px', fontWeight: 700, margin: '3px 0 0' }}>{startFormatted} &mdash; {endFormatted}</p>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280', fontWeight: 600, width: '60px' }}>WEEK</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280', fontWeight: 600 }}>DAY</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280', fontWeight: 600 }}>DATE</th>
                <th style={{ textAlign: 'right', padding: '6px 8px', color: '#6b7280', fontWeight: 600 }}>TIME</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wIdx) =>
                week.sessions.map((session, sIdx) => {
                  const isExamWeek = wIdx === weeks.length - 1;
                  return (
                    <tr
                      key={`${week.week}-${sIdx}`}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        backgroundColor: isExamWeek ? '#fef2f2' : wIdx % 2 === 0 ? '#fff' : '#fafafa',
                      }}
                    >
                      {sIdx === 0 && (
                        <td
                          style={{
                            padding: '5px 8px',
                            fontWeight: 700,
                            color: isExamWeek ? '#dc2626' : '#d97706',
                            verticalAlign: 'top',
                          }}
                          rowSpan={week.sessions.length}
                        >
                          {isExamWeek ? `W${week.week} EXAM` : `W${week.week}`}
                        </td>
                      )}
                      <td style={{ padding: '5px 8px', fontWeight: 500 }}>{session.day}</td>
                      <td style={{ padding: '5px 8px', color: '#4b5563' }}>{session.dateFormatted}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'right', color: '#4b5563' }}>{session.startTime}–{session.endTime}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Exam callout */}
          {examWeek && (
            <div style={{ marginTop: '12px', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', margin: 0 }}>
                Exam Week — Week {examWeek.week}
              </p>
              <p style={{ fontSize: '10px', color: '#b91c1c', margin: '3px 0 0' }}>
                Theory & practical exams. Dates: {examWeek.sessions.map(s => s.dateFormatted).join(' & ')}
              </p>
            </div>
          )}

          {/* What to bring */}
          <div style={{ marginTop: '12px', padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#166534', margin: 0 }}>What to Bring on Day One</p>
            <p style={{ fontSize: '10px', color: '#15803d', margin: '3px 0 0' }}>
              Copybook, pen, and comfy training clothes. We provide your course manuals. Your tutor will meet you at the location.
            </p>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#9ca3af' }}>
            <span>Image Fitness Training Global &mdash; imageft.ie &mdash; WhatsApp: 086 600 3667</span>
            <span>Generated {new Date().toLocaleDateString('en-IE')}</span>
          </div>
        </div>
      </div>
    </>
  );
}
