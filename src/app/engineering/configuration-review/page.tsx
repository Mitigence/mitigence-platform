import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Configuration Review',
  description: 'Most security failures stem from misconfiguration, not missing technology.',
}

export default function ConfigurationReviewPage() {
  return (
    <PageShell
      title="Configuration Review"
      description="Most security failures stem from misconfiguration, not missing technology. Mitigence reviews configurations across your security stack, identifies operational gaps, and delivers prioritised optimisation recommendations."
    />
  )
}
