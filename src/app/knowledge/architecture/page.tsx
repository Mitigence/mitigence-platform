import type { Metadata } from 'next'
import { KnowledgeTopic } from '@/components/knowledge/KnowledgeTopic'

export const metadata: Metadata = {
  title: "Security Architecture",
  description: "Security architecture design, capability mapping, and program blueprints.",
  alternates: {
    canonical: "/knowledge/architecture",
  },
}

export default function KnowledgeArchitecturePage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-12">Security Architecture</h1>
        <KnowledgeTopic topicId="Security Architecture" />
      </div>
    </main>
  )
}
