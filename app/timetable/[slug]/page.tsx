import { Metadata } from 'next';
import { TimetablePageView } from '@/components/timetable/timetable-view';
import { locations, timetables, courseStartDates } from '@/lib/course-data';
import { generateTimetable } from '@/lib/timetable-generator';

export const metadata: Metadata = {
  title: 'Course Timetable | Image Fitness Training',
  description: 'View your course timetable and add sessions to your calendar.',
};

interface PageProps {
  params: { slug: string };
}

export default function TimetablePage({ params }: PageProps) {
  // Parse slug: e.g. "swords-8-week-intensive"
  const { slug } = params;

  // Find matching location and timetable from the slug
  let matchedLocation = locations.find(l => slug.startsWith(l.id));
  let timetableKey = '';

  if (matchedLocation) {
    timetableKey = slug.replace(`${matchedLocation.id}-`, '');
  }

  const matchedTimetable = timetables.find(t => t.id === timetableKey);

  // Find start date
  const startDateEntry = courseStartDates.find(
    sd => matchedLocation && sd.locations.includes(matchedLocation.id) && sd.timetable === timetableKey
  );

  if (!matchedLocation || !matchedTimetable || !startDateEntry) {
    return (
      <main className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Timetable Not Found</h1>
          <p className="text-zinc-400">This timetable link may be incorrect.</p>
          <a href="https://www.imageft.ie" className="text-gold hover:underline mt-4 inline-block">
            Return to Image Fitness Training
          </a>
        </div>
      </main>
    );
  }

  const weeks = generateTimetable(startDateEntry.date, timetableKey);

  return (
    <TimetablePageView
      weeks={weeks}
      locationName={matchedLocation.name}
      locationAddress={matchedLocation.address}
      timetableName={matchedTimetable.name}
      timetableSchedule={matchedTimetable.schedule}
      startDate={startDateEntry.label}
      courseName="PT Course"
    />
  );
}
