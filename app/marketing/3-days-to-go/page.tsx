'use client'

import React from 'react'
import { Variation1, Variation2, Variation3, TWEAK_DEFAULTS, Tweaks } from './variations'

const ARTBOARDS = [
  { id: 'hero', label: "01 · Hero '3'", Component: Variation1 },
  { id: 'moment', label: '02 · This Is Your Moment', Component: Variation2 },
  { id: 'ticket', label: '03 · Gold Foil Ticket', Component: Variation3 },
] as const

export default function ThreeDaysToGoPage() {
  const [t, setT] = React.useState<Tweaks>(TWEAK_DEFAULTS)
  const [scale, setScale] = React.useState(0.5)

  const set = (k: keyof Tweaks) => (e: React.ChangeEvent<HTMLInputElement>) => setT({ ...t, [k]: e.target.value })

  return (
    <div style={{ minHeight: '100vh', background: '#f0eee9', padding: '40px 320px 40px 40px', fontFamily: 'Montserrat, sans-serif' }}>
      <header style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#8a7340', marginBottom: 6 }}>
          IFT · Campaign Graphics
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, fontStyle: 'italic', letterSpacing: -0.6, color: '#0f0d0a' }}>
          3 Days To Go · April Intake
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#555', letterSpacing: 0.3 }}>1080×1080 · Gold on black · Montserrat italic</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {ARTBOARDS.map(({ id, label, Component }) => (
          <section key={id}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#0f0d0a', marginBottom: 12 }}>{label}</div>
            <div
              style={{
                width: 1080 * scale,
                height: 1080 * scale,
                overflow: 'hidden',
                background: '#0f0d0a',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 1080, height: 1080 }}>
                <Component t={t} />
              </div>
            </div>
          </section>
        ))}
      </div>

      <aside
        style={{
          position: 'fixed',
          right: 20,
          top: 20,
          zIndex: 200,
          width: 280,
          maxHeight: 'calc(100vh - 40px)',
          overflow: 'auto',
          background: '#0f0d0a',
          color: '#f1e9d4',
          border: '1px solid #c9a84c55',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          fontSize: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            padding: '14px 16px',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#c9a84c',
            borderBottom: '1px solid #c9a84c33',
          }}
        >
          Tweaks
        </h3>
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="Days">
              <input type="text" value={t.days} onChange={set('days')} style={inputStyle} />
            </Field>
            <Field label="Gold">
              <input type="color" value={t.gold} onChange={set('gold')} style={colorStyle} />
            </Field>
            <Field label="Ink">
              <input type="color" value={t.ink} onChange={set('ink')} style={colorStyle} />
            </Field>
          </div>
          <Field label="Eyebrow (v1)">
            <input type="text" value={t.eyebrow} onChange={set('eyebrow')} style={inputStyle} />
          </Field>
          <Field label="Eyebrow (v2)">
            <input type="text" value={t.eyebrow2} onChange={set('eyebrow2')} style={inputStyle} />
          </Field>
          <Field label="Course line (v1)">
            <input type="text" value={t.courseline} onChange={set('courseline')} style={inputStyle} />
          </Field>
          <Field label="Headline (v1)">
            <input type="text" value={t.headline} onChange={set('headline')} style={inputStyle} />
          </Field>
          <Field label="CTA">
            <input type="text" value={t.cta} onChange={set('cta')} style={inputStyle} />
          </Field>
          <Field label="Tagline">
            <input type="text" value={t.tagline} onChange={set('tagline')} style={inputStyle} />
          </Field>
          <Field label="Locations (v2)">
            <input type="text" value={t.locations} onChange={set('locations')} style={inputStyle} />
          </Field>
          <Field label={`Preview scale · ${Math.round(scale * 100)}%`}>
            <input type="range" min={0.25} max={1} step={0.05} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </Field>
        </div>
      </aside>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#1c1813',
  border: '1px solid #c9a84c33',
  color: '#f1e9d4',
  padding: '8px 10px',
  fontFamily: 'inherit',
  fontSize: 12,
  outline: 'none',
  borderRadius: 0,
  width: '100%',
  boxSizing: 'border-box',
}

const colorStyle: React.CSSProperties = {
  width: '100%',
  height: 34,
  border: '1px solid #c9a84c33',
  background: '#1c1813',
  padding: 2,
  cursor: 'pointer',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
      <label style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase', color: '#c9a84ccc' }}>{label}</label>
      {children}
    </div>
  )
}
