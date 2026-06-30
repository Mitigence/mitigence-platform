'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJourneyStore } from '@/lib/store'
import { defaultTransition } from '@/lib/animations'
import engagementData from '@/data/engagement-studio.json'

type StageId = 'context' | 'objectives' | 'environment' | 'scope' | 'timeline' | 'roadmap'

const STAGES: { id: StageId; label: string }[] = [
  { id: 'context', label: 'Business Context' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'environment', label: 'Environment' },
  { id: 'scope', label: 'Scope' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'roadmap', label: 'Recommended Journey' },
]

function SelectableCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-lg border p-5 transition-colors duration-150 cursor-pointer ${
        selected
          ? 'border-red-600 bg-red-600/10'
          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-white font-medium text-sm">{label}</span>
        <span
          className={`w-4 h-4 rounded-full border flex-shrink-0 ${
            selected ? 'border-red-600 bg-red-600' : 'border-zinc-700'
          }`}
        />
      </div>
      {description && <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{description}</p>}
    </button>
  )
}

export function EngagementStudio() {
  const router = useRouter()
  const [stageIndex, setStageIndex] = useState(0)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const {
    businessContexts,
    objectives,
    environment,
    scopeItems,
    timeline,
    toggleBusinessContext,
    toggleObjective,
    setEnvironment,
    toggleScopeItem,
    setTimeline,
  } = useJourneyStore()

  const stage = STAGES[stageIndex]

  const canAdvance = useMemo(() => {
    switch (stage.id) {
      case 'context':
        return businessContexts.length > 0
      case 'objectives':
        return objectives.length > 0
      case 'environment':
        return environment !== null
      case 'scope':
        return scopeItems.length > 0
      case 'timeline':
        return timeline !== null
      default:
        return true
    }
  }, [stage.id, businessContexts, objectives, environment, scopeItems, timeline])

  const recommendedPhases = useMemo(() => {
    const rules = engagementData.journeyPhases.byObjective as Record<string, string[]>
    const phases = new Set<string>()
    if (objectives.length === 0) {
      engagementData.journeyPhases.default.forEach((p) => phases.add(p))
    } else {
      objectives.forEach((objId) => {
        ;(rules[objId] || engagementData.journeyPhases.default).forEach((p) => phases.add(p))
      })
    }
    return Array.from(phases)
  }, [objectives])

  const recommendedSpecialists = useMemo(() => {
    const map = engagementData.scopeToSpecialists as Record<string, string[]>
    const specialists = new Set<string>()
    scopeItems.forEach((id) => (map[id] || []).forEach((s) => specialists.add(s)))
    return Array.from(specialists)
  }, [scopeItems])

  const timelineLabel = engagementData.timelines.find((t) => t.id === timeline)?.label ?? null

  const goNext = () => setStageIndex((i) => Math.min(i + 1, STAGES.length - 1))
  const goBack = () => setStageIndex((i) => Math.max(i - 1, 0))
  const jumpTo = (i: number) => {
    if (i <= stageIndex) setStageIndex(i)
  }

  const handleScheduleConsultation = () => {
    const summary = {
      businessContexts: businessContexts.map(
        (id) => engagementData.businessContexts.find((c) => c.id === id)?.label ?? id
      ),
      objectives: objectives.map(
        (id) => engagementData.objectives.find((o) => o.id === id)?.label ?? id
      ),
      environment: engagementData.environments.find((e) => e.id === environment)?.label ?? environment,
      scope: scopeItems.map((id) => {
        const label = engagementData.scopeItems.find((s) => s.id === id)?.label ?? id
        const qty = quantities[id]
        return qty ? `${label} (${qty} specialist${qty > 1 ? 's' : ''})` : label
      }),
      timeline: timelineLabel,
      recommendedPhases,
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mitigence-engagement-summary', JSON.stringify(summary))
    }
    router.push('/consultation?from=engagement-studio')
  }

  return (
    <div>
      {/* Stepper nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => jumpTo(i)}
            disabled={i > stageIndex}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              i === stageIndex
                ? 'border-red-600 bg-red-600 text-white'
                : i < stageIndex
                ? 'border-zinc-700 text-zinc-300 hover:border-zinc-500 cursor-pointer'
                : 'border-zinc-900 text-zinc-700 cursor-not-allowed'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={defaultTransition}
        >
          {stage.id === 'context' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What best describes your organization today?
              </h2>
              <p className="text-zinc-500 text-sm mb-8">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {engagementData.businessContexts.map((c) => (
                  <SelectableCard
                    key={c.id}
                    label={c.label}
                    selected={businessContexts.includes(c.id)}
                    onClick={() => toggleBusinessContext(c.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {stage.id === 'objectives' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What would success look like?</h2>
              <p className="text-zinc-500 text-sm mb-8">Select your priorities.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {engagementData.objectives.map((o) => (
                  <SelectableCard
                    key={o.id}
                    label={o.label}
                    selected={objectives.includes(o.id)}
                    onClick={() => toggleObjective(o.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {stage.id === 'environment' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Where does your environment run?</h2>
              <p className="text-zinc-500 text-sm mb-8">Choose the closest match.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {engagementData.environments.map((e) => (
                  <SelectableCard
                    key={e.id}
                    label={e.label}
                    description={e.description}
                    selected={environment === e.id}
                    onClick={() => setEnvironment(e.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {stage.id === 'scope' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What&apos;s in scope?</h2>
              <p className="text-zinc-500 text-sm mb-8">
                Select the areas you want this engagement to cover. Add a specialist count if you
                already know roughly how much support you need — optional.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {engagementData.scopeItems.map((item) => {
                  const selected = scopeItems.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-5 transition-colors duration-150 ${
                        selected ? 'border-red-600 bg-red-600/10' : 'border-zinc-800 bg-zinc-950'
                      }`}
                    >
                      <button
                        onClick={() => toggleScopeItem(item.id)}
                        className="flex items-center justify-between gap-3 w-full cursor-pointer text-left"
                        aria-pressed={selected}
                      >
                        <span className="text-white font-medium text-sm">{item.label}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                            selected ? 'border-red-600 bg-red-600' : 'border-zinc-700'
                          }`}
                        />
                      </button>
                      {selected && (
                        <div className="mt-4 flex items-center gap-2">
                          <label htmlFor={`qty-${item.id}`} className="text-zinc-500 text-xs">
                            Specialists needed
                          </label>
                          <input
                            id={`qty-${item.id}`}
                            type="number"
                            min={0}
                            max={20}
                            value={quantities[item.id] ?? ''}
                            onChange={(e) =>
                              setQuantities((q) => ({
                                ...q,
                                [item.id]: Math.max(0, Number(e.target.value) || 0),
                              }))
                            }
                            placeholder="e.g. 2"
                            className="w-16 bg-zinc-900 border border-zinc-800 rounded-md text-white text-xs px-2 py-1 outline-none focus:border-red-600"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {stage.id === 'timeline' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What&apos;s your timeline?</h2>
              <p className="text-zinc-500 text-sm mb-8">How quickly do you want to move?</p>
              <div className="flex flex-wrap gap-4">
                {engagementData.timelines.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeline(t.id)}
                    className={`rounded-lg border px-6 py-4 text-sm font-medium transition-colors cursor-pointer ${
                      timeline === t.id
                        ? 'border-red-600 bg-red-600/10 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage.id === 'roadmap' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Recommended Journey</h2>
              <p className="text-zinc-500 text-sm mb-8">
                Based on your selections — not a generic proposal.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
                  <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
                    Engagement Roadmap
                  </h3>
                  <ol className="space-y-3">
                    {recommendedPhases.map((phase, i) => (
                      <li key={phase} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-zinc-300 text-sm">{phase}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
                  <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
                    Summary
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-zinc-500 text-xs mb-1">Timeline</dt>
                      <dd className="text-zinc-300">{timelineLabel ?? 'Not selected'}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 text-xs mb-1">Scope</dt>
                      <dd className="text-zinc-300">
                        {scopeItems.length > 0
                          ? scopeItems
                              .map((id) => engagementData.scopeItems.find((s) => s.id === id)?.label)
                              .join(', ')
                          : 'Not selected'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 text-xs mb-1">Suggested Specialists</dt>
                      <dd className="text-zinc-300">
                        {recommendedSpecialists.length > 0
                          ? recommendedSpecialists
                              .map(
                                (id) =>
                                  engagementData.specialistRoles.find((r) => r.id === id)?.label
                              )
                              .join(', ')
                          : 'Determined during scoping'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="rounded-lg border border-red-600/30 bg-red-600/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold mb-1">Ready to move forward?</h3>
                  <p className="text-zinc-400 text-sm">
                    Submit this engagement and we&apos;ll schedule a call with the right specialists
                    to discuss it. No pricing here — just a focused conversation.
                  </p>
                </div>
                <button
                  onClick={handleScheduleConsultation}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Submit &amp; Schedule a Call
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      {stage.id !== 'roadmap' && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-900">
          <button
            onClick={goBack}
            disabled={stageIndex === 0}
            className="text-zinc-400 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <button
            onClick={goNext}
            disabled={!canAdvance}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Continue →
          </button>
        </div>
      )}

      <div className="mt-8">
        <Link href="/platform/engineer/team-builder" className="text-red-600 hover:text-red-500 text-sm font-medium">
          Need help defining your team instead? Try Team Builder →
        </Link>
      </div>
    </div>
  )
}
