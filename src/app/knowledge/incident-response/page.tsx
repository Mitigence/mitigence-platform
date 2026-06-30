import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Incident Response Knowledge',
  description: 'Understanding incident response â€” preparation, detection, containment, eradication, and recovery.',
}

export default function KnowledgeIncidentResponsePage() {
  return (
    <PageShell
      title="Incident Response"
      description="Understanding incident response â€” preparation and planning, detection and triage, containment strategies, eradication procedures, recovery approaches, and the lessons learned process that drives continuous improvement."
    />
  )
}
