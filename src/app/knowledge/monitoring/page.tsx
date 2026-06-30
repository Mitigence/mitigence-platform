import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Monitoring Knowledge',
  description: 'Understanding security monitoring â€” SIEM, log management, detection engineering, and incident response workflows.',
}

export default function KnowledgeMonitoringPage() {
  return (
    <PageShell
      title="Security Monitoring"
      description="Understanding security monitoring â€” SIEM platforms, log collection and normalisation, detection engineering, alert correlation, investigation workflows, and the operational discipline of running an effective SOC."
    />
  )
}
