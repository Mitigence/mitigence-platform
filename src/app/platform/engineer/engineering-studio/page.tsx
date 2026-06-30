import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Engineering Studio',
  description: 'See exactly how Mitigence delivers — the engineering lifecycle from architecture to optimization.',
}

export default function EngineeringStudioPage() {
  return (
    <PageShell
      title="Engineering Studio"
      description="The Mitigence delivery methodology, made visible. Eight engineering phases — architecture, planning, deployment, integration, configuration review, validation, operational readiness, and optimization. Each phase shows what we do, what we deliver, and how we measure success."
      phase="Phase 2"
      module="Module 5 — Engineering Studio"
    />
  )
}
