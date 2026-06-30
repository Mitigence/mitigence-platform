import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Customer Success',
  description: 'How Mitigence ensures long-term success for every engagement.',
  alternates: {
    canonical: '/platform/operate/customer-success',
  },
}

export default function CustomerSuccessPage() {
  return (
    <PageShell
      title="Customer Success"
      description="How Mitigence measures and delivers long-term value — from the first engagement through ongoing partnership, maturity growth, and strategic planning."
    />
  )
}
