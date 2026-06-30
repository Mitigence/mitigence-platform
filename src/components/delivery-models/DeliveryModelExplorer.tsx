'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { defaultTransition } from '@/lib/animations'
import deliveryData from '@/data/delivery-models.json'

export function DeliveryModelExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = deliveryData.models.find((m) => m.id === activeId) ?? null

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {deliveryData.models.map((model) => {
          const selected = model.id === activeId
          return (
            <button
              key={model.id}
              onClick={() => setActiveId(selected ? null : model.id)}
              className={`rounded-lg border p-5 text-left transition-colors duration-150 cursor-pointer ${
                selected
                  ? 'border-red-600 bg-red-600/10'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
              aria-pressed={selected}
            >
              <span
                className={`block w-2 h-2 rounded-full mb-4 ${selected ? 'bg-red-600' : 'bg-zinc-700'}`}
              />
              <span className="text-white font-medium text-sm block mb-1">{model.name}</span>
              <span className="text-zinc-600 text-xs">{model.timeline}</span>
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
            <p className="text-zinc-400 text-sm italic mb-4">{active.tagline}</p>
            <p className="text-zinc-300 text-sm leading-relaxed mb-8">{active.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                  Team
                </h3>
                <ul className="space-y-2">
                  {active.team.map((member) => (
                    <li key={member} className="flex items-center gap-2 text-zinc-400 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                      {member}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                  Collaboration
                </h3>
                <ul className="space-y-2">
                  {active.collaboration.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-zinc-400 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="text-zinc-400 text-xs mt-3">Timeline: {active.timeline}</p>
              </div>

              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                  Reporting
                </h3>
                <ul className="space-y-2">
                  {active.reporting.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-zinc-400 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                Deliverables
              </h3>
              <div className="flex flex-wrap gap-2">
                {active.deliverables.map((d) => (
                  <span
                    key={d}
                    className="text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-zinc-500 text-xs">
                <span className="text-zinc-400 font-medium">Best for:</span> {active.bestFor}
              </p>
              <Link
                href="/consultation"
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                Discuss this model →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <p className="text-zinc-600 text-sm">Select a delivery model above to see how it works in detail.</p>
      )}
    </div>
  )
}
