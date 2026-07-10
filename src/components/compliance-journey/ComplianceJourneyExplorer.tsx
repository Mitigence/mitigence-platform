'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import frameworksData from '@/data/compliance-frameworks.json'
import { defaultTransition } from '@/lib/animations'

const ENGAGEMENT_NAMES: Record<string, string> = {
  'security-assessment': 'Security Assessment',
  'compliance-program': 'Compliance Program',
  'identity-security-engineering': 'Identity Security Engineering',
  'incident-response-planning': 'Incident Response Planning',
  'third-party-risk-assessment': 'Third-Party Risk Assessment',
  'penetration-testing': 'Penetration Testing',
  'network-segmentation': 'Network Segmentation',
  'endpoint-protection': 'Endpoint Protection',
  'ransomware-readiness': 'Ransomware Readiness Review',
  'pci-dss-assessment': 'PCI DSS Assessment',
  'privileged-access-management': 'Privileged Access Management',
  'application-security-testing': 'Application Security Testing',
  'security-accreditation': 'Security Accreditation Support',
}

const SCOPE_COLORS: Record<string, string> = {
  IN: 'bg-orange-950 text-orange-400 border-orange-800',
  EU: 'bg-blue-950 text-blue-400 border-blue-800',
  US: 'bg-zinc-900 text-zinc-400 border-zinc-700',
  GLOBAL: 'bg-red-950 text-red-400 border-red-900',
}

type Phase = {
  phase: string
  duration: string
  description: string
  engagementIds: string[]
}

export function ComplianceJourneyExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)

  const frameworks = frameworksData.frameworks
  const selected = frameworks.find((f) => f.id === selectedId) ?? null

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setExpandedPhase(null)
  }

  const uniqueEngagements = selected
    ? [...new Set(selected.complianceJourney.flatMap((p: Phase) => p.engagementIds))]
    : []

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Select a compliance framework</h2>
      <p className="text-zinc-500 text-sm mb-6">
        See the compliance journey, key obligations, and which Mitigence engagements support each phase.
      </p>

      <div className="flex flex-wrap gap-3 mb-10">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => handleSelect(fw.id)}
            className={`rounded-lg border px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
              selectedId === fw.id
                ? 'border-red-600 bg-red-600/10 text-white'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {fw.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={defaultTransition}
          >
            {/* Framework header */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-6 mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
                    SCOPE_COLORS[selected.scopeBadge] ?? 'bg-zinc-900 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {selected.scope}
                </span>
                <span className="text-xs text-zinc-600">{selected.effectiveDate}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{selected.fullName}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{selected.tagline}</p>
              <div className="flex items-start gap-2 bg-red-950/20 border border-red-900/30 rounded p-3">
                <span className="text-xs text-zinc-500 flex-shrink-0 mt-0.5 font-medium">Penalty:</span>
                <span className="text-xs text-zinc-300 leading-relaxed">{selected.penalty}</span>
              </div>
            </div>

            {/* Who must comply */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-6 mb-6">
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">
                Who Must Comply
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{selected.whoMustComply}</p>
            </div>

            {/* Key requirements */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-6 mb-6">
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">
                Key Requirements
              </h3>
              <ul className="space-y-3">
                {selected.keyRequirements.map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance journey timeline */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-6 mb-6">
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-8">
                Compliance Journey
              </h3>

              <div>
                {selected.complianceJourney.map((phase: Phase, i: number) => {
                  const isLast = i === selected.complianceJourney.length - 1
                  const isOpen = expandedPhase === i

                  return (
                    <div key={i} className="relative flex gap-5">
                      {/* Timeline spine */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center z-10">
                          <span className="text-[11px] font-bold text-zinc-400">{i + 1}</span>
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-zinc-800 mt-1 mb-1 min-h-[24px]" />}
                      </div>

                      {/* Phase card */}
                      <div className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
                        <button
                          onClick={() => setExpandedPhase(isOpen ? null : i)}
                          className="w-full text-left group"
                        >
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h4 className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors leading-snug pt-1">
                              {phase.phase}
                            </h4>
                            <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                              <span className="text-xs text-zinc-600">{phase.duration}</span>
                              <span className="text-zinc-600 text-[10px]">{isOpen ? '▲' : '▼'}</span>
                            </div>
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="text-zinc-400 text-sm leading-relaxed mb-3 mt-1">
                                {phase.description}
                              </p>
                              {phase.engagementIds.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {phase.engagementIds.map((id: string) => (
                                    <Link
                                      key={id}
                                      href={`/platform/engineer/delivery-framework/${id}`}
                                      className="text-xs border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-red-600/50 hover:text-red-400 transition-colors rounded px-2.5 py-1"
                                    >
                                      {ENGAGEMENT_NAMES[id] ?? id} →
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommended Mitigence engagements */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-6 mb-6">
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">
                Mitigence Engagements for {selected.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {uniqueEngagements.map((id: string) => (
                  <Link
                    key={id}
                    href={`/platform/engineer/delivery-framework/${id}`}
                    className="group block border border-zinc-800 rounded-lg bg-zinc-900 hover:border-red-600/40 p-4 transition-colors"
                  >
                    <span className="text-white text-sm font-medium group-hover:text-red-400 transition-colors block mb-1">
                      {ENGAGEMENT_NAMES[id] ?? id}
                    </span>
                    <span className="text-red-600 text-xs">View delivery framework →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA strip */}
            <div className="border border-red-900/30 bg-red-950/10 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-white font-semibold mb-1">
                  Ready to start your {selected.name} compliance program?
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Speak with a Mitigence engineer — we&apos;ll scope your compliance journey and build a
                  delivery plan tailored to your environment.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link
                  href="/platform/engineer/engagement-studio"
                  className="text-sm font-medium text-white border border-zinc-700 hover:border-zinc-600 rounded px-4 py-2 transition-colors whitespace-nowrap"
                >
                  Engagement Studio
                </Link>
                <Link
                  href="/consultation"
                  className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 transition-colors whitespace-nowrap"
                >
                  Book a call →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
