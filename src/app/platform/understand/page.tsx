import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Understand',
  description: 'Explore your digital environment, discover threats, and learn about modern security practices.',
}

export default function UnderstandPage() {
  return (
    <PageShell
      title="Understand"
      description="Explore your digital enterprise, discover attack surfaces, identify security priorities, and learn about modern cybersecurity practices — before any sales conversation begins."
      phase="Phase 2"
    />
  )
}
