import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Endpoint Protection',
  description: 'Every device is a potential entry point. Mitigence engineers endpoint security controls, validates configurations, and tests detection capabilities.',
  alternates: {
    canonical: '/solutions/endpoints',
  },
}

export default function EndpointsPage() {
  return (
    <PageShell
      title="Endpoint Protection"
      description="Every device is a potential entry point. Mitigence engineers endpoint security controls, validates configurations, tests detection capabilities, and ensures your endpoint stack operates at full potential."
    />
  )
}
