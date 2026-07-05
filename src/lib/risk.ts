import type { DeliverableStatus, MeetingStatus } from './supabase/types'

export type ProjectRisk = 'On track' | 'At risk' | 'Delayed'

export interface RiskResult {
  level: ProjectRisk
  reasons: string[]
}

interface DeliverableForRisk {
  item: string
  status: DeliverableStatus
  due_date: string | null
}

interface MeetingForRisk {
  title: string
  status: MeetingStatus
  scheduled_at: string
}

const DAY_MS = 24 * 60 * 60 * 1000

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysBetweenDates(fromDateOnly: string, toDateOnly: string): number {
  const from = Date.parse(`${fromDateOnly}T00:00:00Z`)
  const to = Date.parse(`${toDateOnly}T00:00:00Z`)
  return Math.round((to - from) / DAY_MS)
}

/** True once `dateOnly`'s calendar day has fully passed (not merely begun). */
export function isPastCalendarDate(dateOnly: string): boolean {
  return dateOnly < todayDateString()
}

export function computeProjectRisk(
  deliverables: DeliverableForRisk[],
  meetings: MeetingForRisk[]
): RiskResult {
  const now = Date.now()
  const today = todayDateString()
  const reasons: string[] = []
  let missedCount = 0
  let maxDaysOverdue = 0
  let dueSoon = false

  for (const d of deliverables) {
    if (d.status === 'complete' || !d.due_date) continue
    const daysOverdue = daysBetweenDates(d.due_date, today)

    if (isPastCalendarDate(d.due_date)) {
      missedCount++
      maxDaysOverdue = Math.max(maxDaysOverdue, daysOverdue)
      reasons.push(`${d.item} is ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue`)
    } else if (daysOverdue > -3) {
      dueSoon = true
      reasons.push(`${d.item} is due soon`)
    }
  }

  for (const m of meetings) {
    if (m.status === 'completed') continue
    const scheduled = new Date(m.scheduled_at).getTime()
    const daysOverdue = (now - scheduled) / DAY_MS

    if (daysOverdue > 0) {
      missedCount++
      maxDaysOverdue = Math.max(maxDaysOverdue, daysOverdue)
      reasons.push(`${m.title} is overdue`)
    }
  }

  let level: ProjectRisk = 'On track'
  if (missedCount >= 2 || maxDaysOverdue > 7) {
    level = 'Delayed'
  } else if (missedCount >= 1 || dueSoon) {
    level = 'At risk'
  }

  return { level, reasons }
}
