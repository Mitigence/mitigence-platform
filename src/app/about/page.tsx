import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'About',
  description: 'Our story, our mission, and what drives us to approach cybersecurity differently.',
}

export default function AboutPage() {
  return (
    <PageShell
      title="About Mitigence"
      description="Our story, our mission, and what drives us to approach cybersecurity differently â€” with engineering at the centre, transparency at every step, and a genuine commitment to outcomes over activity."
    />
  )
}
