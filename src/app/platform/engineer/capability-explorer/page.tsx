import type { Metadata } from 'next'
import { CapabilityExplorer } from '@/components/capability-explorer/CapabilityExplorer'

export const metadata: Metadata = {
  title: 'Capability Explorer',
  description: 'Explore Mitigence security capabilities across identity, cloud, applications, monitoring, network, endpoints, data, and remote access.',
  alternates: {
    canonical: '/platform/engineer/capability-explorer',
  },
}

export default function CapabilityExplorerPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Capability Explorer</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Eight security domains. Select any domain to explore how Mitigence engineers that
          capability end-to-end — from architecture and assessment through deployment, validation,
          and optimization. Capabilities, not vendor products.
        </p>
        <CapabilityExplorer />
      </div>
    </main>
  )
}
