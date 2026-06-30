import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Health Checks',
  description: 'Continuous validation that your security controls are functioning as intended.',
  alternates: {
    canonical: '/engineering/health-checks',
  },
}

export default function HealthChecksPage() {
  return (
    <PageShell
      title="Health Checks"
      description="Continuous validation that your security controls are functioning as intended. Scheduled health checks identify configuration drift, operational degradation, and emerging gaps before they become vulnerabilities."
    />
  )
}
