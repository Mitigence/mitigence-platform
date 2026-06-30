import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Engineering',
  description: 'How Mitigence engineers cybersecurity — from architecture design through operational readiness and continuous optimization.',
  alternates: {
    canonical: '/engineering',
  },
}

export default function EngineeringPage() {
  return (
    <PageShell
      title="Security Engineering"
      description="Engineering is what separates Mitigence from assessment-only firms. Every engagement follows a structured engineering lifecycle — architecture, planning, deployment, integration, configuration review, validation, operational readiness, and optimization."
    />
  )
}
