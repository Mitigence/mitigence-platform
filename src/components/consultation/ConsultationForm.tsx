'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'

type FormData = {
  name: string
  email: string
  organization: string
  businessContext: string
  priorities: string
  goals: string
  outcomes: string
}

const STEPS = [
  { key: 'businessContext', label: 'Business context', question: 'Tell us about your organization.' },
  { key: 'priorities', label: 'Current priorities', question: "What's top of mind for your security program right now?" },
  { key: 'goals', label: 'Engagement goals', question: 'What would you like Mitigence to help with?' },
  { key: 'outcomes', label: 'Desired outcomes', question: 'What does success look like for this engagement?' },
  { key: 'contact', label: 'Schedule', question: 'How should we reach you?' },
] as const

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readEngagementHandoff(): Partial<FormData> {
  if (typeof window === 'undefined') return {}
  const raw = sessionStorage.getItem('mitigence-engagement-summary')
  if (!raw) return {}
  try {
    const summary = JSON.parse(raw)
    const lines: string[] = []
    if (summary.businessContexts?.length) lines.push(`Business context: ${summary.businessContexts.join(', ')}`)
    if (summary.environment) lines.push(`Environment: ${summary.environment}`)
    const goalsText = summary.objectives?.length ? `Objectives: ${summary.objectives.join(', ')}` : ''
    const outcomesText = [
      summary.scope?.length ? `Scope: ${summary.scope.join(', ')}` : '',
      summary.timeline ? `Timeline: ${summary.timeline}` : '',
      summary.recommendedPhases?.length ? `Recommended journey: ${summary.recommendedPhases.join(' -> ')}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    return {
      businessContext: lines.join('\n') || undefined,
      goals: goalsText || undefined,
      outcomes: outcomesText || undefined,
    }
  } catch {
    return {}
  }
}

export function ConsultationForm() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(() => ({
    name: '',
    email: '',
    organization: '',
    businessContext: '',
    priorities: '',
    goals: '',
    outcomes: '',
    ...readEngagementHandoff(),
  }))
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const update = (key: keyof FormData, value: string) => setData((d) => ({ ...d, [key]: value }))

  const isLastStep = step === STEPS.length - 1

  const canAdvance = () => {
    const key = STEPS[step].key
    if (key === 'contact') return data.name.trim() !== '' && emailRegex.test(data.email)
    return data[key as keyof FormData].trim() !== ''
  }

  const handleSubmit = async () => {
    setStatus('submitting')
    setError('')
    try {
      const message = [
        `Business context: ${data.businessContext}`,
        `Priorities: ${data.priorities}`,
        `Engagement goals: ${data.goals}`,
        `Desired outcomes: ${data.outcomes}`,
      ].join('\n\n')

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          organization: data.organization,
          message,
          source: 'consultation',
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to submit. Please try again.')
      }

      setStatus('success')
      if (typeof window !== 'undefined') sessionStorage.removeItem('mitigence-engagement-summary')
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Failed to submit. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-5">
          <span className="text-white text-xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Request received.</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          A Mitigence specialist will review what you shared and reach out to schedule your
          strategy session within one business day.
        </p>
      </div>
    )
  }

  const current = STEPS[step]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
              i === step
                ? 'border-red-600 bg-red-600 text-white'
                : i < step
                ? 'border-zinc-700 text-zinc-300'
                : 'border-zinc-900 text-zinc-700'
            }`}
          >
            {i + 1}. {s.label}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={defaultTransition}
        >
          <h2 className="text-2xl font-bold text-white mb-6">{current.question}</h2>

          {current.key !== 'contact' ? (
            <textarea
              value={data[current.key as keyof FormData]}
              onChange={(e) => update(current.key as keyof FormData, e.target.value)}
              rows={6}
              placeholder="Type your answer..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm p-4 outline-none focus:border-red-600 transition-colors resize-none"
            />
          ) : (
            <div className="space-y-4 max-w-md">
              <div>
                <label htmlFor="name" className="block text-zinc-400 text-xs mb-1.5">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-zinc-400 text-xs mb-1.5">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="organization" className="block text-zinc-400 text-xs mb-1.5">
                  Organization
                </label>
                <input
                  id="organization"
                  type="text"
                  value={data.organization}
                  onChange={(e) => update('organization', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-900">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-zinc-400 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          ← Back
        </button>
        {!isLastStep ? (
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canAdvance()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance() || status === 'submitting'}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            {status === 'submitting' ? 'Submitting...' : 'Schedule My Strategy Session'}
          </button>
        )}
      </div>
    </div>
  )
}
