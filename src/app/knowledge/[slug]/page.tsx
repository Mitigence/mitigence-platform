import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Cybersecurity knowledge article from Mitigence.`,
  }
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <PageShell
      title={title}
      description="This knowledge article will contain interactive diagrams, methodology explanations, and practical cybersecurity guidance from the Mitigence engineering team."

    />
  )
}
