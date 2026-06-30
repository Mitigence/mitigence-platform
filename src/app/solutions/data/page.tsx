import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Data — Mitigence",
  description: "Structured and unstructured data — the asset every other control exists to protect. Discovery, assessment, engineering, and continuous improvement.",
  alternates: { canonical: "/solutions/data" },
}

export default function SolutionsDataPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Data</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">Structured and unstructured data — the asset every other control exists to protect.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Common challenges</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Unclear data classification and ownership</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Overprivileged access to sensitive stores</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />Limited visibility into where sensitive data lives</li>
              <li className="flex items-start gap-2 text-zinc-400 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />No consistent encryption or retention policy</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Business risk</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">Data exposure is usually the headline outcome of a breach — and the hardest to fully remediate after the fact.</p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">How Mitigence helps</h2>
          <ol className="space-y-3">
            <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span><span className="text-zinc-300 text-sm">Discovery</span></li>
              <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span><span className="text-zinc-300 text-sm">Classification</span></li>
              <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span><span className="text-zinc-300 text-sm">Access Review</span></li>
              <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span><span className="text-zinc-300 text-sm">Engineering</span></li>
              <li className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">5</span><span className="text-zinc-300 text-sm">Validation</span></li>
          </ol>
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
