'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, CreditCard, ArrowRight, ArrowLeft, Check, Clock, Users, MessageCircle, CalendarDays, Sparkles, AlertTriangle, Wallet, BadgePercent } from 'lucide-react'

// Timetable data based on imageft.ie
const locations = [
  { id: 'dublin', name: 'Dublin', venues: ['Swords', 'Tallaght'], region: 'Dublin' },
  { id: 'cork', name: 'Cork', venues: ['Cork City'], region: 'Munster' },
  { id: 'galway', name: 'Galway', venues: ['Galway City'], region: 'Connacht' },
  { id: 'limerick', name: 'Limerick', venues: ['Limerick City'], region: 'Munster' },
  { id: 'wexford', name: 'Wexford', venues: ['Wexford Town'], region: 'Leinster' },
  { id: 'belfast', name: 'Belfast', venues: ['Belfast City'], region: 'Ulster' },
]

const scheduleTypes = [
  {
    id: 'part-time-evening',
    name: 'Part-Time Evenings',
    duration: '8 Weeks',
    times: 'Mon & Wed 7-10pm + Sat 10am-4:30pm',
    icon: '🌙',
    description: 'Perfect for those working full-time',
    locations: ['dublin'],
  },
  {
    id: 'full-time',
    name: 'Full-Time Intensive',
    duration: '8 Weeks',
    times: 'Thurs & Fri 10am-4:30pm',
    icon: '⚡',
    description: 'Fast-track your qualification',
    locations: ['dublin', 'cork', 'galway', 'limerick', 'wexford'],
  },
  {
    id: 'saturdays',
    name: 'Saturday Course',
    duration: '16 Weeks',
    times: 'Saturdays 10am-4:30pm',
    icon: '📅',
    description: 'Ideal for weekend learners',
    locations: ['cork', 'galway', 'limerick', 'wexford', 'belfast'],
  },
]

const startDates = [
  { id: '1', date: '2026-03-02', scheduleId: 'part-time-evening', locationId: 'dublin', spotsLeft: 3, status: 'almost-sold-out' },
  { id: '2', date: '2026-04-27', scheduleId: 'part-time-evening', locationId: 'dublin', spotsLeft: 12, status: 'available' },
  { id: '3', date: '2026-02-20', scheduleId: 'full-time', locationId: 'cork', spotsLeft: 2, status: 'last-chance' },
  { id: '4', date: '2026-02-20', scheduleId: 'full-time', locationId: 'galway', spotsLeft: 2, status: 'last-chance' },
  { id: '5', date: '2026-04-25', scheduleId: 'saturdays', locationId: 'cork', spotsLeft: 8, status: 'available' },
  { id: '6', date: '2026-04-25', scheduleId: 'saturdays', locationId: 'galway', spotsLeft: 10, status: 'available' },
  { id: '7', date: '2026-04-25', scheduleId: 'saturdays', locationId: 'limerick', spotsLeft: 6, status: 'available' },
  { id: '8', date: '2026-04-25', scheduleId: 'saturdays', locationId: 'wexford', spotsLeft: 9, status: 'available' },
  { id: '9', date: '2026-07-02', scheduleId: 'full-time', locationId: 'dublin', spotsLeft: 15, status: 'available' },
  { id: '10', date: '2026-07-02', scheduleId: 'full-time', locationId: 'cork', spotsLeft: 14, status: 'available' },
  { id: '11', date: '2026-07-02', scheduleId: 'full-time', locationId: 'galway', spotsLeft: 12, status: 'available' },
  { id: '12', date: '2026-07-02', scheduleId: 'full-time', locationId: 'limerick', spotsLeft: 13, status: 'available' },
  { id: '13', date: '2026-07-02', scheduleId: 'full-time', locationId: 'wexford', spotsLeft: 11, status: 'available' },
  { id: '14', date: '2026-05-10', scheduleId: 'saturdays', locationId: 'belfast', spotsLeft: 15, status: 'available' },
]

import { getActiveOffer } from '@/lib/course-data'

const basePackages = [
  {
    id: 'pro-coach',
    name: 'Pro Coach',
    originalPrice: 4000,
    price: 2800,
    deposit: 500,
    monthlyFrom: 292,
    features: [
      'Fitness Instructor (EQF L3)',
      'Group Instruction (EQF L3)',
      'Personal Trainer (EQF L4)',
      'Diploma in Nutrition (NutriCert 1.0)',
      'FREE Workshops & Events',
    ],
    popular: false,
  },
  {
    id: 'complete-coach',
    name: 'Complete Coach',
    originalPrice: 4500,
    price: 3500,
    deposit: 500,
    monthlyFrom: 375,
    features: [
      'Everything in Pro Coach',
      'Fitness Business Accelerator (90-day mentorship)',
      'Get Clients, Retain Clients & Make Money',
      'FREE Hyrox Sim Workshop',
      'FREE Career Pathway Accelerator',
    ],
    popular: true,
  },
]

// Apply any active special offers to packages
const packages = basePackages.map((pkg) => {
  const offer = getActiveOffer(pkg.id)
  if (offer) {
    return { ...pkg, price: offer.price, deposit: offer.minDeposit, monthlyFrom: Math.ceil((offer.price - offer.minDeposit) / 8) }
  }
  return pkg
})

const steps = [
  { id: 1, label: 'Location', icon: MapPin },
  { id: 2, label: 'Schedule', icon: Calendar },
  { id: 3, label: 'Start Date', icon: CalendarDays },
  { id: 4, label: 'Package', icon: CreditCard },
  { id: 5, label: 'Payment', icon: Wallet },
]

const paymentOptions = [
  {
    id: 'deposit',
    name: 'Deposit + Payment Plan',
    description: 'Pay €500 deposit now, spread the rest over monthly payments',
    icon: BadgePercent,
    highlight: 'Most Flexible',
  },
  {
    id: 'full',
    name: 'Pay in Full',
    description: 'Complete payment today and secure your spot instantly',
    icon: Wallet,
    highlight: 'Best Value',
  },
]

export default function PTTimetableWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter schedules available for selected location
  const availableSchedules = selectedLocation
    ? scheduleTypes.filter(s => s.locations.includes(selectedLocation))
    : []

  // Filter dates for selected location and schedule
  const availableDates = selectedLocation && selectedSchedule
    ? startDates.filter(d => d.locationId === selectedLocation && d.scheduleId === selectedSchedule)
    : []

  // Get selected data
  const locationData = locations.find(l => l.id === selectedLocation)
  const scheduleData = scheduleTypes.find(s => s.id === selectedSchedule)
  const dateData = startDates.find(d => d.id === selectedDate)
  const packageData = packages.find(p => p.id === selectedPackage)

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedLocation
      case 2: return !!selectedSchedule
      case 3: return !!selectedDate
      case 4: return !!selectedPackage
      case 5: return !!selectedPayment
      default: return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
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
    setSelectedDate(null)
  }

  const handleScheduleSelect = (id: string) => {
    setSelectedSchedule(id)
    setSelectedDate(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'almost-sold-out':
        return <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Almost Sold Out</span>
      case 'last-chance':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Last Chance</span>
      default:
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">Available</span>
    }
  }

  const getWhatsAppUrl = () => {
    const pkg = packageData?.name ?? 'course'
    const loc = locationData?.name ?? ''
    const schedule = scheduleData?.name ?? ''
    const date = dateData ? formatDate(dateData.date) : ''
    const message = `Hi! I'm interested in the ${pkg} (${schedule}) starting ${date} in ${loc}. Can you tell me more?`
    return `https://wa.me/353851234567?text=${encodeURIComponent(message)}`
  }

  if (!isClient) {
    return <div className="min-h-[400px] flex items-center justify-center"><div className="animate-pulse text-white/40">Loading...</div></div>
  }

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gold text-charcoal-950'
                      : isActive
                      ? 'bg-gold/20 border-2 border-gold text-gold'
                      : 'bg-charcoal-800 text-white/40'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </motion.div>
                <span className={`text-xs mt-2 hidden sm:block ${
                  isActive || isCompleted ? 'text-gold' : 'text-white/40'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-gold' : 'bg-charcoal-700'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Where are you located?</h3>
            <p className="text-white/60 mb-6">Select your nearest training location</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedLocation === location.id
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-charcoal-700 hover:border-charcoal-600 bg-charcoal-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className={`w-4 h-4 ${selectedLocation === location.id ? 'text-gold' : 'text-white/60'}`} />
                    <span className={`font-semibold ${selectedLocation === location.id ? 'text-gold' : 'text-white'}`}>
                      {location.name}
                    </span>
                  </div>
                  <span className="text-xs text-white/50">{location.venues.join(', ')}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">When suits you best?</h3>
            <p className="text-white/60 mb-6">Choose a schedule that fits your lifestyle</p>
            
            <div className="space-y-3">
              {availableSchedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => handleScheduleSelect(schedule.id)}
                  className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedSchedule === schedule.id
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-charcoal-700 hover:border-charcoal-600 bg-charcoal-800/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{schedule.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-lg ${selectedSchedule === schedule.id ? 'text-gold' : 'text-white'}`}>
                          {schedule.name}
                        </span>
                        <span className="px-2 py-1 bg-charcoal-700 rounded-full text-xs text-white/70">
                          {schedule.duration}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-2">{schedule.description}</p>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <Clock className="w-3 h-3" />
                        <span>{schedule.times}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">When do you want to start?</h3>
            <p className="text-white/60 mb-6">Select your preferred start date</p>
            
            {availableDates.length > 0 ? (
              <div className="space-y-3">
                {availableDates.map((date) => (
                  <button
                    key={date.id}
                    onClick={() => setSelectedDate(date.id)}
                    className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedDate === date.id
                        ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                        : 'border-charcoal-700 hover:border-charcoal-600 bg-charcoal-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${
                          selectedDate === date.id ? 'bg-gold text-charcoal-950' : 'bg-charcoal-700 text-white'
                        }`}>
                          <span className="text-xs font-medium">
                            {new Date(date.date).toLocaleDateString('en-IE', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold leading-none">
                            {new Date(date.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <p className={`font-semibold ${selectedDate === date.id ? 'text-gold' : 'text-white'}`}>
                            {formatDate(date.date)}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Users className="w-3 h-3" />
                            <span>{date.spotsLeft} spots remaining</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(date.status)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No dates available for this combination.</p>
                <p className="text-sm">Try a different schedule type.</p>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Choose your package</h3>
            <p className="text-white/60 mb-6">Select the qualification level that suits your goals</p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedPackage === pkg.id
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-charcoal-700 hover:border-charcoal-600 bg-charcoal-800/50'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-charcoal-950 text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <h4 className={`font-bold text-lg mb-3 ${selectedPackage === pkg.id ? 'text-gold' : 'text-white'}`}>
                    {pkg.name}
                  </h4>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-white/40 line-through text-sm">€{pkg.originalPrice.toLocaleString()}</span>
                      <span className="text-3xl font-bold text-gold">€{pkg.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-white/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t border-charcoal-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Deposit</span>
                      <span className="text-white font-semibold">€{pkg.deposit}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-white/50">From</span>
                      <span className="text-gold font-semibold">€{pkg.monthlyFrom}/month</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">How would you like to pay?</h3>
            <p className="text-white/60 mb-6">Choose the payment option that works best for you</p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {paymentOptions.map((option) => {
                const Icon = option.icon
                const isDeposit = option.id === 'deposit'
                const depositAmount = packageData?.deposit ?? 500
                const fullAmount = packageData?.price ?? 0
                const monthlyAmount = packageData?.monthlyFrom ?? 0
                
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPayment(option.id)}
                    className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedPayment === option.id
                        ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                        : 'border-charcoal-700 hover:border-charcoal-600 bg-charcoal-800/50'
                    }`}
                  >
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-charcoal-700 text-gold text-xs font-bold rounded-full">
                      {option.highlight}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4 mt-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedPayment === option.id ? 'bg-gold/20' : 'bg-charcoal-700'
                      }`}>
                        <Icon className={`w-6 h-6 ${selectedPayment === option.id ? 'text-gold' : 'text-white/60'}`} />
                      </div>
                      <h4 className={`font-bold text-lg ${selectedPayment === option.id ? 'text-gold' : 'text-white'}`}>
                        {option.name}
                      </h4>
                    </div>
                    
                    <p className="text-white/60 text-sm mb-4">{option.description}</p>
                    
                    <div className="pt-3 border-t border-charcoal-700">
                      {isDeposit ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Pay today</span>
                            <span className="text-gold font-bold text-xl">€{depositAmount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Then from</span>
                            <span className="text-white font-semibold">€{monthlyAmount}/month</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Total amount</span>
                          <span className="text-gold font-bold text-2xl">€{fullAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* Payment summary */}
            {selectedPayment && packageData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gold/10 border border-gold/30 rounded-xl"
              >
                <div className="flex items-center gap-2 text-gold font-semibold mb-2">
                  <Check className="w-5 h-5" />
                  <span>Your Payment Summary</span>
                </div>
                <div className="text-white/70 text-sm">
                  {selectedPayment === 'deposit' ? (
                    <>
                      <p><strong className="text-white">{packageData.name}</strong> — Pay €{packageData.deposit} deposit now</p>
                      <p className="mt-1">Balance of €{(packageData.price - packageData.deposit).toLocaleString()} in flexible monthly payments from €{packageData.monthlyFrom}/month</p>
                      <p className="mt-2 text-gold font-medium">We will contact you to arrange a flexible payment plan.</p>
                    </>
                  ) : (
                    <p><strong className="text-white">{packageData.name}</strong> — Pay €{packageData.price.toLocaleString()} in full today</p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-charcoal-700">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentStep === 1
              ? 'opacity-0 pointer-events-none'
              : 'text-white/70 hover:text-white hover:bg-charcoal-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {currentStep < 5 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              canProceed()
                ? 'bg-gold text-charcoal-950 hover:bg-gold-400'
                : 'bg-charcoal-800 text-white/40 cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              disabled={!selectedPayment}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedPayment
                  ? 'bg-gold text-charcoal-950 cursor-default'
                  : 'bg-charcoal-800 text-white/40 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{selectedPayment === 'deposit' ? `Pay €${packageData?.deposit ?? 500} Deposit` : 'Pay in Full'}</span>
            </button>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* Summary Bar */}
      {(selectedLocation || selectedSchedule || selectedDate || selectedPackage || selectedPayment) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700"
        >
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Your Selection</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {locationData && (
              <span className="px-3 py-1 bg-charcoal-700 rounded-full text-sm text-white">
                📍 {locationData.name}
              </span>
            )}
            {scheduleData && (
              <span className="px-3 py-1 bg-charcoal-700 rounded-full text-sm text-white">
                {scheduleData.icon} {scheduleData.name}
              </span>
            )}
            {dateData && (
              <span className="px-3 py-1 bg-charcoal-700 rounded-full text-sm text-white">
                📅 {formatDate(dateData.date)}
              </span>
            )}
            {packageData && (
              <span className="px-3 py-1 bg-gold/20 border border-gold/30 rounded-full text-sm text-gold font-semibold">
                💰 {packageData.name} — €{packageData.price?.toLocaleString()}
              </span>
            )}
            {selectedPayment && packageData && (
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-400 font-semibold">
                💳 {selectedPayment === 'deposit' ? `€${packageData.deposit} deposit` : 'Full payment'}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
