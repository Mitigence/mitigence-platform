import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Continuous Improvement",
  description: "Ongoing security improvement that keeps pace with your evolving environment.",
  alternates: { canonical: "/platform/operate/continuous-improvement" },
}

export default function ContinuousImprovementPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Continuous Improvement</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">Security posture degrades if it is not actively maintained. Environments change, threats evolve, and controls need to be tuned. Mitigence provides structured continuous improvement programs.</p>
        <div className="space-y-8 mb-10">

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Quarterly validation</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Regular health checks</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Quarterly reviews of control effectiveness, detection coverage, and posture against the current threat landscape. Not a sales meeting — a working session with measurable outputs.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Detection tuning</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Monitoring that stays current</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Detection rules decay as environments change. Alert fatigue grows. Mitigence continuously tunes detection logic, updates rules for new adversary techniques, and keeps coverage metrics visible.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Program evolution</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Adapts as your business grows</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">A security program built for 200 employees does not scale to 2,000 without change. Mitigence architects continuous improvement programs that account for growth, technology adoption, and organizational change.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Strategic roadmap</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Planned, not reactive</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Improvement is planned against a rolling 12-month roadmap, updated quarterly. Priority areas are agreed in advance, not dictated by the most recent incident.</p>
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
