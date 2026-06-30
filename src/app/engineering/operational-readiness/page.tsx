import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Operational Readiness',
  description: 'A security control is only as valuable as the team that operates it.',
  alternates: {
    canonical: '/engineering/operational-readiness',
  },
}

export default function OperationalReadinessPage() {
  return (
    <PageShell
      title="Operational Readiness"
      description="A security control is only as valuable as the team that operates it. Operational readiness assessments validate that your team has the processes, runbooks, and knowledge to sustain security operations effectively."
    />
  )
}
