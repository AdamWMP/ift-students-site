'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, MessageCircle } from 'lucide-react';
import { welcomeVideos } from '@/lib/course-data';
import type { ContactData } from './onboarding-content';

// Map Ontraport timetable option IDs back to timetable keys
const TIMETABLE_ID_TO_KEY: Record<string, string> = {
  '505': '8-week-intensive',
  '597': '16-week-evening-sat',
  '504': '16-week-saturday',
  '544': 'online-self-paced',
};

interface WelcomeVideoStepProps {
  contact: ContactData;
  checkoutData: Record<string, string> | null;
  onComplete: () => void;
  isCompleted: boolean;
}

export function WelcomeVideoStep({ contact, checkoutData, onComplete, isCompleted }: WelcomeVideoStepProps) {
  const [watched, setWatched] = useState(isCompleted);

  // Determine timetable key from Ontraport field or checkout data
  const timetableKey = checkoutData?.timetable
    || TIMETABLE_ID_TO_KEY[contact.courseTimetable]
    || '16-week-saturday'; // fallback

  const video = welcomeVideos[timetableKey] || welcomeVideos['16-week-saturday'];

  const handleWatched = () => {
    if (!watched) {
      setWatched(true);
      onComplete();
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Video embed */}
      <div className="aspect-video w-full bg-black">
        <iframe
          src={`${video.embedUrl}&autoplay=0&title=0&byline=0&portrait=0`}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Info below video */}
      <div className="p-4 md:p-6 space-y-4">
        <div>
          <h3 className="text-white font-semibold mb-1">Welcome to Image Fitness Training</h3>
          <p className="text-zinc-400 text-sm">
            Watch this short video to learn what to expect from your course and how to get the most out of it.
          </p>
        </div>

        {/* Skool community note */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-400 font-semibold mb-1">Join Your Skool Community</p>
            <p className="text-zinc-400">
              You&apos;ve been sent an invite to join Skool — check your <strong className="text-white">Promotions folder</strong> in your email.
              Once joined, click the <strong className="text-white">Classroom</strong> tab to access your course content.
            </p>
          </div>
        </div>

        {/* Mark as watched button */}
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" />
            <span className="text-sm font-semibold">Video watched</span>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWatched}
            className="w-full py-3 bg-gold text-black font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            I&apos;ve Watched the Video
          </motion.button>
        )}
      </div>
    </div>
  );
}
