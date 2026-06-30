import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Education Security',
  description: 'Academic environments are uniquely open by design — security that balances accessibility with appropriate controls.',
}

export default function EducationPage() {
  return (
    <PageShell
      title="Education Security"
      description="Academic environments are uniquely open by design — which creates security challenges that commercial approaches don't always address. Mitigence understands the balance between accessibility, research freedom, and appropriate security controls."
      phase="Phase 3"
    />
  )
}
