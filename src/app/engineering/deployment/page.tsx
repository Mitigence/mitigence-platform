import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Deployment',
  description: 'Implementation done right — structured deployment methodology covering planning, execution, integration validation, and handover.',
}

export default function DeploymentPage() {
  return (
    <PageShell
      title="Security Deployment"
      description="Implementation done right. Structured deployment methodology covering planning, execution, integration validation, and handover — ensuring controls operate as designed from day one."
      phase="Phase 2"
    />
  )
}
