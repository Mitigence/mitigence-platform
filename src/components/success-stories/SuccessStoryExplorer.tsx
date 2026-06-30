'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'
import storiesData from '@/data/success-stories.json'

const industries = ['All', ...new Set(storiesData.stories.map((s) => s.industry))]
const objectives = ['All', ...new Set(storiesData.stories.map((s) => s.securityObjective))]

export function SuccessStoryExplorer() {
  const [industryFilter, setIndustryFilter] = useState('All')
  const [objectiveFilter, setObjectiveFilter] = useState('All')
  const [activeId, setActiveId] = useState<string | null>(null)

  const filtered = storiesData.stories.filter((s) => {
    const matchIndustry = industryFilter === 'All' || s.industry === industryFilter
    const matchObjective = objectiveFilter === 'All' || s.securityObjective === objectiveFilter
    return matchIndustry && matchObjective
  })

  const active = storiesData.stories.find((s) => s.id === activeId) ?? null

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div>
          <p className="text-zinc-500 text-xs mb-2">Industry</p>
          <div className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <button
                key={i}
                onClick={() => setIndustryFilter(i)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  industryFilter === i
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-2">Objective</p>
          <div className="flex flex-wrap gap-2">
            {objectives.map((o) => (
              <button
                key={o}
                onClick={() => setObjectiveFilter(o)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  objectiveFilter === o
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Story cards */}
      {filtered.length === 0 ? (
        <p className="text-zinc-600 text-sm">No stories match these filters. Try adjusting the filters above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filtered.map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveId(story.id === activeId ? null : story.id)}
              className={`text-left rounded-lg border p-6 transition-colors cursor-pointer ${
                story.id === activeId
                  ? 'border-red-600 bg-red-600/5'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
                  {story.industry}
                </span>
                <span className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
                  {story.deliveryModel}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm leading-snug mb-2">{story.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{story.summary}</p>
              <p className="text-red-600 text-xs font-medium mt-3">
                {story.id === activeId ? 'Close ↑' : 'View details →'}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Expanded story */}
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
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
                {active.industry}
              </span>
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
                {active.organizationSize}
              </span>
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
                {active.deliveryModel} · {active.timeline}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">{active.title}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="border-l-2 border-red-600/30 pl-5">
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-2">Challenge</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{active.challenge}</p>
              </div>
              <div className="border-l-2 border-red-600/30 pl-5">
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-2">Approach</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{active.approach}</p>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-6 mb-6">
              <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Outcomes</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {active.continuousImprovement && (
              <div className="border-t border-zinc-900 pt-6">
                <h3 className="text-white font-semibold text-xs uppercase tracking-wide mb-2">Ongoing Partnership</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{active.continuousImprovement}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
