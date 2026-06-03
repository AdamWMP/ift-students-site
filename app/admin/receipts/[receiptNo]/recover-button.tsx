'use client';

import { useState } from 'react';

export default function RecoverButton({ contactId }: { contactId: string }) {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function fire() {
    if (!confirm(
      `Re-fire ALL notifications for contact #${contactId}?\n\n` +
      `• Email receipt → customer\n` +
      `• Slack #sales notification\n` +
      `• WhatsApp confirmation (if configured)\n\n` +
      `Safe to run multiple times.`
    )) return;
    setBusy(true);
    setFeedback('Firing…');
    try {
      const res = await fetch('/api/admin/recover-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback(`❌ Failed: ${json?.error || res.statusText}`);
      } else {
        const r = json.result || {};
        const e = r.email_send as { ok?: boolean; error?: string } | undefined;
        const s = r.slack as { ok?: boolean; reason?: string } | undefined;
        const parts = [
          `Receipt email: ${e?.ok ? '✅' : `❌ ${e?.error?.slice(0, 80) || '?'}`}`,
          `Slack: ${s?.ok ? '✅' : `❌ ${s?.reason || '?'}`}`,
        ];
        setFeedback(`✅ Recovery complete — ${parts.join(' · ')}`);
      }
    } catch (e) {
      setFeedback(`❌ ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <button
        type="button"
        onClick={fire}
        disabled={busy}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 10,
          background: '#E5443D',
          color: '#fff',
          border: 0,
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          cursor: busy ? 'wait' : 'pointer',
          opacity: busy ? 0.6 : 1,
          fontFamily: 'inherit',
        }}
      >
        🛟 Re-fire All Notifications
      </button>
      <p style={{ fontSize: 11, color: '#888', margin: 0, lineHeight: 1.6 }}>
        Fires receipt email, Slack #sales, and WhatsApp confirmation. Use when the
        original checkout silently failed to notify (like Amy Farrell #108224 on
        2026-05-29 via pilatescheckout.imageft.ie).
      </p>
      {feedback && (
        <div
          style={{
            fontSize: 12,
            padding: '10px 12px',
            borderRadius: 8,
            background: feedback.startsWith('✅') ? 'rgba(123,167,116,0.10)' : feedback.startsWith('❌') ? 'rgba(229,68,61,0.10)' : 'rgba(212,168,54,0.10)',
            color: feedback.startsWith('✅') ? '#9CD095' : feedback.startsWith('❌') ? '#FF8B85' : '#D4A836',
            border: `1px solid ${feedback.startsWith('✅') ? 'rgba(123,167,116,0.30)' : feedback.startsWith('❌') ? 'rgba(229,68,61,0.30)' : 'rgba(212,168,54,0.30)'}`,
            lineHeight: 1.5,
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
