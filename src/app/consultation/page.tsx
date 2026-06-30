import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Schedule a Consultation',
  description: 'Schedule a strategy session with a Mitigence security specialist.',
}

export default function ConsultationPage() {
  return (
    <PageShell
      title="Schedule a Strategy Session"
      description="A focused conversation about your environment and objectives — not a generic sales pitch. Tell us about your organization and what you're trying to achieve. We'll come prepared."
      phase="Phase 1"
    />
  )
}
