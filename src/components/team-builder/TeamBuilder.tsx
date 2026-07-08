'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJourneyStore } from '@/lib/store'
import { defaultTransition } from '@/lib/animations'
import teamData from '@/data/team-builder.json'

export function TeamBuilder() {
  const router = useRouter()
  const { selectedPods, togglePod } = useJourneyStore()
  const [expandedPod, setExpandedPod] = useState<string | null>(null)

  const activePods = useMemo(
    () => teamData.pods.filter((p) => selectedPods.includes(p.id)),
    [selectedPods]
  )

  const deliveryModel = useMemo(() => {
    const models = [...new Set(activePods.map((p) => p.engagementImpact.deliveryModel))]
    return models.length ? models.join(' + ') : null
  }, [activePods])

  const estimatedDuration = useMemo(() => {
    if (activePods.length === 0) return null
    const durations = activePods.map((p) => p.engagementImpact.estimatedDuration)
    const hasOngoing = durations.some((d) =>
      /ongoing|retainer/i.test(d)
    )
    const weekRanges = durations
      .map((d) => {
        const m = d.match(/(\d+)[–-](\d+)\s*week/i)
        if (m) return { min: parseInt(m[1]), max: parseInt(m[2]) }
        const s = d.match(/(\d+)\s*week/i)
        if (s) return { min: parseInt(s[1]), max: parseInt(s[1]) }
        return null
      })
      .filter(Boolean) as { min: number; max: number }[]
    if (hasOngoing && weekRanges.length > 0) {
      const minW = Math.min(...weekRanges.map((r) => r.min))
      return `${minW}+ weeks, with ongoing components`
    }
    if (hasOngoing) return 'Ongoing / Retainer'
    if (weekRanges.length > 0) {
      const minW = Math.min(...weekRanges.map((r) => r.min))
      const maxW = Math.max(...weekRanges.map((r) => r.max))
      return minW === maxW ? `${minW} weeks` : `${minW}–${maxW} weeks`
    }
    return durations[0]
  }, [activePods])

  const collaborationPattern = useMemo(() => {
    const patterns = [...new Set(activePods.map((p) => p.engagementImpact.collaborationPattern))]
    return patterns.length ? patterns.join('; ') : null
  }, [activePods])

  const allDeliverables = useMemo(() => {
    const set = new Set<string>()
    activePods.forEach((p) => p.engagementImpact.deliverables.forEach((d) => set.add(d)))
    return Array.from(set)
  }, [activePods])

  const handleSubmit = () => {
    const summary = {
      pods: activePods.map((p) => ({
        name: p.name,
        specialists: p.specialists.map((s) => s.role),
      })),
      deliveryModel,
      estimatedDuration,
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mitigence-engagement-summary', JSON.stringify(summary))
    }
    router.push('/consultation?from=team-builder')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pod grid */}
      <div className="lg:col-span-2">
        <p className="text-zinc-500 text-sm mb-6">
          Select the capability pods you need. Each pod represents a coordinated team of
          specialists. The side panel updates as you build.
        </p>

        <div className="space-y-4">
          {teamData.pods.map((pod) => {
            const selected = selectedPods.includes(pod.id)
            const expanded = expandedPod === pod.id
            return (
              <div
                key={pod.id}
                className={`rounded-lg border transition-colors duration-150 ${
                  selected ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 bg-zinc-950'
                }`}
              >
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={() => togglePod(pod.id)}
                      className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                        selected ? 'border-red-600 bg-red-600' : 'border-zinc-700'
                      }`}
                      aria-pressed={selected}
                      aria-label={`${selected ? 'Remove' : 'Add'} ${pod.name}`}
                    >
                      {selected && (
                        <span className="text-white text-xs font-bold leading-none">✓</span>
                      )}
                    </button>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{pod.name}</h3>
                      <p className="text-zinc-500 text-xs mt-0.5">{pod.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedPod(expanded ? null : pod.id)}
                    className="text-zinc-600 hover:text-zinc-400 text-xs ml-4 flex-shrink-0 cursor-pointer"
                  >
                    {expanded ? '▲ Hide' : '▼ Specialists'}
                  </button>
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={defaultTransition}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-zinc-900 pt-4">
                        <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-3">
                          Specialist Roles
                        </h4>
                        <div className="space-y-3">
                          {pod.specialists.map((s) => (
                            <div key={s.id}>
                              <span className="text-white text-sm font-medium">{s.role}</span>
                              <p className="text-zinc-500 text-xs mt-0.5">{s.description}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-900">
                          <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-2">
                            Expected Deliverables
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {pod.deliverables.map((d) => (
                              <span
                                key={d}
                                className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Side panel */}
      <div className="lg:col-span-1">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 sticky top-28">
          <h3 className="text-white font-semibold text-sm mb-4">Your Engagement</h3>

          {activePods.length === 0 ? (
            <p className="text-zinc-600 text-xs">Select pods on the left to see how your engagement takes shape.</p>
          ) : (
            <>
              <div className="space-y-4 mb-5">
                {deliveryModel && (
                  <div>
                    <dt className="text-zinc-500 text-xs mb-1">Delivery Model</dt>
                    <dd className="text-white text-sm">{deliveryModel}</dd>
                  </div>
                )}
                {collaborationPattern && (
                  <div>
                    <dt className="text-zinc-500 text-xs mb-1">Collaboration</dt>
                    <dd className="text-zinc-300 text-xs leading-relaxed">{collaborationPattern}</dd>
                  </div>
                )}
                {estimatedDuration && (
                  <div>
                    <dt className="text-zinc-500 text-xs mb-1">Estimated Duration</dt>
                    <dd className="text-white text-sm">{estimatedDuration}</dd>
                  </div>
                )}
              </div>

              {allDeliverables.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-zinc-500 text-xs mb-2">Deliverables</h4>
                  <ul className="space-y-1.5">
                    {allDeliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="mt-1 w-1 h-1 rounded-full bg-red-600 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Submit &amp; Schedule a Call
              </button>
            </>
          )}
        </div>
      </div>

      <div className="lg:col-span-3 mt-4">
        <Link
          href="/platform/engineer/engagement-studio"
          className="text-red-600 hover:text-red-500 text-sm font-medium"
        >
          Prefer to design the full engagement instead? Try Engagement Studio →
        </Link>
      </div>
    </div>
  )
}
