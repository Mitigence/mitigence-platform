import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Knowledge Center',
  description: 'An interactive cybersecurity learning hub. Not a blog â€” a structured resource covering security domains, engineering methodologies, and practical guidance.',
}

export default function KnowledgePage() {
  return (
    <PageShell
      title="Knowledge Center"
      description="An interactive cybersecurity learning hub. Not a blog â€” a structured resource covering security domains, engineering methodologies, and practical guidance. Choose a topic and explore through diagrams, explanations, and Mitigence's engineering approach."
    />
  )
}
