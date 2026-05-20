'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Package, CalendarDays, ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles } from 'lucide-react'
import LocationStep from './location-step'
import ScheduleStep from './schedule-step'
import PackageStep from './package-step'
import DateStep from './date-step'

export interface WizardData {
  locations: LocationData[]
  schedules: ScheduleData[]
  packages: PackageData[]
  startDates: StartDateData[]
}

export interface LocationData {
  id: string
  name: string
  slug: string
  region: string
}

export interface ScheduleData {
  id: string
  name: string
  slug: string
  description: string
  duration: string
  icon: string
  times: string
  locationId: string
}

export interface PackageData {
  id: string
  name: string
  slug: string
  price: number
  fundedPrice?: number | null
  features: string[]
  popular: boolean
}

export interface StartDateData {
  id: string
  date: string
  spotsLeft: number
  scheduleId: string
}

const steps = [
  { id: 1, label: 'Location', icon: MapPin },
  { id: 2, label: 'Schedule', icon: Calendar },
  { id: 3, label: 'Package', icon: Package },
  { id: 4, label: 'Start Date', icon: CalendarDays },
]

export default function CourseFinderWizard({ data }: { data: WizardData }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null)

  const locations = data?.locations ?? []
  const schedules = data?.schedules ?? []
  const packages = data?.packages ?? []
  const startDates = data?.startDates ?? []

  // Filter schedules by selected location
  const filteredSchedules = selectedLocation
    ? schedules?.filter?.((s) => s?.locationId === selectedLocation) ?? []
    : []

  // Filter start dates by selected schedule
  const filteredStartDates = selectedSchedule
    ? startDates?.filter?.((d) => d?.scheduleId === selectedSchedule) ?? []
    : []

  // Get selected items
  const selectedLocationData = locations?.find?.((l) => l?.id === selectedLocation)
  const selectedScheduleData = schedules?.find?.((s) => s?.id === selectedSchedule)
  const selectedPackageData = packages?.find?.((p) => p?.id === selectedPackage)
  const selectedStartDateData = startDates?.find?.((d) => d?.id === selectedStartDate)

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedLocation
      case 2: return !!selectedSchedule
      case 3: return !!selectedPackage
      case 4: return !!selectedStartDate
      default: return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleLocationSelect = (id: string) => {
    setSelectedLocation(id)
    setSelectedSchedule(null)
    setSelectedStartDate(null)
  }

  const handleScheduleSelect = (id: string) => {
    setSelectedSchedule(id)
    setSelectedStartDate(null)
  }

  const getWhatsAppUrl = () => {
    const pkg = selectedPackageData?.name ?? 'course'
    const loc = selectedLocationData?.name ?? 'location'
    const date = selectedStartDateData ? new Date(selectedStartDateData?.date ?? Date.now())?.toLocaleDateString?.('en-IE', { month: 'long', day: 'numeric' }) : 'TBD'
    const message = `Hi! I'm interested in the ${pkg} starting ${date} at ${loc}.`
    return `https://wa.me/353866003667?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps?.map?.((step, index) => {
          const Icon = step?.icon ?? MapPin
          const isActive = currentStep === step?.id
          const isCompleted = currentStep > (step?.id ?? 0)
          
          return (
            <div key={step?.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gold text-black'
                      : isActive
                      ? 'bg-gold/20 border-2 border-gold text-gold'
                      : 'bg-charcoal-800 text-white/40'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs sm:text-sm font-medium ${
                    isActive ? 'text-gold' : isCompleted ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step?.label}
                </span>
              </div>
              {index < (steps?.length ?? 0) - 1 && (
                <div
                  className={`hidden sm:block w-16 md:w-24 h-0.5 mx-2 ${
                    isCompleted ? 'bg-gold' : 'bg-charcoal-700'
                  }`}
                />
              )}
            </div>
          )
        }) ?? null}
      </div>

      {/* Selection Summary */}
      {currentStep > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedLocationData && (
            <span className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs sm:text-sm text-gold">
              📍 {selectedLocationData?.name}
            </span>
          )}
          {selectedScheduleData && currentStep > 2 && (
            <span className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs sm:text-sm text-gold">
              📅 {selectedScheduleData?.name}
            </span>
          )}
          {selectedPackageData && currentStep > 3 && (
            <span className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs sm:text-sm text-gold">
              📦 {selectedPackageData?.name}
            </span>
          )}
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px] sm:min-h-[400px]"
        >
          {currentStep === 1 && (
            <LocationStep
              locations={locations}
              selected={selectedLocation}
              onSelect={handleLocationSelect}
            />
          )}
          {currentStep === 2 && (
            <ScheduleStep
              schedules={filteredSchedules}
              selected={selectedSchedule}
              onSelect={handleScheduleSelect}
            />
          )}
          {currentStep === 3 && (
            <PackageStep
              packages={packages}
              selected={selectedPackage}
              onSelect={setSelectedPackage}
            />
          )}
          {currentStep === 4 && (
            <DateStep
              startDates={filteredStartDates}
              selected={selectedStartDate}
              onSelect={setSelectedStartDate}
              selectedPackage={selectedPackageData}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-charcoal-800">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all tap-target ${
            currentStep === 1
              ? 'text-white/30 cursor-not-allowed'
              : 'text-white hover:bg-charcoal-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all tap-target ${
              canProceed()
                ? 'bg-gold text-black hover:bg-gold-400'
                : 'bg-charcoal-700 text-white/40 cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all tap-target ${
                canProceed()
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-charcoal-700 text-white/40 cursor-not-allowed pointer-events-none'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Chat on WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
