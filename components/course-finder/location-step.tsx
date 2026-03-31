'use client'

import { motion } from 'framer-motion'
import { MapPin, Globe } from 'lucide-react'
import type { LocationData } from './wizard'

interface LocationStepProps {
  locations: LocationData[]
  selected: string | null
  onSelect: (id: string) => void
}

const locationIcons: Record<string, string> = {
  'swords': '🏰',
  'tallaght': '🏙️',
  'cork': '🌊',
  'galway': '🎭',
  'limerick': '🏟️',
  'wexford': '⛵',
  'belfast': '🏛️',
  'online': '🌐',
}

export default function LocationStep({ locations, selected, onSelect }: LocationStepProps) {
  const safeLocations = locations ?? []

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Where would you like to train?</h3>
      <p className="text-white/60 mb-6">Choose your preferred location</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {safeLocations?.map?.((location, index) => {
          const isSelected = selected === location?.id
          const slug = location?.slug ?? ''
          const iconEmoji = locationIcons[slug] ?? '📍'
          const isOnline = slug === 'online'

          return (
            <motion.button
              key={location?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect?.(location?.id ?? '')}
              className={`relative p-4 sm:p-6 rounded-xl text-center transition-all duration-300 tap-target ${
                isSelected
                  ? 'bg-gold text-black shadow-lg shadow-gold/30'
                  : 'bg-charcoal-800 text-white hover:bg-charcoal-700 hover:shadow-lg'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2">{iconEmoji}</div>
              <h4 className="font-semibold text-sm sm:text-base">
                {location?.name ?? 'Unknown'}
              </h4>
              {location?.region && location?.region !== location?.name && (
                <p className={`text-xs mt-1 ${isSelected ? 'text-black/70' : 'text-white/50'}`}>
                  {location?.region}
                </p>
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          )
        }) ?? null}
      </div>

      {safeLocations?.length === 0 && (
        <div className="text-center py-12 text-white/50">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No locations available at the moment</p>
        </div>
      )}
    </div>
  )
}
