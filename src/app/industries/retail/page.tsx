import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Retail Security',
  description: 'Payment data, customer information, supply chain systems, and e-commerce platforms — security for retail organisations.',
  alternates: {
    canonical: '/industries/retail',
  },
}

export default function RetailPage() {
  return (
    <PageShell
      title="Retail Security"
      description="Payment data, customer information, supply chain systems, and e-commerce platforms create a broad attack surface. Retail organisations require security engineering that protects customer trust without disrupting the commercial operation."
    />
  )
}
