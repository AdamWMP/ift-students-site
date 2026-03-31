import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [locations, schedules, packages, startDates] = await Promise.all([
      prisma.location.findMany({ orderBy: { name: 'asc' } }),
      prisma.schedule.findMany({ orderBy: { name: 'asc' } }),
      prisma.package.findMany({ orderBy: { price: 'asc' } }),
      prisma.startDate.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
      }),
    ])

    return NextResponse.json({
      locations: locations ?? [],
      schedules: schedules ?? [],
      packages: packages ?? [],
      startDates: startDates?.map?.((d: { id: string; date: Date; spotsLeft: number; scheduleId: string }) => ({
        ...(d ?? {}),
        date: d?.date?.toISOString?.() ?? '',
      })) ?? [],
    })
  } catch (error) {
    console.error('Wizard data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
