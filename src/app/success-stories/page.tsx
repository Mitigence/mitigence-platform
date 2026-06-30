import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Structured engagement narratives — not testimonials. Real security challenges, real engineering outcomes.',
  alternates: {
    canonical: '/success-stories',
  },
}

export default function SuccessStoriesPage() {
  return (
    <PageShell
      title="Success Stories"
      description="Structured engagement narratives — not testimonials. Every story follows the same framework: challenge, discovery, assessment, engineering, validation, outcome, and continuous improvement. Filter by industry, organization size, objective, environment, or delivery model."
    />
  )
}
