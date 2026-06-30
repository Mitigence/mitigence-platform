import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Network Security',
  description: 'Infrastructure protection from the ground up — network architecture review, segmentation, firewall optimisation, and traffic analysis.',
}

export default function NetworkPage() {
  return (
    <PageShell
      title="Network Security"
      description="Infrastructure protection from the ground up. Network architecture review, segmentation, firewall optimisation, traffic analysis, and operational readiness — ensuring your network is both resilient and operationally manageable."
      phase="Phase 1"
      module="Module 4 — Capability: Network"
    />
  )
}
