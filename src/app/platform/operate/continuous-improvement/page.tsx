import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Continuous Improvement',
  description: 'Quarterly reviews, optimization roadmaps, and ongoing security improvement with Mitigence.',
  alternates: {
    canonical: '/platform/operate/continuous-improvement',
  },
}

export default function ContinuousImprovementPage() {
  return (
    <PageShell
      title="Continuous Improvement"
      description="Security isn't a project — it's a continuous discipline. Quarterly reviews, optimization roadmaps, engineering updates, and long-term partnership that evolves as your organization grows."
    />
  )
}
