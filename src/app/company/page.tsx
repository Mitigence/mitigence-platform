import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Company',
  description: 'Mitigence is a Cybersecurity Delivery and Engineering Platform â€” built for organizations that want security done properly.',
}

export default function CompanyPage() {
  return (
    <PageShell
      title="Mitigence"
      description="Mitigence is a Cybersecurity Delivery and Engineering Platform â€” built for organizations that want to understand their risks, engineer resilient controls, operate with confidence, and continuously improve. Not a reseller. Not a body shop. An engineering firm."
    />
  )
}
