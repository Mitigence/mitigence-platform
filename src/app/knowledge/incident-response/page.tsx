import type { Metadata } from 'next'
import { KnowledgeTopic } from '@/components/knowledge/KnowledgeTopic'

export const metadata: Metadata = {
  title: "Incident Response",
  description: "IR planning, playbook development, tabletop exercises, and post-incident reviews.",
  alternates: {
    canonical: "/knowledge/incident-response",
  },
}

export default function KnowledgeIRPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-12">Incident Response</h1>
        <KnowledgeTopic topicId="Incident Response" />
      </div>
    </main>
  )
}
