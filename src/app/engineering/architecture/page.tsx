import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Architecture',
  description: 'Architecture decisions made early determine security outcomes for years.',
}

export default function ArchitecturePage() {
  return (
    <PageShell
      title="Security Architecture"
      description="Architecture decisions made early determine security outcomes for years. Mitigence designs security architecture that is resilient, operationally realistic, and aligned with your business direction â€” not just compliant with a checklist."
    />
  )
}
