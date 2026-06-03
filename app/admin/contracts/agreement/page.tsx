// The T&C contract students sign during onboarding — read-only, so it can be
// re-read at any time. Gated by middleware (/admin/*). Same text as
// /terms and the onboarding contract step (source: lib/contract-sections.ts).

import { CONTRACT_SECTIONS, CONTRACT_LAST_UPDATED } from '@/lib/contract-sections';

export const dynamic = 'force-dynamic';

export default function ContractAgreementPage() {
  return (
    <main style={{ background: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>{`a.adminlink{color:#D4A836;text-decoration:none}a.adminlink:hover{text-decoration:underline}`}</style>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 22px 90px' }}>
        <div style={{ marginBottom: 18 }}>
          <a className="adminlink" href="/admin/contracts">← Back to signed contracts</a>
        </div>
        <header style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#D4A836' }}>
            Image Fitness Training
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: '4px 0 0' }}>Terms &amp; Conditions Contract</h1>
          <p style={{ color: '#9a9a9a', margin: '8px 0 0', fontSize: 14 }}>Last updated: {CONTRACT_LAST_UPDATED}</p>
        </header>

        <p style={{ color: '#c9c9c9', lineHeight: 1.6, margin: '20px 0 24px', fontSize: 15 }}>
          These terms and conditions govern your enrollment in and participation in courses offered by Image
          Fitness Training. By signing, you agree to be bound by these terms.
        </p>

        {CONTRACT_SECTIONS.map((section) => (
          <section key={section.title} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#D4A836', margin: '0 0 10px' }}>{section.title}</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: '#cfcfcf', lineHeight: 1.55, marginBottom: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: '#D4A836', marginTop: 8, flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
