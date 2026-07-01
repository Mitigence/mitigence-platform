import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About Mitigence',
  description: 'Our story, our mission, and what drives us to approach cybersecurity differently.',
  alternates: {
    canonical: '/about',
  },
}

const principles = [
  {
    title: 'Engineering before marketing',
    body: 'We demonstrate capability through the work itself — not through credentials and case study bullet points. Every methodology we reference, we execute.',
  },
  {
    title: 'Transparency throughout',
    body: "Clients should always know what is happening, why it is happening, and what comes next. We don't hide behind jargon or opaque delivery timelines.",
  },
  {
    title: 'Outcomes over activity',
    body: 'Reports that sit in a drawer and findings that never get fixed are not outcomes. We consider an engagement successful only when the risk it addressed is measurably reduced.',
  },
  {
    title: 'Vendor-neutral by design',
    body: 'We have no product commissions. Our recommendations are based on what fits your environment, your team, and your objectives — not our partnership agreements.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">About Mitigence</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          Mitigence is a Cybersecurity Delivery Platform — a consultancy that approaches
          cybersecurity as an engineering discipline rather than a service catalog.
        </p>

        <div className="border-l-2 border-red-600/30 pl-6 mb-12">
          <p className="text-zinc-300 text-base leading-relaxed mb-4">
            We started with a simple observation: most cybersecurity providers describe what they
            do, but rarely demonstrate how they do it. Clients are left comparing marketing claims
            without the context to evaluate them.
          </p>
          <p className="text-zinc-300 text-base leading-relaxed">
            Mitigence was built to do the opposite. Every engagement is structured around
            transparency — clear scope, clear methodology, clear deliverables, and clear outcomes.
            No black-box delivery. No findings without remediation paths. No reports that nobody
            reads.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">What we believe</h2>
        <div className="space-y-8 mb-12">
          {principles.map((p) => (
            <div key={p.title}>
              <h3 className="text-white font-semibold mb-2">{p.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/approach"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Our approach →
          </Link>
          <Link
            href="/consultation"
            className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Talk to us
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ])) }} />
    </main>
  )
}
