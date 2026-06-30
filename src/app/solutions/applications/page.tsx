import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Application Security',
  description: 'Securing modern applications from architecture through continuous review.',
}

export default function ApplicationsPage() {
  return (
    <PageShell
      title="Application Security"
      description="Securing modern applications from architecture through continuous review. Discovery, assessment, risk analysis, remediation guidance, validation, and ongoing review â€” not just a one-time test."
    />
  )
}
