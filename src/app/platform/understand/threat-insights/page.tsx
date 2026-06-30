import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Threat Insights',
  description: 'Understand the modern threat landscape and how it applies to your environment.',
}

export default function ThreatInsightsPage() {
  return (
    <PageShell
      title="Threat Insights"
      description="A clear view of the modern threat landscape â€” attack paths, common vectors, evolving techniques, and how they map to your environment. Education-first, without the fear-based messaging."
    />
  )
}
