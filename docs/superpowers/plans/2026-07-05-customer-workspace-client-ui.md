# Customer Workspace Phase 4: Client-Facing Workspace UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the phase 2 `/workspace` placeholder with a real client-facing workspace that looks exactly like the static preview (`CustomerWorkspacePreview.tsx`), built from the client's own real data — including the computed risk badge, delay explanations, and real file downloads.

**Architecture:** Server Components fetch the client's own data (RLS already scopes every query to `client_id = current_client_id()`, so no extra ownership checks needed) and pass it to a Client Component that is a real-data fork of `CustomerWorkspacePreview.tsx` — same classNames, same tab structure, same `framer-motion` transitions, with due dates/delay explanations/downloads layered on top of the existing look.

**Tech Stack:** Next.js Server Components, `framer-motion`, Supabase Storage signed URLs (`createSignedUrls`), reuses `computeProjectRisk` (phase 3) and the phase 1 client RLS policies — no new dependencies.

## Global Constraints

- The workspace must look exactly like `CustomerWorkspacePreview.tsx` — same tab structure, same Tailwind classes, same `AnimatePresence`/`motion.div` transitions. Additions (due dates, overdue flags, delay explanations, download links) layer onto that look, they don't replace it. (From phase 4 spec.)
- `/workspace` always shows a project list first, even for a client with exactly one project — no auto-skip. (From phase 4 spec.)
- File downloads are real (signed URLs via the client's own session), not deferred. (From phase 4 spec.)
- The "This week's activity" panel is derived from real data (recently updated deliverables, an upcoming meeting, a recent report) — no new schema. (From phase 4 spec.)
- This phase is strictly read-only for the client — no new write paths. (From phase 4 spec.)
- Site chrome stays around these routes, matching `/admin`. (From phase 4 spec.)
- Repo has no test framework. Verification is `npm run build` plus manual browser verification via the preview tool, using real test data created and deleted the same way as prior phases.

---

### Task 1: Shared helpers — signed URLs and recent activity

**Files:**
- Create: `E:\mit\WEBAPP\src\lib\supabase\signed-urls.ts`
- Create: `E:\mit\WEBAPP\src\lib\recent-activity.ts`

**Interfaces:**
- Consumes: `Database` type (phase 1); `DeliverableStatus`, `MeetingStatus` types (phase 1).
- Produces: `getSignedFileUrls(supabase, paths: string[]): Promise<Record<string, string>>` and `computeRecentActivity(deliverables, meetings, reports): string[]` — both used by Task 3's project page.

- [ ] **Step 1: Write the signed-URL helper**

Write `E:\mit\WEBAPP\src\lib\supabase\signed-urls.ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function getSignedFileUrls(
  supabase: SupabaseClient<Database>,
  paths: string[]
): Promise<Record<string, string>> {
  if (paths.length === 0) return {}

  const { data, error } = await supabase.storage.from('workspace-files').createSignedUrls(paths, 3600)

  if (error || !data) return {}

  const urls: Record<string, string> = {}
  for (const entry of data) {
    if (entry.path && entry.signedUrl && !entry.error) {
      urls[entry.path] = entry.signedUrl
    }
  }
  return urls
}
```

- [ ] **Step 2: Write the recent-activity helper**

Write `E:\mit\WEBAPP\src\lib\recent-activity.ts`:

```typescript
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
```

- [ ] **Step 3: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/lib/supabase/signed-urls.ts src/lib/recent-activity.ts && git commit -m "$(cat <<'EOF'
feat: signed file URL and recent-activity helpers for client workspace

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `/workspace` project list

**Files:**
- Modify: `E:\mit\WEBAPP\src\app\workspace\page.tsx` (currently the phase 2 placeholder)

**Interfaces:**
- Consumes: `computeProjectRisk`, `RiskResult` (phase 3); `createServerSupabaseClient` (phase 1); `signOutAction` (phase 2).
- Produces: nothing later tasks import — this is a leaf route.

- [ ] **Step 1: Replace the placeholder with the real project list**

Write `E:\mit\WEBAPP\src\app\workspace\page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeProjectRisk, type RiskResult } from '@/lib/risk'
import { signOutAction } from '@/app/actions/auth'

const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}

export default async function WorkspacePage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, phase')
    .order('created_at')

  const projectsWithRisk = await Promise.all(
    (projects ?? []).map(async (project) => {
      const [{ data: deliverables }, { data: meetings }] = await Promise.all([
        supabase.from('deliverables').select('item, status, due_date').eq('project_id', project.id),
        supabase.from('meetings').select('title, status, scheduled_at').eq('project_id', project.id),
      ])
      return {
        ...project,
        risk: computeProjectRisk(deliverables ?? [], meetings ?? []),
      }
    })
  )

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Your Projects</h1>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="space-y-2">
          {projectsWithRisk.map((project) => (
            <Link
              key={project.id}
              href={`/workspace/${project.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 p-4 transition-colors"
            >
              <div>
                <p className="text-white text-sm font-medium">{project.name}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{project.phase || 'No phase set'}</p>
              </div>
              <span
                className={`text-xs font-semibold rounded-full px-2.5 py-1 border ${RISK_STYLES[project.risk.level]}`}
              >
                {project.risk.level}
              </span>
            </Link>
          ))}
          {projectsWithRisk.length === 0 && (
            <p className="text-zinc-600 text-sm">No projects yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/workspace/page.tsx && git commit -m "$(cat <<'EOF'
feat: client project list with computed risk badges

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `/workspace/[projectId]` — the real client workspace

**Files:**
- Create: `E:\mit\WEBAPP\src\app\workspace\[projectId]\page.tsx`
- Create: `E:\mit\WEBAPP\src\app\workspace\[projectId]\client-workspace.tsx`

**Interfaces:**
- Consumes: `getSignedFileUrls`, `computeRecentActivity` (Task 1); `computeProjectRisk`, `RiskResult` (phase 3); `createServerSupabaseClient` (phase 1); `signOutAction` (phase 2); `defaultTransition` (existing, `src/lib/animations`).
- Produces: nothing later tasks import — this is the final route in this plan.

- [ ] **Step 1: Write the real-data workspace component**

Write `E:\mit\WEBAPP\src\app\workspace\[projectId]\client-workspace.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'
import type { RiskResult } from '@/lib/risk'
import type { DeliverableStatus, MeetingStatus, Priority, Effort } from '@/lib/supabase/types'

const TABS = ['Overview', 'Reports', 'Deliverables', 'Meetings', 'Recommendations'] as const
type Tab = (typeof TABS)[number]

const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}

interface Project {
  id: string
  name: string
  phase: string
  progress: number
}

interface Report {
  id: string
  title: string
  report_type: string
  report_date: string
  status: string
  file_path: string | null
}

interface Deliverable {
  id: string
  item: string
  status: DeliverableStatus
  week_label: string
  due_date: string | null
  delay_explanation: string | null
  file_path: string | null
}

interface Meeting {
  id: string
  title: string
  meeting_type: string
  scheduled_at: string
  status: MeetingStatus
  mom_file_path: string | null
}

interface Recommendation {
  id: string
  finding: string
  priority: Priority
  effort: Effort
}

interface ClientWorkspaceProps {
  project: Project
  risk: RiskResult
  recentActivity: string[]
  reports: Report[]
  deliverables: Deliverable[]
  meetings: Meeting[]
  recommendations: Recommendation[]
  fileUrls: Record<string, string>
}

function isDeliverableOverdue(deliverable: Deliverable): boolean {
  if (deliverable.status === 'complete' || !deliverable.due_date) return false
  return new Date(deliverable.due_date).getTime() < Date.now()
}

function isMeetingOverdue(meeting: Meeting): boolean {
  if (meeting.status === 'completed') return false
  return new Date(meeting.scheduled_at).getTime() < Date.now()
}

function formatScheduledAt(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function ClientWorkspace({
  project,
  risk,
  recentActivity,
  reports,
  deliverables,
  meetings,
  recommendations,
  fileUrls,
}: ClientWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const completedCount = deliverables.filter((d) => d.status === 'complete').length
  const nextMeeting = meetings
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Workspace header */}
      <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <span className="text-zinc-400 text-xs">Mitigence Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-zinc-500 text-xs">Live session</span>
        </div>
      </div>

      {/* Project header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-white font-semibold">{project.name}</h3>
            <p className="text-zinc-500 text-xs mt-0.5">{project.phase || 'No phase set'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-zinc-800 rounded-full h-1.5">
              <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
            <span className="text-zinc-400 text-xs">{project.progress}%</span>
            <span className={`text-xs rounded-full px-2.5 py-1 border ${RISK_STYLES[risk.level]}`}>
              {risk.level}
            </span>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-5 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-red-600 text-white bg-red-600/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 min-h-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={defaultTransition}
          >
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Deliverables completed</p>
                  <p className="text-2xl font-bold text-white">
                    {completedCount} / {deliverables.length}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Open recommendations</p>
                  <p className="text-2xl font-bold text-white">{recommendations.length}</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Next meeting</p>
                  <p className="text-white font-semibold text-sm">
                    {nextMeeting ? formatScheduledAt(nextMeeting.scheduled_at) : 'No meetings scheduled'}
                  </p>
                </div>
                <div className="sm:col-span-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-3">This week&apos;s activity</p>
                  {recentActivity.length > 0 ? (
                    <ul className="space-y-2">
                      {recentActivity.map((entry) => (
                        <li key={entry} className="flex items-center gap-2 text-zinc-300 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-600 text-xs">No recent activity.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Reports' && (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{r.title}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {r.report_type} &middot; {r.report_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {r.file_path && fileUrls[r.file_path] && (
                        <a
                          href={fileUrls[r.file_path]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors"
                        >
                          Download
                        </a>
                      )}
                      <span className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
                {reports.length === 0 && <p className="text-zinc-600 text-sm">No reports yet.</p>}
              </div>
            )}

            {activeTab === 'Deliverables' && (
              <div className="space-y-2">
                {deliverables.map((d) => {
                  const overdue = isDeliverableOverdue(d)
                  return (
                    <div key={d.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-xs ${
                              d.status === 'complete'
                                ? 'border-green-600 bg-green-600 text-white'
                                : d.status === 'in-progress'
                                  ? 'border-red-600 bg-red-600/20 text-red-500'
                                  : 'border-zinc-700'
                            }`}
                          >
                            {d.status === 'complete' ? '✓' : d.status === 'in-progress' ? '·' : ''}
                          </span>
                          <span
                            className={`text-sm ${d.status === 'complete' ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}
                          >
                            {d.item}
                          </span>
                          {d.file_path && fileUrls[d.file_path] && (
                            <a
                              href={fileUrls[d.file_path]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors"
                            >
                              Download
                            </a>
                          )}
                        </div>
                        <span className={`text-xs ${overdue ? 'text-red-500' : 'text-zinc-600'}`}>
                          {d.week_label}
                          {d.due_date ? ` · Due ${d.due_date}${overdue ? ' (overdue)' : ''}` : ''}
                        </span>
                      </div>
                      {d.delay_explanation && (
                        <p className="text-zinc-500 text-xs mt-1 ml-7">{d.delay_explanation}</p>
                      )}
                    </div>
                  )
                })}
                {deliverables.length === 0 && (
                  <p className="text-zinc-600 text-sm">No deliverables yet.</p>
                )}
              </div>
            )}

            {activeTab === 'Meetings' && (
              <div className="space-y-3">
                {meetings.map((m) => {
                  const overdue = isMeetingOverdue(m)
                  return (
                    <div
                      key={m.id}
                      className={`rounded-lg border p-4 ${overdue ? 'border-red-600/40 bg-red-600/5' : 'border-zinc-800 bg-zinc-900'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white text-sm font-medium">{m.title}</p>
                          <p className={`text-xs mt-0.5 ${overdue ? 'text-red-500' : 'text-zinc-500'}`}>
                            {formatScheduledAt(m.scheduled_at)}
                            {overdue ? ' (overdue)' : ''}
                            {m.mom_file_path && fileUrls[m.mom_file_path] && (
                              <>
                                {' · '}
                                <a
                                  href={fileUrls[m.mom_file_path]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-500 hover:text-red-400 font-medium transition-colors"
                                >
                                  Download minutes
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2.5 py-1 flex-shrink-0">
                          {m.meeting_type}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {meetings.length === 0 && <p className="text-zinc-600 text-sm">No meetings yet.</p>}
              </div>
            )}

            {activeTab === 'Recommendations' && (
              <div className="space-y-3">
                {recommendations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4 gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 flex-shrink-0 ${
                          r.priority === 'High'
                            ? 'bg-red-600/10 text-red-500 border border-red-600/20'
                            : 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20'
                        }`}
                      >
                        {r.priority}
                      </span>
                      <p className="text-zinc-300 text-sm">{r.finding}</p>
                    </div>
                    <span className="text-zinc-500 text-xs flex-shrink-0">Effort: {r.effort}</span>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-zinc-600 text-sm">No recommendations yet.</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write the page that fetches data and renders it**

Write `E:\mit\WEBAPP\src\app\workspace\[projectId]\page.tsx`:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeProjectRisk } from '@/lib/risk'
import { computeRecentActivity } from '@/lib/recent-activity'
import { getSignedFileUrls } from '@/lib/supabase/signed-urls'
import { signOutAction } from '@/app/actions/auth'
import { ClientWorkspace } from './client-workspace'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function WorkspaceProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, phase, progress')
    .eq('id', projectId)
    .single<{ id: string; name: string; phase: string; progress: number }>()

  if (!project) notFound()

  const [{ data: reports }, { data: deliverables }, { data: meetings }, { data: recommendations }] =
    await Promise.all([
      supabase
        .from('reports')
        .select('id, title, report_type, report_date, status, file_path, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('deliverables')
        .select('id, item, status, week_label, due_date, delay_explanation, file_path, updated_at')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('updated_at'),
      supabase
        .from('meetings')
        .select('id, title, meeting_type, scheduled_at, status, mom_file_path')
        .eq('project_id', projectId)
        .order('scheduled_at'),
      supabase
        .from('recommendations')
        .select('id, finding, priority, effort')
        .eq('project_id', projectId)
        .order('created_at'),
    ])

  const risk = computeProjectRisk(deliverables ?? [], meetings ?? [])
  const recentActivity = computeRecentActivity(deliverables ?? [], meetings ?? [], reports ?? [])

  const filePaths = [
    ...(reports ?? []).map((r) => r.file_path),
    ...(deliverables ?? []).map((d) => d.file_path),
    ...(meetings ?? []).map((m) => m.mom_file_path),
  ].filter((path): path is string => Boolean(path))

  const fileUrls = await getSignedFileUrls(supabase, filePaths)

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/workspace" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
            &larr; Your projects
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <ClientWorkspace
          project={project}
          risk={risk}
          recentActivity={recentActivity}
          reports={reports ?? []}
          deliverables={deliverables ?? []}
          meetings={meetings ?? []}
          recommendations={recommendations ?? []}
          fileUrls={fileUrls}
        />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, route list includes `/workspace/[projectId]`.

- [ ] **Step 4: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/workspace/\[projectId\] && git commit -m "$(cat <<'EOF'
feat: real client-facing workspace matching the static preview exactly

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: End-to-end manual verification

**Files:** none (Supabase dashboard + admin tool + browser preview only)

**Interfaces:**
- Consumes: everything from Tasks 1-3, plus the existing PM admin tool (phase 3) to populate real data.
- Produces: confidence the client workspace matches the preview's look and shows correct real data, risk, activity, overdue flags, delay explanations, and working downloads. No code artifact.

- [ ] **Step 1: Create a temporary PM test user**

Same process as phase 3's Task 9. Create `verify-pm-client-ui@mitigence.com` via the Supabase dashboard (Auto Confirm ON), give it a `pm` profile via SQL Editor:

```sql
insert into public.profiles (id, role, client_id)
select id, 'pm', null from auth.users where email = 'verify-pm-client-ui@mitigence.com';
```

- [ ] **Step 2: Start the app, log in as PM, create a test client with real data**

```bash
cd "E:/mit/WEBAPP" && npm run build && npm run start
```

Log in as `verify-pm-client-ui@mitigence.com`. Create client `Verify Client UI Co` with first project `Client UI Test Project`. Note the generated client login (`verify-client-ui-co@mitigence.com` + shown password).

In that project, using the admin tool:
- Add a report with a title and a small test file attached.
- Add one deliverable with no due date, left "pending".
- Add a second deliverable with a due date of yesterday, left "pending" (this will show as overdue), and type something into its delay explanation.
- Add a meeting scheduled a few days in the future (still "upcoming").
- Add one recommendation.

- [ ] **Step 3: Sign out and log in as the client**

Sign out (from `/admin`). Go to `/login`, sign in with the generated client email + password.

Expected: redirected to `/workspace`, showing `Verify Client UI Co`'s... no — showing `Client UI Test Project` in a project list with a risk badge (should read "At risk", since one deliverable is overdue).

- [ ] **Step 4: Verify the workspace matches the preview's look**

Click into the project. Expected: the same visual structure as `platform/operate/customer-workspace`'s preview — dark card, "Mitigence Workspace" header bar with the three dots and "Live session" indicator, project name/phase/progress bar, the risk badge instead of a static status, and the same 5 tabs (Overview/Reports/Deliverables/Meetings/Recommendations).

- [ ] **Step 5: Verify each tab's real data**

- **Overview:** "Deliverables completed" shows `0 / 2`; "Open recommendations" shows `1`; "Next meeting" shows the formatted scheduled time; "This week's activity" lists the recently-added deliverables/meeting/report (all just created, so all within the 7-day window).
- **Reports:** the test report appears with a "Download" link. Click it — expected: opens/downloads the exact file that was uploaded.
- **Deliverables:** both deliverables appear; the overdue one shows its due date in red with "(overdue)" and the delay explanation text underneath it.
- **Meetings:** the test meeting appears with its formatted date/time, not overdue (scheduled in the future).
- **Recommendations:** the test recommendation appears with its priority badge and effort.

- [ ] **Step 6: Verify the client cannot see anything from a different client**

Manually navigate to a nonexistent or another project's UUID under `/workspace/<some-other-uuid>`. Expected: 404 (RLS returns no row, `notFound()` fires) — confirms a client can't view another client's project by guessing an ID.

- [ ] **Step 7: Clean up test data**

Sign out. In the SQL Editor:

```sql
delete from public.clients where slug = 'verify-client-ui-co';
```

Then delete the `verify-pm-client-ui@mitigence.com` and `verify-client-ui-co@mitigence.com` auth users via the dashboard, and remove the uploaded test files from the `workspace-files` storage bucket the same way as prior phases.

- [ ] **Step 8: No commit needed**

This task only exercised the running app and the live database — there is no file to commit. Mark this task done in your own tracking.
