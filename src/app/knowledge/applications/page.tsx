import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Application Security Knowledge',
  description: 'Understanding application security — secure development, testing methodologies, and risk management.',
}

export default function KnowledgeApplicationsPage() {
  return (
    <PageShell
      title="Application Security"
      description="Understanding application security — secure development practices, testing methodologies (SAST, DAST, penetration testing), API security, dependency management, and risk-based vulnerability management."
      phase="Phase 3"
      module="Module 11 — Knowledge: Applications"
    />
  )
}
