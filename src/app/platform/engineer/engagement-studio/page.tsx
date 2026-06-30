import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Engagement Studio',
  description: 'Design your cybersecurity engagement — objectives, environment, scope, timeline, and recommended journey.',
}

export default function EngagementStudioPage() {
  return (
    <PageShell
      title="Engagement Studio"
      description="Your digital consultant. Define your business context, security objectives, environment, and scope — and receive a structured engagement roadmap with recommended phases, milestones, and deliverables. No PDF. No generic proposal."
      phase="Phase 1"
      module="Module 3 — Engagement Studio"
    />
  )
}
