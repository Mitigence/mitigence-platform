import type { DeliverableStatus, MeetingStatus } from './supabase/types'

interface DeliverableForActivity {
  item: string
  status: DeliverableStatus
  updated_at: string
}

interface MeetingForActivity {
  title: string
  status: MeetingStatus
  scheduled_at: string
}

interface ReportForActivity {
  title: string
  created_at: string
}

const DAY_MS = 24 * 60 * 60 * 1000

export function computeRecentActivity(
  deliverables: DeliverableForActivity[],
  meetings: MeetingForActivity[],
  reports: ReportForActivity[]
): string[] {
  const now = Date.now()
  const entries: { text: string; at: number }[] = []

  for (const d of deliverables) {
    const updatedAt = new Date(d.updated_at).getTime()
    if (now - updatedAt >= 0 && now - updatedAt <= 7 * DAY_MS) {
      entries.push({ text: `${d.item} — ${d.status}`, at: updatedAt })
    }
  }

  for (const m of meetings) {
    if (m.status !== 'upcoming') continue
    const scheduledAt = new Date(m.scheduled_at).getTime()
    if (scheduledAt - now >= 0 && scheduledAt - now <= 7 * DAY_MS) {
      entries.push({
        text: `${m.title} scheduled for ${new Date(m.scheduled_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}`,
        at: scheduledAt,
      })
    }
  }

  for (const r of reports) {
    const createdAt = new Date(r.created_at).getTime()
    if (now - createdAt >= 0 && now - createdAt <= 7 * DAY_MS) {
      entries.push({ text: `${r.title} report added`, at: createdAt })
    }
  }

  return entries
    .sort((a, b) => b.at - a.at)
    .slice(0, 5)
    .map((e) => e.text)
}
