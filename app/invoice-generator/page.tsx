import GeneratorContent from '@/components/invoice-generator/generator-content'

export const metadata = {
  title: 'Quotation & Invoice Generator',
  description: 'Generate Image Fitness Training quotations and invoices in the official template.',
  robots: { index: false, follow: false },
}

export default function InvoiceGeneratorPage() {
  return <GeneratorContent />
}
