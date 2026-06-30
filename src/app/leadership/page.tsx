import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Leadership',
  description: 'Meet the Mitigence team — the people behind the platform and the engineering.',
}

export default function LeadershipPage() {
  return (
    <PageShell
      title="Leadership"
      description="Meet the Mitigence team — the people behind the platform, the engineering methodology, and the delivery approach. Security practitioners who built this because they saw a better way."
      phase="Phase 0"
    />
  )
}
