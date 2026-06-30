import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Monitoring',
  description: 'Visibility, detection, correlation, investigation, and response — engineered and optimised by Mitigence.',
}

export default function MonitoringPage() {
  return (
    <PageShell
      title="Security Monitoring"
      description="Visibility, detection, correlation, investigation, and response. Mitigence engineers and optimises your monitoring capability — from log collection and SIEM tuning through use-case development and operational runbooks."
      phase="Phase 1"
      module="Module 4 — Capability: Monitoring"
    />
  )
}
