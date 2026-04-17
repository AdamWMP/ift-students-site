'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Sparkles, Check, RotateCcw, ChevronRight, Rocket, GraduationCap } from 'lucide-react'
import CalendlyModal from '@/components/calendly-modal'

type Pathway = 'career' | 'business'

interface Option {
  emoji: string
  text: string
  scores: Partial<Record<Pathway, number>>
}

interface Question {
  id: number
  question: string
  subtitle?: string
  options: Option[]
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Which best describes where you are today?',
    subtitle: 'Pick the one that feels most like you',
    options: [
      { emoji: '🌱', text: "I'm new to fitness coaching — I want to get qualified", scores: { career: 3 } },
      { emoji: '🏋️', text: "I love training and want to make it my job", scores: { career: 2, business: 1 } },
      { emoji: '📜', text: "I'm already a qualified PT or instructor", scores: { business: 3 } },
      { emoji: '💼', text: "I qualified a while ago but I'm not earning what I want", scores: { business: 3 } },
    ],
  },
  {
    id: 2,
    question: "What's your biggest goal over the next 12 months?",
    options: [
      { emoji: '🎓', text: 'Get certified and start working in the industry', scores: { career: 3 } },
      { emoji: '💪', text: 'Learn how to coach people properly', scores: { career: 3 } },
      { emoji: '💰', text: 'Sign my first 10+ paying clients', scores: { business: 3 } },
      { emoji: '🚀', text: 'Scale my coaching into a full-time business', scores: { business: 3 } },
    ],
  },
  {
    id: 3,
    question: 'How confident do you feel coaching a client through a full programme?',
    options: [
      { emoji: '😅', text: "Not confident — I've never coached before", scores: { career: 3 } },
      { emoji: '🤔', text: 'Somewhat — I know the basics but lack structure', scores: { career: 2, business: 1 } },
      { emoji: '😎', text: "I'm confident coaching, I just need more clients", scores: { business: 3 } },
      { emoji: '🔥', text: "I'm already coaching — I want to scale", scores: { business: 3 } },
    ],
  },
  {
    id: 4,
    question: "What's holding you back the most right now?",
    options: [
      { emoji: '📚', text: 'I need a recognised qualification', scores: { career: 3 } },
      { emoji: '🧭', text: "I don't know where to start in the industry", scores: { career: 3 } },
      { emoji: '📣', text: "I can't find consistent paying clients", scores: { business: 3 } },
      { emoji: '💸', text: "I'm qualified but not earning enough yet", scores: { business: 3 } },
    ],
  },
  {
    id: 5,
    question: 'How do you want to earn money in fitness?',
    options: [
      { emoji: '🏢', text: 'Work in a gym, studio, or sports team', scores: { career: 3 } },
      { emoji: '🤝', text: 'Be employed while building experience', scores: { career: 3 } },
      { emoji: '🧑‍💻', text: 'Run my own online coaching business', scores: { business: 3 } },
      { emoji: '👑', text: 'Build my personal brand and charge premium', scores: { business: 3 } },
    ],
  },
  {
    id: 6,
    question: 'Which of these sounds more like you?',
    options: [
      { emoji: '❤️', text: 'I love the idea of coaching people in person', scores: { career: 3 } },
      { emoji: '🧠', text: 'I want to master movement, nutrition, and programming', scores: { career: 3 } },
      { emoji: '📱', text: 'I love marketing, content, and building a brand', scores: { business: 3 } },
      { emoji: '📈', text: 'I think about systems, offers, and business growth', scores: { business: 3 } },
    ],
  },
  {
    id: 7,
    question: 'How much time can you dedicate each week?',
    options: [
      { emoji: '⏰', text: '5–8 hours (part-time / evenings)', scores: { career: 2, business: 1 } },
      { emoji: '📅', text: 'Weekends and some evenings', scores: { career: 3 } },
      { emoji: '💻', text: '8–12 hours — I can work from home', scores: { business: 3 } },
      { emoji: '🔁', text: "I'm already full-time in fitness", scores: { business: 3 } },
    ],
  },
  {
    id: 8,
    question: 'In 6 months, what would make this feel like a win?',
    options: [
      { emoji: '🏅', text: 'Being a qualified personal trainer or instructor', scores: { career: 3 } },
      { emoji: '🏋️‍♀️', text: 'Working in a gym helping real clients', scores: { career: 3 } },
      { emoji: '💵', text: 'Earning €3–5k/month from my own clients', scores: { business: 3 } },
      { emoji: '🌍', text: 'A full client roster and a brand I love', scores: { business: 3 } },
    ],
  },
]

interface Result {
  key: Pathway
  title: string
  badge: string
  headline: string
  description: string
  emoji: string
  link: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  ctaText: string
  runnerUp: {
    title: string
    link: string
  }
}

const results: Record<Pathway, Result> = {
  career: {
    key: 'career',
    title: 'The Career Path',
    badge: 'Your Match: Career',
    headline: 'Start Your Fitness Career',
    description:
      "You're ready to step into the fitness industry. The smart move right now is to get a recognised qualification so you can confidently coach clients, earn income in a gym or studio, and build the foundation of a long career in fitness.",
    emoji: '🎓',
    icon: GraduationCap,
    link: '/courses/personal-trainer',
    features: [
      'EQF Level 4 Personal Trainer qualification',
      'NutriCert Global Nutrition Diploma included',
      '8–16 weeks with flexible schedules',
      'Dublin, Cork & Limerick locations',
    ],
    ctaText: 'See the Career Course',
    runnerUp: {
      title: 'Already qualified? Check out the Business Accelerator',
      link: '/business-accelerator',
    },
  },
  business: {
    key: 'business',
    title: 'The Business Path',
    badge: 'Your Match: Business',
    headline: 'Launch Your Fitness Business',
    description:
      "You don't need another certificate — you need clients, systems and a business that actually pays you. The Fitness Business Accelerator is built for qualified trainers ready to sign paying clients, build a brand, and grow their income fast.",
    emoji: '🚀',
    icon: Rocket,
    link: '/business-accelerator',
    features: [
      '7-week Fitness Business Accelerator',
      'Live mentorship (Mon & Wed, 7pm)',
      'Niche, offer, marketing, sales systems',
      'Get your first paying clients fast',
    ],
    ctaText: 'See the Business Accelerator',
    runnerUp: {
      title: 'Not qualified yet? See the Personal Trainer course',
      link: '/courses/personal-trainer',
    },
  },
}

export default function CoursePathwayQuizContent() {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [scores, setScores] = useState<Record<Pathway, number>>({ career: 0, business: 0 })
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  const handleAnswer = (optionIndex: number) => {
    const option = questions[currentQuestion].options[optionIndex]
    const newScores = { ...scores }
    Object.entries(option.scores).forEach(([key, value]) => {
      newScores[key as Pathway] = (newScores[key as Pathway] || 0) + (value || 0)
    })
    setScores(newScores)
    setAnswers([...answers, optionIndex])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setStage('result')
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      const prevAnswer = answers[answers.length - 1]
      const prevOption = questions[currentQuestion - 1].options[prevAnswer]
      const newScores = { ...scores }
      Object.entries(prevOption.scores).forEach(([key, value]) => {
        newScores[key as Pathway] = (newScores[key as Pathway] || 0) - (value || 0)
      })
      setScores(newScores)
      setAnswers(answers.slice(0, -1))
      setCurrentQuestion(currentQuestion - 1)
    } else {
      setStage('intro')
    }
  }

  const restart = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setScores({ career: 0, business: 0 })
    setStage('intro')
  }

  const getResult = (): Result => {
    const winner: Pathway = scores.business > scores.career ? 'business' : 'career'
    return results[winner]
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <>
      <section className="min-h-screen pt-24 pb-16 flex items-center">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 w-full">
          <AnimatePresence mode="wait">
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm text-gold font-medium">60-Second Pathway Quiz</span>
                </div>

                <div className="flex justify-center gap-4 mb-8 text-6xl sm:text-7xl">
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                  >
                    🎓
                  </motion.span>
                  <motion.span
                    initial={{ scale: 0, rotate: 20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.25, type: 'spring' }}
                  >
                    🚀
                  </motion.span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                  Career or <span className="text-gold">Business?</span>
                </h1>
                <p className="text-white/70 text-lg mb-10 max-w-md mx-auto">
                  Answer 8 quick questions and we&apos;ll show you whether to start a new fitness career — or launch your own business.
                </p>

                <button
                  onClick={() => setStage('quiz')}
                  className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-lg"
                >
                  Start the Quiz
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-3 gap-4 mt-12 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gold">60s</div>
                    <div className="text-xs text-white/50">To complete</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gold">8</div>
                    <div className="text-xs text-white/50">Short questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gold">100%</div>
                    <div className="text-xs text-white/50">Free &amp; personal</div>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'quiz' && (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top bar: back + progress */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={goBack}
                    className="w-10 h-10 rounded-full bg-charcoal-800/80 border border-charcoal-700/50 flex items-center justify-center text-white/70 hover:text-white hover:border-gold/50 transition-all flex-shrink-0"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex-1 h-2 bg-charcoal-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold to-gold-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="text-sm text-white/50 font-medium flex-shrink-0 w-12 text-right">
                    {currentQuestion + 1}/{questions.length}
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
                  {questions[currentQuestion].question}
                </h2>
                {questions[currentQuestion].subtitle && (
                  <p className="text-white/50 text-center mb-8">
                    {questions[currentQuestion].subtitle}
                  </p>
                )}
                {!questions[currentQuestion].subtitle && <div className="mb-8" />}

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="w-full text-left p-4 bg-charcoal-800/60 rounded-2xl border border-charcoal-700/50 hover:border-gold/60 hover:bg-gold/5 transition-all duration-200 group flex items-center gap-4"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-charcoal-900/80 border border-charcoal-700/50 flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                        {option.emoji}
                      </div>
                      <span className="flex-1 text-white/90 group-hover:text-white transition-colors text-base sm:text-lg font-medium leading-snug">
                        {option.text}
                      </span>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {(() => {
                  const result = getResult()
                  const total = scores.career + scores.business
                  const winnerPct = total > 0 ? Math.round((scores[result.key] / total) * 100) : 50
                  const Icon = result.icon
                  return (
                    <>
                      <div className="text-center mb-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gold/30 to-gold/10 rounded-full flex items-center justify-center text-5xl"
                        >
                          {result.emoji}
                        </motion.div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-full mb-4">
                          <Icon className="w-4 h-4 text-gold" />
                          <span className="text-sm text-gold font-medium">{result.badge}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
                          {result.headline}
                        </h1>
                        <p className="text-white/60">
                          Based on your answers, this is the right next step for you.
                        </p>
                      </div>

                      {/* Score breakdown */}
                      <div className="bg-charcoal-800/50 rounded-2xl p-5 border border-charcoal-700/50 mb-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-white/80 font-medium flex items-center gap-2">
                                <span>🎓</span> Career Path
                              </span>
                              <span className="text-white/60">
                                {total > 0 ? Math.round((scores.career / total) * 100) : 0}%
                              </span>
                            </div>
                            <div className="h-2 bg-charcoal-900 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${result.key === 'career' ? 'bg-gradient-to-r from-gold to-gold-400' : 'bg-charcoal-600'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${total > 0 ? (scores.career / total) * 100 : 0}%` }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-white/80 font-medium flex items-center gap-2">
                                <span>🚀</span> Business Path
                              </span>
                              <span className="text-white/60">
                                {total > 0 ? Math.round((scores.business / total) * 100) : 0}%
                              </span>
                            </div>
                            <div className="h-2 bg-charcoal-900 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${result.key === 'business' ? 'bg-gradient-to-r from-gold to-gold-400' : 'bg-charcoal-600'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${total > 0 ? (scores.business / total) * 100 : 0}%` }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-white/40 mt-4 text-center">
                          {winnerPct}% match with {result.title}
                        </p>
                      </div>

                      {/* Result detail card */}
                      <div className="bg-gradient-to-br from-charcoal-800/80 to-charcoal-900/80 rounded-2xl p-6 sm:p-8 border border-gold/30 mb-6">
                        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6">
                          {result.description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3 mb-8">
                          {result.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-gold" />
                              </div>
                              <span className="text-white/80 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href={result.link}
                            className="btn-gold flex items-center justify-center gap-2 flex-1 py-4"
                          >
                            {result.ctaText}
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setIsCalendlyOpen(true)}
                            className="btn-outline flex items-center justify-center gap-2 flex-1 py-4"
                          >
                            Book a Free Call
                          </button>
                        </div>
                      </div>

                      {/* Runner-up + restart */}
                      <div className="text-center">
                        <Link
                          href={result.runnerUp.link}
                          className="inline-block px-5 py-2.5 bg-charcoal-800/50 border border-charcoal-700/50 rounded-full text-white/70 text-sm hover:border-gold/30 hover:text-gold transition-all mb-6"
                        >
                          {result.runnerUp.title}
                        </Link>
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
