import type { RiskResult } from './risk'
import { isPastCalendarDate } from './risk'
import type { DeliverableStatus, MeetingStatus } from './supabase/types'

export const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}

export function isDeliverableOverdue(deliverable: {
  status: DeliverableStatus
  due_date: string | null
}): boolean {
  if (deliverable.status === 'complete' || !deliverable.due_date) return false
  return isPastCalendarDate(deliverable.due_date)
}

export function isMeetingOverdue(meeting: { status: MeetingStatus; scheduled_at: string }): boolean {
  if (meeting.status === 'completed') return false
  return new Date(meeting.scheduled_at).getTime() < Date.now()
}

export function formatScheduledAt(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
