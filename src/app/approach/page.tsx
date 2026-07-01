import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Our Approach',
  description: 'The Mitigence delivery philosophy — why we lead with engineering, not marketing.',
  alternates: {
    canonical: '/approach',
  },
}

const phases = [
  {
    number: '01',
    name: 'Understand',
    description: 'We invest time to understand your environment, your risk context, and your operational reality before making any recommendations. Discovery is not a formality — it determines whether what comes next actually fits.',
  },
  {
    number: '02',
    name: 'Engineer',
    description: "We design, implement, and validate security controls with the same discipline applied to any engineering problem: clear requirements, structured implementation, verified outcomes. We don't treat security as a product to be installed — it is a capability to be built.",
  },
  {
    number: '03',
    name: 'Validate',
    description: 'Controls are not effective because we say they are. We test them, review configurations independently, and confirm coverage before an engagement closes. Assumption is not the same as verification.',
  },
  {
    number: '04',
    name: 'Operate',
    description: "Delivery does not stop at implementation. We support operational readiness — helping your team understand what was built, how to operate it, and what to do when something goes wrong. Knowledge transfer is a deliverable, not an afterthought.",
  },
  {
    number: '05',
    name: 'Improve',
    description: 'Security posture degrades if it is not actively maintained. We provide continuous improvement frameworks, periodic reviews, and ongoing advisory to ensure the program adapts as your business and the threat landscape evolve.',
  },
]

const commitments = [
  "Clear scope before work begins — no discovery by invoice",
  "Findings with remediation guidance, not just findings",
  "Reports you can actually act on, not 100-page PDFs",
  "Weekly status updates on all active engagements",
  "Post-delivery validation to confirm controls work",
  "No product commissions, no vendor bias",
]

export default function ApproachPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Our Approach</h1>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          Cybersecurity is a delivery discipline. Every engagement follows the same structured
          framework — regardless of size, scope, or sector.
        </p>

        <div className="space-y-10 mb-12">
          {phases.map((phase) => (
            <div key={phase.name} className="flex gap-5">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  {phase.number}
                </div>
              </div>
              <div>
                <h2 className="text-white font-bold text-xl mb-2">{phase.name}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h3 className="text-white font-semibold mb-4">What clients can always expect</h3>
          <ul className="space-y-2">
            {commitments.map((c) => (
              <li key={c} className="flex items-start gap-2 text-zinc-400 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/consultation"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          See it in practice — schedule a call →
        </Link>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Our Approach', path: '/approach' },
      ])) }} />
    </main>
  )
}
