import type { Metadata } from 'next'
import { CustomerWorkspacePreview } from '@/components/customer-workspace/CustomerWorkspacePreview'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Customer Workspace',
  description: 'Your engagement hub — projects, reports, deliverables, milestones, and collaboration in one place.',
  alternates: {
    canonical: '/platform/operate/customer-workspace',
  },
}

export default function CustomerWorkspacePage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Customer Workspace</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          This is what working with Mitigence looks like after an engagement begins. One workspace
          for everything — projects, reports, deliverables, meetings, and recommendations. Not a
          portal. A collaboration environment.
        </p>
        <CustomerWorkspacePreview />
        <div className="mt-8">
          <Link
            href="/consultation"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Start an engagement →
          </Link>
        </div>
      </div>
    </main>
  )
}
