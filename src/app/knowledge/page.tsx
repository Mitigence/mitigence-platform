import type { Metadata } from 'next'
import { KnowledgeHub } from '@/components/knowledge/KnowledgeHub'

export const metadata: Metadata = {
  title: 'Knowledge Center',
  description: 'An interactive cybersecurity learning hub. Not a blog — a structured resource covering security domains, engineering methodologies, and practical guidance.',
  alternates: {
    canonical: '/knowledge',
  },
}

export default function KnowledgePage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Knowledge Center</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Not a blog. A structured resource covering the security domains and engineering
          methodologies that matter to modern enterprises. Select a topic to explore.
        </p>
        <KnowledgeHub />
      </div>
    </main>
  )
}
