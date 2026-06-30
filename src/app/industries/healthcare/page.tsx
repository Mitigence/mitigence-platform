import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Healthcare Security',
  description: 'Patient safety and data protection are inseparable — security for healthcare organisations.',
  alternates: {
    canonical: '/industries/healthcare',
  },
}

export default function HealthcarePage() {
  return (
    <PageShell
      title="Healthcare Security"
      description="Patient safety and data protection are inseparable. Healthcare organisations must secure clinical systems, protect sensitive patient data, meet regulatory obligations, and maintain operational continuity — often with constrained security resources."
    />
  )
}
