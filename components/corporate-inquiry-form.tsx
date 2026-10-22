'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const engagementTypes = [
  'On-site course delivery (full qualification)',
  'Standalone workshop (1 to 3 days)',
  'Workshop series (multiple weekends)',
  'International wellness retreat (Spain / Portugal / other)',
  'Ongoing corporate wellness programming',
  'Not sure yet — I would like to talk it through',
]

const groupSizes = ['1 to 10', '11 to 25', '26 to 50', '50+']

const timeframes = [
  'As soon as possible',
  'Within 3 months',
  '3 to 6 months out',
  '6+ months out',
  'Flexible / exploring',
]

export default function CorporateInquiryForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    const payload = {
      firstName: String(formData.get('firstName') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      company: String(formData.get('company') ?? '').trim(),
      role: String(formData.get('role') ?? '').trim(),
      engagementType: String(formData.get('engagementType') ?? '').trim(),
      groupSize: String(formData.get('groupSize') ?? '').trim(),
      location: String(formData.get('location') ?? '').trim(),
      timeframe: String(formData.get('timeframe') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    }

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.company) {
      setStatus('error')
      setErrorMessage('Please fill in your name, email and company.')
      return
    }

    try {
      const res = await fetch('/api/corporate-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong')
      }
      setStatus('success')
      event.currentTarget.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-charcoal-900 border border-gold-500/40 rounded-2xl p-10 text-center">
        <div className="text-gold-500 text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold mb-3">Thank you — we have your enquiry.</h3>
        <p className="text-charcoal-300 leading-relaxed max-w-md mx-auto">
          Our corporate team will respond within 1 business day. If it is more urgent, email{' '}
          <a href="mailto:sales@imageft.ie" className="text-gold-500 underline">
            sales@imageft.ie
          </a>{' '}
          or WhatsApp us directly.
        </p>
      </div>
    )
  }

  const inputBase =
    'w-full bg-charcoal-900 border border-charcoal-700 focus:border-gold-500 rounded-lg px-4 py-3 text-white placeholder-charcoal-400 focus:outline-none transition-colors'

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal-900 rounded-2xl p-6 md:p-10 border border-charcoal-800">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm text-charcoal-300 mb-2">First name *</label>
          <input id="firstName" name="firstName" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm text-charcoal-300 mb-2">Last name *</label>
          <input id="lastName" name="lastName" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-charcoal-300 mb-2">Work email *</label>
          <input id="email" type="email" name="email" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm text-charcoal-300 mb-2">Phone</label>
          <input id="phone" type="tel" name="phone" className={inputBase} />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm text-charcoal-300 mb-2">Company / Organisation *</label>
          <input id="company" name="company" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm text-charcoal-300 mb-2">Your role / title</label>
          <input id="role" name="role" placeholder="e.g. Head of Wellness, Director" className={inputBase} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="engagementType" className="block text-sm text-charcoal-300 mb-2">Type of engagement</label>
          <select id="engagementType" name="engagementType" className={inputBase} defaultValue="">
            <option value="" disabled>Choose one…</option>
            {engagementTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="groupSize" className="block text-sm text-charcoal-300 mb-2">Approximate group size</label>
          <select id="groupSize" name="groupSize" className={inputBase} defaultValue="">
            <option value="" disabled>Choose one…</option>
            {groupSizes.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="timeframe" className="block text-sm text-charcoal-300 mb-2">Timeframe</label>
          <select id="timeframe" name="timeframe" className={inputBase} defaultValue="">
            <option value="" disabled>Choose one…</option>
            {timeframes.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="location" className="block text-sm text-charcoal-300 mb-2">Preferred delivery location</label>
          <input id="location" name="location" placeholder="e.g. Dublin, Cork, Marbella, our office at X" className={inputBase} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="message" className="block text-sm text-charcoal-300 mb-2">What are you looking to achieve?</label>
          <textarea id="message" name="message" rows={5} placeholder="A few sentences on who the audience is, what success looks like, and any constraints we should know about." className={inputBase} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-4 text-red-400 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 w-full md:w-auto bg-gold-500 hover:bg-gold-400 disabled:opacity-60 disabled:cursor-not-allowed text-charcoal-950 font-bold py-4 px-10 rounded-lg text-lg transition-all"
      >
        {status === 'submitting' ? 'Sending…' : 'Register My Interest'}
      </button>

      <p className="mt-6 text-xs text-charcoal-400">
        We respond within 1 business day. Prefer to email?{' '}
        <a href="mailto:sales@imageft.ie?subject=Corporate%20enquiry" className="text-gold-500 underline">
          sales@imageft.ie
        </a>
        .
      </p>
    </form>
  )
}
