// Admin-only billing history.
// Source of truth = Ontraport. Every paid booking surfaces here because
// f2604 (Deposit Amount) is populated by the checkout flow. No DB needed.
// Selection / email / download interactivity lives in the client table.

import { listRecentReceipts } from '@/lib/receipts/from-ontraport';
import ReceiptsTable, { type ReceiptRow } from './receipts-table';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchParams {
  q?: string;
  brand?: 'ift' | 'pilates';
  limit?: string;
}

export default async function AdminReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q || '').trim();
  const limit = Math.min(Number(params.limit) || 50, 100);

  let receipts: Awaited<ReturnType<typeof listRecentReceipts>> = [];
  let queryError: string | null = null;
  try {
    receipts = await listRecentReceipts({
      search: q || undefined,
      brand: params.brand,
      limit,
    });
  } catch (e) {
    queryError = e instanceof Error ? e.message : String(e);
  }

  const totalPaid = receipts.reduce((sum, r) => sum + (r.paidToday || 0), 0);
  const totalRemaining = receipts.reduce((sum, r) => sum + (r.remainingBalance || 0), 0);

  return (
    <main style={{ background: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>{`
        @media (max-width: 720px) {
          .admin-header { flex-direction: column !important; align-items: flex-start !important; }
          .admin-stats { width: 100%; justify-content: space-between !important; gap: 12px !important; }
          .admin-stats > div { text-align: left !important; }
          .admin-search { flex-direction: column !important; }
          .admin-search > * { width: 100% !important; }
          .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .admin-table-wrap table { min-width: 720px; }
          .admin-h1 { font-size: 30px !important; }
          .admin-container { padding: 20px 14px 100px !important; }
        }
      `}</style>
      <div className="admin-container" style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 24px 80px' }}>
        <header className="admin-header" style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', color: '#D4A836', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
              IFT Admin · Billing History
            </p>
            <h1 className="admin-h1" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 40, fontWeight: 600, lineHeight: 1.1, margin: 0 }}>
              Recent bookings
            </h1>
            <p style={{ color: '#a9a9a9', fontSize: 14, marginTop: 6 }}>
              Sourced live from Ontraport · {receipts.length} of newest {limit}. Receipts sent from <a style={{ color: '#D4A836', textDecoration: 'none' }} href="mailto:education@imageft.ie">education@imageft.ie</a>.
            </p>
            <p style={{ color: '#a9a9a9', fontSize: 14, marginTop: 4 }}>
              <a style={{ color: '#D4A836', textDecoration: 'none' }} href="/admin/contracts">Signed contracts →</a>
            </p>
          </div>
          <div className="admin-stats" style={{ display: 'flex', gap: 18 }}>
            <Stat label="Paid today (page)" value={`€${totalPaid.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`} />
            <Stat label="Outstanding (page)" value={`€${totalRemaining.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`} />
          </div>
        </header>

        <form action="/admin/receipts" method="get" className="admin-search" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <input type="text" name="q" defaultValue={q} placeholder="Search by name, email, student no., receipt no., phone…"
            style={{ flex: 1, minWidth: 240, padding: '10px 14px', borderRadius: 10, border: '1px solid #27272a', background: '#0f0f0f', color: '#f5f5f5', fontSize: 14 }} />
          <select name="brand" defaultValue={params.brand || ''}
            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #27272a', background: '#0f0f0f', color: '#f5f5f5', fontSize: 14 }}>
            <option value="">All brands</option>
            <option value="ift">IFT</option>
            <option value="pilates">Pilates</option>
          </select>
          <button type="submit"
            style={{ padding: '10px 22px', borderRadius: 10, background: '#D4A836', color: '#000', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Search
          </button>
          {(q || params.brand) && (
            <a href="/admin/receipts"
              style={{ padding: '10px 22px', borderRadius: 10, background: 'transparent', color: '#f5f5f5', textDecoration: 'none', fontWeight: 600, fontSize: 13, border: '1px solid rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Clear
            </a>
          )}
        </form>

        {queryError && (
          <div style={{ background: 'rgba(229,68,61,0.10)', border: '1px solid rgba(229,68,61,0.30)', borderRadius: 12, padding: '14px 18px', marginBottom: 18, color: '#FF8B85', fontSize: 13 }}>
            <strong>Ontraport query failed:</strong> {queryError}
          </div>
        )}

        <div className="admin-table-wrap">
          <ReceiptsTable
            rows={receipts.map((r): ReceiptRow => ({ ...r, modifiedAtIso: r.modifiedAt.toISOString() }))}
            emptyMessage={q ? `No bookings matching "${q}".` : 'No bookings found in Ontraport with f2604 populated.'}
          />
        </div>

        <p style={{ color: '#666', fontSize: 11, marginTop: 16, lineHeight: 1.7 }}>
          Data sourced live from Ontraport contacts where Deposit Amount (f2604) is populated.
          Receipt HTML is rendered on-demand using the same template the customer received.
        </p>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, color: '#D4A836', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
