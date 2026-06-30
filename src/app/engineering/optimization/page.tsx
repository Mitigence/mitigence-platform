import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Optimization',
  description: 'Security engineering doesn\'t end at deployment â€” Mitigence continuously optimises configurations and tunes detection logic.',
}

export default function OptimizationPage() {
  return (
    <PageShell
      title="Security Optimization"
      description="Security engineering doesn't end at deployment. Mitigence continuously optimises configurations, tunes detection logic, updates policies, and improves operational efficiency as your environment evolves."
    />
  )
}
