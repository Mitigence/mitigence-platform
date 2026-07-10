import type { Metadata } from 'next'
import { ComplianceJourneyExplorer } from '@/components/compliance-journey/ComplianceJourneyExplorer'

export const metadata: Metadata = {
  title: 'Compliance Framework Journey',
  description:
    'Map your path to compliance. Explore DPDP, GDPR, ISO 27001:2022, SOC 2, PCI DSS, NIST CSF 2.0, DORA, and NIS2 — with phased journeys and integrated Mitigence delivery.',
  alternates: {
    canonical: '/platform/understand/compliance-journey',
  },
}

export default function ComplianceJourneyPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Compliance Framework Journey</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Select a compliance framework to see how Mitigence&apos;s advisory and engineering
          services help you close gaps, build controls, and get audit-ready — the audit itself
          is always conducted by an independent body.
        </p>
        <ComplianceJourneyExplorer />
      </div>
    </main>
  )
}
