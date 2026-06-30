import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Financial Services Security',
  description: 'Regulated, targeted, and operationally complex — security for financial services organisations.',
  alternates: {
    canonical: '/industries/financial-services',
  },
}

export default function FinancialServicesPage() {
  return (
    <PageShell
      title="Financial Services Security"
      description="Regulated, targeted, and operationally complex. Financial services organisations face constant threat actor interest, strict regulatory requirements, and the operational challenge of securing legacy and modern systems simultaneously."
    />
  )
}
