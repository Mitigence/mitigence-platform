import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Team Builder',
  description: 'Assemble specialist capability pods and understand how your delivery team is structured.',
}

export default function TeamBuilderPage() {
  return (
    <PageShell
      title="Team Builder"
      description="Cybersecurity is delivered by coordinated expertise, not isolated services. Select capability pods — assessment, engineering, operations, incident response, architecture — and see how your delivery team takes shape, what they do together, and what you can expect."
      phase="Phase 2"
      module="Module 6 — Team Builder"
    />
  )
}
