import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Security Health Checks",
  description: "Ongoing validation that controls remain effective as environments change.",
  alternates: { canonical: "/engineering/health-checks" },
}

export default function EngineeringHealthChecksPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Security Health Checks</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">Security controls degrade over time. Configurations drift. Detection rules go stale. Mitigence health checks are structured validation exercises that confirm security posture against a defined baseline — and identify what has changed.</p>

        <h2 className="text-white font-semibold mb-4">What this covers</h2>
        <ul className="space-y-3 mb-10">
          <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Periodic posture validation against CIS Benchmarks</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Detection rule coverage assessment</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Alert quality and false positive rate review</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Access control freshness checks</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Comparison against prior baseline with delta reporting</li>
        </ul>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Typical deliverables</h3>
          <ul className="space-y-2">
                <li key="Program Review Report" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Program Review Report</li>
                <li key="Updated Roadmap" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Updated Roadmap</li>
                <li key="Executive Briefing" className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Executive Briefing</li>
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
