import type { Metadata } from 'next'
import Link from 'next/link'
import engagementsData from '@/data/engagements.json'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Delivery Framework',
  description: 'Every engagement type Mitigence delivers — timelines, phases, and deliverables before the first conversation.',
  alternates: { canonical: '/platform/engineer/delivery-framework' },
}

const TYPE_COLORS: Record<string, string> = {
  'Offensive Security': 'text-red-400 border-red-600/30 bg-red-600/5',
  'Engineering / Architecture': 'text-blue-400 border-blue-600/30 bg-blue-600/5',
  'Identity Engineering': 'text-purple-400 border-purple-600/30 bg-purple-600/5',
  'Risk & Compliance': 'text-amber-400 border-amber-600/30 bg-amber-600/5',
  'GRC / Compliance': 'text-amber-400 border-amber-600/30 bg-amber-600/5',
  'Specialist Assessment': 'text-teal-400 border-teal-600/30 bg-teal-600/5',
  'Risk Assessment': 'text-orange-400 border-orange-600/30 bg-orange-600/5',
  'Preparedness': 'text-green-400 border-green-600/30 bg-green-600/5',
  'Compliance / GRC': 'text-amber-400 border-amber-600/30 bg-amber-600/5',
  'Network Engineering': 'text-cyan-400 border-cyan-600/30 bg-cyan-600/5',
  'Risk Programme': 'text-orange-400 border-orange-600/30 bg-orange-600/5',
  'Assessment': 'text-zinc-300 border-zinc-600/30 bg-zinc-600/5',
  'Engineering / Operations': 'text-blue-400 border-blue-600/30 bg-blue-600/5',
  'Compliance Assessment': 'text-amber-400 border-amber-600/30 bg-amber-600/5',
  'Offensive Security / DevSecOps': 'text-red-400 border-red-600/30 bg-red-600/5',
}

export default function DeliveryFrameworkPage() {
  return (
    <main className="min-h-screen pt-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Delivery Framework</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-4">
          Every engagement type Mitigence delivers — including activity type, timeline, phases, and deliverables. Understand the process before the first conversation.
        </p>
        <p className="text-zinc-600 text-sm mb-12">{engagementsData.engagements.length} engagement types across offensive security, engineering, compliance, and risk.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {engagementsData.engagements.map((eng) => {
            const typeClass = TYPE_COLORS[eng.activityType] ?? 'text-zinc-400 border-zinc-600/30 bg-zinc-600/5'
            return (
              <Link
                key={eng.id}
                href={`/platform/engineer/delivery-framework/${eng.id}`}
                className="group block bg-zinc-950 border border-zinc-800 hover:border-red-600/50 rounded-xl p-6 transition-all hover:bg-zinc-900/60"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md border ${typeClass}`}>
                    {eng.activityType}
                  </span>
                  <span className="text-zinc-600 text-xs whitespace-nowrap mt-0.5">{eng.timeline}</span>
                </div>
                <h2 className="text-white font-semibold text-sm mb-2 group-hover:text-red-400 transition-colors leading-snug">
                  {eng.name}
                </h2>
                <p className="text-zinc-500 text-xs leading-relaxed mb-4">{eng.tagline}</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 text-xs">{eng.phases.length} phases · {eng.deliverables.length} deliverables</span>
                  <span className="text-red-600 text-xs font-medium group-hover:text-red-500 transition-colors">View →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Platform', path: '/platform' },
        { name: 'Engineer', path: '/platform/engineer' },
        { name: 'Delivery Framework', path: '/platform/engineer/delivery-framework' },
      ])) }} />
    </main>
  )
}
