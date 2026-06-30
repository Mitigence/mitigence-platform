import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Customer Workspace',
  description: 'Your engagement hub — projects, reports, deliverables, milestones, and collaboration in one place.',
}

export default function CustomerWorkspacePage() {
  return (
    <PageShell
      title="Customer Workspace"
      description="A preview of the Mitigence customer workspace — where projects, reports, deliverables, milestones, recommendations, and team communication come together. This is what working with Mitigence looks like after engagement begins."
      phase="Phase 4"
      module="Module 10 — Customer Workspace Preview"
    />
  )
}
