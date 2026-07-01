import type { Metadata } from 'next'
import { breadcrumbJsonLd } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Security Deployment",
  description: "Structured implementation of security controls across your environment.",
  alternates: { canonical: "/engineering/deployment" },
}

export default function EngineeringDeploymentPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Security Deployment</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">Deploying security tools is not the same as deploying security. Mitigence engineers controls using a structured methodology that confirms each component is correctly configured before moving to the next.</p>

        <h2 className="text-white font-semibold mb-4">What this covers</h2>
        <ul className="space-y-3 mb-10">
          <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Vendor-neutral deployment across all security domains</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Staged rollout with configuration validation at each stage</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Integration of controls into existing tooling and workflows</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Documentation of every configuration decision</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Knowledge transfer at deployment completion</li>
        </ul>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Typical deliverables</h3>
          <ul className="space-y-2">
                <li key="Deployed Controls" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Deployed Controls</li>
                <li key="Configuration Baseline Document" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Configuration Baseline Document</li>
                <li key="Implementation Notes" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Implementation Notes</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/platform/engineer/engagement-studio" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Design an engagement &rarr;
          </Link>
          <Link href="/consultation" className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Talk to a specialist
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Security Engineering', path: '/engineering' },
        { name: 'Deployment', path: '/engineering/deployment' },
      ])) }} />
    </main>
  )
}
