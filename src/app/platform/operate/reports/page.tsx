import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Reports',
  description: 'Interactive reports — not 100-page PDFs. Executive summaries, risk heatmaps, and actionable recommendations.',
  alternates: {
    canonical: '/platform/operate/reports',
  },
}

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports"
      description="Cybersecurity reports reimagined. Interactive executive summaries, risk heatmaps, affected asset views, priority matrices, and actionable recommendations — consumable online first, exportable second."
    />
  )
}
