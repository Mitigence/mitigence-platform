import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Secure Remote Access',
  description: 'Remote workforces require more than VPNs. Mitigence designs and engineers secure access architectures for modern distributed teams.',
}

export default function RemoteAccessPage() {
  return (
    <PageShell
      title="Secure Remote Access"
      description="Remote workforces require more than VPNs. Mitigence designs and engineers secure access architectures — zero-trust network access, identity-aware proxies, and session monitoring — built for modern distributed teams."
      phase="Phase 1"
      module="Module 4 — Capability: Remote Access"
    />
  )
}
