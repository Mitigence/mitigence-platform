import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Engineer',
  description: 'Design your security engagement, assemble specialists, and build the right program for your organization.',
}

export default function EngineerPage() {
  return (
    <PageShell
      title="Engineer"
      description="Design your cybersecurity engagement, configure your scope, assemble specialist teams, and understand exactly how Mitigence delivers. The planning experience that replaces the sales brochure."
    />
  )
}
