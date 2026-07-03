import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { Reveal } from '@/components/effects/Reveal'
import { HomeSections1 } from '@/components/home/HomeSections1'
import HomeSections2 from '@/components/home/HomeSections2'
import HomeSections3 from '@/components/home/HomeSections3'

export const metadata: Metadata = {
  title: 'Cybersecurity Delivery & Engineering Platform',
  description:
    'Mitigence helps organizations discover risks, engineer resilient security architectures, strengthen operations, and continuously improve cyber resilience.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* Section 1: Hero — Interactive Enterprise Map */}
      <Hero />

      {/* Sections 2–5: Why Security, Explore Enterprise, Attack Surface, Security Program */}
      <HomeSections1 />

      {/* Sections 6–9: Team Builder, Engineering Lifecycle, Delivery Models, Capability Explorer */}
      <HomeSections2 />

      {/* Sections 10–12: Customer Workspace, Success Stories, Knowledge Center */}
      <HomeSections3 />

      {/* Section 13: Consultation CTA */}
      <section id="consultation" className="py-24">
        <Reveal className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-8 h-0.5 bg-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Security Journey?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Schedule a strategy session with a Mitigence security specialist. No generic sales pitch — a focused conversation about your environment and objectives.
          </p>
          <a
            href="/consultation"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-4 rounded-md transition-colors text-lg cyber-glow-hover"
          >
            Schedule a Strategy Session
          </a>
        </Reveal>
      </section>

    </main>
  )
}
