'use client'

import { useActionState } from 'react'
import { createProjectAction, type CreateProjectState } from './actions'

const initialState: CreateProjectState = {}

export function NewProjectForm({ clientId }: { clientId: string }) {
  const boundAction = createProjectAction.bind(null, clientId)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-6 space-y-3">
      <div>
        <label htmlFor="name" className="block text-zinc-400 text-xs mb-1.5">
          New project name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {isPending ? 'Creating...' : 'Add project'}
      </button>
    </form>
  )
}
