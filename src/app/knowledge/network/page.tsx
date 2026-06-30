import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Network Security Knowledge',
  description: 'Understanding network security â€” segmentation, firewalls, traffic analysis, and infrastructure protection.',
}

export default function KnowledgeNetworkPage() {
  return (
    <PageShell
      title="Network Security"
      description="Understanding network security â€” segmentation strategies, firewall architectures, traffic analysis, intrusion detection, VPN technologies, and the principles of building resilient, defensible network infrastructure."
    />
  )
}
