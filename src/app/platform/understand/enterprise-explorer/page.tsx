import type { Metadata } from 'next'
import { EnterpriseExplorer } from '@/components/enterprise-explorer/EnterpriseExplorer'

export const metadata: Metadata = {
  title: 'Enterprise Explorer',
  description: 'Navigate your digital enterprise and discover security considerations for every layer.',
  alternates: {
    canonical: '/platform/understand/enterprise-explorer',
  },
}

export default function EnterpriseExplorerPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Enterprise Explorer</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          An interactive map of your digital enterprise. Navigate between identity, endpoints,
          cloud, networks, applications, APIs, data, and remote access to understand common risks
          and how Mitigence approaches each domain.
        </p>
        <EnterpriseExplorer />
      </div>
    </main>
  )
}
