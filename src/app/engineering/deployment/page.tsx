import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Deployment',
  description: 'Implementation done right â€” structured deployment methodology covering planning, execution, integration validation, and handover.',
}

export default function DeploymentPage() {
  return (
    <PageShell
      title="Security Deployment"
      description="Implementation done right. Structured deployment methodology covering planning, execution, integration validation, and handover â€” ensuring controls operate as designed from day one."
    />
  )
}
