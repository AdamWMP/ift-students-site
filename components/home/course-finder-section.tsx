import prisma from '@/lib/db'
import CourseFinderWizard from '@/components/course-finder/wizard'
import { Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getWizardData() {
  try {
    const [locations, schedules, packages, startDates] = await Promise.all([
      prisma.location.findMany({ orderBy: { name: 'asc' } }),
      prisma.schedule.findMany({ orderBy: { name: 'asc' } }),
      prisma.package.findMany({ orderBy: { price: 'asc' } }),
      prisma.startDate.findMany({ 
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' } 
      }),
    ])

    return {
      locations: locations ?? [],
      schedules: schedules ?? [],
      packages: packages ?? [],
      startDates: startDates?.map?.((d: { id: string; date: Date; spotsLeft: number; scheduleId: string }) => ({ ...d, date: d?.date?.toISOString?.() ?? '' })) ?? [],
    }
  } catch (error) {
    console.error('Failed to fetch wizard data:', error)
    return {
      locations: [],
      schedules: [],
      packages: [],
      startDates: [],
    }
  }
}

export default async function CourseFinderSection() {
  const data = await getWizardData()

  return (
    <section id="course-finder" className="py-16 sm:py-24 bg-charcoal-950">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">Course Finder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your <span className="text-gold">Perfect</span> Course
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Answer a few questions and we&apos;ll match you with the ideal course, location, and schedule.
          </p>
        </div>

        {/* Wizard */}
        <div className="max-w-4xl mx-auto bg-charcoal-900 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
          <CourseFinderWizard data={data as any} />
        </div>
      </div>
    </section>
  )
}
