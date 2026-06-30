import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Our Approach',
  description: 'The Mitigence delivery philosophy — why we lead with engineering, not marketing.',
  alternates: {
    canonical: '/approach',
  },
}

export default function ApproachPage() {
  return (
    <PageShell
      title="Our Approach"
      description="The Mitigence delivery philosophy — why we lead with engineering, not marketing. How we structure every engagement, what we refuse to do, and what clients can always expect from us — clarity, honesty, and measurable outcomes."
    />
  )
}
