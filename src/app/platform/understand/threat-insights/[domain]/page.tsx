import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import threatsData from '@/data/threats.json'
import { breadcrumbJsonLd } from '@/lib/seo'

interface Props {
  params: Promise<{ domain: string }>
}

export async function generateStaticParams() {
  return threatsData.domains.map((d) => ({ domain: d.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params
  const d = threatsData.domains.find((x) => x.id === domain)
  if (!d) return {}
  return {
    title: `${d.name} — Threat Insights`,
    description: d.description,
    alternates: { canonical: `/platform/understand/threat-insights/${domain}` },
  }
}

export default async function ThreatDomainPage({ params }: Props) {
  const { domain } = await params
  const d = threatsData.domains.find((x) => x.id === domain)
  if (!d) notFound()

  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-10">
          <Link href="/platform/understand/threat-insights" className="hover:text-zinc-400 transition-colors">Threat Insights</Link>
          <span>/</span>
          <span className="text-zinc-400">{d.name}</span>
        </nav>

        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">{d.name}</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed max-w-2xl">{d.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {d.threats.map((t) => (
            <Link
              key={t.id}
              href={`/platform/understand/threat-insights/${domain}/${t.id}`}
              className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-3 transition-colors" />
              <h2 className="text-white font-semibold mb-2 text-sm group-hover:text-red-400 transition-colors">{t.name}</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">{t.tagline}</p>
              <span className="text-red-600 text-xs font-medium mt-3 block">Understand this threat →</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/platform/understand/threat-insights" className="border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            ← All threat domains
          </Link>
          <Link href="/platform/engineer/engagement-studio" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Design an engagement →
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Threat Insights', path: '/platform/understand/threat-insights' },
        { name: d.name, path: `/platform/understand/threat-insights/${domain}` },
      ])) }} />
    </main>
  )
}
