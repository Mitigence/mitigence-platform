import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import threatsData from '@/data/threats.json'
import { breadcrumbJsonLd } from '@/lib/seo'

interface Props {
  params: Promise<{ domain: string; threat: string }>
}

export async function generateStaticParams() {
  return threatsData.domains.flatMap((d) =>
    d.threats.map((t) => ({ domain: d.id, threat: t.id }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, threat } = await params
  const d = threatsData.domains.find((x) => x.id === domain)
  const t = d?.threats.find((x) => x.id === threat)
  if (!d || !t) return {}
  return {
    title: `${t.name} — ${d.name} | Threat Insights`,
    description: t.tagline,
    alternates: { canonical: `/platform/understand/threat-insights/${domain}/${threat}` },
  }
}

export default async function ThreatDetailPage({ params }: Props) {
  const { domain, threat } = await params
  const d = threatsData.domains.find((x) => x.id === domain)
  const t = d?.threats.find((x) => x.id === threat)
  if (!d || !t) notFound()

  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-10 flex-wrap">
          <Link href="/platform/understand/threat-insights" className="hover:text-zinc-400 transition-colors">Threat Insights</Link>
          <span>/</span>
          <Link href={`/platform/understand/threat-insights/${domain}`} className="hover:text-zinc-400 transition-colors">{d.name}</Link>
          <span>/</span>
          <span className="text-zinc-400">{t.name}</span>
        </nav>

        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">{d.name}</p>
        <h1 className="text-4xl font-bold text-white mb-4">{t.name}</h1>
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">{t.tagline}</p>

        {/* Description */}
        <div className="mb-10">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">What it is</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{t.description}</p>
        </div>

        {/* Techniques */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Attack techniques</h2>
          <ul className="space-y-2">
            {t.techniques.map((technique) => (
              <li key={technique} className="flex items-start gap-2 text-zinc-400 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                {technique}
              </li>
            ))}
          </ul>
        </div>

        {/* Impact */}
        <div className="rounded-lg border border-red-600/20 bg-red-600/5 p-6 mb-10">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Business impact</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">{t.impact}</p>
        </div>

        {/* References */}
        <div className="mb-12">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Authoritative references</h2>
          <ul className="space-y-2">
            {t.references.map((ref) => (
              <li key={ref.url} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
                <a href={ref.url} target="_blank" rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 text-sm underline underline-offset-2 transition-colors">
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="border-t border-zinc-900 pt-8 flex flex-wrap gap-4">
          <Link href={`/platform/understand/threat-insights/${domain}`}
            className="border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            ← Back to {d.name}
          </Link>
          <Link href="/platform/engineer/engagement-studio"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Design an engagement →
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Threat Insights', path: '/platform/understand/threat-insights' },
        { name: d.name, path: `/platform/understand/threat-insights/${domain}` },
        { name: t.name, path: `/platform/understand/threat-insights/${domain}/${threat}` },
      ])) }} />
    </main>
  )
}
