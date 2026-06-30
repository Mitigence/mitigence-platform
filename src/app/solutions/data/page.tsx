import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Data Protection',
  description: 'Protecting sensitive data wherever it lives â€” at rest, in transit, and in use.',
}

export default function DataPage() {
  return (
    <PageShell
      title="Data Protection"
      description="Protecting sensitive data wherever it lives â€” at rest, in transit, and in use. Data classification, DLP engineering, encryption validation, and ongoing monitoring to ensure your most critical assets remain protected."
    />
  )
}
