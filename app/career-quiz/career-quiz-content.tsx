'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Sparkles, Dumbbell, Heart, Apple, Baby, Rocket, Check, Star, RotateCcw } from 'lucide-react'
import CalendlyModal from '@/components/calendly-modal'
import { track } from '@/lib/meta/events'

interface Question {
  id: number
  question: string
  options: { text: string; scores: Record<string, number> }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What excites you most about a fitness career?",
    options: [
      { text: "Helping people transform their bodies & build confidence", scores: { pt: 3, nutrition: 1 } },
      { text: "Teaching movement, posture, and mindful exercise", scores: { pilates: 3, prenatal: 1 } },
      { text: "Training athletes to be faster, stronger, more explosive", scores: { sc: 3 } },
      { text: "Creating complete wellness plans including diet & training", scores: { nutrition: 3, pt: 1 } },
    ],
  },
  {
    id: 2,
    question: "What's your current fitness background?",
    options: [
      { text: "I'm passionate about fitness but new to the industry", scores: { pt: 3, pilates: 2 } },
      { text: "I'm already a qualified PT looking to specialize", scores: { sc: 3, nutrition: 2, prenatal: 2 } },
      { text: "I practice yoga/Pilates and want to teach", scores: { pilates: 3 } },
      { text: "I have a sports or athletic background", scores: { sc: 3, pt: 2 } },
    ],
  },
  {
    id: 3,
    question: "What type of clients do you dream of working with?",
    options: [
      { text: "General population - everyday people wanting to get fit", scores: { pt: 3, nutrition: 1 } },
      { text: "Athletes and sports performers", scores: { sc: 3 } },
      { text: "People seeking mind-body connection and flexibility", scores: { pilates: 3 } },
      { text: "Pregnant women and new mothers", scores: { prenatal: 3, pilates: 1 } },
    ],
  },
  {
    id: 4,
    question: "What's your preferred work environment?",
    options: [
      { text: "A busy gym floor with weights and machines", scores: { pt: 3, sc: 2 } },
      { text: "A calm studio with mats and reformers", scores: { pilates: 3 } },
      { text: "A performance facility or sports club", scores: { sc: 3 } },
      { text: "Online coaching from anywhere", scores: { nutrition: 2, pt: 2, business: 2 } },
    ],
  },
  {
    id: 5,
    question: "How important is business training to you?",
    options: [
      { text: "Essential - I want to run my own successful business", scores: { business: 3, pt: 1 } },
      { text: "Helpful but I'd prefer to work for a gym first", scores: { pt: 2, pilates: 1 } },
      { text: "Not a priority - I want to focus on coaching skills", scores: { sc: 2, pilates: 2 } },
      { text: "I already have business skills, just need the qualification", scores: { pt: 1, sc: 1 } },
    ],
  },
  {
    id: 6,
    question: "What's your timeline for completing a course?",
    options: [
      { text: "As fast as possible - I want to start earning soon", scores: { pt: 2, pilates: 2 } },
      { text: "I can commit to weekends for a few months", scores: { pt: 3, pilates: 2, sc: 1 } },
      { text: "I prefer self-paced online learning", scores: { nutrition: 3, prenatal: 3 } },
      { text: "I'm flexible and want the most comprehensive option", scores: { pt: 2, business: 2 } },
    ],
  },
]

interface Result {
  key: string
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  link: string
  features: string[]
}

const results: Record<string, Result> = {
  pt: {
    key: 'pt',
    title: 'Personal Trainer',
    subtitle: 'EQF Level 4 Certification',
    description: "You're a natural motivator who wants to help everyday people achieve their fitness goals. The PT course is your gateway to a rewarding career.",
    icon: Dumbbell,
    color: 'gold',
    link: '/courses/personal-trainer',
    features: ['8-16 weeks to qualify', 'Includes Nutrition Diploma', 'Multiple locations available', 'Part-time or intensive options'],
  },
  pilates: {
    key: 'pilates',
    title: 'Pilates Instructor',
    subtitle: 'Mat & Reformer Options',
    description: "You're drawn to mindful movement and want to help clients improve posture, flexibility, and core strength through Pilates.",
    icon: Heart,
    color: 'pink-500',
    link: '/courses/pilates',
    features: ['5-11 weeks for Mat', 'Add Reformer for studio work', 'Pregnancy Pilates included', 'REPs Ireland accredited'],
  },
  sc: {
    key: 'sc',
    title: 'Strength & Conditioning',
    subtitle: 'Active IQ Level 4',
    description: "You want to train athletes and high performers. The S&C certification will take your coaching to elite level.",
    icon: Rocket,
    color: 'blue-500',
    link: '/courses/strength-conditioning',
    features: ['12-week advanced program', 'Olympic lifting mastery', 'Sports performance focus', 'Requires PT qualification'],
  },
  nutrition: {
    key: 'nutrition',
    title: 'NutriCert Global',
    subtitle: 'Nutrition Coaching Diploma',
    description: "You understand that nutrition is key to results. Add nutrition coaching to your skillset and deliver complete transformations.",
    icon: Apple,
    color: 'green-500',
    link: '/courses/nutricert',
    features: ['Self-paced online', 'Included in PT packages', 'Evidence-based protocols', 'Client meal planning'],
  },
  prenatal: {
    key: 'prenatal',
    title: 'Pre & Post Natal',
    subtitle: 'Specialist Certification',
    description: "You want to specialize in supporting mothers through pregnancy and postpartum. A growing niche with dedicated clientele.",
    icon: Baby,
    color: 'purple-500',
    link: '/courses/pre-post-natal',
    features: ['Fully online course', '16 CPD points', 'Dual accreditation', 'Start anytime'],
  },
  business: {
    key: 'business',
    title: 'Complete Coach + FBA',
    subtitle: 'Full Career Launch Package',
    description: "You want it all - the qualification AND the business training to hit the ground running. Smart choice.",
    icon: Sparkles,
    color: 'gold',
    link: '/courses/personal-trainer',
    features: ['PT + Nutrition + Business', '90-day mentorship', 'Get your first clients', 'Full career launch'],
  },
}

export default function CareerQuizContent() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [scores, setScores] = useState<Record<string, number>>({ pt: 0, pilates: 0, sc: 0, nutrition: 0, prenatal: 0, business: 0 })
  const [showResult, setShowResult] = useState(false)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  const handleAnswer = (optionIndex: number) => {
    const option = questions[currentQuestion].options[optionIndex]
    const newScores = { ...scores }
    Object.entries(option.scores).forEach(([key, value]) => {
      newScores[key] = (newScores[key] || 0) + value
    })
    setScores(newScores)
    setAnswers([...answers, optionIndex])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const topResult = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0]?.[0]
      track('CompleteRegistration', {
        customData: { content_name: 'Career Quiz', content_category: topResult || 'quiz' },
      })
      setShowResult(true)
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      const prevAnswer = answers[answers.length - 1]
      const prevOption = questions[currentQuestion - 1].options[prevAnswer]
      const newScores = { ...scores }
      Object.entries(prevOption.scores).forEach(([key, value]) => {
        newScores[key] = (newScores[key] || 0) - value
      })
      setScores(newScores)
      setAnswers(answers.slice(0, -1))
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const restart = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setScores({ pt: 0, pilates: 0, sc: 0, nutrition: 0, prenatal: 0, business: 0 })
    setShowResult(false)
  }

  const getResult = (): Result => {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const topKey = sorted[0][0]
    return results[topKey] || results.pt
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <>
      <section className="min-h-screen pt-24 pb-16 flex items-center">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 w-full">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-sm text-gold font-medium">2-Minute Career Quiz</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Find Your <span className="text-gold">Perfect Course</span>
                  </h1>
                  <p className="text-white/60">Answer {questions.length} quick questions to discover your ideal path</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-white/50 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <div className="h-2 bg-charcoal-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold to-gold-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="bg-charcoal-800/50 rounded-2xl p-8 border border-charcoal-700/50 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white mb-8 text-center">
                    {questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className="w-full text-left p-5 bg-charcoal-900/50 rounded-xl border border-charcoal-700/50 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-charcoal-700/50 flex items-center justify-center text-white/50 group-hover:bg-gold/20 group-hover:text-gold transition-colors font-semibold text-sm">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-white/80 group-hover:text-white transition-colors">
                            {option.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Back Button */}
                {currentQuestion > 0 && (
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {(() => {
                  const result = getResult()
                  const Icon = result.icon
                  return (
                    <>
                      {/* Celebration Header */}
                      <div className="text-center mb-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                          className="w-20 h-20 mx-auto mb-6 bg-gold/20 rounded-full flex items-center justify-center"
                        >
                          <Icon className="w-10 h-10 text-gold" />
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                          Your Perfect Match:
                        </h2>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gold mb-2">
                          {result.title}
                        </h1>
                        <p className="text-white/60">{result.subtitle}</p>
                      </div>

                      {/* Result Card */}
                      <div className="bg-gradient-to-br from-charcoal-800/80 to-charcoal-900/80 rounded-2xl p-8 border border-gold/30 mb-8">
                        <p className="text-white/70 text-lg leading-relaxed mb-6">
                          {result.description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                          {result.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-gold" />
                              </div>
                              <span className="text-white/80 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Link
                            href={result.link}
                            className="btn-gold flex items-center justify-center gap-2 flex-1 py-4"
                          >
                            View {result.title} Course
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setIsCalendlyOpen(true)}
                            className="btn-outline flex items-center justify-center gap-2 flex-1 py-4"
                          >
                            Schedule a Call
                          </button>
                        </div>
                      </div>

                      {/* Other Options */}
                      <div className="text-center">
                        <p className="text-white/50 mb-4">Not quite right? Explore other options:</p>
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                          {Object.values(results)
                            .filter((r) => r.key !== result.key)
                            .slice(0, 4)
                            .map((r) => (
                              <Link
                                key={r.key}
                                href={r.link}
                                className="px-4 py-2 bg-charcoal-800/50 border border-charcoal-700/50 rounded-full text-white/70 text-sm hover:border-gold/30 hover:text-gold transition-all"
                              >
                                {r.title}
                              </Link>
                            ))}
                        </div>
                        <button
                          onClick={restart}
                          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mx-auto"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Retake Quiz</span>
                        </button>
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
