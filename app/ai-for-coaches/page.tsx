'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Bot, Clock, Users, CheckCircle, ArrowRight, CreditCard, Lock,
  ChevronDown, Zap, TrendingUp, FileText, MessageSquare,
  Package, Loader2, AlertCircle, Sparkles, Brain,
  ChevronLeft, ChevronRight, Wifi, Moon, Star,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

// ─── Constants ───────────────────────────────────────────────────────────
const FULL_PRICE = 300;
const PLAN_TOTAL = 499;
const DEPOSIT = 199;
const REMAINING = PLAN_TOTAL - DEPOSIT;
const TOTAL_SPOTS = 20;
const SPOTS_TAKEN = 14;
const PHASE_1_DATE = new Date('2026-05-18T18:00:00Z');

const AI_PLATFORMS = [
  {
    emoji: '🤖',
    name: 'ChatGPT',
    tagline: "The one everyone's heard of",
    color: '#10a37f',
    plain: "Think of it like texting a very smart assistant who never sleeps and never charges by the hour. You type what you need, it writes it back — instantly.",
    uses: ['Write a week of captions in 10 minutes', 'Draft emails to clients', 'Create meal plan templates instantly'],
  },
  {
    emoji: '🔍',
    name: 'Gemini',
    tagline: "Google's version — and it's powerful",
    color: '#4285F4',
    plain: "Made by Google, so it sits perfectly alongside your Gmail, Docs and Drive. If you already live in the Google world, this one clicks immediately.",
    uses: ['Summarise long documents in seconds', 'Research topics and get straight answers', 'Create images and short videos'],
  },
  {
    emoji: '🧠',
    name: 'Claude',
    tagline: 'The one that really listens',
    color: '#D97706',
    plain: "Brilliant at following detailed instructions and remembering context. We use it on Phase 2 to build you a custom content tool that works specifically for your business.",
    uses: ['Build your own AI content generator', 'Give it your voice — it sounds like you', 'Great for longer, more detailed work'],
  },
  {
    emoji: '📚',
    name: 'NotebookLM',
    tagline: 'Turn your files into an expert',
    color: '#3B82F6',
    plain: "Upload any file — a training programme, a client guide, your notes — and suddenly you can have a conversation with it. It's like a research assistant who's read everything you own.",
    uses: ['Ask your PT manual anything', 'Turn client cases into content ideas', 'Create audio summaries of documents'],
  },
  {
    emoji: '🎨',
    name: 'Gamma',
    tagline: 'Professional slides without the headache',
    color: '#8B5CF6',
    plain: "Type a few bullet points and Gamma builds you a full, polished presentation in seconds. No design skills needed — looks like something a designer spent hours on.",
    uses: ['Build a client onboarding deck in minutes', 'Create a sales presentation for your services', 'Turn your programme into a visual guide'],
  },
  {
    emoji: '🎬',
    name: 'Gemini Vo3',
    tagline: 'Type what you want — watch it become video',
    color: '#EF4444',
    plain: "Describe a scene or a fitness concept and it generates a short video. Brilliant for social content without ever picking up a camera.",
    uses: ['Create short reels without filming', 'Generate visual content for social', 'Bring your fitness tips to life'],
  },
];

// ─── Countdown ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function CountUnit({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative bg-black/40 border border-gold/25 rounded-xl w-16 h-16 sm:w-[72px] sm:h-[72px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />
        <span className="relative text-2xl sm:text-3xl font-extrabold text-gold tabular-nums leading-none">
          {String(v).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] uppercase tracking-[0.18em] text-white/35">{label}</span>
    </div>
  );
}

// ─── Scarcity Bar ────────────────────────────────────────────────────────
function SpotsBar({ spotsLeft }: { spotsLeft: number }) {
  const pct = Math.round((SPOTS_TAKEN / TOTAL_SPOTS) * 100);
  const isHot = spotsLeft <= 8;
  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-1.5">
        <div className={`flex items-center gap-1.5 text-xs font-bold ${isHot ? 'text-red-400' : 'text-amber-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isHot ? 'bg-red-400' : 'bg-amber-400'}`} />
          {isHot ? `Only ${spotsLeft} spots left` : `${spotsLeft} spots remaining`}
        </div>
        <span className="text-[11px] text-white/25 tabular-nums">{SPOTS_TAKEN} / {TOTAL_SPOTS} taken</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          className={`h-full rounded-full ${isHot ? 'bg-red-500' : 'bg-amber-500'}`}
        />
      </div>
      <p className="text-[11px] text-white/20 mt-1.5">{SPOTS_TAKEN} coaches have already secured their place</p>
    </div>
  );
}

// ─── Mobile Sticky Bar ───────────────────────────────────────────────────
function MobileStickyBar({ spotsLeft, onCTA }: { spotsLeft: number; onCTA: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-charcoal-900/97 backdrop-blur-md border-t border-red-500/25 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-red-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            Only {spotsLeft} spots left
          </p>
          <p className="text-[10px] text-white/35 mt-0.5">{SPOTS_TAKEN} coaches already booked</p>
        </div>
        <button onClick={onCTA} className="flex-shrink-0 bg-gold text-charcoal-950 font-extrabold text-xs uppercase tracking-wide px-5 py-3 rounded-xl whitespace-nowrap">
          Book Now
        </button>
      </div>
    </div>
  );
}

// ─── Platform Carousel (arc/fan) ─────────────────────────────────────────
function PlatformCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardWidth, setCardWidth] = useState(240);
  const touchStartX = useRef(0);

  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setCardWidth(w < 640 ? 190 : w < 768 ? 220 : 240);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const prev = () => setActiveIndex(i => (i === 0 ? AI_PLATFORMS.length - 1 : i - 1));
  const next = () => setActiveIndex(i => (i === AI_PLATFORMS.length - 1 ? 0 : i + 1));

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
  }

  const getCardStyle = (index: number) => {
    const total = AI_PLATFORMS.length;
    let d = index - activeIndex;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    const abs = Math.abs(d);
    const half = cardWidth / 2;
    if (isMobile) {
      return {
        transform: `translateX(${-half + d * 150}px) translateY(${abs * 14}px) scale(${abs === 0 ? 1 : 0.76}) rotate(${d * 7}deg)`,
        opacity: abs > 1 ? 0 : abs === 0 ? 1 : 0.45,
        zIndex: 10 - abs,
      };
    }
    const radius = 650;
    const angle = d * 20;
    const x = -half + Math.sin((angle * Math.PI) / 180) * radius;
    return {
      transform: `translateX(${x}px) translateY(${abs * 28}px) scale(${1 - abs * 0.11}) rotate(${d * 5}deg)`,
      opacity: abs > 2 ? 0 : 1 - abs * 0.28,
      zIndex: 10 - abs,
    };
  };

  const active = AI_PLATFORMS[activeIndex];

  return (
    <div>
      <div
        className="relative h-[340px] sm:h-[420px] flex items-center justify-center -mx-4 sm:mx-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button onClick={prev} className="absolute left-1 sm:left-0 md:-left-14 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-gold border border-white/10 hover:border-gold rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Previous">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-black" />
        </button>
        <button onClick={next} className="absolute right-1 sm:right-0 md:-right-14 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-gold border border-white/10 hover:border-gold rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Next">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-black" />
        </button>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[130px] transition-colors duration-700 pointer-events-none" style={{ backgroundColor: `${active.color}15` }} />

        <div className="relative w-full h-full select-none">
          {isClient && AI_PLATFORMS.map((p, i) => (
            <motion.div
              key={p.name}
              className="absolute left-1/2 top-0 w-[190px] sm:w-[220px] md:w-[240px] cursor-pointer"
              style={getCardStyle(i)}
              animate={getCardStyle(i)}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={() => setActiveIndex(i)}
            >
              <div
                className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, ${p.color}22, ${p.color}08 50%, #0d0d0d)`,
                  boxShadow: activeIndex === i ? `0 0 50px ${p.color}35, 0 25px 60px rgba(0,0,0,0.6)` : '0 8px 30px rgba(0,0,0,0.5)',
                  border: activeIndex === i ? `2px solid ${p.color}55` : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex-1 flex flex-col items-center justify-center px-5 pt-6 pb-3 gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${p.color}1a`, border: `1px solid ${p.color}35` }}>
                    {p.emoji}
                  </div>
                  {activeIndex === i && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-black uppercase tracking-wide" style={{ backgroundColor: p.color }}>
                      On the night
                    </motion.div>
                  )}
                </div>
                <div className="px-4 sm:px-5 pb-5 pt-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">{p.name}</h3>
                  <p className="text-white/45 text-[11px] sm:text-xs mt-0.5 leading-snug">{p.tagline}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }} className="max-w-lg mx-auto text-center mt-6 sm:mt-8 px-2">
          <p className="text-base sm:text-lg text-white/65 leading-relaxed mb-5">{active.plain}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {active.uses.map((u) => (
              <div key={u} className="flex items-center gap-1.5 text-xs text-white/55 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
                <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: active.color }} />{u}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-6">
        {AI_PLATFORMS.map((p, i) => (
          <button key={p.name} onClick={() => setActiveIndex(i)} className="h-1.5 rounded-full transition-all duration-300" style={{ width: activeIndex === i ? 22 : 6, backgroundColor: activeIndex === i ? p.color : 'rgba(255,255,255,0.18)' }} aria-label={p.name} />
        ))}
      </div>
    </div>
  );
}

// ─── Payment Selector ────────────────────────────────────────────────────
function PaymentSelector({ isFullPayment, planMonths, onFullChange, onMonthsChange }: {
  isFullPayment: boolean; planMonths: 1 | 2;
  onFullChange: (v: boolean) => void; onMonthsChange: (v: 1 | 2) => void;
}) {
  const monthly = parseFloat((REMAINING / planMonths).toFixed(2));
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#111]">
      <div className="flex">
        {[{ label: 'Pay in Full', sub: 'Save €199', full: true }, { label: 'Payment Plan', sub: `From €${DEPOSIT} today`, full: false }].map((opt) => (
          <button key={opt.label} onClick={() => onFullChange(opt.full)} className={`flex-1 py-4 px-3 text-center transition-all duration-200 ${isFullPayment === opt.full ? 'bg-gold text-charcoal-950' : 'text-white/40 hover:text-white/70 bg-transparent'}`}>
            <p className={`text-xs font-extrabold uppercase tracking-[0.08em] ${isFullPayment === opt.full ? 'text-charcoal-950' : ''}`}>{opt.label}</p>
            <p className={`text-[10px] mt-0.5 font-medium ${isFullPayment === opt.full ? 'text-charcoal-950/70' : 'text-white/25'}`}>{opt.sub}</p>
          </button>
        ))}
      </div>
      <div className="p-5 sm:p-6">
        {isFullPayment ? (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-3 py-1.5 mb-5">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-gold text-[11px] font-semibold">Save €199 vs payment plan</span>
            </div>
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-white/25 text-xl font-semibold line-through">€{PLAN_TOTAL}</span>
              <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">€{FULL_PRICE}</span>
            </div>
            <p className="text-white/35 text-sm">One payment · access to both phases · nothing more to pay</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5">
              <p className="text-white/35 text-xs mb-1 uppercase tracking-wider">Charged today</p>
              <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">€{DEPOSIT}</span>
              <p className="text-white/35 text-sm mt-2">then €{monthly}/mo × {planMonths} month{planMonths > 1 ? 's' : ''}</p>
              <p className="text-white/20 text-xs mt-0.5">Total €{PLAN_TOTAL}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2.5 text-center">Choose your instalments</p>
              <div className="grid grid-cols-2 gap-2">
                {([1, 2] as const).map((n) => {
                  const mo = parseFloat((REMAINING / n).toFixed(2));
                  return (
                    <button key={n} onClick={() => onMonthsChange(n)} className={`rounded-xl border py-3.5 px-4 text-center transition-all duration-200 ${planMonths === n ? 'border-gold bg-gold/8' : 'border-white/10 hover:border-white/20 bg-white/2'}`}>
                      <p className={`text-sm font-extrabold ${planMonths === n ? 'text-gold' : 'text-white'}`}>{n} month{n > 1 ? 's' : ''}</p>
                      <p className="text-white/35 text-xs mt-0.5">€{mo}/mo</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Checkout Form ───────────────────────────────────────────────────────
function CheckoutForm({ isFullPayment, planMonths }: { isFullPayment: boolean; planMonths: 1 | 2 }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const chargeToday = isFullPayment ? FULL_PRICE : DEPOSIT;
  function fmtCard(v: string) { return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout/create-workshop-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, isFullPayment, planMonths, cardNumber: cardNumber.replace(/\s/g, ''), cardExpMonth: expMonth, cardExpYear: expYear, cardCvc: cvc }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error || 'Payment failed. Please try again.'); return; }
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { setError('Something went wrong. Please try again or contact us.'); }
    finally { setSubmitting(false); }
  }

  if (success) {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-gold" />
        </div>
        <h3 className="text-2xl font-extrabold text-white mb-2">You&apos;re in! 🎉</h3>
        <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto mb-6">Check your email for your joining link. We can&apos;t wait to see you online.</p>
        <div className="space-y-1.5">
          <p className="text-gold font-bold text-sm">Phase 1 · Monday 18th May — 7:00pm</p>
          <p className="text-gold font-bold text-sm">Phase 2 · Saturday 23rd May — 11:00am</p>
          <p className="text-white/30 text-xs mt-2">Online · Join from anywhere</p>
        </div>
      </div>
    );
  }

  const inputCls = 'w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/18 text-sm focus:outline-none focus:border-gold/40 focus:bg-black/40 transition-all';
  const labelCls = 'block text-[10px] uppercase tracking-[0.18em] text-white/35 mb-1.5';

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>First Name</label><input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sarah" className={inputCls} /></div>
        <div><label className={labelCls}>Last Name</label><input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Murphy" className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@gmail.com" className={inputCls} /></div>
      <div><label className={labelCls}>Phone</label><input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+353 87 000 0000" className={inputCls} /></div>
      <div className="pt-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><CreditCard className="w-3.5 h-3.5 text-gold" /><span className="text-[10px] uppercase tracking-[0.18em] text-white/35">Card Details</span></div>
          <div className="flex items-center gap-1"><Lock className="w-3 h-3 text-white/20" /><span className="text-[10px] text-white/20">Secured by Stripe</span></div>
        </div>
        <label className={labelCls}>Card Number</label>
        <input type="text" inputMode="numeric" value={cardNumber} onChange={e => setCardNumber(fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className={`${inputCls} mb-3`} />
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Month</label><input type="text" inputMode="numeric" value={expMonth} onChange={e => setExpMonth(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="MM" maxLength={2} className={inputCls} /></div>
          <div><label className={labelCls}>Year</label><input type="text" inputMode="numeric" value={expYear} onChange={e => setExpYear(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="YYYY" maxLength={4} className={inputCls} /></div>
          <div><label className={labelCls}>CVC</label><input type="text" inputMode="numeric" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} className={inputCls} /></div>
        </div>
      </div>
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm leading-snug">{error}</p>
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-amber-400/75 bg-amber-500/5 border border-amber-500/12 rounded-xl px-3.5 py-3">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
        <span>Only {TOTAL_SPOTS - SPOTS_TAKEN} spots left — once they&apos;re gone, that&apos;s it.</span>
      </div>
      <button type="submit" disabled={submitting} className="w-full bg-gold text-charcoal-950 font-extrabold text-sm uppercase tracking-wide py-4 rounded-xl hover:bg-gold/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(212,168,54,0.3)] active:scale-[0.99]">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</> : <>Secure My Spot — €{chargeToday} Today<ArrowRight className="w-4 h-4" /></>}
      </button>
      <p className="text-center text-[11px] text-white/20 leading-relaxed">🔒 Payments processed securely via Stripe.<br />Your card details are never stored on our servers.</p>
    </form>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, heading, sub }: { eyebrow: string; heading: React.ReactNode; sub?: string }) {
  return (
    <FadeUp className="mb-10 sm:mb-12">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.05] tracking-tight">{heading}</h2>
      {sub && <p className="text-white/50 mt-4 text-base max-w-lg leading-relaxed">{sub}</p>}
    </FadeUp>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────
export default function AIForCoachesPage() {
  const [isFullPayment, setIsFullPayment] = useState(true);
  const [planMonths, setPlanMonths] = useState<1 | 2>(1);
  const [dynamicSpots, setDynamicSpots] = useState(TOTAL_SPOTS - SPOTS_TAKEN);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(PHASE_1_DATE);

  // After 3 minutes on page, drop spots by 1 (urgency psychology)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDynamicSpots(prev => Math.max(1, prev - 1));
    }, 3 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  function scrollToCheckout() {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-charcoal-950">

        {/* ── Desktop urgency banner ──────────────────────────────── */}
        <div className="hidden sm:flex w-full py-2.5 px-4 items-center justify-center gap-2.5 bg-black/60 border-b border-gold/15">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0" />
          <span className="text-gold/90 text-xs font-semibold tracking-wide">
            Ireland&apos;s first AI workshop built specifically for fitness coaches. May 2026. 20 places. That&apos;s it.
          </span>
        </div>

        {/* ── Hero — video background ─────────────────────────────── */}
        <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center overflow-hidden pt-16">
          {/* Video background */}
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/ai-workshop-hero.mp4" type="video/mp4" />
          </video>
          {/* Layered overlay — dark enough to read, light enough to feel energetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-black/30" />

          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10 py-20 sm:py-28">
            <FadeUp>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 mb-7 bg-white/8 border border-gold/20 rounded-full pl-2.5 pr-4 py-1.5 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold/90 font-bold">
                  Image Fitness Training × AIVA Consulting
                </span>
              </div>

              <h1 className="font-extrabold text-[clamp(2.6rem,8vw,5.5rem)] text-white leading-[0.95] tracking-tight mb-6 max-w-2xl">
                Stop Spending Your<br />
                <span className="text-gold">Sundays Writing Captions.</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-3 max-w-xl font-medium">
                Two evenings. Your own AI setup. A full week&apos;s content in 30 minutes.
              </p>
              <p className="text-sm sm:text-base text-white/50 leading-relaxed mb-9 max-w-lg">
                This is the workshop that&apos;s about to change how you run your fitness business — and nobody else in Ireland is offering it.
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
                {[
                  { icon: <Users className="w-3 h-3" />, text: `${dynamicSpots} Places Only` },
                  { icon: <Wifi className="w-3 h-3" />, text: 'Fully Online' },
                  { icon: <Clock className="w-3 h-3" />, text: 'Phase 1 + 2 · May 2026' },
                ].map((s) => (
                  <div key={s.text} className="flex items-center gap-1.5 bg-white/8 border border-white/12 rounded-full px-3 py-1.5 text-white/65 text-xs backdrop-blur-sm">
                    <span className="text-gold">{s.icon}</span>{s.text}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button onClick={scrollToCheckout} className="inline-flex items-center gap-2 bg-gold text-charcoal-950 font-extrabold text-sm uppercase tracking-wide px-8 py-4 rounded-xl hover:bg-gold/90 transition-all shadow-[0_0_40px_rgba(212,168,54,0.35)] active:scale-[0.98]">
                  I&apos;m In — Save My Spot <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-sm text-white/40">From <span className="text-white/60 font-semibold">€{DEPOSIT}</span> deposit · <span className="text-white/60 font-semibold">{dynamicSpots} places</span> only</p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Stats bar ───────────────────────────────────────────── */}
        <div className="border-y border-white/8 bg-black/40 backdrop-blur-sm">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 divide-x divide-white/6">
            {[
              { n: '30 min', l: 'to create a week of content' },
              { n: '5 min', l: 'to write a full programme' },
              { n: 'First', l: 'of its kind in Ireland' },
            ].map((s) => (
              <div key={s.n} className="text-center px-4">
                <p className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">{s.n}</p>
                <p className="text-white/35 text-[10px] sm:text-xs mt-1 leading-tight">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── The Problem (NEW) ───────────────────────────────────── */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[200px]" />
          </div>
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <FadeUp>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-4">Sound familiar?</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                  You&apos;re a brilliant coach.<br />
                  <span className="text-white/50">But you&apos;re drowning in the stuff that isn&apos;t coaching.</span>
                </h2>
                <div className="space-y-4 text-white/60 text-base leading-relaxed">
                  <p>You finished your last client at 7pm. Now you&apos;re sitting on the couch trying to think of something to post tomorrow. You&apos;ve got a half-written programme in a Google Doc you keep meaning to finish. Your website still says &quot;coming soon&quot; on the services page.</p>
                  <p>And somewhere in your inbox there&apos;s a lead you forgot to follow up with three days ago.</p>
                  <p className="text-white/80 font-semibold">What if that stuff took minutes instead of hours? What if you had a setup that handled the content, the admin, the marketing — and it actually sounded like you?</p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3">
                  <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
                  <p className="text-gold text-sm font-semibold">That&apos;s exactly what we&apos;re building in this workshop.</p>
                </div>
              </FadeUp>

              {/* Hero image */}
              <FadeUp delay={0.15}>
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                  <Image
                    src="/ai-for-coaches/transform-coaching.jpg"
                    alt="Transform Your Coaching Business with AI"
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  {/* Fallback gradient card if image not found */}
                  <div className="absolute inset-0 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-black flex flex-col items-center justify-center p-8">
                    <div className="w-20 h-20 rounded-3xl bg-gold/15 border border-gold/25 flex items-center justify-center mb-6">
                      <Bot className="w-10 h-10 text-gold" />
                    </div>
                    <p className="text-2xl font-extrabold text-white text-center mb-2">Transform Your Coaching Business</p>
                    <p className="text-gold font-bold text-xl">with AI.</p>
                    <p className="text-white/40 text-sm mt-4 text-center">Add the image to<br />/public/ai-for-coaches/transform-coaching.jpg</p>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── What We Cover ───────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#111] border-y border-white/5">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <SectionHeading
              eyebrow="What we cover"
              heading={<>Four problems.<br /><span className="text-gold">One workshop. All solved.</span></>}
              sub="We don't teach theory. We sit down together and fix the things that eat your week."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                {
                  icon: <MessageSquare className="w-4 h-4" />,
                  title: 'Your Content Game',
                  desc: "Staring at a blank screen after a full day of sessions is soul-destroying. We'll show you how to generate a full week of captions, carousels, and story ideas in under 30 minutes — and it'll sound like you wrote every word. Because the AI learns YOUR voice.",
                },
                {
                  icon: <FileText className="w-4 h-4" />,
                  title: 'Client Programmes & Check-Ins',
                  desc: "A 12-week programme from scratch? That used to be your entire Sunday. Now it takes minutes. We'll build it live in the workshop, then show you how to personalise it for any client in seconds.",
                },
                {
                  icon: <TrendingUp className="w-4 h-4" />,
                  title: 'Your Business & Marketing',
                  desc: "That email you keep meaning to write to past clients? The pricing page that's been 'in progress' for six months? We're doing all of it. Together. In the room. You'll leave with actual copy you can use the next morning.",
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  title: 'The Admin That Steals Your Evenings',
                  desc: "Onboarding new clients, answering the same five questions, sending session reminders — it adds up to hours every single week. We'll set up simple AI-powered flows that handle the repetitive stuff automatically.",
                },
              ].map((s, i) => (
                <FadeUp key={s.title} delay={i * 0.08}>
                  <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6 h-full hover:border-gold/15 transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/12 transition-colors">{s.icon}</div>
                    <h3 className="font-extrabold text-white text-base mb-2.5">{s.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Infographic image */}
            <FadeUp delay={0.2}>
              <div className="rounded-3xl overflow-hidden border border-gold/10 shadow-xl">
                <Image
                  src="/ai-for-coaches/4-things.jpg"
                  alt="4 Things Every Coach Deals With"
                  width={1100}
                  height={600}
                  className="w-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Two Phases ──────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <SectionHeading
              eyebrow="Two sessions. Two completely different nights."
              heading={<>One massive<br /><span className="text-gold">head start.</span></>}
            />

            <div className="max-w-2xl space-y-4 mb-10">
              {/* Phase 1 */}
              <FadeUp delay={0.1}>
                <div className="relative bg-[#0d0d0d] border border-gold/20 rounded-2xl p-6 overflow-hidden hover:border-gold/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[60px]" />
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-gold">1</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-extrabold text-white text-lg">Phase 1 — Quick Wins Night</p>
                        <span className="bg-gold/15 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Start here</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-3">
                        <span className="flex items-center gap-1.5 text-white/40 text-xs"><Clock className="w-3 h-3" />Monday 18th May · 7:00pm – 9:30pm</span>
                        <span className="flex items-center gap-1.5 text-white/40 text-xs"><Wifi className="w-3 h-3" />Online</span>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed">This is where you go from &quot;I&apos;ve heard of ChatGPT&quot; to &quot;I just made a week&apos;s worth of content in 20 minutes.&quot; We introduce the tools, get your hands dirty immediately, and you leave that night with real things already created. No slides. No lectures. Building from minute one.</p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Phase 2 */}
              <FadeUp delay={0.15}>
                <div className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-gold/15 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/4 rounded-full blur-[60px]" />
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/12 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-white/70">2</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-extrabold text-white text-lg">Phase 2 — The Big Build</p>
                        <span className="bg-white/8 text-white/60 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1"><Moon className="w-2.5 h-2.5" />Works while you sleep</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-3">
                        <span className="flex items-center gap-1.5 text-white/40 text-xs"><Clock className="w-3 h-3" />Saturday 23rd May · 11:00am – 2:00pm</span>
                        <span className="flex items-center gap-1.5 text-white/40 text-xs"><Wifi className="w-3 h-3" />Online</span>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed">This is the session people talk about. You build your own AI content generator and your own AI assistant — both trained on YOUR brand, YOUR voice, YOUR business. When you close your laptop on Saturday afternoon, you&apos;ve got tools that keep working for you at 6am before your first client, on the bus, at 11pm when you finally sit down. They don&apos;t clock off. Ever.</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Countdown + Spots */}
            <FadeUp delay={0.2} className="max-w-lg">
              <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 sm:p-6 mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">Phase 1 starts in</p>
                <div className="flex gap-3 sm:gap-4">
                  <CountUnit v={countdown.d} label="Days" />
                  <CountUnit v={countdown.h} label="Hrs" />
                  <CountUnit v={countdown.m} label="Min" />
                  <CountUnit v={countdown.s} label="Sec" />
                </div>
              </div>
              <SpotsBar spotsLeft={dynamicSpots} />
              <button onClick={scrollToCheckout} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-gold hover:text-gold/70 transition-colors">
                Secure my spot now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </FadeUp>
          </div>
        </section>

        {/* ── Meet Your Trainer (NEW) ─────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#111] border-y border-white/5">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <FadeUp className="mb-10 text-center max-w-2xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">Your Trainer</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                You&apos;re not learning from a YouTube tutorial.<br />
                <span className="text-gold">You&apos;re learning from someone who does this for a living.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="max-w-2xl mx-auto bg-[#0d0d0d] border border-gold/12 rounded-3xl p-7 sm:p-10">
                <div className="flex flex-col sm:flex-row gap-7 items-start">
                  {/* Photo placeholder */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-gold/25 relative">
                      <Image
                        src="/ai-for-coaches/sonia-madsen.jpg"
                        alt="Sonia Madsen - AIVA Consulting"
                        fill
                        className="object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-charcoal-800 flex items-center justify-center">
                        <span className="text-4xl">👩‍💼</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white mb-0.5">Sonia Madsen</h3>
                    <p className="text-gold text-sm font-semibold mb-4">Founder, AIVA Consulting</p>
                    <div className="space-y-3 text-white/55 text-sm leading-relaxed">
                      <p>Sonia helps Irish businesses cut through the AI noise and actually get results. She&apos;s not a tech guru who talks over your head — she&apos;s the person who sits down with real business owners and builds AI workflows that save them hours every single week.</p>
                      <p>She&apos;s worked with accountancy firms, recruitment companies, consultancies, and service-based businesses across Ireland — automating the repetitive work that drains their time and building AI systems that actually stick.</p>
                      <p className="text-white/70 font-medium">Her clients don&apos;t just learn about AI. They leave with setups that are still running months later. That&apos;s the promise for this workshop too.</p>
                    </div>
                    <div className="mt-5 flex items-start gap-2 bg-gold/8 border border-gold/15 rounded-xl px-4 py-3">
                      <Star className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-gold/90 text-xs font-medium leading-relaxed">&ldquo;We didn&apos;t build this workshop because AI is trendy. We built it because our coaches were spending more time on Instagram than on their clients.&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── AI Assistant Feature ─────────────────────────────────── */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gold/5 rounded-full blur-[200px]" />
          </div>
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10">
            <FadeUp className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">The Big Build</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[0.95] tracking-tight mb-5">
                You don&apos;t leave with &ldquo;notes.&rdquo;<br />
                <span className="text-gold">You leave with weapons.</span>
              </h2>
              <p className="text-white/45 text-base leading-relaxed">
                Everything you build in this workshop is yours to use the very next morning — on the bus, between sessions, at 11pm when you finally sit down. They don&apos;t clock off. Ever.
              </p>
            </FadeUp>

            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <FadeUp delay={0.1}>
                <div className="relative bg-[#0a0a0a] border border-gold/20 rounded-3xl p-7 overflow-hidden hover:border-gold/35 transition-all duration-300 h-full">
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-gold/8 rounded-full blur-[70px]" />
                  <div className="relative">
                    <div className="text-4xl mb-5">⚡</div>
                    <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-3 py-1 mb-4">
                      <Sparkles className="w-3 h-3 text-gold" />
                      <span className="text-gold text-[10px] font-bold uppercase tracking-widest">Content Generator</span>
                    </div>
                    <h4 className="font-extrabold text-white text-xl mb-3 leading-tight">Captions, emails, programmes — in seconds</h4>
                    <p className="text-white/45 text-sm leading-relaxed mb-6">Trained on your voice, your audience, your topics. Open it at 6am before your first session. Open it on the bus. It creates real content that sounds exactly like you — not a robot.</p>
                    <div className="space-y-2.5">
                      {['30 minutes → a full week of content', 'Sounds like you, not like AI', 'Works any time, from any device'].map((b) => (
                        <div key={b} className="flex items-center gap-2.5 text-sm text-white/50">
                          <CheckCircle className="w-3.5 h-3.5 text-gold flex-shrink-0" />{b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.18}>
                <div className="relative bg-[#0a0a0a] border border-white/8 rounded-3xl p-7 overflow-hidden hover:border-white/15 transition-all duration-300 h-full">
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/5 rounded-full blur-[70px]" />
                  <div className="relative">
                    <div className="text-4xl mb-5">🤖</div>
                    <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
                      <Moon className="w-3 h-3 text-white/40" />
                      <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Works 24 / 7</span>
                    </div>
                    <h4 className="font-extrabold text-white text-xl mb-3 leading-tight">Your own AI assistant that never clocks off</h4>
                    <p className="text-white/45 text-sm leading-relaxed mb-6">It knows your services, your pricing, your tone. It handles the questions that eat your evenings — even when you&apos;re not around. A team member on call around the clock, every day of the year.</p>
                    <div className="space-y-2.5">
                      {['Handles repetitive questions for you', 'Available at 2am if a client needs it', 'Built and ready before you leave Phase 2'].map((b) => (
                        <div key={b} className="flex items-center gap-2.5 text-sm text-white/50">
                          <CheckCircle className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />{b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Platform Carousel ───────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#111] border-y border-white/5">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <SectionHeading
              eyebrow="The Platforms"
              heading={<>The tools you&apos;ll use —<br /><span className="text-gold">explained simply.</span></>}
              sub="You don't need to know anything about these before you arrive. Here's what they are in plain English. Swipe through to explore each one."
            />
            <PlatformCarousel />
          </div>
        </section>

        {/* ── What You Leave With ─────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="max-w-lg">
              <SectionHeading
                eyebrow="What you leave with"
                heading={<>Use it the very<br /><span className="text-gold">next morning.</span></>}
                sub="Not just notes — actual tools and templates you can open the day after the workshop and start using immediately."
              />
              <FadeUp delay={0.1}>
                <div className="bg-[#0d0d0d] border border-gold/15 rounded-3xl p-7 sm:p-8">
                  <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6">
                    <Package className="w-4 h-4" />
                  </div>
                  <ul className="space-y-4">
                    {[
                      'Your own AI content generator — trained on your voice, your audience, your brand',
                      'Your own custom AI assistant — handles the questions that eat your evenings',
                      'A prompt pack — copy-paste templates for content, programmes, emails and more',
                      'A curated list of the best AI tools — free and paid — so you\'re not wasting time Googling',
                      "Clear do's and don'ts for keeping client data safe",
                      'Q&A access with Sonia and the AIVA team',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/55">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-white/6 flex items-center justify-between">
                    <p className="text-white/20 text-xs">Estimated tool value</p>
                    <p className="text-white/50 font-extrabold text-sm">€1,500+</p>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Who This Is For (NEW) ───────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#111] border-y border-white/5">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <FadeUp>
                <SectionHeading
                  eyebrow="Is this for you?"
                  heading={<>This is for you<br /><span className="text-gold">if…</span></>}
                />
                <div className="space-y-3">
                  {[
                    "You're a personal trainer, Pilates instructor, gym owner, or fitness coach",
                    "You've heard about AI but have no idea where to start",
                    "You spend more time on admin and content than actual coaching",
                    "You've tried ChatGPT but everything it writes sounds robotic",
                    "You want to get ahead before every other coach figures this out",
                    "You don't need to be 'techy' — if you can send a WhatsApp, you can do this",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-[#0d0d0d] border border-white/6 rounded-xl px-4 py-3.5 hover:border-gold/15 transition-colors">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-white/65 text-sm leading-snug">{item}</p>
                    </div>
                  ))}
                  <div className="mt-2 bg-gold/6 border border-gold/15 rounded-xl px-4 py-3.5">
                    <p className="text-gold/80 text-sm leading-relaxed">IFT graduates get priority, but any fitness professional or coach is welcome. If you work in the industry and you want the edge — this is it.</p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.12}>
                <div className="lg:pt-16">
                  <div className="bg-[#0d0d0d] border border-white/8 rounded-3xl p-7">
                    <Brain className="w-8 h-8 text-gold mb-4" />
                    <h3 className="text-xl font-extrabold text-white mb-3">What if I&apos;ve already used ChatGPT?</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">Good — then you already know the basics. But there&apos;s a massive difference between typing a question into ChatGPT and having a fully trained AI setup that creates content in your voice, handles your admin, and works while you sleep.</p>
                    <p className="text-white/70 text-sm font-semibold">That&apos;s what we build in Phase 2.</p>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Value Stack ─────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-10 max-w-2xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">Let&apos;s talk money</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                This pays for itself<br /><span className="text-gold">before the month is out.</span>
              </h2>
              <p className="text-white/45 text-base leading-relaxed">
                Hiring a freelancer for your socials? That&apos;s €500+ a month — and they still won&apos;t sound like you. Subscribing to all the AI tools yourself and figuring it out alone? That&apos;s €1,500+ a year and months of trial and error. This workshop is <span className="text-white font-bold">€300</span>. Everything included.
              </p>
            </FadeUp>

            {/* ROI image */}
            <FadeUp delay={0.1} className="mb-10">
              <div className="rounded-3xl overflow-hidden border border-gold/10 shadow-xl max-w-2xl mx-auto">
                <Image
                  src="/ai-for-coaches/roi-maths.jpg"
                  alt="ROI Maths — AI for Coaches Workshop"
                  width={900}
                  height={700}
                  className="w-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </FadeUp>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'What coaches spend on content alone', value: '€500+/mo', sub: 'Outsourcing captions, graphics and strategy to freelancers', colour: 'text-red-400', bg: 'bg-red-500/4 border-red-500/12' },
                { label: 'What the tools are worth per year', value: '€1,500+', sub: 'Subscriptions to ChatGPT, Gemini, Claude, NotebookLM and more', colour: 'text-amber-400', bg: 'bg-amber-500/4 border-amber-500/12' },
                { label: 'What you pay for everything', value: '€300', sub: 'Both sessions · your own AI setup · take-away pack · Q&A with Sonia', colour: 'text-gold', bg: 'bg-gold/4 border-gold/15' },
              ].map((item, i) => (
                <FadeUp key={item.label} delay={i * 0.1}>
                  <div className={`rounded-2xl border p-6 text-center h-full ${item.bg}`}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/35 mb-4 leading-snug">{item.label}</p>
                    <p className={`text-4xl sm:text-5xl font-extrabold mb-3 ${item.colour}`}>{item.value}</p>
                    <p className="text-white/35 text-xs leading-relaxed">{item.sub}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={0.3}>
              <p className="text-center text-white/25 text-sm mt-7 max-w-md mx-auto leading-relaxed">
                One new client you pick up because your content got sharper pays for this ten times over. And that&apos;s before we even count the hours you get back every single week.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#111] border-y border-white/5">
          <div className="max-w-[680px] mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Questions people ask</h2>
            </FadeUp>
            <div className="space-y-2.5">
              {[
                { q: 'Do I need to know anything about AI?', a: "Absolutely not. This workshop is built for people who've never touched these tools. If you can send a WhatsApp, you're more than qualified. We start from zero and you'll be creating content within the first 20 minutes." },
                { q: 'What do I need to take part?', a: "A laptop and a decent internet connection. That's it. If you've got a logo or some existing content, bring that too — we'll put it to work." },
                { q: 'Do I have to attend both sessions?', a: "Yes — and you'll want to. Phase 1 gets you going with quick wins. Phase 2 is where you build the AI setup that keeps working for you long after the workshop ends. They're designed as one programme and both are included in your booking." },
                { q: 'Is this only for IFT graduates?', a: "IFT graduates get priority access, but any fitness professional or coach is welcome. If you work in the industry and want to get ahead, you're in." },
                { q: "What if I've already used ChatGPT?", a: "Good — then you already know the basics. But there's a massive difference between typing a question into ChatGPT and having a fully trained AI setup that creates content in your voice, handles your admin, and works while you sleep. That's what we build in Phase 2." },
              ].map((faq, i) => (
                <FadeUp key={faq.q} delay={i * 0.06}>
                  <details className="group bg-[#0d0d0d] border border-white/7 rounded-2xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none gap-4">
                      <span className="font-semibold text-white text-sm leading-snug">{faq.q}</span>
                      <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                    </summary>
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-white/45 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Checkout ────────────────────────────────────────────── */}
        <section ref={checkoutRef} id="checkout" className="py-20 sm:py-28">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-500/8 border border-red-500/18 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                <span className="text-red-400 text-xs font-semibold">{dynamicSpots} spots left — {SPOTS_TAKEN} coaches already booked</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Lock In Your Spot</h2>
              <p className="text-white/35 mt-2 text-sm">Phase 1 + Phase 2 · Fully Online · May 2026 · Led by Sonia Madsen, AIVA Consulting</p>
            </FadeUp>

            <div className="max-w-3xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
              <FadeUp delay={0.1} className="space-y-5">
                <PaymentSelector isFullPayment={isFullPayment} planMonths={planMonths} onFullChange={setIsFullPayment} onMonthsChange={setPlanMonths} />
                <div className="bg-[#0d0d0d] border border-white/7 rounded-2xl p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-4">What&apos;s included</p>
                  <ul className="space-y-2.5">
                    {[
                      'Phase 1 — Mon 18th May, 7:00pm–9:30pm (online)',
                      'Phase 2 — Sat 23rd May, 11:00am–2:00pm (online)',
                      'Your own content generator (built on the night)',
                      'Your own custom AI assistant',
                      'Full take-away pack',
                      'Q&A with Sonia Madsen, AIVA Consulting',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs text-white/45">
                        <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
              <FadeUp delay={0.15}>
                <div className="bg-[#0d0d0d] border border-white/8 rounded-3xl p-6 sm:p-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6">Your Details</p>
                  <CheckoutForm isFullPayment={isFullPayment} planMonths={planMonths} />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────── */}
        <section className="relative py-20 sm:py-28 overflow-hidden text-center">
          {/* Background video for final CTA */}
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/ai-workshop-scene.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-black/85 to-black/90" />

          <div className="max-w-[640px] mx-auto px-4 sm:px-6 relative z-10">
            <FadeUp>
              <div className="flex items-center justify-center gap-2 mb-7">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">{dynamicSpots} spots left · {SPOTS_TAKEN} coaches already booked</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight leading-[1.05]">
                20 places. First time ever.<br />
                <span className="text-gold">You&apos;re either on this —</span><br />
                or you&apos;re watching from the sidelines.
              </h2>

              <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md mx-auto">
                The coaches who don&apos;t move now will spend the next year trying to figure this out alone. The ones who book today will already be ahead.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8 text-xs text-white/40">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold" />Both phases included</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold" />Your own AI assistant built</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold" />€1,500+ in tools covered</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold" />Led by Sonia Madsen, AIVA Consulting</span>
              </div>

              <button onClick={scrollToCheckout} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-charcoal-950 font-extrabold text-sm uppercase tracking-wide px-10 py-4 rounded-xl hover:bg-gold/90 transition-all shadow-[0_0_60px_rgba(212,168,54,0.35)] active:scale-[0.98]">
                Lock In My Spot Now <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-white/20 text-xs mt-3">From €{DEPOSIT} deposit today · {dynamicSpots} places only · Fully online · May 2026</p>
            </FadeUp>
          </div>
        </section>

      </main>

      {/* Mobile sticky CTA */}
      <MobileStickyBar spotsLeft={dynamicSpots} onCTA={scrollToCheckout} />

      <Footer />
    </>
  );
}
