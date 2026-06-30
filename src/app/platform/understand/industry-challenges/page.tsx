import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Industry Challenges',
  description: 'Security challenges specific to your industry and regulatory environment.',
}

export default function IndustryChallengesPage() {
  return (
    <PageShell
      title="Industry Challenges"
      description="Every industry faces distinct security pressures â€” regulatory requirements, threat profiles, operational constraints. Explore the specific challenges your sector navigates and how Mitigence addresses them."
    />
  )
}
