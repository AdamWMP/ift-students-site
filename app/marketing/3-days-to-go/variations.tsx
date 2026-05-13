'use client'

import React from 'react'

export type Tweaks = {
  days: string
  gold: string
  ink: string
  eyebrow: string
  eyebrow2: string
  courseline: string
  headline: string
  cta: string
  tagline: string
  locations: string
}

export const TWEAK_DEFAULTS: Tweaks = {
  days: '1',
  gold: '#c9a84c',
  ink: '#000000',
  eyebrow: 'April Intake · 2026',
  eyebrow2: 'This is your moment',
  courseline: 'TOMORROW · PersonAL TRAINER & Mat Pilates Course Begins...',
  headline: 'Places almost full.',
  cta: 'Book Your Course Now - Start Tomorrow',
  tagline: 'Where Coaches Are Made',
  locations: '',
}

const Noise = ({ opacity = 0.08 }: { opacity?: number }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
      opacity,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>")`,
    }}
  />
)

const GoldGrad = ({ id, hi, mid, deep }: { id: string; hi: string; mid: string; deep: string }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={hi} />
      <stop offset="50%" stopColor={mid} />
      <stop offset="100%" stopColor={deep} />
    </linearGradient>
  </defs>
)

const IFTLogo = ({ size = 36 }: { size?: number; color?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/marketing/3-days-to-go/logo-ift.png"
    alt="Image Fitness Training"
    style={{ height: size * 2.2, display: 'block', objectFit: 'contain', width: '187px' }}
  />
)

function palette(gold: string) {
  const mix = (c1: string, c2: string, t: number) => {
    const p = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
    const [r1, g1, b1] = p(c1)
    const [r2, g2, b2] = p(c2)
    const h = (n: number) => Math.round(n).toString(16).padStart(2, '0')
    return '#' + h(r1 + (r2 - r1) * t) + h(g1 + (g2 - g1) * t) + h(b1 + (b2 - b1) * t)
  }
  return { GOLD: gold, GOLD_HI: mix(gold, '#ffffff', 0.45), GOLD_DEEP: mix(gold, '#000000', 0.55) }
}

export function Variation1({ t }: { t: Tweaks }) {
  const { GOLD, GOLD_HI, GOLD_DEEP } = palette(t.gold)
  const INK = t.ink
  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1080,
        background: INK,
        overflow: 'hidden',
        fontFamily: 'Montserrat, sans-serif',
        color: '#fff',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 30%, ${GOLD}39 0%, ${INK}00 55%)` }} />
      <div
        style={{
          position: 'absolute',
          left: -120,
          top: 180,
          width: 1400,
          height: 260,
          background: `linear-gradient(90deg, transparent 0%, ${GOLD_DEEP} 15%, ${GOLD} 50%, ${GOLD_HI} 70%, ${GOLD} 85%, transparent 100%)`,
          transform: 'rotate(-14deg)',
          opacity: 0.14,
          filter: 'blur(2px)',
        }}
      />
      <div style={{ position: 'absolute', top: 56, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, color: GOLD, textTransform: 'uppercase' }}>{t.eyebrow}</div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2.5,
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            fontFamily: 'ui-monospace, Menlo, monospace',
          }}
        >
          IFT/26/04 — {String(t.days).padStart(2, '0')}:DAYS
        </div>
      </div>
      <div style={{ position: 'absolute', left: 64, top: 180, width: 'calc(100% - 128px)' }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 8, color: '#fff', textTransform: 'uppercase', marginBottom: 8, opacity: 0.85 }}>Only</div>
        <div style={{ position: 'relative', height: 620, marginLeft: -20 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 60,
              fontSize: 820,
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'transparent',
              WebkitTextStroke: `2px ${GOLD_DEEP}`,
              lineHeight: 0.8,
              letterSpacing: -40,
              filter: 'blur(22px)',
              opacity: 0.8,
            }}
          >
            {t.days}
          </div>
          <svg width="720" height="620" viewBox="0 0 720 620" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <GoldGrad id="v1g" hi={GOLD_HI} mid={GOLD} deep={GOLD_DEEP} />
            <text x="0" y="520" fontFamily="Montserrat, sans-serif" fontSize="720" fontWeight="900" fontStyle="italic" fill="url(#v1g)" letterSpacing="-40">
              {t.days}
            </text>
            <text
              x="0"
              y="520"
              fontFamily="Montserrat, sans-serif"
              fontSize="720"
              fontWeight="900"
              fontStyle="italic"
              fill="none"
              stroke={GOLD_HI}
              strokeWidth="1.2"
              opacity="0.5"
              letterSpacing="-40"
            >
              {t.days}
            </text>
          </svg>
          <div style={{ position: 'absolute', left: 420, top: 240, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 110, fontWeight: 900, fontStyle: 'italic', color: '#fff', letterSpacing: -4, lineHeight: 0.95, textTransform: 'uppercase' }}>DAYS</div>
            <div style={{ fontSize: 110, fontWeight: 900, fontStyle: 'italic', color: GOLD, letterSpacing: -4, lineHeight: 0.95, textTransform: 'uppercase' }}>TO GO</div>
            <div style={{ width: 220, height: 4, background: GOLD, marginTop: 14 }} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 64, right: 64, bottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, color: GOLD, textTransform: 'uppercase', marginBottom: 14 }}>{t.courseline}</div>
            <div style={{ fontSize: 34, fontWeight: 800, fontStyle: 'italic', lineHeight: 1.02, letterSpacing: -0.6, textTransform: 'uppercase', color: '#fff', marginBottom: 6 }}>
              {t.headline}
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, fontStyle: 'italic', lineHeight: 1.02, letterSpacing: -0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
              {t.cta}
            </div>
          </div>
          <IFTLogo size={44} color={GOLD} />
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 24, border: `1px solid ${GOLD}`, opacity: 0.22, pointerEvents: 'none' }} />
      <Noise opacity={0.06} />
    </div>
  )
}

export function Variation2({ t }: { t: Tweaks }) {
  const { GOLD, GOLD_HI, GOLD_DEEP } = palette(t.gold)
  const INK = t.ink
  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1080,
        background: INK,
        overflow: 'hidden',
        fontFamily: 'Montserrat, sans-serif',
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, #1a1612 0 8px, #0f0d0a 8px 16px)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${INK}66 0%, ${INK}cc 55%, ${INK}ee 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -200,
          top: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GOLD} 0%, ${GOLD}33 40%, transparent 70%)`,
          opacity: 0.35,
          filter: 'blur(30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 44,
          background: 'rgba(0,0,0,0.55)',
          borderBottom: `1px solid ${GOLD}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          fontSize: 11,
          letterSpacing: 3,
          color: GOLD,
          textTransform: 'uppercase',
          fontFamily: 'ui-monospace, Menlo, monospace',
        }}
      >
        <span>◆ IFT Global · Intake 04.26</span>
        <span>{t.locations}</span>
      </div>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: -60,
          bottom: -180,
          fontSize: 1100,
          fontWeight: 900,
          fontStyle: 'italic',
          color: 'transparent',
          WebkitTextStroke: `2px ${GOLD}`,
          opacity: 0.16,
          lineHeight: 0.8,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {t.days}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 840,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 6,
            color: GOLD,
            textTransform: 'uppercase',
            marginBottom: 28,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ width: 40, height: 1, background: GOLD }} />
          {t.eyebrow2}
          <span style={{ width: 40, height: 1, background: GOLD }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 20 }}>
          <svg width="380" height="440" viewBox="0 0 380 440" style={{ overflow: 'visible' }}>
            <GoldGrad id="v2g" hi={GOLD_HI} mid={GOLD} deep={GOLD_DEEP} />
            <text
              x="0"
              y="360"
              fontFamily="Montserrat, sans-serif"
              fontSize="520"
              fontWeight="900"
              fontStyle="italic"
              fill="url(#v2g)"
              letterSpacing="-24"
              style={{ filter: `drop-shadow(0 20px 40px ${GOLD_DEEP}66)` }}
            >
              {t.days}
            </text>
            <text
              x="0"
              y="360"
              fontFamily="Montserrat, sans-serif"
              fontSize="520"
              fontWeight="900"
              fontStyle="italic"
              fill="none"
              stroke="#fff"
              strokeWidth="0.8"
              opacity="0.35"
              letterSpacing="-24"
            >
              {t.days}
            </text>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: 4 }}>
            <div style={{ fontSize: 80, fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: -2, color: '#fff', textTransform: 'uppercase' }}>DAYS</div>
            <div style={{ fontSize: 80, fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: -2, color: '#fff', textTransform: 'uppercase' }}>TO</div>
            <div style={{ fontSize: 80, fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: -2, color: GOLD, textTransform: 'uppercase' }}>START.</div>
          </div>
        </div>
        <div style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.35, color: 'rgba(255,255,255,0.82)', maxWidth: 680, marginTop: 8, marginBottom: 28 }}>
          The April intake for our <span style={{ color: GOLD, fontWeight: 700 }}>Personal Trainer</span> and{' '}
          <span style={{ color: GOLD, fontWeight: 700 }}>Pilates Instructor</span> courses opens Saturday.
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0,
            border: `1.5px solid ${GOLD}`,
            background: `${GOLD}14`,
            padding: '18px 28px',
            textTransform: 'uppercase',
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: 2,
            fontSize: 16,
            color: GOLD,
          }}
        >
          {t.cta}
          <span style={{ display: 'inline-block', marginLeft: 18, fontSize: 22 }}>→</span>
        </div>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginTop: 14,
            fontFamily: 'ui-monospace, Menlo, monospace',
          }}
        >
          Places almost full · Link in bio
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          background: GOLD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          color: INK,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 900, fontStyle: 'italic', letterSpacing: 1.5, textTransform: 'uppercase' }}>Image Fitness Training · Global</div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>{t.tagline}</div>
      </div>
      <Noise opacity={0.05} />
    </div>
  )
}

export function Variation3({ t }: { t: Tweaks }) {
  const { GOLD, GOLD_HI, GOLD_DEEP } = palette(t.gold)
  const INK = t.ink
  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1080,
        background: '#050403',
        overflow: 'hidden',
        fontFamily: 'Montserrat, sans-serif',
        color: '#fff',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${GOLD}2e 0%, #05040300 60%)` }} />
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <div
          key={pos}
          style={{
            position: 'absolute',
            ...(pos === 'tl' ? { top: 36, left: 36 } : {}),
            ...(pos === 'tr' ? { top: 36, right: 36 } : {}),
            ...(pos === 'bl' ? { bottom: 36, left: 36 } : {}),
            ...(pos === 'br' ? { bottom: 36, right: 36 } : {}),
            width: 40,
            height: 40,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 14,
              height: 1,
              background: GOLD,
              ...(pos.includes('r') ? { right: 0, left: 'auto' } : {}),
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1,
              height: 14,
              background: GOLD,
              ...(pos.includes('b') ? { bottom: 0, top: 'auto' } : {}),
              ...(pos.includes('r') ? { right: 0, left: 'auto' } : {}),
            }}
          />
        </div>
      ))}
      <div style={{ position: 'absolute', top: 80, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 6,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            fontFamily: 'ui-monospace, Menlo, monospace',
          }}
        >
          Admit One · April 26 Intake · Non-transferable
        </div>
        <IFTLogo size={40} color={GOLD} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 240,
          bottom: 240,
          background: `linear-gradient(155deg, ${GOLD_HI} 0%, ${GOLD} 35%, ${GOLD_DEEP} 75%, ${GOLD} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 40px 120px ${GOLD_DEEP}55, inset 0 0 0 1px ${GOLD_HI}, inset 0 2px 0 ${GOLD_HI}aa`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.28) 35%, transparent 55%, rgba(255,255,255,0.15) 70%, transparent 85%)`,
            mixBlendMode: 'screen',
          }}
        />
        <div style={{ position: 'absolute', left: -24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, background: '#050403', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: -24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, background: '#050403', borderRadius: '50%' }} />
        <div
          style={{
            height: 54,
            borderBottom: `1.5px dashed ${INK}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            color: INK,
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          <span>NO. 04·26</span>
          <span>⁘ PERSONAL TRAINER ⁘ PILATES INSTRUCTOR ⁘</span>
          <span>IFT·GLOBAL</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', color: INK, zIndex: 2 }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>Countdown</div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 6 }}>
              <svg width="320" height="340" viewBox="0 0 320 340" style={{ overflow: 'visible' }}>
                <text
                  x="0"
                  y="290"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="420"
                  fontWeight="900"
                  fontStyle="italic"
                  fill={INK}
                  letterSpacing="-18"
                  style={{ filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.15))' }}
                >
                  {t.days}
                </text>
                <text
                  x="0"
                  y="290"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="420"
                  fontWeight="900"
                  fontStyle="italic"
                  fill="none"
                  stroke={GOLD_HI}
                  strokeWidth="1.5"
                  opacity="0.8"
                  letterSpacing="-18"
                >
                  {t.days}
                </text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                <div style={{ fontSize: 64, fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: -1.6, textTransform: 'uppercase' }}>DAYS</div>
                <div style={{ fontSize: 64, fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: -1.6, textTransform: 'uppercase' }}>TO</div>
                <div style={{ fontSize: 64, fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: -1.6, textTransform: 'uppercase' }}>GO.</div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            height: 54,
            borderTop: `1.5px dashed ${INK}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            color: INK,
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          <span>Starts · Sat 25·04</span>
          <span>Places almost full</span>
          <span>Link in bio ↗</span>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 72, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 34, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: -0.6, color: '#fff', lineHeight: 1 }}>{t.cta}</div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, color: GOLD, textTransform: 'uppercase' }}>{t.tagline}</div>
      </div>
      <Noise opacity={0.04} />
    </div>
  )
}
