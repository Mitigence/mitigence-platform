import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Project Timeline",
  description: "Milestone-driven project tracking with transparent delivery cadence.",
  alternates: { canonical: "/platform/operate/project-timeline" },
}

export default function ProjectTimelinePage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Project Timeline</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">Every Mitigence engagement runs on a clearly defined timeline with visible milestones, scheduled reviews, and delivery checkpoints. You always know where the project stands.</p>
        <div className="space-y-8 mb-10">

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Week 1–2</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Discovery & Kickoff</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Environment discovery, stakeholder interviews, scope validation, and project planning. Every engagement starts with a structured kickoff to align on objectives, methodology, and communication cadence.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Week 3+</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Active Engineering</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Structured delivery in weekly sprints. Progress is visible in the Customer Workspace. Engineering activities, blockers, and dependencies are communicated proactively — not waiting for you to ask.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Mid-point</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Steering Review</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">A formal mid-engagement review to validate findings, confirm direction, and adjust scope if needed. Delivered as a briefing document before the meeting so time is spent on decisions, not summaries.</p>
        </div>

        <div className="border-l-2 border-red-600/30 pl-6">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Close</span>
          <h2 className="text-white font-bold text-xl mt-2 mb-2">Validation & Handoff</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">Findings are validated before the engagement closes. Deliverables are reviewed together. Knowledge transfer is structured, not informal. The engagement closes when outcomes are confirmed — not when the calendar says time is up.</p>
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
