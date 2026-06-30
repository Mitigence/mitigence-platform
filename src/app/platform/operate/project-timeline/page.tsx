import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Project Timeline',
  description: 'Track your security engagement from kickoff to completion and beyond.',
}

export default function ProjectTimelinePage() {
  return (
    <PageShell
      title="Project Timeline"
      description="A structured view of your engagement timeline â€” kickoff, discovery, assessment, engineering, validation, reporting, and ongoing improvement. Every milestone, every deliverable, every review point visible from day one."
    />
  )
}
