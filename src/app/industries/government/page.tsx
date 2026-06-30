import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Government Security',
  description: 'Public sector organisations operating under heightened threat conditions and strict data handling requirements.',
}

export default function GovernmentPage() {
  return (
    <PageShell
      title="Government Security"
      description="Public sector organisations operate under heightened threat conditions, strict data handling requirements, and complex procurement environments. Mitigence brings structured delivery and engineering depth to government security programmes."
      phase="Phase 3"
    />
  )
}
