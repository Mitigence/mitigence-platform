import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Mitigence — we\'re looking for engineers who want to make cybersecurity clearer and more effective.',
}

export default function CareersPage() {
  return (
    <PageShell
      title="Careers at Mitigence"
      description="Join Mitigence — we're looking for engineers who want to make cybersecurity clearer and more effective. If you're tired of checkbox security and want to do the real work, let's talk."
      phase="Phase 0"
    />
  )
}
