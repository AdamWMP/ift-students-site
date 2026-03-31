'use client'

import { motion } from 'framer-motion'
import { Check, Star, Sparkles } from 'lucide-react'
import type { PackageData } from './wizard'

interface PackageStepProps {
  packages: PackageData[]
  selected: string | null
  onSelect: (id: string) => void
}

export default function PackageStep({ packages, selected, onSelect }: PackageStepProps) {
  const safePackages = packages ?? []

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Choose your package</h3>
      <p className="text-white/60 mb-6">All packages include internationally recognized certifications</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {safePackages?.map?.((pkg, index) => {
          const isSelected = selected === pkg?.id
          const isPopular = pkg?.popular ?? false
          const features = pkg?.features ?? []
          const price = pkg?.fundedPrice ?? pkg?.price ?? 0
          const originalPrice = pkg?.price ?? 0

          return (
            <motion.button
              key={pkg?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect?.(pkg?.id ?? '')}
              className={`relative p-4 sm:p-6 rounded-xl text-left transition-all duration-300 tap-target ${
                isSelected
                  ? 'bg-gold text-black shadow-lg shadow-gold/30 ring-2 ring-gold'
                  : isPopular
                  ? 'bg-charcoal-800 text-white ring-2 ring-gold/50 hover:ring-gold'
                  : 'bg-charcoal-800 text-white hover:bg-charcoal-700'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                    isSelected ? 'bg-black text-gold' : 'bg-gold text-black'
                  }`}>
                    <Star className="w-3 h-3" fill="currentColor" />
                    POPULAR
                  </span>
                </div>
              )}

              <div className="mb-4 pt-2">
                <h4 className="font-bold text-lg">{pkg?.name ?? 'Package'}</h4>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">€{price?.toLocaleString?.()}</span>
                  {(pkg?.fundedPrice ?? 0) < originalPrice && originalPrice > 0 && (
                    <span className={`text-sm line-through ${isSelected ? 'text-black/50' : 'text-white/40'}`}>
                      €{originalPrice?.toLocaleString?.()}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${isSelected ? 'text-black/70' : 'text-white/50'}`}>
                  with funding
                </p>
              </div>

              <ul className="space-y-2">
                {features?.slice?.(0, 5)?.map?.((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-black' : 'text-gold'}`} />
                    <span className={isSelected ? 'text-black/80' : 'text-white/70'}>{feature}</span>
                  </li>
                )) ?? null}
              </ul>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-gold" />
                </motion.div>
              )}
            </motion.button>
          )
        }) ?? null}
      </div>
    </div>
  )
}
