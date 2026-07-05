'use client'

import { useActionState } from 'react'
import {
  addDeliverableAction,
  updateDeliverableStatusAction,
  type AddDeliverableState,
  type UpdateDeliverableStatusState,
} from './deliverables-actions'
import type { DeliverableStatus } from '@/lib/supabase/types'

const addInitialState: AddDeliverableState = {}
const updateInitialState: UpdateDeliverableStatusState = {}

interface Deliverable {
  id: string
  item: string
  status: DeliverableStatus
  week_label: string
  file_path: string | null
}

function DeliverableRow({ projectId, deliverable }: { projectId: string; deliverable: Deliverable }) {
  const boundAction = updateDeliverableStatusAction.bind(null, projectId, deliverable.id)
  const [state, formAction, isPending] = useActionState(boundAction, updateInitialState)

  return (
    <form
      action={formAction}
      className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
    >
      <div className="min-w-0">
        <p className="text-white text-sm truncate">{deliverable.item}</p>
        <p className="text-zinc-500 text-xs mt-0.5">
          {deliverable.week_label}
          {deliverable.file_path ? ' · File attached' : ''}
          {state.error ? ` · ${state.error}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input type="file" name="file" className="text-zinc-400 text-xs w-28" />
        <select
          name="status"
          defaultValue={deliverable.status}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          disabled={isPending}
          className="bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs px-2 py-1.5 outline-none focus:border-red-600"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>
    </form>
  )
}

export function DeliverablesSection({
  projectId,
  deliverables,
}: {
  projectId: string
  deliverables: Deliverable[]
}) {
  const boundAddAction = addDeliverableAction.bind(null, projectId)
  const [addState, addFormAction, isAdding] = useActionState(boundAddAction, addInitialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Deliverables</h2>

      <div className="space-y-2 mb-4">
        {deliverables.map((d) => (
          <DeliverableRow key={d.id} projectId={projectId} deliverable={d} />
        ))}
        {deliverables.length === 0 && <p className="text-zinc-600 text-sm">No deliverables yet.</p>}
      </div>

      <form action={addFormAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="item" className="block text-zinc-400 text-xs mb-1.5">
              Item
            </label>
            <input
              id="item"
              name="item"
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="weekLabel" className="block text-zinc-400 text-xs mb-1.5">
              Week label
            </label>
            <input
              id="weekLabel"
              name="weekLabel"
              type="text"
              placeholder="Week 7"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>
        {addState.error && <p className="text-red-500 text-sm">{addState.error}</p>}
        <button
          type="submit"
          disabled={isAdding}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {isAdding ? 'Adding...' : 'Add deliverable'}
        </button>
      </form>
    </section>
  )
}
