'use client'

import { useActionState } from 'react'
import { createClientAction, type CreateClientState } from './actions'

const initialState: CreateClientState = {}

export function NewClientForm() {
  const [state, formAction, isPending] = useActionState(createClientAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-600/30 bg-green-600/5 p-4 mb-6">
        <p className="text-green-500 text-sm font-medium mb-2">Client created</p>
        <p className="text-zinc-300 text-sm">
          Email: <span className="font-mono">{state.success.email}</span>
        </p>
        <p className="text-zinc-300 text-sm">
          Password: <span className="font-mono">{state.success.password}</span>
        </p>
        <p className="text-zinc-500 text-xs mt-2">
          Hand these off to the client now — this password will not be shown again.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-6 space-y-3">
      <div>
        <label htmlFor="clientName" className="block text-zinc-400 text-xs mb-1.5">
          Client name
        </label>
        <input
          id="clientName"
          name="clientName"
          type="text"
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="projectName" className="block text-zinc-400 text-xs mb-1.5">
          First project name
        </label>
        <input
          id="projectName"
          name="projectName"
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
        {isPending ? 'Creating...' : 'Create client'}
      </button>
    </form>
  )
}
