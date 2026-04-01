'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { Send, MessageCircle, Phone, Sparkles } from 'lucide-react'

export default function ContactFormSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const interests = [
    'Personal Trainer Course',
    'Pilates Instructor',
    'Reformer Pilates',
    'Strength & Conditioning',
    'Nutrition Certification',
    'Pre & Post Natal',
    'Business Accelerator',
    'Not Sure Yet - Help Me Decide'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-charcoal-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">Let&apos;s Connect</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            LET US KNOW WHAT <span className="text-gold">WORKS FOR YOU</span>
          </h2>
          <p className="text-xl sm:text-2xl text-white/70 mb-2">
            We&apos;ll reach out & see how it fits...
          </p>
          <p className="text-lg text-gold font-medium">
            ANYTHING IS POSSIBLE!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {submitted ? (
            <div className="text-center py-16 bg-charcoal-900/50 border border-gold/20 rounded-3xl">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
              <p className="text-white/60 mb-6">We&apos;ll be in touch within 24 hours</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-gold hover:text-gold-400 font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-900/80 border border-charcoal-700 rounded-xl text-white placeholder-white/40 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-900/80 border border-charcoal-700 rounded-xl text-white placeholder-white/40 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-900/80 border border-charcoal-700 rounded-xl text-white placeholder-white/40 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                    placeholder="+353 ..."
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">I&apos;m Interested In *</label>
                  <select
                    required
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-900/80 border border-charcoal-700 rounded-xl text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a course...</option>
                    {interests.map((interest) => (
                      <option key={interest} value={interest} className="bg-charcoal-900">
                        {interest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Tell Us More (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-4 bg-charcoal-900/80 border border-charcoal-700 rounded-xl text-white placeholder-white/40 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none"
                  placeholder="Any questions or specific requirements? Let us know..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 bg-gold hover:bg-gold-400 text-charcoal-950 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-charcoal-950/30 border-t-charcoal-950 rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Send me info
                    </>
                  )}
                </button>

                <span className="text-white/40">or</span>

                <a
                  href="https://wa.me/353866000001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 border border-green-500/30 hover:border-green-500 bg-green-500/10 hover:bg-green-500/20 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  WhatsApp Us
                </a>
              </div>

              <p className="text-center text-white/40 text-sm pt-2">
                We typically respond within 2 hours during business hours
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
