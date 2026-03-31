'use client'

import { motion } from 'framer-motion'
import { Clock, Calendar } from 'lucide-react'
import type { ScheduleData } from './wizard'

interface ScheduleStepProps {
  schedules: ScheduleData[]
  selected: string | null
  onSelect: (id: string) => void
}

const scheduleIcons: Record<string, string> = {
  'evening-weekend': '🌙',
  'full-time': '☀️',
  'saturday-only': '📅',
  'part-time-16': '⏰',
}

export default function ScheduleStep({ schedules, selected, onSelect }: ScheduleStepProps) {
  const safeSchedules = schedules ?? []

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">When can you attend?</h3>
      <p className="text-white/60 mb-6">Choose a schedule that fits your lifestyle</p>

      <div className="space-y-3 sm:space-y-4">
        {safeSchedules?.map?.((schedule, index) => {
          const isSelected = selected === schedule?.id
          const slug = schedule?.slug ?? ''
          const iconEmoji = scheduleIcons[slug] ?? schedule?.icon ?? '📅'

          return (
            <motion.button
              key={schedule?.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect?.(schedule?.id ?? '')}
              className={`w-full p-4 sm:p-6 rounded-xl text-left transition-all duration-300 tap-target ${
                isSelected
                  ? 'bg-gold text-black shadow-lg shadow-gold/30'
                  : 'bg-charcoal-800 text-white hover:bg-charcoal-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{iconEmoji}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base sm:text-lg">
                    {schedule?.name ?? 'Schedule'}
                  </h4>
                  <p className={`text-sm mt-1 ${isSelected ? 'text-black/70' : 'text-white/60'}`}>
                    {schedule?.times ?? schedule?.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`flex items-center gap-1 text-xs ${isSelected ? 'text-black/60' : 'text-white/50'}`}>
                      <Clock className="w-3 h-3" />
                      {schedule?.duration ?? '8 weeks'}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        }) ?? null}
      </div>

      {safeSchedules?.length === 0 && (
        <div className="text-center py-12 text-white/50">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No schedules available for this location</p>
          <p className="text-sm mt-2">Try selecting a different location</p>
        </div>
      )}
    </div>
  )
}
