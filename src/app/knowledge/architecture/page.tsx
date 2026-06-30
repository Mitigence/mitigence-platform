import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Architecture Knowledge',
  description: 'Understanding security architecture â€” frameworks, design principles, and building defensible systems.',
}

export default function KnowledgeArchitecturePage() {
  return (
    <PageShell
      title="Security Architecture"
      description="Understanding security architecture â€” design principles, common frameworks (SABSA, TOGAF, zero-trust), threat modelling, defence-in-depth strategies, and how architecture decisions shape long-term security outcomes."
    />
  )
}
