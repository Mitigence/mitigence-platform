import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Identity Security Knowledge',
  description: 'Understanding identity security — authentication, authorisation, privileged access, and zero-trust principles.',
  alternates: {
    canonical: '/knowledge/identity',
  },
}

export default function KnowledgeIdentityPage() {
  return (
    <PageShell
      title="Identity Security"
      description="Understanding identity security — authentication, authorisation, privileged access management, directory services, federation, and the principles of zero-trust identity architecture."
    />
  )
}
