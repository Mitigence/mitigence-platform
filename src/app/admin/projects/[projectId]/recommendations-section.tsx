'use client'

import { useActionState } from 'react'
import { addRecommendationAction, type AddRecommendationState } from './recommendations-actions'
import type { Priority, Effort } from '@/lib/supabase/types'

const initialState: AddRecommendationState = {}

interface Recommendation {
  id: string
  finding: string
  priority: Priority
  effort: Effort
}

export function RecommendationsSection({
  projectId,
  recommendations,
}: {
  projectId: string
  recommendations: Recommendation[]
}) {
  const boundAction = addRecommendationAction.bind(null, projectId)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Recommendations</h2>

      <div className="space-y-2 mb-4">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-semibold rounded-full px-2.5 py-1 flex-shrink-0 bg-zinc-800 text-zinc-300">
                {r.priority}
              </span>
              <p className="text-zinc-300 text-sm truncate">{r.finding}</p>
            </div>
            <span className="text-zinc-500 text-xs flex-shrink-0">Effort: {r.effort}</span>
          </div>
        ))}
        {recommendations.length === 0 && <p className="text-zinc-600 text-sm">No recommendations yet.</p>}
      </div>

      <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div>
          <label htmlFor="finding" className="block text-zinc-400 text-xs mb-1.5">
            Finding
          </label>
          <input
            id="finding"
            name="finding"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="priority" className="block text-zinc-400 text-xs mb-1.5">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue="Medium"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label htmlFor="effort" className="block text-zinc-400 text-xs mb-1.5">
              Effort
            </label>
            <select
              id="effort"
              name="effort"
              defaultValue="Medium"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {isPending ? 'Adding...' : 'Add recommendation'}
        </button>
      </form>
    </section>
  )
}
