'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';

// All 10 unique video testimonials from both sites
const testimonialVideos = [
  {
    id: 1,
    src: 'https://cdn.shopify.com/videos/c/vp/bbce677bd33c4c79b88f33a890df9fda/bbce677bd33c4c79b88f33a890df9fda.HD-720p-4.5Mbps-72028946.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/bbce677bd33c4c79b88f33a890df9fda.thumbnail.0000000000.jpg?v=1770650570&width=960&height=540',
    name: 'Graduate Story',
    role: 'PT Graduate',
  },
  {
    id: 2,
    src: 'https://cdn.shopify.com/videos/c/vp/e26ef2f596d3457e9dfb9cc9c7591bb3/e26ef2f596d3457e9dfb9cc9c7591bb3.HD-720p-1.6Mbps-72029079.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/e26ef2f596d3457e9dfb9cc9c7591bb3.thumbnail.0000000000.jpg?v=1770650532&width=960&height=540',
    name: 'Success Story',
    role: 'PT Graduate',
  },
  {
    id: 3,
    src: 'https://cdn.shopify.com/videos/c/vp/b50cb1d575fe452d8f52b52bfce01f60/b50cb1d575fe452d8f52b52bfce01f60.HD-720p-1.6Mbps-72029338.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/b50cb1d575fe452d8f52b52bfce01f60.thumbnail.0000000000.jpg?v=1770650611&width=960&height=540',
    name: 'Career Change',
    role: 'PT Graduate',
  },
  {
    id: 4,
    src: 'https://cdn.shopify.com/videos/c/vp/a61c35b3b0dc46a090dba0ab11449050/a61c35b3b0dc46a090dba0ab11449050.HD-720p-1.6Mbps-72029306.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/a61c35b3b0dc46a090dba0ab11449050.thumbnail.0000000000.jpg?v=1770650624&width=960&height=540',
    name: 'Transformation',
    role: 'PT Graduate',
  },
  {
    id: 5,
    src: 'https://cdn.shopify.com/videos/c/vp/743d958e9f5d4af2b72fa476dd6dd3fa/743d958e9f5d4af2b72fa476dd6dd3fa.HD-720p-1.6Mbps-72029278.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/743d958e9f5d4af2b72fa476dd6dd3fa.thumbnail.0000000000.jpg?v=1770650588&width=960&height=540',
    name: 'Dream Job',
    role: 'PT Graduate',
  },
  {
    id: 6,
    src: 'https://cdn.shopify.com/videos/c/vp/ed62a2c6bcbb4e78af243abdf00a9a75/ed62a2c6bcbb4e78af243abdf00a9a75.HD-720p-1.6Mbps-72028963.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/ed62a2c6bcbb4e78af243abdf00a9a75.thumbnail.0000000000.jpg?v=1770650509&width=960&height=540',
    name: 'New Career',
    role: 'PT Graduate',
  },
  {
    id: 7,
    src: 'https://cdn.shopify.com/videos/c/vp/1a10facb055a42d5b2fb4f4e9fd4457b/1a10facb055a42d5b2fb4f4e9fd4457b.HD-720p-1.6Mbps-72029063.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/1a10facb055a42d5b2fb4f4e9fd4457b.thumbnail.0000000000.jpg?v=1770650543&width=960&height=540',
    name: 'Life Changed',
    role: 'PT Graduate',
  },
  {
    id: 8,
    src: 'https://cdn.shopify.com/videos/c/vp/03aa338aaedb43f1ade5c1e75e811b7c/03aa338aaedb43f1ade5c1e75e811b7c.HD-720p-1.6Mbps-72029047.mp4',
    poster: 'https://cdn.shopify.com/s/files/1/0943/8170/3499/files/preview_images/03aa338aaedb43f1ade5c1e75e811b7c.thumbnail.0000000000.jpg?v=1770650569&width=960&height=540',
    name: 'Success',
    role: 'PT Graduate',
  },
];

export function ResultsWallSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Sound ON by default when playing
  const [isClient, setIsClient] = useState(false);
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoized close function for use in effects
  const closeExpandedVideo = useCallback(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setExpandedVideo(null);
    // Scroll back to saved position (Results Wall area)
    setTimeout(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' });
    }, 50);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedVideo !== null) {
        closeExpandedVideo();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [expandedVideo, closeExpandedVideo]);

  // Handle browser back button (Android) - close modal instead of navigating away
  useEffect(() => {
    if (expandedVideo !== null) {
      // Push a fake history state when modal opens
      window.history.pushState({ modalOpen: true }, '');
      
      const handlePopState = () => {
        // When back button is pressed, close modal
        closeExpandedVideo();
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [expandedVideo, closeExpandedVideo]);

  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = 220;
      const gap = 16;
      const scrollPosition = index * (cardWidth + gap);
      sliderRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(testimonialVideos.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleVideoClick = (index: number) => {
    // Save scroll position before opening modal
    scrollPositionRef.current = window.scrollY;
    
    // Pause all inline videos
    Object.keys(videoRefs.current).forEach((key) => {
      const v = videoRefs.current[parseInt(key)];
      if (v) v.pause();
    });
    setIsPlaying(null);
    
    // Open expanded modal view
    setExpandedVideo(index);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = !isMuted;
    });
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const cardWidth = 220 + 16;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-gradient-to-b from-black to-charcoal-950 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A836]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#D4A836]/10 border border-[#D4A836]/30 rounded-full text-[#D4A836] text-sm font-medium mb-4">
            Check us out in the wild
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            The Results <span className="text-[#D4A836]">Wall</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Scroll through and see what happens when you stop guessing and follow a proven plan.
          </p>
        </motion.div>

        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 hover:bg-[#D4A836] rounded-full flex items-center justify-center transition-colors group -translate-x-2 md:translate-x-2"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-black" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 hover:bg-[#D4A836] rounded-full flex items-center justify-center transition-colors group translate-x-2 md:-translate-x-2"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-black" />
          </button>

          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/80 hover:bg-zinc-800 rounded-full flex items-center justify-center transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>

          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8 md:px-16 py-4 snap-x snap-mandatory"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {testimonialVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 snap-center"
                style={{ width: 220 }}
              >
                <div
                  className={`relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                    activeIndex === index
                      ? 'ring-4 ring-[#D4A836] shadow-xl shadow-[#D4A836]/20 scale-105'
                      : 'ring-2 ring-zinc-800 hover:ring-zinc-600'
                  }`}
                  onClick={() => handleVideoClick(index)}
                >
                  {isClient && (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={video.src}
                      poster={video.poster || undefined}
                      className="w-full h-full object-cover bg-zinc-900"
                      loop
                      muted={isMuted}
                      playsInline
                      preload="metadata"
                      onEnded={() => setIsPlaying(null)}
                    />
                  )}

                  {/* Tap to play/pause - no overlay button */}
                  {isPlaying !== index && (
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                  )}

                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-semibold text-sm">{video.name}</p>
                    <p className="text-[#D4A836] text-xs">{video.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-6">
            {testimonialVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index
                    ? 'w-6 bg-[#D4A836]'
                    : 'w-2 bg-zinc-600 hover:bg-zinc-500'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-zinc-400 mb-4">Ready to write your own success story?</p>
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A836] text-black font-bold rounded-xl hover:bg-[#E5B82A] transition-colors"
          >
            Book Now
            <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Expanded Video Modal */}
      <AnimatePresence>
        {expandedVideo !== null && isClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black"
            onClick={closeExpandedVideo}
          >
            {/* Fixed close button at top */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={closeExpandedVideo}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm mx-4 mt-16 mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video container */}
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden ring-4 ring-[#D4A836] shadow-2xl shadow-[#D4A836]/30">
                <video
                  ref={modalVideoRef}
                  src={testimonialVideos[expandedVideo]?.src}
                  poster={testimonialVideos[expandedVideo]?.poster || undefined}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  controls
                />
                
                {/* Mute toggle inside video */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              {/* Video info */}
              <div className="mt-4 text-center">
                <p className="text-white font-semibold text-lg">{testimonialVideos[expandedVideo]?.name}</p>
                <p className="text-[#D4A836]">{testimonialVideos[expandedVideo]?.role}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
