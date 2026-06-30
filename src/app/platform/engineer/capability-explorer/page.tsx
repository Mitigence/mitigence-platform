import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Capability Explorer',
  description: 'Explore Mitigence security capabilities across identity, cloud, applications, monitoring, network, endpoints, data, and remote access.',
}

export default function CapabilityExplorerPage() {
  return (
    <PageShell
      title="Capability Explorer"
      description="Eight security domains. Click any domain to explore the engineering lifecycle inside it â€” from architecture and assessment through deployment, validation, and optimization. Capabilities, not vendor products."
    />
  )
}
