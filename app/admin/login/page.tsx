// Admin login — password-only, full-screen.
// Submits to /api/admin/login which sets a cookie and redirects to /admin/receipts.

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const showError = params.error === '1';
  const next = params.next || '/admin/receipts';

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at top, rgba(212,168,54,0.15) 0%, transparent 55%), #0a0a0a',
        color: '#f5f5f5',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <form
        action="/api/admin/login"
        method="post"
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#161616',
          border: '1px solid rgba(212,168,54,0.18)',
          borderRadius: 22,
          padding: '40px 36px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.50)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              color: '#D4A836',
              textTransform: 'uppercase',
              fontWeight: 700,
              margin: 0,
              marginBottom: 8,
            }}
          >
            IFT Admin
          </p>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 36,
              fontWeight: 600,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Enter password
          </h1>
        </div>

        <input type="hidden" name="next" value={next} />

        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="Password"
          autoComplete="current-password"
          style={{
            width: '100%',
            background: '#0a0a0a',
            color: '#f5f5f5',
            border: '1px solid #27272a',
            borderRadius: 12,
            padding: '16px 18px',
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: '0.04em',
            outline: 'none',
            textAlign: 'center',
            fontFamily: 'inherit',
          }}
        />

        {showError && (
          <p
            style={{
              marginTop: 14,
              padding: '10px 14px',
              background: 'rgba(229,68,61,0.10)',
              border: '1px solid rgba(229,68,61,0.35)',
              color: '#FF8B85',
              borderRadius: 10,
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            Incorrect password — try again.
          </p>
        )}

        <button
          type="submit"
          style={{
            display: 'block',
            width: '100%',
            marginTop: 18,
            padding: '15px 22px',
            borderRadius: 999,
            background: '#D4A836',
            color: '#000',
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Unlock
        </button>

        <p
          style={{
            marginTop: 22,
            fontSize: 11,
            color: '#666',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Admin-only billing history.<br />
          Session lasts 7 days on this device.
        </p>
      </form>
    </main>
  );
}
