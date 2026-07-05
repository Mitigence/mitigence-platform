'use client'

import { useActionState } from 'react'
import {
  addMeetingAction,
  completeMeetingAction,
  type AddMeetingState,
  type CompleteMeetingState,
} from './meetings-actions'
import type { MeetingStatus } from '@/lib/supabase/types'
import { formatScheduledAt, isMeetingOverdue as isOverdue } from '@/lib/risk-styles'

const addInitialState: AddMeetingState = {}
const completeInitialState: CompleteMeetingState = {}

interface Meeting {
  id: string
  title: string
  meeting_type: string
  scheduled_at: string
  status: MeetingStatus
  mom_file_path: string | null
}

function MeetingRow({ projectId, meeting }: { projectId: string; meeting: Meeting }) {
  const boundAction = completeMeetingAction.bind(null, projectId, meeting.id)
  const [state, formAction, isPending] = useActionState(boundAction, completeInitialState)
  const overdue = isOverdue(meeting)

  return (
    <div
      className={`rounded-lg border p-3 ${overdue ? 'border-red-600/40 bg-red-600/5' : 'border-zinc-800 bg-zinc-950'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-white text-sm">{meeting.title}</p>
          <p className={`text-xs mt-0.5 ${overdue ? 'text-red-500' : 'text-zinc-500'}`}>
            {meeting.meeting_type} &middot; {formatScheduledAt(meeting.scheduled_at)} &middot; {meeting.status}
            {overdue ? ' (overdue)' : ''}
            {meeting.mom_file_path ? ' · MoM attached' : ''}
          </p>
        </div>
      </div>
      {meeting.status === 'upcoming' && (
        <form action={formAction} className="flex items-center gap-2 mt-2">
          <input type="file" name="file" className="text-zinc-400 text-xs w-32" />
          <button
            type="submit"
            disabled={isPending}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {isPending ? 'Saving...' : 'Mark completed'}
          </button>
          {state.error && <span className="text-red-500 text-xs">{state.error}</span>}
        </form>
      )}
    </div>
  )
}

export function MeetingsSection({ projectId, meetings }: { projectId: string; meetings: Meeting[] }) {
  const boundAddAction = addMeetingAction.bind(null, projectId)
  const [addState, addFormAction, isAdding] = useActionState(boundAddAction, addInitialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Meetings</h2>

      <div className="space-y-2 mb-4">
        {meetings.map((m) => (
          <MeetingRow key={m.id} projectId={projectId} meeting={m} />
        ))}
        {meetings.length === 0 && <p className="text-zinc-600 text-sm">No meetings yet.</p>}
      </div>

      <form action={addFormAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div>
          <label htmlFor="meetingTitle" className="block text-zinc-400 text-xs mb-1.5">
            Title
          </label>
          <input
            id="meetingTitle"
            name="title"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="meetingType" className="block text-zinc-400 text-xs mb-1.5">
              Type
            </label>
            <input
              id="meetingType"
              name="meetingType"
              type="text"
              placeholder="Workshop"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="scheduledAt" className="block text-zinc-400 text-xs mb-1.5">
              Scheduled
            </label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              required
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
          {isAdding ? 'Adding...' : 'Add meeting'}
        </button>
      </form>
    </section>
  )
}
