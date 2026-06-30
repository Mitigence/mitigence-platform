import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Knowledge Center',
  description: 'Interactive cybersecurity learning — not a blog, an encyclopedia.',
  alternates: {
    canonical: '/platform/understand/knowledge-center',
  },
}

export default function KnowledgeCenterPage() {
  return (
    <PageShell
      title="Knowledge Center"
      description="An interactive learning resource covering cybersecurity domains, methodologies, and engineering practices. Choose a topic — cloud, identity, applications, monitoring, network, incident response, or architecture — and explore through animated explanations and practical guidance."
    />
  )
}
