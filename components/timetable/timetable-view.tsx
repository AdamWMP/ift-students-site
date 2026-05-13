'use client';

import { CalendarPlus, Download, MapPin, Clock, Printer } from 'lucide-react';
import Image from 'next/image';
import type { TimetableWeek } from '@/lib/timetable-generator';
import { generateICSFile, generateSingleSessionICS } from '@/lib/ics-generator';

interface TimetablePageViewProps {
  weeks: TimetableWeek[];
  locationName: string;
  locationAddress: string;
  timetableName: string;
  timetableSchedule: string;
  startDate: string;
  courseName: string;
}

export function TimetablePageView({
  weeks,
  locationName,
  locationAddress,
  timetableName,
  timetableSchedule,
  startDate,
  courseName,
}: TimetablePageViewProps) {

  const handleDownloadAll = () => {
    const icsContent = generateICSFile(weeks, courseName, locationName);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IFT-Timetable-${locationName.replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSession = (weekNum: number, session: { date: string; day: string; startTime: string; endTime: string }) => {
    const icsContent = generateSingleSessionICS(session, weekNum, courseName, locationName);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IFT-Week${weekNum}-${session.day}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Determine current week for highlighting
  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-charcoal-950 to-black print:bg-white">
      {/* Header */}
      <div className="pt-8 pb-4 px-4 print:pt-2 print:pb-2">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Image src="/logo-global.png" alt="Image Fitness Training" width={40} height={40} className="rounded" />
          <span className="text-white/60 text-sm print:text-black">Image Fitness Training Global</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Course info */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 print:text-black">
            Course Timetable
          </h1>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 print:text-gray-600">
              <MapPin className="w-4 h-4 text-gold print:text-gray-500" />
              <span className="text-sm">{locationName} &mdash; {locationAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 print:text-gray-600">
              <Clock className="w-4 h-4 text-gold print:text-gray-500" />
              <span className="text-sm">{timetableName} &mdash; {timetableSchedule}</span>
            </div>
            <p className="text-gold text-sm font-semibold print:text-gray-800">Starting {startDate}</p>
          </div>
        </div>

        {/* Action buttons - hidden in print */}
        <div className="flex items-center gap-3 mb-6 print:hidden">
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold text-black font-semibold rounded-lg text-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            Add All to Calendar
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>

        {/* Timetable grid */}
        <div className="space-y-3">
          {weeks.map((week) => {
            const isCurrentWeek = week.sessions.some(s => s.date === today);
            return (
              <div
                key={week.week}
                className={`rounded-xl border p-4 ${
                  isCurrentWeek
                    ? 'bg-gold/5 border-gold/30 print:border-gray-400'
                    : 'bg-zinc-900/30 border-zinc-800 print:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gold font-bold text-sm print:text-gray-800">Week {week.week}</span>
                    {isCurrentWeek && (
                      <span className="text-xs bg-gold text-black px-2 py-0.5 rounded-full font-semibold">This Week</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {week.sessions.map((session, i) => {
                    const isPast = session.date < today;
                    return (
                      <div key={i} className={`flex items-center justify-between ${isPast ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium text-sm w-28 print:text-black">{session.day}</span>
                          <span className="text-zinc-400 text-sm print:text-gray-600">{session.dateFormatted}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 text-xs print:text-gray-500">{session.startTime} - {session.endTime}</span>
                          <button
                            onClick={() => handleDownloadSession(week.week, session)}
                            className="text-zinc-600 hover:text-gold transition-colors print:hidden"
                            title="Add to calendar"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center print:border-gray-200">
          <p className="text-zinc-500 text-sm print:text-gray-500">
            Image Fitness Training Global &mdash; imageft.ie
          </p>
        </div>
      </div>
    </main>
  );
}
