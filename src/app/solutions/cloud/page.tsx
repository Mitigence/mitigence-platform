import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Cloud Security',
  description: 'Engineering-led cloud security across architecture, configuration, workload protection, and identity.',
  alternates: {
    canonical: '/solutions/cloud',
  },
}

export default function CloudPage() {
  return (
    <PageShell
      title="Cloud Security"
      description="Engineering-led cloud security across architecture, configuration, workload protection, and identity. Whether you're cloud-first, multi-cloud, or hybrid — Mitigence engineers the controls, not just assesses them."
    />
  )
}
