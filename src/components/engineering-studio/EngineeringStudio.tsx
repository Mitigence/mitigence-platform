'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { defaultTransition } from '@/lib/animations'
import lifecycleData from '@/data/engineering-lifecycle.json'

export function EngineeringStudio() {
  const [activeId, setActiveId] = useState<string | null>('assess')
  const active = lifecycleData.phases.find((p) => p.id === activeId) ?? null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Phase list */}
      <div className="lg:col-span-1">
        <nav className="space-y-1">
          {lifecycleData.phases.map((phase, i) => (
            <button
              key={phase.id}
              onClick={() => setActiveId(phase.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeId === phase.id
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                  activeId === phase.id
                    ? 'border-white text-white'
                    : 'border-zinc-700 text-zinc-600'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {phase.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Phase detail */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={defaultTransition}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-2">{active.name}</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{active.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                    Inputs Required
                  </h3>
                  <ul className="space-y-2">
                    {active.inputs.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-zinc-400 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-700 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                    Mitigence Activities
                  </h3>
                  <ul className="space-y-2">
                    {active.activities.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-zinc-400 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-6 mb-6">
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

              <div className="border-t border-zinc-900 pt-6">
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                  Customer Touchpoints
                </h3>
                <div className="flex flex-wrap gap-2">
                  {active.customerTouchpoints.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <Link
            href="/platform/engineer/engagement-studio"
            className="text-red-600 hover:text-red-500 text-sm font-medium"
          >
            Design an engagement that follows this lifecycle →
          </Link>
        </div>
      </div>
    </div>
  )
}
