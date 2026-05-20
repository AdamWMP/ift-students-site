'use client';

import { motion } from 'framer-motion';
import { Check, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export function CheckoutReturn({ sessionId }: { sessionId?: string }) {
  return (
    <section className="relative pt-20 pb-32 md:py-28 bg-gradient-to-b from-charcoal-950 to-black min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center py-20"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Booking <span className="text-gold">Confirmed!</span>
          </h2>
          <p className="text-zinc-400 mb-6">
            Your deposit has been processed successfully. Welcome to Image Fitness Training!
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 mb-8 text-left space-y-3">
            <h3 className="text-white font-semibold text-sm mb-3">What happens next?</h3>
            <div className="flex items-start gap-3 text-sm">
              <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <p className="text-zinc-400">
                You&apos;ll receive a <strong className="text-white">confirmation email</strong> with your course details and next steps.
              </p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <p className="text-zinc-400">
                A member of our team will be in touch within <strong className="text-white">24 hours</strong> to welcome you and answer any questions.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gold text-black font-bold rounded-xl hover:bg-gold-400 transition-colors"
            >
              Back to Home
            </Link>
            <a
              href="https://wa.me/353866003667"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-zinc-700 text-white font-semibold rounded-xl hover:border-zinc-500 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>

          {sessionId && (
            <p className="text-zinc-600 text-xs mt-8">
              Reference: {sessionId}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
