'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useJourneyStore } from '@/lib/store'
import { defaultTransition } from '@/lib/animations'
import capabilitiesData from '@/data/capabilities.json'

export function CapabilityExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeStage, setActiveStage] = useState(0)
  const addExploredCapability = useJourneyStore((s) => s.addExploredCapability)

  const activeDomain = capabilitiesData.domains.find((d) => d.id === activeId) ?? null

  const handleSelect = (id: string) => {
    if (activeId === id) {
      setActiveId(null)
      return
    }
    setActiveId(id)
    setActiveStage(0)
    addExploredCapability(id)
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {capabilitiesData.domains.map((domain) => {
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
              <span className="text-white font-medium text-sm block">{domain.name}</span>
              <span className="text-zinc-600 text-xs mt-1 block">{domain.tagline}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeDomain && (
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={defaultTransition}
            className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">{activeDomain.name}</h2>
              <p className="text-zinc-400 text-sm mt-1">{activeDomain.tagline}</p>
            </div>

            {/* Stage tabs */}
            <div className="flex overflow-x-auto border-b border-zinc-800">
              {activeDomain.lifecycle.map((step, i) => (
                <button
                  key={step.stage}
                  onClick={() => setActiveStage(i)}
                  className={`flex-shrink-0 px-5 py-3 text-xs font-medium transition-colors cursor-pointer border-b-2 ${
                    i === activeStage
                      ? 'border-red-600 text-white bg-red-600/5'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {step.stage}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={defaultTransition}
                className="p-6"
              >
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {activeDomain.lifecycle[activeStage].description}
                </p>

                {activeStage < activeDomain.lifecycle.length - 1 && (
                  <button
                    onClick={() => setActiveStage(activeStage + 1)}
                    className="text-red-600 hover:text-red-500 text-sm font-medium cursor-pointer"
                  >
                    Next: {activeDomain.lifecycle[activeStage + 1]?.stage} →
                  </button>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="px-6 pb-6 flex flex-wrap gap-4 border-t border-zinc-900 pt-4">
              <Link
                href="/platform/engineer/engagement-studio"
                className="text-red-600 hover:text-red-500 text-sm font-medium"
              >
                Design an engagement for {activeDomain.name} →
              </Link>
              <Link
                href="/platform/engineer/team-builder"
                className="text-zinc-400 hover:text-white text-sm font-medium"
              >
                Build a team for this →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeDomain && (
        <p className="text-zinc-600 text-sm">Select a domain above to explore how Mitigence engineers that capability end-to-end.</p>
      )}
    </div>
  )
}
