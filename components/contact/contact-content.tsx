'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle, Loader2 } from 'lucide-react'

const locations = [
  { name: 'Swords, Dublin', address: 'The Castle Shopping Centre, Bridge Street, Swords, Co. Dublin' },
  { name: 'Tallaght, Dublin', address: 'The Vault Health Club, Belgard Square W, Tallaght, Dublin 24' },
  { name: 'Cork City', address: 'FLYEfit Cork, Stapleton House, 10 Oliver Plunkett St, Centre, Cork' },
  { name: 'Tuam, Galway', address: 'HQ Gym, N17 Business Park, Galway Rd, Farrannamartin, Tuam, Co. Galway' },
  { name: 'Limerick City', address: 'Matchbox Fitness, Unit 6E Eastpoint Retail Park, Ballysimon Rd, Limerick' },
  { name: 'Wexford', address: 'Predator Fitness, Unit 4, Kerlogue Industrial Estate, Co. Wexford' },
  { name: 'Belfast', address: 'Momentum Fitness, Unit 7, 220 Stewartstown Rd, Dunmurry, Belfast' },
]

export default function ContactContent() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res?.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e?.target?.name ?? ''
    const value = e?.target?.value ?? ''
    setFormData((prev) => ({ ...(prev ?? {}), [name]: value }))
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70">
              Have questions? We&apos;re here to help. Reach out and start your journey today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            <motion.a
              href="https://wa.me/353851234567?text=Hi!%20I%27m%20interested%20in%20your%20fitness%20courses."
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center hover:bg-green-500/20 transition-all group"
            >
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
              <p className="text-white/60 text-sm">Quick response, chat with us directly</p>
            </motion.a>

            <motion.a
              href="tel:+353851234567"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gold/10 border border-gold/30 rounded-xl p-6 text-center hover:bg-gold/20 transition-all group"
            >
              <Phone className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
              <p className="text-white/60 text-sm">Mon-Fri, 9am-6pm</p>
            </motion.a>

            <motion.a
              href="mailto:info@imageft.ie"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 text-center hover:border-gold/30 transition-all group"
            >
              <Mail className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-white/60 text-sm">info@imageft.ie</p>
            </motion.a>
          </div>

          {/* Contact Form & Locations */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-charcoal-900 rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/60">We&apos;ll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData?.name ?? ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData?.email ?? ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData?.phone ?? ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData?.subject ?? ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="pt-course">Personal Trainer Course</option>
                      <option value="sc-course">Strength & Conditioning Course</option>
                      <option value="pilates">Pilates Course</option>
                      <option value="payment">Payment / Funding</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData?.message ?? ''}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Our Locations</h2>
              <div className="space-y-4">
                {locations?.map?.((location, index) => (
                  <div
                    key={index}
                    className="bg-charcoal-900 rounded-xl p-4 hover:bg-charcoal-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-white mb-1">{location?.name ?? ''}</h3>
                        <p className="text-white/60 text-sm">{location?.address ?? ''}</p>
                      </div>
                    </div>
                  </div>
                )) ?? null}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
