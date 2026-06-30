import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Security Journey Designer',
  description: 'Discover where your organization is today and design a roadmap to where you want to be.',
}

export default function SecurityJourneyPage() {
  return (
    <PageShell
      title="Security Journey Designer"
      description="Select your current security maturity level, define where you want to be, and receive a tailored roadmap â€” from assessment through engineering, operations, and continuous improvement."
    />
  )
}
