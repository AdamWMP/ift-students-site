'use client';

// Interactive receipts table — selection, bulk actions, per-row actions.
// Used inside the (server) admin page so we keep server-side data fetch
// while getting client-side interactivity.

import Link from 'next/link';
import { useState, useTransition } from 'react';

export interface ReceiptRow {
  receiptNo: string;
  contactId: string;
  brand: 'ift' | 'pilates';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  packageName: string;
  location: string;
  intakeDate: string;
  paidToday: number;
  courseTotal: number;
  remainingBalance: number;
  monthlyAmount: number;
  months: number;
  isFullPayment: boolean;
  modifiedAtIso: string;
}

interface Props {
  rows: ReceiptRow[];
  emptyMessage?: string;
}

export default function ReceiptsTable({ rows, emptyMessage }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0;

  function toggleOne(receiptNo: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(receiptNo)) next.delete(receiptNo);
      else next.add(receiptNo);
      return next;
    });
  }
  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.receiptNo)));
  }

  async function emailReceipts(receiptNos: string[]) {
    if (!receiptNos.length) return;
    const labels = receiptNos.length === 1 ? '1 receipt' : `${receiptNos.length} receipts`;
    if (!confirm(`Email ${labels} to the customer${receiptNos.length > 1 ? 's' : ''}?`)) return;
    setFeedback(`Sending ${labels}…`);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/receipts/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiptNos }),
        });
        const json = (await res.json().catch(() => null)) as
          | { sent: number; total: number; results: Array<{ receiptNo: string; ok: boolean; email?: string; error?: string }> }
          | null;
        if (!res.ok || !json) {
          setFeedback(`❌ Send failed (HTTP ${res.status})`);
          return;
        }
        const fails = json.results.filter((r) => !r.ok);
        if (fails.length === 0) {
          setFeedback(`✅ Sent ${json.sent}/${json.total}`);
          setSelected(new Set());
        } else {
          setFeedback(`⚠ Sent ${json.sent}/${json.total} — ${fails.length} failed: ${fails.map((f) => f.receiptNo).join(', ')}`);
        }
      } catch (e) {
        setFeedback(`❌ Send failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    });
  }

  function downloadReceipts(receiptNos: string[]) {
    receiptNos.forEach((rn) => {
      const a = document.createElement('a');
      a.href = `/api/admin/receipts/${encodeURIComponent(rn)}/download`;
      a.download = `${rn}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  const selectedList = Array.from(selected);

  return (
    <>
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#1f1f1f' }}>
              <Th style={{ width: 36, textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer', accentColor: '#D4A836', width: 16, height: 16 }}
                  aria-label="Select all"
                />
              </Th>
              <Th>Last modified</Th>
              <Th>Receipt No.</Th>
              <Th>Student</Th>
              <Th>Package</Th>
              <Th align="right">Paid Today</Th>
              <Th align="right">Remaining</Th>
              <Th align="center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#a9a9a9' }}>
                  {emptyMessage || 'No bookings found.'}
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const isSel = selected.has(r.receiptNo);
              const modifiedAt = new Date(r.modifiedAtIso);
              return (
                <tr key={r.receiptNo} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: isSel ? 'rgba(212,168,54,0.04)' : 'transparent' }}>
                  <Td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleOne(r.receiptNo)}
                      style={{ cursor: 'pointer', accentColor: '#D4A836', width: 16, height: 16 }}
                      aria-label={`Select ${r.receiptNo}`}
                    />
                  </Td>
                  <Td>
                    <div style={{ color: '#f5f5f5' }}>{modifiedAt.toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div style={{ color: '#888', fontSize: 11 }}>{modifiedAt.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</div>
                  </Td>
                  <Td>
                    <code style={{ color: '#D4A836', fontWeight: 600, fontSize: 12 }}>{r.receiptNo}</code>
                    {r.brand === 'pilates' && (
                      <span style={{ marginLeft: 8, fontSize: 10, padding: '1px 6px', background: 'rgba(184,146,46,0.15)', color: '#E5A4A4', borderRadius: 99, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>Pilates</span>
                    )}
                  </Td>
                  <Td>
                    <div style={{ color: '#f5f5f5', fontWeight: 600 }}>{r.firstName} {r.lastName}</div>
                    <div style={{ color: '#a9a9a9', fontSize: 11 }}>{r.email}</div>
                    <div style={{ color: '#888', fontSize: 11 }}>#{r.contactId}</div>
                  </Td>
                  <Td>
                    <div style={{ color: '#f5f5f5' }}>{r.packageName}</div>
                    <div style={{ color: '#888', fontSize: 11 }}>{r.location} · {r.intakeDate}</div>
                  </Td>
                  <Td align="right">
                    <div style={{ color: '#D4A836', fontWeight: 700 }}>€{r.paidToday.toLocaleString('en-IE', { minimumFractionDigits: 2 })}</div>
                    <div style={{ color: '#888', fontSize: 11 }}>
                      {r.isFullPayment ? 'paid in full' : `deposit · €${r.monthlyAmount}/mo × ${r.months}`}
                    </div>
                  </Td>
                  <Td align="right">
                    <span style={{ color: r.remainingBalance > 0 ? '#f5f5f5' : '#666' }}>€{r.remainingBalance.toLocaleString('en-IE', { minimumFractionDigits: 2 })}</span>
                  </Td>
                  <Td align="center">
                    <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Link
                        href={`/admin/receipts/${encodeURIComponent(r.receiptNo)}`}
                        title="View receipt"
                        style={btnSmStyle('ghost')}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        title={`Email to ${r.email}`}
                        onClick={() => emailReceipts([r.receiptNo])}
                        disabled={busy}
                        style={btnSmStyle('email')}
                      >
                        📧 Email
                      </button>
                      <button
                        type="button"
                        title="Download as .html"
                        onClick={() => downloadReceipts([r.receiptNo])}
                        style={btnSmStyle('ghost')}
                      >
                        ⬇ Download
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sticky bulk-action toolbar — appears when ≥1 row is selected */}
      {someSelected && (
        <div
          style={{
            position: 'fixed',
            bottom: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#161616',
            border: '1px solid rgba(212,168,54,0.30)',
            borderRadius: 999,
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
            padding: '12px 16px 12px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            zIndex: 50,
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          <span style={{ fontSize: 13, color: '#f5f5f5', fontWeight: 600 }}>
            {selected.size} selected
          </span>
          <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.10)' }} />
          <button
            type="button"
            onClick={() => emailReceipts(selectedList)}
            disabled={busy}
            style={btnLgStyle('gold')}
          >
            📧 Email customers
          </button>
          <button
            type="button"
            onClick={() => downloadReceipts(selectedList)}
            style={btnLgStyle('ghost')}
          >
            ⬇ Download all
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            style={{ background: 'transparent', border: 0, color: '#a9a9a9', fontSize: 12, padding: 6, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Clear
          </button>
        </div>
      )}

      {feedback && (
        <div
          style={{
            position: 'fixed',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#161616',
            border: '1px solid rgba(212,168,54,0.35)',
            color: '#f5f5f5',
            borderRadius: 999,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 600,
            zIndex: 60,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            maxWidth: 'calc(100vw - 40px)',
          }}
        >
          {feedback}
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ marginLeft: 12, background: 'transparent', border: 0, color: '#a9a9a9', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

function Th({ children, align = 'left', style }: { children?: React.ReactNode; align?: 'left' | 'right' | 'center'; style?: React.CSSProperties }) {
  return (
    <th style={{ padding: '12px 14px', textAlign: align, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a9a9a9', fontWeight: 700, ...style }}>
      {children}
    </th>
  );
}
function Td({ children, align = 'left', style }: { children?: React.ReactNode; align?: 'left' | 'right' | 'center'; style?: React.CSSProperties }) {
  return <td style={{ padding: '12px 14px', textAlign: align, verticalAlign: 'top', ...style }}>{children}</td>;
}

function btnSmStyle(variant: 'gold' | 'ghost' | 'email'): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 10px',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    border: 0,
    whiteSpace: 'nowrap',
  };
  if (variant === 'gold') return { ...base, background: '#D4A836', color: '#000' };
  if (variant === 'email') return { ...base, background: 'rgba(212,168,54,0.10)', color: '#D4A836', border: '1px solid rgba(212,168,54,0.30)' };
  return { ...base, background: 'transparent', color: '#f5f5f5', border: '1px solid rgba(255,255,255,0.14)' };
}
function btnLgStyle(variant: 'gold' | 'ghost'): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
    border: 0,
  };
  if (variant === 'gold') return { ...base, background: '#D4A836', color: '#000' };
  return { ...base, background: 'transparent', color: '#f5f5f5', border: '1px solid rgba(255,255,255,0.18)' };
}
