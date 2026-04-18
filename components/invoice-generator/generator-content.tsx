'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

type DocType = 'QUOTATION' | 'INVOICE'

interface FormState {
  docType: DocType
  studentName: string
  invoiceTo: string
  issueDate: string
  term: string
  docId: string
  courseName: string
  qualifications: string
  startDate: string
  endDate: string
  totalDue: string
  administrator: string
}

function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function formatShortDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}/${mm}/${yy}`
}

function weeksBetween(startIso: string, endIso: string) {
  if (!startIso || !endIso) return ''
  const s = new Date(startIso)
  const e = new Date(endIso)
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return ''
  const ms = e.getTime() - s.getTime()
  if (ms <= 0) return ''
  const weeks = Math.round(ms / (1000 * 60 * 60 * 24 * 7))
  return `${weeks} week${weeks === 1 ? '' : 's'}`
}

const defaultState: FormState = {
  docType: 'QUOTATION',
  studentName: 'DONALD AZARÍAS WEIL COREA',
  invoiceTo: 'DEPARTMENT OF SOCIAL PROTECTION',
  issueDate: '2026-04-14',
  term: 'S26',
  docId: '105841',
  courseName: 'THE CAREER PATHWAY',
  qualifications:
    'Fitness Instruction EQF Level 3\nGroup Instruction EQF Level 3\nPersonal Trainer EQF Level 4\nFitness Business Accelerator Mentorship',
  startDate: '2026-04-25',
  endDate: '2026-08-08',
  totalDue: '3500',
  administrator: 'Adam Ward',
}

export default function GeneratorContent() {
  const [form, setForm] = useState<FormState>(defaultState)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const duration = useMemo(
    () => weeksBetween(form.startDate, form.endDate),
    [form.startDate, form.endDate],
  )

  const docNumber = `IFT.${form.term}.${form.docId}`
  const totalLabel = `€${form.totalDue}`
  const isInvoice = form.docType === 'INVOICE'
  const docLabel = isInvoice ? 'INVOICE' : 'QUOTATION'
  const refLabel = isInvoice ? 'INVOICE TO :' : 'QUOTATION TO :'
  const numberLabel = isInvoice ? 'INVOICE No :' : 'Quotation No :'

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 lg:flex-row lg:p-8 print:p-0">
        {/* Form panel */}
        <aside className="w-full flex-shrink-0 lg:w-[360px] print:hidden">
          <div className="sticky top-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h1 className="mb-1 text-xl font-semibold text-neutral-900">
              Quotation / Invoice Generator
            </h1>
            <p className="mb-4 text-xs text-neutral-500">
              Fill in the fields — the preview updates live.
            </p>

            <div className="mb-4 grid grid-cols-2 gap-2">
              {(['QUOTATION', 'INVOICE'] as DocType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update('docType', t)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    form.docType === t
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Field label="Student Reference">
                <input
                  className={inputCls}
                  value={form.studentName}
                  onChange={(e) => update('studentName', e.target.value)}
                />
              </Field>

              <Field label={isInvoice ? 'Invoice To' : 'Quotation To'}>
                <input
                  className={inputCls}
                  value={form.invoiceTo}
                  onChange={(e) => update('invoiceTo', e.target.value)}
                />
              </Field>

              <Field label="Date">
                <input
                  type="date"
                  className={inputCls}
                  value={form.issueDate}
                  onChange={(e) => update('issueDate', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Term (e.g. S26)">
                  <input
                    className={inputCls}
                    value={form.term}
                    onChange={(e) => update('term', e.target.value.toUpperCase())}
                  />
                </Field>
                <Field label="ID">
                  <input
                    className={inputCls}
                    value={form.docId}
                    onChange={(e) => update('docId', e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Course Name">
                <input
                  className={inputCls}
                  value={form.courseName}
                  onChange={(e) => update('courseName', e.target.value)}
                />
              </Field>

              <Field label="Qualifications (one per line)">
                <textarea
                  className={`${inputCls} min-h-[88px] font-sans`}
                  value={form.qualifications}
                  onChange={(e) => update('qualifications', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Start Date">
                  <input
                    type="date"
                    className={inputCls}
                    value={form.startDate}
                    onChange={(e) => update('startDate', e.target.value)}
                  />
                </Field>
                <Field label="End Date">
                  <input
                    type="date"
                    className={inputCls}
                    value={form.endDate}
                    onChange={(e) => update('endDate', e.target.value)}
                  />
                </Field>
              </div>

              <p className="text-xs text-neutral-500">
                Duration auto-calculated: <strong>{duration || '—'}</strong>
              </p>

              <Field label="Total Due (€)">
                <input
                  className={inputCls}
                  inputMode="numeric"
                  value={form.totalDue}
                  onChange={(e) => update('totalDue', e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </Field>

              <Field label="Administrator">
                <input
                  className={inputCls}
                  value={form.administrator}
                  onChange={(e) => update('administrator', e.target.value)}
                />
              </Field>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-5 w-full rounded-md bg-neutral-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Print / Save as PDF
            </button>
          </div>
        </aside>

        {/* Preview panel */}
        <section className="flex-1">
          <div className="mx-auto flex justify-center">
            <DocumentPreview
              docLabel={docLabel}
              refLabel={refLabel}
              numberLabel={numberLabel}
              studentName={form.studentName}
              invoiceTo={form.invoiceTo}
              issueDate={formatDate(form.issueDate)}
              docNumber={docNumber}
              totalLabel={totalLabel}
              courseName={form.courseName}
              qualifications={form.qualifications}
              startDate={formatShortDate(form.startDate)}
              endDate={formatShortDate(form.endDate)}
              duration={duration}
              administrator={form.administrator}
            />
          </div>
        </section>
      </div>

      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            background: white !important;
          }
        }
      `}</style>
    </main>
  )
}

const inputCls =
  'w-full rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
        {label}
      </span>
      {children}
    </label>
  )
}

interface PreviewProps {
  docLabel: string
  refLabel: string
  numberLabel: string
  studentName: string
  invoiceTo: string
  issueDate: string
  docNumber: string
  totalLabel: string
  courseName: string
  qualifications: string
  startDate: string
  endDate: string
  duration: string
  administrator: string
}

function DocumentPreview(props: PreviewProps) {
  const {
    docLabel,
    refLabel,
    numberLabel,
    studentName,
    invoiceTo,
    issueDate,
    docNumber,
    totalLabel,
    courseName,
    qualifications,
    startDate,
    endDate,
    duration,
    administrator,
  } = props

  return (
    <div
      id="doc-preview"
      className="relative bg-white text-neutral-900 shadow-xl print:shadow-none"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily:
          'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Black diagonal header shape */}
      <div
        className="absolute left-0 top-0 bg-black text-white"
        style={{
          width: '420px',
          height: '470px',
          clipPath:
            'polygon(0 0, 100% 0, 100% 72%, 55% 100%, 0 100%)',
        }}
      >
        <div className="px-8 pt-6">
          <div className="relative h-[150px] w-[220px]">
            <Image
              src="/logo-global.png"
              alt="Image Fitness Training"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="mt-1 text-[17px] font-extrabold leading-tight tracking-wide">
            IMAGE EDUCATION LTD
          </div>
          <div className="mb-2 text-[11px] font-semibold tracking-wide">
            (TA IMAGE FITNESS TRAINING)
          </div>
          <div className="space-y-[2px] text-[10.5px] font-semibold uppercase leading-snug tracking-wide">
            <div>Castle Shopping Centre</div>
            <div>Bridge Street</div>
            <div>Swords, Co. Dublin</div>
            <div>Remittance:</div>
            <div>accounts@imageft.ie</div>
            <div>Tel: (01) 9023377</div>
          </div>
        </div>
      </div>

      {/* Top-right logos + doc title */}
      <div className="absolute right-10 top-6 flex flex-col items-end">
        <div className="flex items-center gap-4">
          <NefpcBadge />
          <div className="relative h-[80px] w-[80px]">
            <Image
              src="/reps-ireland-logo.png"
              alt="REPs Ireland Approved Provider"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h1
          className="mt-2 text-[64px] font-black leading-none tracking-tight text-black"
          style={{ textShadow: '1px 2px 0 rgba(0,0,0,0.08)' }}
        >
          {docLabel}
        </h1>
      </div>

      {/* Student reference */}
      <div className="absolute left-0 right-0" style={{ top: '330px' }}>
        <div className="text-center">
          <span className="text-[18px] font-extrabold tracking-wide text-neutral-900 underline decoration-2 underline-offset-[6px]">
            STUDENT REFERENCE: {studentName}
          </span>
        </div>
      </div>

      {/* Details row */}
      <div
        className="absolute left-0 right-0 grid grid-cols-3 gap-6 px-10"
        style={{ top: '385px' }}
      >
        <div>
          <div className="text-[13px] font-extrabold tracking-wide text-neutral-900">
            {refLabel}
          </div>
          <div className="mt-2 whitespace-pre-line text-[12px] font-bold uppercase leading-tight text-[#1a2761]">
            {invoiceTo}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[13px] font-semibold text-neutral-800">
            Date : {issueDate}
          </div>
          <div className="mt-5 text-[13px] font-semibold text-neutral-800">
            {numberLabel} {docNumber}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-bold tracking-wide text-neutral-900">
            TOTAL DUE :
          </div>
          <div className="mt-2 text-[26px] font-extrabold text-[#1a2761]">
            {totalLabel}
          </div>
        </div>
      </div>

      {/* Description table */}
      <div className="absolute left-10 right-10" style={{ top: '510px' }}>
        {/* Header */}
        <div className="flex items-center justify-between rounded-sm bg-black px-5 py-3 text-white">
          <div className="text-[17px] font-bold">Description</div>
          <div className="text-[17px] font-bold">Total</div>
        </div>

        {/* Course name row */}
        <div className="flex items-center justify-between bg-white px-5 py-4">
          <div className="text-[13px] font-extrabold tracking-wide text-neutral-900">
            {courseName}
          </div>
          <div className="text-[13px] font-bold text-neutral-900">
            {totalLabel}
          </div>
        </div>

        {/* Qualifications row */}
        <div className="bg-neutral-100 px-5 py-4">
          <div className="whitespace-pre-line text-[12.5px] font-bold leading-[1.55] text-neutral-900">
            {qualifications}
          </div>
        </div>

        {/* Spacer */}
        <div className="h-3 bg-white" />

        {/* Dates row */}
        <div className="bg-neutral-100 px-5 py-4">
          <div className="space-y-[2px] text-[12.5px] font-bold leading-tight text-neutral-900">
            <div>Course Start Date: {startDate || '—'}</div>
            <div>Course End Date: {endDate || '—'}</div>
            <div>Duration: {duration || '—'}</div>
          </div>
        </div>

        {/* Fees Due */}
        <div className="flex items-center justify-between border-b border-neutral-900 bg-white px-5 py-4">
          <div className="text-[13px] font-extrabold text-neutral-900">
            Fees Due
          </div>
          <div className="text-[13px] font-bold text-neutral-900">
            {totalLabel}
          </div>
        </div>
      </div>

      {/* Payment method + total */}
      <div
        className="absolute left-10 right-10 grid grid-cols-2 gap-8"
        style={{ top: '870px' }}
      >
        <div>
          <div className="mb-2 text-[15px] font-extrabold text-neutral-900">
            Payment Method
          </div>
          <div className="space-y-[2px] text-[10.5px] leading-snug text-neutral-900">
            <div>Please make your cheques and payments payable to:</div>
            <div>Image Education Ltd (T/A Image Fitness Training)</div>
            <div>Tax Reg No: 3706146SH C Reg: 585030</div>
            <div>For bank lodgements:</div>
            <div>AIB Bank</div>
            <div>A/c no.: 65895007 Sort code: 93-25-23</div>
            <div>IBAN: IE84AIBK93252365895007 BIC/SWIFT: AIBKIE2DXXX</div>
          </div>
        </div>
        <div className="flex items-start justify-end pt-6">
          <div
            className="flex w-[260px] items-center justify-between px-5 py-3 text-[15px] font-extrabold text-neutral-900"
            style={{ background: '#f2d06b' }}
          >
            <span>Total :</span>
            <span>{totalLabel}</span>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div
        className="absolute right-10 text-right"
        style={{ top: '1010px' }}
      >
        <div
          className="text-[20px] font-bold text-neutral-900"
          style={{ fontFamily: '"Brush Script MT", cursive' }}
        >
          {administrator}
        </div>
        <div className="text-[12px] text-neutral-700">Administrator</div>
      </div>

      {/* Gold footer ribbon */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '90px',
          background: '#f2d06b',
          clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        <div className="absolute bottom-4 left-10 right-10 text-[11px] font-semibold text-neutral-900">
          Image Education Limited &nbsp;is Trading as Image Fitness Training ·
          <br />
          Tax Registration Number 3706146SH
        </div>
      </div>
    </div>
  )
}

function NefpcBadge() {
  return (
    <div className="flex flex-col items-center">
      <svg
        width="90"
        height="54"
        viewBox="0 0 90 54"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NEFPC"
      >
        <ellipse cx="45" cy="46" rx="38" ry="4" fill="#6fbf4b" />
        <path
          d="M10 40 Q 18 26 36 24 L 70 24 Q 82 24 82 34 L 82 40 Z"
          fill="#3ea8e5"
        />
        <circle cx="68" cy="22" r="6" fill="#3ea8e5" />
        <path
          d="M30 24 Q 36 18 44 18 L 48 18"
          stroke="#3ea8e5"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-1 text-center leading-[1]">
        <div className="text-[14px] font-black tracking-wider text-black">
          N.E.F.P.C
        </div>
        <div className="text-[5px] font-bold tracking-[0.15em] text-black">
          NATIONAL ELITE FITNESS PROFESSIONAL
        </div>
        <div className="text-[5px] font-bold tracking-[0.15em] text-black">
          CERTIFICATE
        </div>
      </div>
    </div>
  )
}
