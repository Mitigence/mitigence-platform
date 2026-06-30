import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Enterprise Explorer',
  description: 'Navigate your digital enterprise and discover security considerations for every layer.',
}

export default function EnterpriseExplorerPage() {
  return (
    <PageShell
      title="Enterprise Explorer"
      description="An interactive map of your digital enterprise. Navigate between identity, endpoints, cloud, networks, applications, APIs, data, and remote access to understand common risks and how Mitigence approaches each domain."
    />
  )
}
