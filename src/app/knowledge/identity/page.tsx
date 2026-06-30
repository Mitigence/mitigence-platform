import type { Metadata } from 'next'
import { KnowledgeTopic } from '@/components/knowledge/KnowledgeTopic'

export const metadata: Metadata = {
  title: "Identity & Access Management",
  description: "IAM, zero-trust identity, privileged access management, and directory security.",
  alternates: {
    canonical: "/knowledge/identity",
  },
}

export default function KnowledgeIdentityPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-12">Identity & Access Management</h1>
        <KnowledgeTopic topicId="Identity & Access Management" />
      </div>
    </main>
  )
}
