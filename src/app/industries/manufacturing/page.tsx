import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Manufacturing Security',
  description: 'OT and IT convergence introduces security risks that traditional approaches weren\'t designed to address.',
}

export default function ManufacturingPage() {
  return (
    <PageShell
      title="Manufacturing Security"
      description="OT and IT convergence introduces security risks that traditional approaches weren't designed to address. Mitigence brings expertise in both environments â€” securing industrial systems without disrupting operational processes."
    />
  )
}
