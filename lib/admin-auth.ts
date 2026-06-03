// Shared helper used by middleware + the login API route.
// Hashes the admin password so the raw secret never appears in cookies
// or request logs. Hash is deterministic per-password so we can verify
// by re-hashing.

export const ADMIN_COOKIE = 'admin_session';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * SHA-256(`${password}|admin-session-v1`) → lowercase hex.
 * Uses Web Crypto so it works in both the Edge runtime (middleware)
 * and the Node runtime (API routes).
 */
export async function hashSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}|admin-session-v1`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
