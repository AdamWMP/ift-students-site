'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const courses = [
  {
    id: 'pt',
    name: 'Personal Trainer',
    shortName: 'PT Course',
    description: 'Become a certified Personal Trainer and transform lives through fitness coaching.',
    image: '/pt-course-card.jpg',
    href: '/courses/personal-trainer',
    duration: '8-16 weeks',
    level: 'All Levels',
    price: 'From €1,500',
    color: '#D4A836',
    isMostPopular: true,
    testimonial: {
      quote: 'Best decision I ever made for my career.',
      name: 'Sarah M.',
      location: 'Dublin',
    },
    attributes: [
      { name: 'Flexibility', level: 3 },
      { name: 'Career Growth', level: 3 },
      { name: 'Earning Potential', level: 3 },
    ],
  },
  {
    id: 'pilates',
    name: 'Pilates Instructor',
    shortName: 'Pilates Course',
    description: 'Become a certified Pilates instructor and help clients build core strength.',
    image: '/pilates-mat-course.avif',
    href: '/courses/pilates',
    duration: '5-10 weeks',
    level: 'All Levels',
    price: 'From €1,800',
    color: '#F5D966',
    testimonial: {
      quote: 'Teaching Pilates has become my passion.',
      name: 'Emma K.',
      location: 'Galway',
    },
    attributes: [
      { name: 'Mind-Body', level: 3 },
      { name: 'Flexibility', level: 3 },
      { name: 'Client Base', level: 3 },
    ],
  },
  {
    id: 'reformer',
    name: 'Reformer Pilates',
    shortName: 'Reformer Course',
    description: 'Add reformer to your teaching toolkit. 6-day intensive for Mat Pilates qualified instructors.',
    image: '/reformer-course.webp',
    href: '/courses/reformer-pilates',
    duration: '6 Days',
    level: 'Add-On',
    price: 'From €700',
    color: '#E5B82A',
    testimonial: {
      quote: 'The reformer certification elevated my entire practice.',
      name: 'Aoife M.',
      location: 'Dublin',
    },
    attributes: [
      { name: 'Technical Depth', level: 3 },
      { name: 'Premium Skills', level: 3 },
      { name: 'Client Demand', level: 3 },
    ],
  },
  {
    id: 'sc',
    name: 'Strength & Conditioning',
    shortName: 'S&C Course',
    description: 'Master the science of athletic performance and strength training.',
    image: '/sc-course-card.jpg',
    href: '/courses/strength-conditioning',
    duration: '12 weeks',
    level: 'Advanced',
    price: 'From €1,350',
    color: '#B8922E',
    testimonial: {
      quote: 'The S&C course opened doors I never knew existed.',
      name: 'James O.',
      location: 'Cork',
    },
    attributes: [
      { name: 'Technical Depth', level: 3 },
      { name: 'Sports Focus', level: 3 },
      { name: 'Elite Coaching', level: 2 },
    ],
  },
  {
    id: 'nutrition',
    name: 'Advanced Nutrition',
    shortName: 'Nutrition Course',
    description: 'Learn the science of nutrition to maximize athletic performance.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=800&fit=crop',
    href: '/courses/nutricert',
    duration: 'Fully Online',
    level: 'Advanced',
    price: 'From €750',
    color: '#967526',
    testimonial: {
      quote: 'Added a whole new dimension to my coaching.',
      name: 'Ryan T.',
      location: 'Limerick',
    },
    attributes: [
      { name: 'Science Based', level: 3 },
      { name: 'Add-on Value', level: 3 },
      { name: 'Client Results', level: 3 },
    ],
  },
  {
    id: 'prenatal',
    name: 'Pre & Post Natal',
    shortName: 'Pre/Post Natal',
    description: 'Specialist certification for training pregnant and postpartum clients safely.',
    image: '/prenatal-fitness.png',
    href: '/courses/pre-post-natal',
    duration: 'Fully Online',
    level: 'Specialist',
    price: 'From €697',
    color: '#C4A052',
    testimonial: {
      quote: 'This course filled a huge gap in my services.',
      name: 'Siobhan D.',
      location: 'Galway',
    },
    attributes: [
      { name: 'Specialist Niche', level: 3 },
      { name: 'Growing Demand', level: 3 },
      { name: 'Client Trust', level: 3 },
    ],
  },
  {
    id: 'business',
    name: 'Fitness Business Accelerator',
    shortName: 'Business Course',
    description: 'Build and scale your fitness business with proven strategies.',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=800&fit=crop',
    href: '/business-accelerator',
    duration: 'Live online weekly',
    level: 'Advanced',
    price: 'From €900',
    color: '#8B7525',
    testimonial: {
      quote: 'Doubled my income within 6 months.',
      name: 'Ciara B.',
      location: 'Wexford',
    },
    attributes: [
      { name: 'Marketing', level: 3 },
      { name: 'Sales', level: 3 },
      { name: 'Scaling', level: 2 },
    ],
  },
];

export function CourseCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? courses.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === courses.length - 1 ? 0 : prev + 1));
  };

  const [isMobile, setIsMobile] = useState(false);
  const [cardWidth, setCardWidth] = useState(320);

  useEffect(() => {
    const checkSize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setCardWidth(w < 640 ? 200 : w < 768 ? 280 : 320);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const totalItems = courses.length;
    
    // Handle wrap-around
    let normalizedDiff = diff;
    if (diff > totalItems / 2) normalizedDiff = diff - totalItems;
    if (diff < -totalItems / 2) normalizedDiff = diff + totalItems;
    
    const absDiff = Math.abs(normalizedDiff);

    // Since framer-motion animate overrides CSS transforms, we must include
    // the -50% card-width centering offset in our JS calculations.
    const cardHalf = cardWidth / 2;

    if (isMobile) {
      // Mobile: card is 200px wide, screen ~375px
      // cardHalf offset centers the active card; ±155px spaces adjacent cards
      const x = -cardHalf + normalizedDiff * 155;
      const scale = absDiff === 0 ? 1 : 0.8;
      const opacity = absDiff > 1 ? 0 : absDiff === 0 ? 1 : 0.55;
      const zIndex = 10 - absDiff;
      const rotate = normalizedDiff * 5;
      const y = absDiff * 10;
      
      return {
        transform: `translateX(${x}px) translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        zIndex,
      };
    }
    
    // Desktop: arc-based layout
    const radius = 400;
    const angleMultiplier = 25;
    const angle = normalizedDiff * angleMultiplier;
    const x = -cardHalf + Math.sin((angle * Math.PI) / 180) * radius;
    const y = absDiff * 30;
    const scale = 1 - absDiff * 0.15;
    const opacity = absDiff > 2 ? 0 : 1 - absDiff * 0.35;
    const zIndex = 10 - absDiff;
    const rotate = normalizedDiff * 5;
    
    return {
      transform: `translateX(${x}px) translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
      opacity,
      zIndex,
    };
  };

  const activeCourse = courses[activeIndex];

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-charcoal-950 to-black overflow-x-clip overflow-y-visible">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] transition-colors duration-500"
        style={{ backgroundColor: `${activeCourse.color}10` }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-2 bg-[#D4A836]/10 border border-[#D4A836]/30 rounded-full text-[#D4A836] text-sm font-medium mb-4">
            What&apos;s Your Path
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Most Popular <span className="text-[#D4A836]">Courses</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative h-[380px] sm:h-[450px] md:h-[550px] flex items-center justify-center -mx-4 sm:mx-0">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 md:left-20 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 hover:bg-[#D4A836] rounded-full flex items-center justify-center transition-colors group"
            aria-label="Previous course"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-black rotate-180" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 md:right-20 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 hover:bg-[#D4A836] rounded-full flex items-center justify-center transition-colors group"
            aria-label="Next course"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-black" />
          </button>

          {/* Cards Container */}
          <div className="relative w-full h-[320px] sm:h-[380px] md:h-[450px]">
            {isClient && courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="absolute left-1/2 top-0 w-[200px] sm:w-[280px] md:w-[320px] cursor-pointer"
                style={getCardStyle(index)}
                onClick={() => setActiveIndex(index)}
                animate={getCardStyle(index)}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div 
                  className={`relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    activeIndex === index 
                      ? 'ring-4 ring-[#D4A836] shadow-[#D4A836]/30' 
                      : 'ring-2 ring-zinc-800'
                  }`}
                >
                  {/* Most Popular Ribbon */}
                  {'isMostPopular' in course && course.isMostPopular && (
                    <div className="absolute top-3 right-3 z-20">
                      <div className="bg-[#D4A836] text-black text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg">
                        ⭐ Most Popular
                      </div>
                    </div>
                  )}
                  
                  {/* Course Image */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90">
                    <Image
                      src={course.image}
                      alt={course.name}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <div 
                      className="inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-2 sm:mb-3 text-black"
                      style={{ backgroundColor: course.color }}
                    >
                      {course.level}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 leading-tight">{course.name}</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mb-2 sm:mb-3">{course.duration}</p>
                    <p className="text-white font-semibold text-sm sm:text-base">{course.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Course Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto text-center mt-2 sm:mt-4 md:mt-8"
          >
            {/* Testimonial */}
            <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 italic mb-2 sm:mb-4">
              &quot;{activeCourse.testimonial.quote}&quot;
            </p>
            <p className="text-[#D4A836] font-semibold text-sm sm:text-base">{activeCourse.testimonial.name}</p>
            <p className="text-zinc-500 text-xs sm:text-sm mb-4 sm:mb-6">📍 {activeCourse.testimonial.location}</p>

            {/* Attributes */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              {activeCourse.attributes.map((attr) => (
                <div key={attr.name} className="text-center">
                  <div className="flex gap-1 justify-center mb-1">
                    {[1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className={`w-2 h-2 rounded-full ${
                          dot <= attr.level ? 'bg-[#D4A836]' : 'bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-400 text-sm">{attr.name}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={activeCourse.href}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A836] text-black font-bold rounded-xl hover:bg-[#E5B82A] transition-colors"
            >
              Explore {activeCourse.shortName}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {courses.map((course, index) => (
            <button
              key={course.id}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? 'w-8'
                  : 'w-2 hover:bg-zinc-500'
              }`}
              style={{ 
                backgroundColor: activeIndex === index ? course.color : '#52525b' 
              }}
              aria-label={`Go to ${course.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
