import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Integration',
  description: 'Security controls don\'t operate in isolation — Mitigence engineers the connections between systems.',
}

export default function IntegrationPage() {
  return (
    <PageShell
      title="Security Integration"
      description="Security controls don't operate in isolation. Mitigence engineers the connections between systems — ensuring your identity, endpoint, network, cloud, and monitoring layers work as a coherent, integrated capability."
      phase="Phase 2"
    />
  )
}
