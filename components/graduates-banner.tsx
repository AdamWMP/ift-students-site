'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

// Graduate avatar data - using diverse images
const graduates = [
  { id: 1, image: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Graduate 1' },
  { id: 2, image: 'https://randomuser.me/api/portraits/women/44.jpg', name: 'Graduate 2' },
  { id: 3, image: 'https://randomuser.me/api/portraits/men/67.jpg', name: 'Graduate 3' },
  { id: 4, image: 'https://randomuser.me/api/portraits/women/68.jpg', name: 'Graduate 4' },
  { id: 5, image: 'https://randomuser.me/api/portraits/men/75.jpg', name: 'Graduate 5' },
  { id: 6, image: 'https://randomuser.me/api/portraits/women/65.jpg', name: 'Graduate 6' },
  { id: 7, image: 'https://randomuser.me/api/portraits/men/22.jpg', name: 'Graduate 7' },
  { id: 8, image: 'https://randomuser.me/api/portraits/women/29.jpg', name: 'Graduate 8' },
  { id: 9, image: 'https://randomuser.me/api/portraits/men/45.jpg', name: 'Graduate 9' },
  { id: 10, image: 'https://randomuser.me/api/portraits/women/52.jpg', name: 'Graduate 10' },
]

interface GraduatesBannerProps {
  variant?: 'default' | 'compact'
  className?: string
}

export default function GraduatesBanner({ variant = 'default', className = '' }: GraduatesBannerProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  const isCompact = variant === 'compact'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 ${className}`}
    >
      {/* Avatars Container */}
      <div className="flex items-center justify-center">
        <div className="flex items-center -space-x-3 sm:-space-x-4">
          {graduates.map((graduate, index) => (
            <motion.div
              key={graduate.id}
              initial={{ opacity: 0, scale: 0.5, x: -20 }}
              animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                type: 'spring',
                stiffness: 200
              }}
              className="relative group"
              style={{ zIndex: graduates.length - index }}
            >
              {/* Gold ring */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-gold via-gold-400 to-gold-600 p-[2px] ${isCompact ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-9 h-9 sm:w-11 sm:h-11'}`}>
                <div className="w-full h-full rounded-full bg-charcoal-950 p-[2px]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                  </div>
                </div>
              </div>
              
              {/* Avatar image with gold border */}
              <div className={`relative rounded-full overflow-hidden ring-2 ring-gold shadow-lg shadow-gold/20 transition-transform duration-300 group-hover:scale-110 group-hover:z-50 ${isCompact ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-9 h-9 sm:w-11 sm:h-11'}`}>
                <Image
                  src={graduate.image}
                  alt={graduate.name}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center md:text-left"
      >
        <p className={`text-white/90 font-medium ${isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
          Join Ireland&apos;s largest, award winning training provider
        </p>
      </motion.div>
    </motion.div>
  )
}
