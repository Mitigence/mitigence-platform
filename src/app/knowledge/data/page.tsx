import type { Metadata } from 'next'
import { KnowledgeTopic } from '@/components/knowledge/KnowledgeTopic'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Data Security",
  description: "Data classification, DLP implementation, DSPM, and data flow analysis — understanding and building a complete data security program.",
  alternates: {
    canonical: "/knowledge/data",
  },
}

export default function KnowledgeDataPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-12">Data Security</h1>
        <KnowledgeTopic topicId="data" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Knowledge Center', path: '/knowledge' },
        { name: 'Data Security', path: '/knowledge/data' },
      ])) }} />
    </main>
  )
}
