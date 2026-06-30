import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Security capabilities across eight domains — applications, cloud, identity, network, endpoints, data, remote access, and monitoring.',
  alternates: {
    canonical: '/solutions',
  },
}

export default function SolutionsPage() {
  return (
    <PageShell
      title="Security Solutions"
      description="Eight security domains. Each one an engineering discipline — not a product category. Explore how Mitigence approaches application security, cloud security, identity, network, endpoints, data protection, remote access, and security monitoring."
    />
  )
}
