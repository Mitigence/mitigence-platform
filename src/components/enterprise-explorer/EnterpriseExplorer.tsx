'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useJourneyStore } from '@/lib/store'
import { defaultTransition } from '@/lib/animations'
import enterpriseMap from '@/data/enterprise-map.json'

export function EnterpriseExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const addExploredDomain = useJourneyStore((s) => s.addExploredDomain)

  const active = enterpriseMap.domains.find((d) => d.id === activeId) ?? null

  const handleSelect = (id: string) => {
    setActiveId((current) => (current === id ? null : id))
    addExploredDomain(id)
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {enterpriseMap.domains.map((domain) => {
          const selected = domain.id === activeId
          return (
            <button
              key={domain.id}
              onClick={() => handleSelect(domain.id)}
              className={`rounded-lg border p-5 text-left transition-colors duration-150 cursor-pointer ${
                selected
                  ? 'border-red-600 bg-red-600/10'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
              aria-pressed={selected}
            >
              <span
                className={`block w-2 h-2 rounded-full mb-4 ${
                  selected ? 'bg-red-600' : 'bg-zinc-700'
                }`}
              />
              <span className="text-white font-medium text-sm">{domain.name}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={defaultTransition}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{active.name}</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-2xl">{active.description}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                  Typical Challenges
                </h3>
                <ul className="space-y-2">
                  {active.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-zinc-400 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                  Business Risk
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{active.businessRisk}</p>
              </div>

              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                  How Mitigence Helps
                </h3>
                <ol className="flex flex-wrap gap-2">
                  {active.mitigenceApproach.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1"
                    >
                      <span className="text-red-600 font-bold">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-zinc-900">
              <Link
                href={active.relatedSolutionHref}
                className="text-red-600 hover:text-red-500 text-sm font-medium"
              >
                Explore {active.name} solutions →
              </Link>
              <Link
                href="/platform/engineer/engagement-studio"
                className="text-zinc-400 hover:text-white text-sm font-medium"
              >
                Design an engagement for this →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <p className="text-zinc-600 text-sm">Select a domain above to explore its risks and how Mitigence helps.</p>
      )}
    </div>
  )
}
