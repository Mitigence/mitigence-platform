import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${title} | Success Story`,
    description: `Mitigence success story: ${title}. A structured narrative covering challenge, engineering approach, and outcomes.`,
  }
}

export default async function SuccessStoryPage({ params }: Props) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <PageShell
      title={title}
      description="This success story will detail the engagement challenge, discovery findings, assessment results, engineering approach, validation outcomes, and the ongoing improvement roadmap — following the Mitigence structured delivery narrative."
      phase="Phase 3"
      module="Module 9 — Success Story"
    />
  )
}
