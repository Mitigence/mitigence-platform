import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Configuration Review",
  description: "Validate that what was deployed is configured correctly and staying that way.",
  alternates: { canonical: "/engineering/configuration-review" },
}

export default function EngineeringConfigurationReviewPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Configuration Review</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">A tool deployed with a default or incorrect configuration provides the appearance of security without the substance. Mitigence validates configurations independently from implementation — and reviews them periodically as environments change.</p>

        <h2 className="text-white font-semibold mb-4">What this covers</h2>
        <ul className="space-y-3 mb-10">
          <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />CIS Benchmark assessment for cloud, endpoint, and network controls</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Firewall rule review and policy optimization</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Identity and access policy review</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />SIEM detection coverage validation</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Security tool health check — are the controls actually working?</li>
        </ul>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Typical deliverables</h3>
          <ul className="space-y-2">
                <li key="Validation Report" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Validation Report</li>
                <li key="Test Evidence Package" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Test Evidence Package</li>
                <li key="Finding Remediation List" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Finding Remediation List</li>
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
    </main>
  )
}
