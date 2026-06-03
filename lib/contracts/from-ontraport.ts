/**
 * Signed-contract source of truth: Ontraport (same pattern as lib/receipts).
 *
 * When a student signs the T&C at /onboarding/[contactId], the contract API
 * writes field f2344 (Contract Signed) = "Signed by {name} on {YYYY-MM-DD}"
 * and adds the "T&C Contract Signed" tag. So every signer is a contact with
 * f2344 populated — we query that directly, no separate DB.
 */

const CONTRACT_FIELD = 'f2344'; // ONTRAPORT_FIELDS.contractSigned

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export interface SignedContractRow {
  contactId: string;
  name: string;
  email: string;
  signatureName: string; // name typed at signing (parsed from f2344)
  signedDate: string;    // YYYY-MM-DD (parsed from f2344), '' if unknown
  signedText: string;    // raw f2344 value
}

interface OntraportContact {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  [key: string]: string | undefined;
}

export interface ListContractsOptions {
  search?: string;
  limit?: number;
}

/**
 * List contacts who have signed the T&C contract (f2344 not empty), newest first.
 */
export async function listSignedContracts(opts: ListContractsOptions = {}): Promise<SignedContractRow[]> {
  const { search, limit = 100 } = opts;

  const condition = encodeURIComponent(
    JSON.stringify([{ field: { field: CONTRACT_FIELD }, op: 'IS NOT EMPTY' }])
  );
  const range = Math.min(limit, 50); // Ontraport caps at 50/page
  const url =
    `https://api.ontraport.com/1/Contacts` +
    `?condition=${condition}` +
    `&sort=dlm&sortDir=desc&range=${range}&listFields=` +
    encodeURIComponent(['id', 'firstname', 'lastname', 'email', CONTRACT_FIELD, 'dlm', 'date'].join(','));

  const res = await fetch(url, { headers: ontraportHeaders(), cache: 'no-store' });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ontraport list failed: ${res.status} ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data?: OntraportContact[] };
  const contacts = json.data || [];

  let rows: SignedContractRow[] = contacts.map((c) => {
    const signedText = String(c[CONTRACT_FIELD] || '');
    const m = signedText.match(/Signed by\s+(.+?)\s+on\s+(\d{4}-\d{2}-\d{2})/i);
    const signatureName = m ? m[1].trim() : '';
    const signedDate = m ? m[2] : '';
    const name = [c.firstname, c.lastname].filter(Boolean).join(' ').trim() || signatureName;
    return {
      contactId: String(c.id),
      name,
      email: c.email || '',
      signatureName,
      signedDate,
      signedText,
    };
  });

  if (search) {
    const needle = search.toLowerCase().trim();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.email.toLowerCase().includes(needle) ||
        r.signatureName.toLowerCase().includes(needle)
    );
  }

  return rows;
}
