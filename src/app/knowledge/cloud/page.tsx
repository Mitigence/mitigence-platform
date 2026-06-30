import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Cloud Security Knowledge',
  description: 'Understanding cloud security â€” architecture, shared responsibility, configuration, and workload protection.',
}

export default function KnowledgeCloudPage() {
  return (
    <PageShell
      title="Cloud Security"
      description="Understanding cloud security from the ground up â€” shared responsibility models, architecture patterns, configuration management, identity in the cloud, and workload protection across AWS, Azure, and GCP."
    />
  )
}
