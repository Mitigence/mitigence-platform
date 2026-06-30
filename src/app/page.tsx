import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cybersecurity Delivery & Engineering Platform',
  description:
    'Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* Section 1: Hero — Interactive Enterprise Map */}
      <section id="hero" className="min-h-screen flex items-center border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Phase 1 — Hero + Enterprise Map</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            Cybersecurity Isn&apos;t One Service.<br />
            <span className="text-red-600">It&apos;s a Continuously Engineered Journey.</span>
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mb-10">
            Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience through expert-led engagements and transparent delivery.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/platform/engineer/engagement-studio" className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors">
              Build Your Security Program
            </a>
            <a href="/platform" className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium px-6 py-3 rounded-md transition-colors">
              Explore the Platform
            </a>
            <a href="/consultation" className="text-zinc-500 hover:text-zinc-300 font-medium px-6 py-3 transition-colors">
              Talk to a Security Expert →
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Why Modern Security Is Different */}
      <section id="why-security-is-different" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Security Has Become More Connected—and More Complex.</h2>
          <p className="text-zinc-500 text-sm">Phase 1 — Module 14: Security Complexity Timeline</p>
        </div>
      </section>

      {/* Section 3: Explore Your Digital Enterprise */}
      <section id="explore-enterprise" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Every organization is different. Start with what you&apos;re protecting.</h2>
          <p className="text-zinc-500 text-sm">Phase 1 — Module 4 Preview: Domain Tiles</p>
        </div>
      </section>

      {/* Section 4: Discover Your Attack Surface */}
      <section id="attack-surface" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Discover Your Attack Surface</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 9: Attack Path Visualization</p>
        </div>
      </section>

      {/* Section 5: Build Your Security Program */}
      <section id="security-program" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Build Your Security Program</h2>
          <p className="text-zinc-500 text-sm">Phase 1 — Module 2 + 3: Journey Designer + Engagement Studio</p>
        </div>
      </section>

      {/* Section 6: Build Your Cybersecurity Team */}
      <section id="team-builder" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Build Your Cybersecurity Team</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 6: Team Builder</p>
        </div>
      </section>

      {/* Section 7: Security Engineering Lifecycle */}
      <section id="engineering-lifecycle" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">The Engineering Lifecycle</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 8: Engineering Lifecycle Animation</p>
        </div>
      </section>

      {/* Section 8: Delivery Models */}
      <section id="delivery-models" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Choose How You&apos;d Like to Work With Us</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 7: Delivery Model Explorer</p>
        </div>
      </section>

      {/* Section 9: Capability Explorer Preview */}
      <section id="capability-explorer" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Explore Security Capabilities</h2>
          <p className="text-zinc-500 text-sm">Phase 2 — Module 4: Capability Explorer</p>
        </div>
      </section>

      {/* Section 10: Customer Workspace Preview */}
      <section id="customer-workspace" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Your Security Journey, Visible at Every Stage</h2>
          <p className="text-zinc-500 text-sm">Phase 4 — Module 10: Customer Workspace Preview</p>
        </div>
      </section>

      {/* Section 11: Success Stories */}
      <section id="success-stories" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Organizations That Chose a Different Path</h2>
          <p className="text-zinc-500 text-sm">Phase 3 — Module 12: Success Story Explorer</p>
        </div>
      </section>

      {/* Section 12: Knowledge Center Preview */}
      <section id="knowledge-center" className="border-b border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">What Would You Like to Understand?</h2>
          <p className="text-zinc-500 text-sm">Phase 3 — Module 11: Knowledge Center</p>
        </div>
      </section>

      {/* Section 13: Consultation CTA */}
      <section id="consultation" className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-8 h-0.5 bg-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Security Journey?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Schedule a strategy session with a Mitigence security specialist. No generic sales pitch — a focused conversation about your environment and objectives.
          </p>
          <a
            href="/consultation"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-4 rounded-md transition-colors text-lg"
          >
            Schedule a Strategy Session
          </a>
        </div>
      </section>

    </main>
  )
}
