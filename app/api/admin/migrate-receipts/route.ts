// One-off setup endpoint that creates the Receipt table on the production
// database. Idempotent — re-running has no effect after the first success.
//
// Auth: gated by the same admin cookie as /admin/*. Middleware enforces it
// because /api/admin/* paths run BEFORE the API handler but AFTER middleware.
// Actually — middleware excludes /api/ by default in the matcher, so we add
// an explicit cookie check here too.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ADMIN_COOKIE, hashSessionToken } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SQL — SQLite syntax. If you've migrated production to Postgres,
// swap INTEGER for SERIAL/BIGINT and adjust quoting accordingly.
const CREATE_SQL_SQLITE = `
  CREATE TABLE IF NOT EXISTS "Receipt" (
    "receiptNo" TEXT PRIMARY KEY,
    "contactId" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'ift',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "intakeDate" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "courseTotal" REAL NOT NULL,
    "paidToday" REAL NOT NULL,
    "remainingBalance" REAL NOT NULL,
    "monthlyAmount" REAL NOT NULL,
    "months" INTEGER NOT NULL DEFAULT 0,
    "firstInstalment" TEXT NOT NULL,
    "cardLast4" TEXT,
    "isFullPayment" INTEGER NOT NULL,
    "emailSent" INTEGER NOT NULL DEFAULT 0,
    "emailError" TEXT,
    "whatsappSent" INTEGER NOT NULL DEFAULT 0,
    "whatsappError" TEXT,
    "htmlSnapshot" TEXT NOT NULL,
    "ontraportInvoiceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

const CREATE_INDEX_CONTACT = `CREATE INDEX IF NOT EXISTS "Receipt_contactId_idx" ON "Receipt"("contactId");`;
const CREATE_INDEX_EMAIL = `CREATE INDEX IF NOT EXISTS "Receipt_email_idx" ON "Receipt"("email");`;
const CREATE_INDEX_CREATED = `CREATE INDEX IF NOT EXISTS "Receipt_createdAt_idx" ON "Receipt"("createdAt");`;

export async function POST(req: NextRequest) {
  // Gate: same cookie middleware uses for /admin/* routes.
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new NextResponse('Admin not configured', { status: 503 });
  }
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await hashSessionToken(adminPassword);
  if (cookie !== expected) {
    return NextResponse.redirect(new URL('/admin/login?next=/admin/receipts', req.url), { status: 303 });
  }

  try {
    await prisma.$executeRawUnsafe(CREATE_SQL_SQLITE);
    await prisma.$executeRawUnsafe(CREATE_INDEX_CONTACT);
    await prisma.$executeRawUnsafe(CREATE_INDEX_EMAIL);
    await prisma.$executeRawUnsafe(CREATE_INDEX_CREATED);
    console.log('[Admin] Receipt table created (or already existed).');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[Admin] migrate-receipts failed:', msg);
    return new NextResponse(`Migration failed: ${msg}`, { status: 500 });
  }

  // Bounce back to the receipts list — it'll render successfully now.
  return NextResponse.redirect(new URL('/admin/receipts', req.url), { status: 303 });
}
