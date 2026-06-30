import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Identity Security',
  description: 'Identity is the new perimeter. Mitigence architects, deploys, validates, and continuously optimises identity security controls.',
}

export default function IdentityPage() {
  return (
    <PageShell
      title="Identity Security"
      description="Identity is the new perimeter. Mitigence architects, deploys, validates, and continuously optimises identity security controls â€” from directory hardening and PAM to zero-trust access and conditional policy."
    />
  )
}
