import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'The Platform',
  description: 'Understand, Engineer, and Operate your cybersecurity program through the Mitigence Experience Platform.',
  alternates: {
    canonical: '/platform',
  },
}

export default function PlatformPage() {
  return (
    <PageShell
      title="The Mitigence Platform"
      description="Three interconnected experiences — Understand, Engineer, and Operate — that guide organizations from discovery to continuous improvement. Each experience is a product in its own right."
    />
  )
}
