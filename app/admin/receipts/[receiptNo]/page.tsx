// Admin receipt detail — fetches the contact from Ontraport, renders
// the receipt HTML on-demand, and shows the metadata sidebar.
// No DB lookup, no stored snapshot — Ontraport IS the source of truth.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { contactIdFromReceiptNo, getReceiptByContactId } from '@/lib/receipts/from-ontraport';
import { renderReceiptHtml } from '@/lib/receipts/render';
import RecoverButton from './recover-button';

export const dynamic = 'force-dynamic';

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ receiptNo: string }>;
}) {
  const { receiptNo } = await params;
  const decoded = decodeURIComponent(receiptNo);
  const contactId = contactIdFromReceiptNo(decoded);

  if (!contactId) {
    return errorPanel({
      heading: 'Unrecognised receipt number',
      body: `"${decoded}" doesn't match the IFT-YYYY-{contactId} format.`,
    });
  }

  let receiptInput: Awaited<ReturnType<typeof getReceiptByContactId>> = null;
  let fetchError: string | null = null;
  try {
    receiptInput = await getReceiptByContactId(contactId);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  if (fetchError) {
    return errorPanel({
      heading: `Couldn't fetch contact #${contactId} from Ontraport`,
      body: 'Booking + payment likely succeeded — check Slack #sales or the contact directly in Ontraport.',
      detail: fetchError,
    });
  }
  if (!receiptInput) notFound();

  const html = renderReceiptHtml(receiptInput);
  const remaining = Math.max(0, receiptInput.courseTotal - receiptInput.paidToday);

  return (
    <main style={{ background: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>{`
        @media (max-width: 880px) {
          .receipt-grid { grid-template-columns: 1fr !important; }
          .receipt-iframe { min-height: 800px !important; }
          .receipt-container { padding: 16px 14px 80px !important; }
          .receipt-h1 { font-size: 26px !important; }
        }
      `}</style>
      <div className="receipt-container" style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 24px 80px' }}>

        <header style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Link href="/admin/receipts" style={{ color: '#D4A836', textDecoration: 'none', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>
              ← Back to all receipts
            </Link>
            <h1 className="receipt-h1" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 34, fontWeight: 600, margin: '12px 0 4px' }}>
              {receiptInput.firstName} {receiptInput.lastName}
            </h1>
            <p style={{ color: '#a9a9a9', fontSize: 13, margin: 0 }}>
              <code style={{ color: '#D4A836', fontSize: 13 }}>{receiptInput.receiptNo}</code>
              {' · '}
              <span>Issued {receiptInput.issuedDate}</span>
              {' · '}
              <a
                href={`https://app.ontraport.com/#!/contact/edit&id=${contactId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#D4A836', textDecoration: 'none' }}
              >
                Open in Ontraport ↗
              </a>
            </p>
          </div>
        </header>

        <div className="receipt-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 22, alignItems: 'flex-start' }}>

          <section style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.18em', color: '#D4A836', textTransform: 'uppercase', fontWeight: 700 }}>
                Receipt · rendered live from Ontraport data
              </span>
              <span style={{ fontSize: 11, color: '#888' }}>{html.length.toLocaleString()} bytes</span>
            </div>
            <iframe className="receipt-iframe" srcDoc={html} sandbox=""
              style={{ width: '100%', minHeight: 1100, border: 'none', background: '#efece6', display: 'block' }}
              title={`Receipt ${receiptInput.receiptNo}`}
            />
          </section>

          <aside style={{ display: 'grid', gap: 14 }}>
            <Card title="Recovery">
              <RecoverButton contactId={String(receiptInput.contactId)} />
            </Card>
            <Card title="Student">
              <Field label="Student no.">#{receiptInput.contactId}</Field>
              <Field label="Email"><span style={{ wordBreak: 'break-word' }}>{receiptInput.email}</span></Field>
              <Field label="Phone">{receiptInput.phone}</Field>
              <Field label="Brand">{receiptInput.brand === 'pilates' ? 'Image Pilates' : 'Image Fitness Training'}</Field>
            </Card>

            <Card title="Course">
              <Field label="Package">{receiptInput.packageName}</Field>
              <Field label="Intake">{receiptInput.intakeDate}</Field>
              <Field label="Location">{receiptInput.location}</Field>
              <Field label="Schedule">{receiptInput.schedule}</Field>
            </Card>

            <Card title="Payment">
              <Field label="Course total">€{receiptInput.courseTotal.toLocaleString('en-IE', { minimumFractionDigits: 2 })}</Field>
              <Field label="Paid today">€{receiptInput.paidToday.toLocaleString('en-IE', { minimumFractionDigits: 2 })}{receiptInput.isFullPayment ? ' (in full)' : ' (deposit)'}</Field>
              <Field label="Remaining">€{remaining.toLocaleString('en-IE', { minimumFractionDigits: 2 })}</Field>
              {!receiptInput.isFullPayment && (
                <>
                  <Field label="Plan">€{receiptInput.monthlyAmount}/mo × {receiptInput.months}</Field>
                  <Field label="First instalment">{receiptInput.firstInstalment || '—'}</Field>
                </>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function errorPanel({ heading, body, detail }: { heading: string; body: string; detail?: string }) {
  return (
    <main style={{ background: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 560, background: '#161616', border: '1px solid rgba(229,164,54,0.30)', borderRadius: 22, padding: '36px 32px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', color: '#E5A436', textTransform: 'uppercase', fontWeight: 700, margin: 0, marginBottom: 8 }}>Receipt unavailable</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 30, fontWeight: 600, lineHeight: 1.2, margin: 0, marginBottom: 12 }}>{heading}</h1>
        <p style={{ color: '#a9a9a9', fontSize: 14, lineHeight: 1.65, margin: 0, marginBottom: 18 }}>{body}</p>
        <Link href="/admin/receipts" style={{ display: 'inline-block', padding: '12px 22px', borderRadius: 999, background: '#D4A836', color: '#000', fontWeight: 800, fontSize: 12, letterSpacing: '0.10em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Back to list
        </Link>
        {detail && (
          <details style={{ marginTop: 18, fontSize: 11, color: '#666' }}>
            <summary style={{ cursor: 'pointer', color: '#a9a9a9' }}>Show error detail</summary>
            <pre style={{ marginTop: 8, padding: 10, background: '#0a0a0a', borderRadius: 8, overflow: 'auto', color: '#FF8B85', fontSize: 11, lineHeight: 1.5 }}>{detail}</pre>
          </details>
        )}
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 18 }}>
      <p style={{ margin: 0, fontSize: 10, letterSpacing: '0.18em', color: '#D4A836', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>{title}</p>
      <div style={{ display: 'grid', gap: 10 }}>{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12, alignItems: 'baseline', fontSize: 13 }}>
      <span style={{ color: '#888', fontSize: 11, letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ color: '#f5f5f5' }}>{children}</span>
    </div>
  );
}
