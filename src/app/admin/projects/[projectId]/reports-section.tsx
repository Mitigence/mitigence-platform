'use client'

import { useActionState } from 'react'
import { addReportAction, type AddReportState } from './reports-actions'

const initialState: AddReportState = {}

interface Report {
  id: string
  title: string
  report_type: string
  report_date: string
  status: string
  file_path: string | null
}

export function ReportsSection({ projectId, reports }: { projectId: string; reports: Report[] }) {
  const boundAction = addReportAction.bind(null, projectId)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Reports</h2>

      <div className="space-y-2 mb-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <div>
              <p className="text-white text-sm">{r.title}</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                {r.report_type} &middot; {r.report_date} &middot; {r.status}
              </p>
            </div>
            {r.file_path && <span className="text-zinc-600 text-xs flex-shrink-0">File attached</span>}
          </div>
        ))}
        {reports.length === 0 && <p className="text-zinc-600 text-sm">No reports yet.</p>}
      </div>

      <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div>
          <label htmlFor="title" className="block text-zinc-400 text-xs mb-1.5">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reportType" className="block text-zinc-400 text-xs mb-1.5">
              Type
            </label>
            <input
              id="reportType"
              name="reportType"
              type="text"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="reportDate" className="block text-zinc-400 text-xs mb-1.5">
              Date label
            </label>
            <input
              id="reportDate"
              name="reportDate"
              type="text"
              placeholder="Week 6"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>
        <div>
          <label htmlFor="file" className="block text-zinc-400 text-xs mb-1.5">
            File (optional)
          </label>
          <input id="file" name="file" type="file" className="w-full text-zinc-300 text-sm" />
        </div>
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {isPending ? 'Adding...' : 'Add report'}
        </button>
      </form>
    </section>
  )
}
