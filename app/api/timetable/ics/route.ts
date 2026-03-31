import { NextRequest, NextResponse } from 'next/server';
import { generateTimetable } from '@/lib/timetable-generator';
import { generateICSFile } from '@/lib/ics-generator';
import { locations } from '@/lib/course-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('location') || '';
  const schedule = searchParams.get('schedule') || '';
  const startDate = searchParams.get('startDate') || '';

  if (!locationId || !schedule || !startDate) {
    return NextResponse.json({ error: 'Missing parameters: location, schedule, startDate' }, { status: 400 });
  }

  const location = locations.find(l => l.id === locationId);
  const locationName = location?.name || locationId;

  const weeks = generateTimetable(startDate, schedule);
  if (weeks.length === 0) {
    return NextResponse.json({ error: 'Invalid schedule type' }, { status: 400 });
  }

  const icsContent = generateICSFile(weeks, 'PT Course', locationName);

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="IFT-Timetable-${locationId}-${schedule}.ics"`,
    },
  });
}
