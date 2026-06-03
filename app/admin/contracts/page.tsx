// Admin-only: signed T&C contracts.
// Source of truth = Ontraport (field f2344, "Signed by {name} on {date}").
// Gated by middleware (/admin/*). No DB needed.

import { listSignedContracts } from '@/lib/contracts/from-ontraport';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchParams {
  q?: string;
  limit?: string;
}

export default async function AdminContractsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q || '').trim();
  const limit = Math.min(Number(params.limit) || 50, 100);

  let rows: Awaited<ReturnType<typeof listSignedContracts>> = [];
  let queryError: string | null = null;
  try {
    rows = await listSignedContracts({ search: q || undefined, limit });
  } catch (e) {
    queryError = e instanceof Error ? e.message : String(e);
  }

  const fmtDate = (d: string) => {
    if (!d) return '—';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <main style={{ background: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>{`
        @media (max-width: 720px) {
          .admin-header { flex-direction: column !important; align-items: flex-start !important; }
          .admin-search { flex-direction: column !important; }
          .admin-search > * { width: 100% !important; }
          .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .admin-table-wrap table { min-width: 640px; }
          .admin-h1 { font-size: 30px !important; }
          .admin-container { padding: 20px 14px 100px !important; }
        }
        a.adminlink { color: #D4A836; text-decoration: none; }
        a.adminlink:hover { text-decoration: underline; }
      `}</style>
      <div className="admin-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
        <header className="admin-header" style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="admin-h1" style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Signed Contracts</h1>
            <p style={{ color: '#9a9a9a', margin: '6px 0 0', fontSize: 14 }}>
              Sourced live from Ontraport · {rows.length} of newest {limit}.{' '}
              <a className="adminlink" href="/admin/contracts/agreement">View the contract →</a>
            </p>
          </div>
          <nav style={{ display: 'flex', gap: 16, fontSize: 14 }}>
            <a className="adminlink" href="/admin/receipts">Receipts</a>
            <a className="adminlink" href="/admin/contracts/agreement">Contract text</a>
          </nav>
        </header>

        <form action="/admin/contracts" method="get" className="admin-search" style={{ display: 'flex', gap: 10, margin: '18px 0 22px', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name or email…"
            style={{ flex: 1, minWidth: 220, background: '#161616', border: '1px solid #2a2a2a', color: '#f5f5f5', borderRadius: 10, padding: '11px 14px', fontSize: 15 }}
          />
          <button type="submit" style={{ background: '#D4A836', color: '#111', border: 'none', borderRadius: 10, padding: '11px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Search
          </button>
        </form>

        {queryError ? (
          <div style={{ background: '#2a1414', border: '1px solid #5a2222', borderRadius: 12, padding: 18, color: '#f3b4b4' }}>
            <strong>Couldn’t load contracts.</strong>
            <div style={{ marginTop: 6, fontSize: 13, color: '#d99' }}>{queryError}</div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#caa' }}>
              Check that <code>ONTRAPORT_API_KEY</code> and <code>ONTRAPORT_APP_ID</code> are set.
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 12, padding: 28, color: '#9a9a9a', textAlign: 'center' }}>
            No signed contracts found{q ? ` for “${q}”` : ''}.
          </div>
        ) : (
          <div className="admin-table-wrap" style={{ background: '#121212', border: '1px solid #242424', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#181818', textAlign: 'left', color: '#9a9a9a' }}>
                  <th style={{ padding: '13px 16px', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '13px 16px', fontWeight: 600 }}>Signed date</th>
                  <th style={{ padding: '13px 16px', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '13px 16px', fontWeight: 600 }}>Contract</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.contactId} style={{ borderTop: '1px solid #222' }}>
                    <td style={{ padding: '13px 16px', fontWeight: 600 }}>
                      {r.name || '—'}
                      {r.signatureName && r.signatureName !== r.name && (
                        <span style={{ color: '#777', fontWeight: 400 }}> · signed “{r.signatureName}”</span>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px', color: '#cfcfcf' }}>{fmtDate(r.signedDate)}</td>
                    <td style={{ padding: '13px 16px', color: '#cfcfcf' }}>{r.email || '—'}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <a className="adminlink" href="/admin/contracts/agreement">View →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
