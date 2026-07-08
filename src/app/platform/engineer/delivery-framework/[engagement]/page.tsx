import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import engagementsData from '@/data/engagements.json'
import { breadcrumbJsonLd } from '@/lib/seo'

interface Props {
  params: Promise<{ engagement: string }>
}

export async function generateStaticParams() {
  return engagementsData.engagements.map((e) => ({ engagement: e.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { engagement } = await params
  const eng = engagementsData.engagements.find((e) => e.id === engagement)
  if (!eng) return {}
  return {
    title: `${eng.name} — Delivery Framework`,
    description: eng.tagline,
    alternates: { canonical: `/platform/engineer/delivery-framework/${engagement}` },
  }
}

export default async function EngagementDetailPage({ params }: Props) {
  const { engagement } = await params
  const eng = engagementsData.engagements.find((e) => e.id === engagement)
  if (!eng) notFound()

  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-10 flex-wrap">
          <Link href="/platform/engineer/delivery-framework" className="hover:text-zinc-400 transition-colors">Delivery Framework</Link>
          <span>/</span>
          <span className="text-zinc-400">{eng.name}</span>
        </nav>

        {/* Header */}
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
            {eng.activityType}
          </span>
          <span className="text-xs text-zinc-600 border border-zinc-800 bg-zinc-950 px-3 py-1 rounded-full">
            ⏱ {eng.timeline}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">{eng.name}</h1>
        <p className="text-zinc-300 text-lg mb-3 leading-relaxed">{eng.tagline}</p>
        <p className="text-zinc-500 text-sm leading-relaxed mb-12 max-w-2xl">{eng.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {eng.tags.map((tag) => (
            <span key={tag} className="text-xs text-zinc-500 border border-zinc-800 bg-zinc-950 px-2.5 py-1 rounded-md">{tag}</span>
          ))}
        </div>

        {/* Phases */}
        <div className="mb-12">
          <h2 className="text-white font-semibold text-xs uppercase tracking-widest mb-6">Engagement Phases</h2>
          <div className="space-y-0">
            {eng.phases.map((phase, idx) => (
              <div key={phase.name} className="flex gap-5 group">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full border border-zinc-700 bg-zinc-950 flex items-center justify-center flex-shrink-0 group-hover:border-red-600/60 transition-colors">
                    <span className="text-zinc-500 text-xs font-medium group-hover:text-red-500 transition-colors">{idx + 1}</span>
                  </div>
                  {idx < eng.phases.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-800 my-1" />
                  )}
                </div>
                {/* Phase content */}
                <div className={`pb-8 ${idx === eng.phases.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex flex-wrap items-baseline gap-3 mb-1">
                    <h3 className="text-white font-medium text-sm">{phase.name}</h3>
                    <span className="text-zinc-600 text-xs">{phase.duration}</span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 mb-12">
          <h2 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">What You Receive</h2>
          <ul className="space-y-3">
            {eng.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 text-zinc-400 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA strip */}
        <div className="rounded-xl border border-red-600/20 bg-red-600/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h3 className="text-white font-semibold mb-1">Ready to scope this engagement?</h3>
            <p className="text-zinc-400 text-sm">Tell us about your environment and objectives — we&apos;ll map the approach to your context.</p>
          </div>
          <Link href="/consultation" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
            Schedule a call →
          </Link>
        </div>

        {/* Back navigation */}
        <div className="border-t border-zinc-900 pt-8 flex flex-wrap gap-4">
          <Link href="/platform/engineer/delivery-framework"
            className="border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            ← All engagement types
          </Link>
          <Link href="/platform/engineer/engagement-studio"
            className="border border-zinc-800 hover:border-red-600/50 text-zinc-400 hover:text-red-400 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Design a custom engagement →
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Platform', path: '/platform' },
        { name: 'Engineer', path: '/platform/engineer' },
        { name: 'Delivery Framework', path: '/platform/engineer/delivery-framework' },
        { name: eng.name, path: `/platform/engineer/delivery-framework/${eng.id}` },
      ])) }} />
    </main>
  )
}
