import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Security Engineering',
  description: 'How Mitigence engineers cybersecurity — from architecture design through operational readiness and continuous optimization.',
  alternates: {
    canonical: '/engineering',
  },
}

const services = [
  { name: 'Security Architecture', href: '/engineering/architecture', description: 'Reference architectures, capability blueprints, and zero-trust design.' },
  { name: 'Deployment', href: '/engineering/deployment', description: 'Structured implementation of security controls with validation at every stage.' },
  { name: 'Integration', href: '/engineering/integration', description: 'Connect controls into a unified, coherent program that shares data and automates response.' },
  { name: 'Configuration Review', href: '/engineering/configuration-review', description: 'Independent validation that deployed controls are correctly configured and staying that way.' },
  { name: 'Health Checks', href: '/engineering/health-checks', description: 'Periodic posture validation against defined baselines with delta reporting.' },
  { name: 'Optimization', href: '/engineering/optimization', description: 'Improve detection effectiveness, reduce noise, and close coverage gaps continuously.' },
  { name: 'Operational Readiness', href: '/engineering/operational-readiness', description: 'Transition controls into operational management with runbooks and trained teams.' },
]

export default function EngineeringPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Security Engineering</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Engineering is what separates Mitigence from assessment-only firms. Every engagement
          follows a structured engineering lifecycle — architecture through operational readiness.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-4 transition-colors" />
              <h2 className="text-white font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">{s.name}</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Security Engineering', path: '/engineering' },
      ])) }} />
    </main>
  )
}
