'use client'

import { useActionState } from 'react'
import { updateProjectAction, type UpdateProjectState } from './project-actions'

const initialState: UpdateProjectState = {}

interface Project {
  id: string
  name: string
  phase: string
  progress: number
}

export function ProjectStatusForm({ project }: { project: Project }) {
  const boundAction = updateProjectAction.bind(null, project.id)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-4 space-y-3">
      <p className="text-white text-sm font-medium mb-1">Project status</p>
      <div>
        <label htmlFor="phase" className="block text-zinc-400 text-xs mb-1.5">
          Phase
        </label>
        <input
          id="phase"
          name="phase"
          type="text"
          defaultValue={project.phase}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="progress" className="block text-zinc-400 text-xs mb-1.5">
          Progress (%)
        </label>
        <input
          id="progress"
          name="progress"
          type="number"
          min={0}
          max={100}
          defaultValue={project.progress}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state.success && <p className="text-green-500 text-sm">Saved.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
