import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Healthcare Security',
  description: 'Patient safety and data protection are inseparable â€” security for healthcare organisations.',
}

export default function HealthcarePage() {
  return (
    <PageShell
      title="Healthcare Security"
      description="Patient safety and data protection are inseparable. Healthcare organisations must secure clinical systems, protect sensitive patient data, meet regulatory obligations, and maintain operational continuity â€” often with constrained security resources."
    />
  )
}
