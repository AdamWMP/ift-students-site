'use client'

import { motion } from 'framer-motion'
import { CalendarDays, Users, AlertCircle } from 'lucide-react'
import type { StartDateData, PackageData } from './wizard'

interface DateStepProps {
  startDates: StartDateData[]
  selected: string | null
  onSelect: (id: string) => void
  selectedPackage: PackageData | null | undefined
}

export default function DateStep({ startDates, selected, onSelect, selectedPackage }: DateStepProps) {
  const safeDates = startDates ?? []
  const pkg = selectedPackage

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date?.toLocaleDateString?.('en-IE', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) ?? 'Date TBD'
    } catch {
      return 'Date TBD'
    }
  }

  const getMonthsAway = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const months = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
      if (months <= 0) return 'Starting soon'
      if (months === 1) return 'Starts next month'
      return `Starts in ${months} months`
    } catch {
      return ''
    }
  }

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Pick your start date</h3>
      <p className="text-white/60 mb-6">Secure your spot - limited places available</p>

      {/* Selected Package Summary */}
      {pkg && (
        <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gold font-medium">{pkg?.name ?? 'Selected Package'}</p>
              <p className="text-white/60 text-sm">Your investment</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gold">€{(pkg?.fundedPrice ?? pkg?.price ?? 0)?.toLocaleString?.()}</p>
              <p className="text-white/50 text-xs">or payment plan available</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {safeDates?.map?.((startDate, index) => {
          const isSelected = selected === startDate?.id
          const spotsLeft = startDate?.spotsLeft ?? 0
          const isLowSpots = spotsLeft <= 4

          return (
            <motion.button
              key={startDate?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect?.(startDate?.id ?? '')}
              className={`w-full p-4 sm:p-5 rounded-xl text-left transition-all duration-300 tap-target ${
                isSelected
                  ? 'bg-gold text-black shadow-lg shadow-gold/30'
                  : 'bg-charcoal-800 text-white hover:bg-charcoal-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-black/20' : 'bg-gold/10'
                  }`}>
                    <CalendarDays className={`w-6 h-6 ${isSelected ? 'text-black' : 'text-gold'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-base sm:text-lg">
                      {formatDate(startDate?.date ?? '')}
                    </p>
                    <p className={`text-sm ${isSelected ? 'text-black/70' : 'text-white/50'}`}>
                      {getMonthsAway(startDate?.date ?? '')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 text-sm ${
                    isLowSpots
                      ? isSelected ? 'text-red-900' : 'text-red-400'
                      : isSelected ? 'text-black/70' : 'text-white/50'
                  }`}>
                    {isLowSpots && <AlertCircle className="w-4 h-4" />}
                    <Users className="w-4 h-4" />
                    <span>{spotsLeft} spots left</span>
                  </div>
                </div>
              </div>
            </motion.button>
          )
        }) ?? null}
      </div>

      {safeDates?.length === 0 && (
        <div className="text-center py-12 text-white/50">
          <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No start dates available for this selection</p>
          <p className="text-sm mt-2">Try a different schedule</p>
        </div>
      )}
    </div>
  )
}
