'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Star, Quote, ThumbsUp, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'

const reviews = [
  {
    id: 1,
    name: 'Mollie Walsh',
    image: '/reviews/mollie-walsh.jpg',
    badge: 'Local Guide \u00b7 24 reviews \u00b7 20 photos',
    rating: 5,
    date: 'a year ago',
    text: 'Finished my part time course a month ago. Such a good experience! Im now equipped with lots of knowledge I\'ll need going into a career in fitness. Really great tutors - Sharon and Johnny were so helpful, always there when you need them. It was a really hands on course, they provided clear instruction each week and checked on our progress regularly. Highly recommend \ud83d\ude0a',
    helpful: 52,
    verified: true,
    attachedImage: '/team-group.jpg',
  },
  {
    id: 2,
    name: 'Zoey Donohoe',
    image: '/reviews/zoey-donohoe.jpg',
    badge: '1 review',
    rating: 5,
    date: '6 months ago',
    text: 'Absolutely loved every minute of learning from Image Fitness, The course instructor Stefano was phenomenal really created a bond with each of the students and created a team bond within the students. Stefano really was a brilliant teacher & we were lucky to get a teacher like him. Thank you Stefano We all greatly appreciate you and all your help',
    helpful: 33,
    verified: true,
  },
  {
    id: 3,
    name: 'Eoghan G.',
    image: '/reviews/eoghan-g.jpg',
    badge: 'Local Guide \u00b7 321 reviews',
    rating: 5,
    date: '5 months ago',
    text: 'I (36M) signed up to shift my career into fitness from corporate marketing tech. The content covered by the PT/Fitness Trainer course was super interesting and taught interactively - class tuition, online videos, quizzes, real world assignments and on the gym floor. The tutors were extremely knowledgeable. The gym (Vault Tallaght) was very clean, safe and well equipped. Big thanks to Johnny, Shane, Adam and the rest of the Image team!',
    helpful: 42,
    verified: true,
  },
  {
    id: 4,
    name: 'Louise Neville',
    image: '/reviews/louise-neville.jpg',
    badge: '1 review \u00b7 8 photos',
    rating: 5,
    date: '11 months ago',
    text: 'I\'m 44 and have recently completed my PT and Fitness class course with Image Fitness! At the beginning I wasn\'t sure what to expect, but it was the best decision I made. I met some amazing people and we continue to stay in touch. Our coach May was Awesome - so approachable and made the learning easy to follow and enjoyable. This course has opened up so many opportunities for me!',
    helpful: 38,
    verified: true,
  },
  {
    id: 5,
    name: 'Katie Burdis',
    image: '/reviews/katie-burdis.jpg',
    badge: '1 review',
    rating: 5,
    date: '3 months ago',
    text: 'Just completed the 8 week intensive course & I could not recommend it enough. I enjoyed every minute of it. The tutors Shane & Johnny were amazing, always willing to answer any questions we had and help build my confidence for going forward. Bitter sweet finishing up. Great memories, Great People + Great atmosphere. 10/10',
    helpful: 29,
    verified: true,
  },
  {
    id: 6,
    name: 'Rafaela',
    image: '/reviews/rafaela.jpg',
    badge: '2 reviews',
    rating: 5,
    date: '6 months ago',
    text: 'Taking the course at Image Fitness Training Global was one of the best decisions I\'ve made! It helped me grow not only in knowledge but also in confidence as a professional. The course is well-structured, organized, and filled with up-to-date content. A special shout-out to May, our instructor - she was absolutely amazing from start to finish. I highly recommend this course!',
    helpful: 31,
    verified: true,
  },
  {
    id: 7,
    name: 'Trish Kennedy',
    image: '/reviews/trish-kennedy.jpg',
    badge: '7 reviews \u00b7 8 photos',
    rating: 5,
    date: 'a year ago',
    text: 'Image Fitness delivered everything you\'d want in a Personal training and group instructor course and more. Our instructor Johnny was second to none - fun, professional, knowledgeable and most of all encouraged and believed in us. I am super glad I did this course, it was one of the best investments I could\'ve done in myself and as a bonus I made great friends.',
    helpful: 45,
    verified: true,
  },
  {
    id: 8,
    name: 'Bri B',
    image: '/reviews/bri-b.jpg',
    badge: '8 reviews \u00b7 12 photos',
    rating: 5,
    date: '6 months ago',
    text: 'I just finished the 16-week PT course with ImageFitnessTraining and absolutely loved it! The course was so fun, and well structured with very useful information. The tutors were incredibly supportive and made learning both enjoyable and motivating. I met great people, gained more confidence, and had an amazing time throughout. Highly recommend!',
    helpful: 27,
    verified: true,
  },
  {
    id: 9,
    name: 'Kevin Heavin',
    image: '/reviews/kevin-heavin.jpg',
    badge: 'Local Guide \u00b7 13 reviews',
    rating: 5,
    date: '5 months ago',
    text: 'Very enjoyable course, packed full of content that is delivered in an exceptional manner. The tutors are well prepared and full of knowledge and delivered the info in a way that made it easy to understand and retain. I felt over prepared for the exams and ready to enter the industry with confidence. Massive thanks to Adam, Johnny, Gary & Stefano. 100% recommend',
    helpful: 34,
    verified: true,
  },
  {
    id: 10,
    name: 'Fionn O\'Shea',
    image: '/reviews/fionn-oshea.jpg',
    badge: '4 reviews \u00b7 3 photos',
    rating: 5,
    date: '11 months ago',
    text: 'Stefano was a great tutor to all of us at Swords weekend group classes, thoroughly enjoyed the experience and all the staff were great. Adam and Aaron also whom first got me signed up continuing to help throughout with any questions I had \ud83d\udc4c',
    helpful: 19,
    verified: true,
  },
  {
    id: 11,
    name: 'Shane Gannon',
    image: '/reviews/shane-gannon.jpg',
    badge: '2 reviews',
    rating: 5,
    date: '10 months ago',
    text: 'Absolutely fantastic experience getting qualified with Image. I was on the intensive course with Shane & Johnnie and found them both to be exceptional instructors. The material was presented well and concisely. The aftercare and support given by Image is second to none - Simon was incredibly helpful, not only helping me get my first job in a gym but also providing practical career advice.',
    helpful: 36,
    verified: true,
  },
  {
    id: 12,
    name: 'Kristian Sullivan',
    image: '/reviews/kristian-sullivan.jpg',
    badge: '2 reviews \u00b7 1 photo',
    rating: 5,
    date: '2 years ago',
    text: 'Couldn\'t recommend Image Fitness enough, I done the combination course and the strength and conditioning course with them. The tutors were very good - the knowledge I gained will be with me for life. They make you feel at home from the minute you walk in. A big thanks especially to Mark White who breaks down everything for you to understand easily.',
    helpful: 41,
    verified: true,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  )
}

export default function GoogleReviewsSlider() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [isClient, setIsClient] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show 1 on mobile, 2 on md, 3 on lg
  const getVisibleCount = useCallback(() => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 768) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }, [])

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [getVisibleCount])

  const maxIndex = Math.max(0, reviews.length - visibleCount)

  const goNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const goPrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  if (!isClient) {
    return <section className="py-16 bg-charcoal-900" />
  }

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-charcoal-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-6">
            <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Google Reviews</span>
              <div className="flex items-center gap-1">
                <span className="text-white font-bold">4.9</span>
                <StarRating rating={5} />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our <span className="text-gold">Graduates</span> Say
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. See what our 5,000+ graduates have to say about their experience.
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              currentIndex === 0
                ? 'bg-charcoal-800/50 text-white/20 cursor-not-allowed'
                : 'bg-charcoal-800 text-white hover:bg-gold hover:text-charcoal-950 shadow-lg'
            }`}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              currentIndex >= maxIndex
                ? 'bg-charcoal-800/50 text-white/20 cursor-not-allowed'
                : 'bg-charcoal-800 text-white hover:bg-gold hover:text-charcoal-950 shadow-lg'
            }`}
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-6 sm:mx-8">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="group relative bg-charcoal-800/50 backdrop-blur-sm border border-charcoal-700 rounded-2xl p-5 sm:p-6 hover:border-gold/30 transition-all duration-300 h-full flex flex-col">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-gold/10 group-hover:text-gold/20 transition-colors" />

                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-charcoal-600 group-hover:ring-gold/50 transition-all flex-shrink-0">
                        <Image
                          src={review.image}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-semibold text-sm truncate">{review.name}</h4>
                          {review.verified && (
                            <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} />
                          <span className="text-white/40 text-xs">{review.date}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1 line-clamp-5">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    {'attachedImage' in review && review.attachedImage && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden mb-3 ring-1 ring-charcoal-600">
                        <Image
                          src={review.attachedImage as string}
                          alt={`Photo shared by ${review.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-charcoal-700">
                      <span className="flex items-center gap-2 text-white/40 text-xs">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({review.helpful})</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" xmlns="https://i.redd.it/astsgopipi1f1.png">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="text-white/30 text-xs">Google</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === i
                    ? 'w-6 bg-gold'
                    : 'w-2 bg-charcoal-600 hover:bg-charcoal-500'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="https://g.page/r/CfKCG9jFG9jFEB0/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white font-medium transition-all group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/250px-Google_%22G%22_logo.svg.png">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            View All Reviews on Google
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
