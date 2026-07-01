import type { Metadata } from 'next'
import { breadcrumbJsonLd } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Operational Readiness",
  description: "Transition controls into operational management with clear runbooks and capable teams.",
  alternates: { canonical: "/engineering/operational-readiness" },
}

export default function EngineeringOperationalReadinessPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Operational Readiness</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">A security control that nobody knows how to operate is a control that will not be maintained. Mitigence engineering engagements close with operational readiness validation — making sure your team can run what we built.</p>

        <h2 className="text-white font-semibold mb-4">What this covers</h2>
        <ul className="space-y-3 mb-10">
          <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Operational runbook development for all deployed controls</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Analyst training on detection workflows and escalation paths</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Alert playbook creation for the most common incident types</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Operational acceptance testing with your team</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Ongoing operational support and tuning retainer options</li>
        </ul>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Typical deliverables</h3>
          <ul className="space-y-2">
                <li key="Operational Runbooks" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Operational Runbooks</li>
                <li key="Alert Playbooks" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Alert Playbooks</li>
                <li key="Knowledge Transfer Package" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Knowledge Transfer Package</li>
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
        { name: 'Operational Readiness', path: '/engineering/operational-readiness' },
      ])) }} />
    </main>
  )
}
