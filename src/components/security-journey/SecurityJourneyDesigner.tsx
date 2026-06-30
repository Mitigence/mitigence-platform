'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useJourneyStore } from '@/lib/store'
import { defaultTransition } from '@/lib/animations'
import maturityData from '@/data/maturity-stages.json'

export function SecurityJourneyDesigner() {
  const { currentMaturity, targetMaturity, setCurrentMaturity, setTargetMaturity } = useJourneyStore()

  const current = maturityData.stages.find((s) => s.id === currentMaturity) ?? null
  const target = maturityData.stages.find((s) => s.id === targetMaturity) ?? null

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Where is your organization today?</h2>
      <p className="text-zinc-500 text-sm mb-6">Select your current maturity stage.</p>

      <div className="flex flex-wrap gap-3 mb-10">
        {maturityData.stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setCurrentMaturity(stage.id)}
            className={`rounded-lg border px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
              currentMaturity === stage.id
                ? 'border-red-600 bg-red-600/10 text-white'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {stage.name}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={defaultTransition}
            className="mb-10"
          >
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-8">
              <p className="text-zinc-400 text-sm mb-5">{current.summary}</p>
              <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                Current Challenges
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {current.challenges.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-zinc-400 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Where do you want to be?</h2>
            <p className="text-zinc-500 text-sm mb-6">Select your target maturity stage.</p>
            <div className="flex flex-wrap gap-3">
              {maturityData.stages
                .filter((s) => s.order > current.order)
                .map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setTargetMaturity(stage.id)}
                    className={`rounded-lg border px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                      targetMaturity === stage.id
                        ? 'border-red-600 bg-red-600/10 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {stage.name}
                  </button>
                ))}
              {maturityData.stages.filter((s) => s.order > current.order).length === 0 && (
                <p className="text-zinc-600 text-sm">
                  You&apos;re at the highest maturity stage. Focus shifts to sustaining it.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {target && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={defaultTransition}
            className="rounded-lg border border-red-600/30 bg-red-600/5 p-6"
          >
            <h3 className="text-white font-semibold mb-4">Your Next Journey</h3>
            <ol className="flex flex-wrap items-center gap-3 mb-6">
              {target.recommendedJourney.map((phase, i) => (
                <li key={phase} className="flex items-center gap-3">
                  <span className="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
                    <span className="text-red-600 font-bold">{i + 1}</span>
                    {phase}
                  </span>
                  {i < target.recommendedJourney.length - 1 && (
                    <span className="text-zinc-700">→</span>
                  )}
                </li>
              ))}
            </ol>
            <Link
              href="/platform/engineer/engagement-studio"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Design this engagement →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
