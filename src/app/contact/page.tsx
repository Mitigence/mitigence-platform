import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Mitigence.',
}

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Mitigence"
      description="Get in touch with the Mitigence team. Whether you have a specific security challenge, want to explore an engagement, or simply want to understand how we work — we're here."
      phase="Phase 0"
    />
  )
}
