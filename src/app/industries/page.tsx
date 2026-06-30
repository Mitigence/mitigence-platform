import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Industries',
  description: 'Every sector faces distinct security pressures. Explore how Mitigence approaches financial services, healthcare, government, education, retail, and manufacturing.',
  alternates: {
    canonical: '/industries',
  },
}

export default function IndustriesPage() {
  return (
    <PageShell
      title="Industries"
      description="Every sector faces distinct security pressures. Explore how Mitigence approaches financial services, healthcare, government, education, retail, and manufacturing — with context-specific challenges and relevant engagement approaches."
    />
  )
}
