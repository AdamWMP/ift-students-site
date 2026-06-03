/**
 * Receipt persistence — writes the receipt + delivery status to the
 * Prisma DB so it shows up in the admin billing-history view.
 *
 * Best-effort: failures here MUST NOT break the booking flow. We wrap
 * every Prisma call in try/catch and log to console + Slack so a DB
 * outage doesn't lose customer money.
 */

import prisma from '@/lib/db';
import { renderReceiptHtml, type ReceiptInput } from './render';
import type { ReceiptSendResult } from './send';

export interface StoreReceiptInput extends ReceiptInput {
  ontraportInvoiceId?: string | number;
  cardLast4?: string;
  result: ReceiptSendResult;
}

export async function persistReceipt(input: StoreReceiptInput): Promise<{ ok: boolean; error?: string }> {
  try {
    // Render once + store the exact HTML the customer received. If a year
    // later they want a copy for their accountant, we serve it from here.
    const html = renderReceiptHtml(input);
    const remaining = Math.max(0, input.courseTotal - input.paidToday);

    await prisma.receipt.upsert({
      where: { receiptNo: input.receiptNo },
      // If somehow we get a duplicate send (cold-start dedupe bypassed),
      // refresh the channel statuses but don't lose the original row.
      update: {
        emailSent: input.result.email.ok,
        emailError: input.result.email.error,
        whatsappSent: input.result.whatsapp.ok,
        whatsappError: input.result.whatsapp.error,
      },
      create: {
        receiptNo: input.receiptNo,
        contactId: String(input.contactId),
        brand: input.brand || 'ift',
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        packageName: input.packageName,
        intakeDate: input.intakeDate,
        location: input.location,
        schedule: input.schedule,
        courseTotal: input.courseTotal,
        paidToday: input.paidToday,
        remainingBalance: remaining,
        monthlyAmount: input.monthlyAmount,
        months: input.months,
        firstInstalment: input.firstInstalment,
        cardLast4: input.cardLast4,
        isFullPayment: input.isFullPayment,
        emailSent: input.result.email.ok,
        emailError: input.result.email.error,
        whatsappSent: input.result.whatsapp.ok,
        whatsappError: input.result.whatsapp.error,
        htmlSnapshot: html,
        ontraportInvoiceId: input.ontraportInvoiceId ? String(input.ontraportInvoiceId) : undefined,
      },
    });

    console.log(`[Receipt-Store] ✅ Persisted ${input.receiptNo}`);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[Receipt-Store] ❌ Failed to persist ${input.receiptNo}:`, msg);
    return { ok: false, error: msg };
  }
}
