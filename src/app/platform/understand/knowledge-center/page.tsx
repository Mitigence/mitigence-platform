import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Knowledge Center',
  description: 'Interactive cybersecurity learning â€” not a blog, an encyclopedia.',
}

export default function KnowledgeCenterPage() {
  return (
    <PageShell
      title="Knowledge Center"
      description="An interactive learning resource covering cybersecurity domains, methodologies, and engineering practices. Choose a topic â€” cloud, identity, applications, monitoring, network, incident response, or architecture â€” and explore through animated explanations and practical guidance."
    />
  )
}
