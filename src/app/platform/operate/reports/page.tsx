import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Reports",
  description: "Interactive reports — not 100-page PDFs. Executive summaries, risk heatmaps, and actionable recommendations.",
  alternates: { canonical: "/platform/operate/reports" },
}

export default function ReportsPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Reports</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">Cybersecurity reports should be consumable, not archiveable. Mitigence produces reports that executives can read in minutes and engineers can act on immediately.</p>
        <div className="space-y-8 mb-10">

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Executive summary</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Start with business impact</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Findings are framed in terms of business risk, not just technical severity. Executives get what they need to make decisions without wading through 80 pages of raw findings.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Risk heatmap</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Prioritized by actual risk</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Every finding is scored by exploitability, impact, and remediation effort — giving your team a clear, defensible prioritization. High-severity findings with low remediation effort are addressed first.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Technical detail</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Evidence-backed findings</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Technical findings include evidence, affected assets, attack paths, and specific remediation guidance. Not just what the problem is — exactly how to fix it.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Remediation roadmap</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Findings as a workplan</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Reports close with a sequenced remediation roadmap that your team can act on directly. Optional export to PDF for stakeholder distribution.</p>
        </div>
        </div>
        <div className="border-t border-zinc-900 pt-8">
          <Link href="/consultation" className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Talk to a specialist &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
