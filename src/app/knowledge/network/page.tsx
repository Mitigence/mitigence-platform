import type { Metadata } from 'next'
import { KnowledgeTopic } from '@/components/knowledge/KnowledgeTopic'

export const metadata: Metadata = {
  title: "Network Security",
  description: "Network segmentation, firewall architecture, lateral movement prevention, and network detection.",
  alternates: {
    canonical: "/knowledge/network",
  },
}

export default function KnowledgeNetworkPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-12">Network Security</h1>
        <KnowledgeTopic topicId="Network Security" />
      </div>
    </main>
  )
}
