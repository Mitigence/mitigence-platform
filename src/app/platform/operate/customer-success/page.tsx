import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Customer Success",
  description: "Long-term partnership that keeps your security program effective and evolving.",
  alternates: { canonical: "/platform/operate/customer-success" },
}

export default function CustomerSuccessPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Customer Success</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">An engagement ending does not mean the relationship ends. Mitigence maintains long-term partnerships with clients through structured customer success programs.</p>
        <div className="space-y-8 mb-10">

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Dedicated contact</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">No handoff to a general queue</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Every client has a named Mitigence specialist who understands their environment and history. Questions, advice, and escalations go to someone who knows the context.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Quarterly reviews</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Structured progress reviews</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Quarterly reviews track program progress against objectives, identify new risk areas, and produce a rolling roadmap. Reviews include both technical and business-level perspectives.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Proactive recommendations</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Stay ahead of change</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">When a significant vulnerability affects your technology stack, or when your environment changes significantly — your Mitigence contact reaches out proactively, not reactively.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Maturity progression</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Long-term partner, not vendor</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">The goal of every Mitigence engagement is to leave the client more capable than before. Customer success is measured by maturity progression over time, not by the number of engagements delivered.</p>
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
