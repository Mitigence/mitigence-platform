import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Operate',
  description: 'See how Mitigence operates alongside your team â€” projects, reports, reviews, and continuous improvement.',
}

export default function OperatePage() {
  return (
    <PageShell
      title="Operate"
      description="The operational experience of working with Mitigence â€” project tracking, interactive reports, milestone reviews, and continuous improvement. Transparency at every stage of delivery."
    />
  )
}
