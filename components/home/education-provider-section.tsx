'use client';

import { motion } from 'framer-motion';
import { MonitorPlay, CalendarDays, Laptop, LayoutGrid } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const learningOptions = [
  {
    icon: MonitorPlay,
    title: 'Blended',
    description: 'Theory Online, at your pace. Then practical in course with us',
  },
  {
    icon: CalendarDays,
    title: 'Scheduled',
    description: 'Classic course, weekly schedule. 8 or 16 weeks long',
  },
  {
    icon: Laptop,
    title: 'Fully Online',
    description: 'In your time, On your terms, At your pace',
  },
  {
    icon: LayoutGrid,
    title: 'Your Schedule',
    description: 'We fit your course around you, easily. Everyone\'s different',
  },
];

const awardLogos = [
  { name: 'Skillnet Ireland', image: '/skillnet-logo.png' },
  { name: 'EHFA Approved', image: '/ehfa-logo.webp' },
  { name: 'REPs Ireland', image: '/reps-ireland-logo.png' },
];

export function EducationProviderSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay prevented, that's okay
      });
    }
  }, [isClient]);

  return (
    <section className="relative py-20 md:py-32 bg-black overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-black to-black" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 items-center mb-20">
          
          {/* Left: Title and Awards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <p className="text-[#D4A836] font-medium text-base sm:text-lg mb-2">
              Europe&apos;s #1
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
              <span className="block">FITNESS</span>
              <span className="block">EDUCATION</span>
              <span className="block">PROVIDER</span>
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
              Award Winning
            </p>
            
            {/* Award logos - clean, direct display */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {awardLogos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative bg-white/90 rounded-lg p-2"
                >
                  <Image
                    src={logo.image}
                    alt={logo.name}
                    width={80}
                    height={80}
                    className="object-contain w-12 h-12 sm:w-16 sm:h-16"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Center: Video/Laptop mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 flex justify-center"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px]">
              {/* Impressive multi-layer shadow effect behind laptop */}
              <div className="absolute inset-0 -z-10">
                {/* Primary gold glow - stronger on mobile */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[320px] md:h-[400px] bg-[#D4A836]/40 sm:bg-[#D4A836]/25 blur-[80px] sm:blur-[80px] rounded-full" />
                {/* Secondary ambient glow - stronger on mobile */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[320px] md:w-[400px] h-[250px] sm:h-[250px] md:h-[300px] bg-[#D4A836]/30 sm:bg-[#D4A836]/15 blur-[60px] sm:blur-[60px] rounded-full" />
                {/* Inner bright core - stronger on mobile */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[240px] md:w-[300px] h-[160px] sm:h-[160px] md:h-[200px] bg-[#D4A836]/25 sm:bg-[#D4A836]/10 blur-[50px] sm:blur-[40px] rounded-full" />
              </div>
              
              {/* Laptop frame */}
              <div className="relative">
                {/* Screen */}
                <div className="relative w-full bg-zinc-900 rounded-t-lg sm:rounded-t-xl p-1.5 sm:p-2 border-2 sm:border-4 border-zinc-700 border-b-0 shadow-2xl shadow-black/50">
                  {/* Camera notch */}
                  <div className="absolute top-0.5 sm:top-1 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-zinc-600 rounded-full z-20" />
                  
                  {/* Video container */}
                  <div className="relative w-full aspect-video rounded-md sm:rounded-lg overflow-hidden bg-zinc-800 mt-1.5 sm:mt-2">
                    {isClient && (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      >
                        <source src="/education-provider-video-compressed.mp4" type="video/mp4" />
                      </video>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
                
                {/* Laptop base/keyboard */}
                <div className="relative w-[calc(100%+28px)] sm:w-[calc(100%+35px)] md:w-[calc(100%+40px)] -ml-[14px] sm:-ml-[17px] md:-ml-5 h-3 sm:h-4 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-lg sm:rounded-b-xl shadow-xl shadow-black/30">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-zinc-600 rounded-b-lg" />
                </div>
                
                {/* Ground reflection shadow */}
                <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-6 sm:h-8 bg-gradient-to-t from-transparent via-black/40 to-black/60 blur-lg sm:blur-xl rounded-full" />
              </div>
            </div>
          </motion.div>
          
          {/* Right: Tagline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed">
              Your time matters. So you&apos;ve{' '}
              <span className="text-[#D4A836] font-medium">many ways</span>{' '}
              to learn with us.
            </h3>
          </motion.div>
        </div>
        
        {/* Learning Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {learningOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="group text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4A836]/50 transition-all duration-300 hover:bg-zinc-900/80"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#D4A836]/10 flex items-center justify-center group-hover:bg-[#D4A836]/20 transition-colors">
                <option.icon className="w-8 h-8 text-[#D4A836]" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {option.title}
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {option.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
