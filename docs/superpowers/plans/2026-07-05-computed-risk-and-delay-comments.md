# Computed Project Risk & Delay Explanations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the PM's ability to manually set project risk, replace it with a value computed live from real deliverable/meeting due dates, and let the PM attach a delay explanation to any deliverable so the client always understands why something is late.

**Architecture:** A pure function (`computeProjectRisk`) takes the project's current deliverables and meetings and returns a risk level plus human-readable reasons — computed fresh on every page render, never stored. Two schema additions (`deliverables.due_date`, `deliverables.delay_explanation`) and one schema change (`meetings.scheduled_at` becomes a real timestamp) feed it real data instead of free text.

**Tech Stack:** Supabase Postgres migration, `src/lib/risk.ts` (pure TypeScript, no DB dependency), existing Server Action + `useActionState` pattern from phase 3.

## Global Constraints

- Risk is never stored — always computed live from deliverables/meetings on render. (From design.)
- Risk levels: On track / At risk / Delayed. At risk = 1 item overdue or a deliverable due within 3 days. Delayed = 2+ items overdue, or anything overdue by more than 7 days. (From design.)
- `delay_explanation` is a single current-state text field per deliverable, not a comment thread. (From design.)
- Meetings and Recommendations sections are otherwise unchanged. (From design.)
- The `projects.status` column is left in place in the database (unused going forward) — not dropped. Dropping it wasn't part of the brainstormed scope and isn't required for this change to work.
- Repo has no test framework. Verification is `npm run build` plus manual browser verification via the preview tool, using real test data created and deleted the same way as prior phases.

---

### Task 1: Schema migration and types

**Files:**
- Create: `E:\mit\WEBAPP\supabase\migrations\0004_risk_and_delay_explanation.sql`
- Modify: `E:\mit\WEBAPP\src\lib\supabase\types.ts`

**Interfaces:**
- Consumes: existing `deliverables`/`meetings` table shapes from `supabase/migrations/0001_schema.sql`.
- Produces: `deliverables.due_date` (`date`, nullable), `deliverables.delay_explanation` (`text`, nullable), `meetings.scheduled_at` as `timestamptz` instead of `text` — every later task in this plan depends on these three columns existing with these types.

- [ ] **Step 1: Check for real (non-test) data before changing `scheduled_at`'s type**

In the Supabase dashboard (project `kjcvlqrsnudyearzuuan`) → SQL Editor, run:

```sql
select count(*) from public.meetings;
```

Expected: `0` (all phase 1/2/3 test meetings were deleted during their own verification cleanup). If this is not `0`, stop and inspect those rows by hand before continuing — `alter column ... type timestamptz using scheduled_at::timestamptz` will fail (or silently produce wrong values) on any row whose `scheduled_at` isn't a real timestamp string like the free-text mock values ("Thursday 10:00") phase 3 allowed.

- [ ] **Step 2: Write and run the migration**

In the SQL Editor, run:

```sql
alter table public.deliverables
  add column due_date date,
  add column delay_explanation text;

alter table public.meetings
  alter column scheduled_at type timestamptz using scheduled_at::timestamptz;
```

Expected: `Success. No rows returned`.

Also save this exact SQL to `E:\mit\WEBAPP\supabase\migrations\0004_risk_and_delay_explanation.sql`:

```sql
-- Computed risk & delay explanations (change to phase 3 PM admin tool)

alter table public.deliverables
  add column due_date date,
  add column delay_explanation text;

alter table public.meetings
  alter column scheduled_at type timestamptz using scheduled_at::timestamptz;
```

- [ ] **Step 3: Update the Database type**

In `E:\mit\WEBAPP\src\lib\supabase\types.ts`, replace the `deliverables` table entry with:

```typescript
      deliverables: {
        Row: {
          id: string
          project_id: string
          item: string
          status: DeliverableStatus
          week_label: string
          due_date: string | null
          delay_explanation: string | null
          file_path: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          item: string
          status?: DeliverableStatus
          week_label?: string
          due_date?: string | null
          delay_explanation?: string | null
          file_path?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: Partial<{
          item: string
          status: DeliverableStatus
          week_label: string
          due_date: string | null
          delay_explanation: string | null
          file_path: string | null
          updated_by: string | null
          updated_at: string
        }>
        Relationships: []
      }
```

`meetings`' TypeScript shape is unchanged (`scheduled_at: string` already covers an ISO timestamp string just as well as free text — only the Postgres column type and what gets written into it change, not the TS interface).

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. (Nothing consumes `due_date`/`delay_explanation` yet, so this only proves the type edit itself is syntactically valid — later tasks exercise it.)

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add supabase/migrations/0004_risk_and_delay_explanation.sql src/lib/supabase/types.ts && git commit -m "$(cat <<'EOF'
feat: add deliverable due-date/delay-explanation columns, meetings.scheduled_at becomes a real timestamp

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Risk computation

**Files:**
- Create: `E:\mit\WEBAPP\src\lib\risk.ts`

**Interfaces:**
- Consumes: `DeliverableStatus`, `MeetingStatus` types from `src/lib/supabase/types.ts` (phase 1).
- Produces: `ProjectRisk` type (`'On track' | 'At risk' | 'Delayed'`), `RiskResult` interface (`{ level: ProjectRisk; reasons: string[] }`), `computeProjectRisk(deliverables, meetings): RiskResult` — used by Task 3's project page and risk badge.

- [ ] **Step 1: Write the risk function**

Write `E:\mit\WEBAPP\src\lib\risk.ts`:

```typescript
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

export function computeProjectRisk(
  deliverables: DeliverableForRisk[],
  meetings: MeetingForRisk[]
): RiskResult {
  const now = Date.now()
  const reasons: string[] = []
  let missedCount = 0
  let maxDaysOverdue = 0
  let dueSoon = false

  for (const d of deliverables) {
    if (d.status === 'complete' || !d.due_date) continue
    const due = new Date(d.due_date).getTime()
    const daysOverdue = (now - due) / DAY_MS

    if (daysOverdue > 0) {
      missedCount++
      maxDaysOverdue = Math.max(maxDaysOverdue, daysOverdue)
      const rounded = Math.ceil(daysOverdue)
      reasons.push(`${d.item} is ${rounded} day${rounded === 1 ? '' : 's'} overdue`)
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
```

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/lib/risk.ts && git commit -m "$(cat <<'EOF'
feat: pure computeProjectRisk function

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Remove manual status, add risk badge

**Files:**
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-actions.ts`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-status-form.tsx`
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\risk-badge.tsx`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx`
- Modify: `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\page.tsx`

**Interfaces:**
- Consumes: `computeProjectRisk`, `RiskResult` (Task 2).
- Produces: `RiskBadge({ risk: RiskResult })` component — self-contained, nothing later depends on its internals.

- [ ] **Step 1: Drop `status` from the project update action**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-actions.ts` entirely with:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface UpdateProjectState {
  error?: string
  success?: boolean
}

export async function updateProjectAction(
  projectId: string,
  _prevState: UpdateProjectState,
  formData: FormData
): Promise<UpdateProjectState> {
  const phase = String(formData.get('phase') ?? '').trim()
  const progressRaw = String(formData.get('progress') ?? '0')
  const progress = Math.min(100, Math.max(0, Number(progressRaw) || 0))

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('projects')
    .update({ phase, progress, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (error) {
    return { error: `Could not update project: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return { success: true }
}
```

- [ ] **Step 2: Drop the Status field from the form**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-status-form.tsx` entirely with:

```typescript
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
```

- [ ] **Step 3: Write the risk badge component**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\risk-badge.tsx`:

```typescript
import type { RiskResult } from '@/lib/risk'

const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}

export function RiskBadge({ risk }: { risk: RiskResult }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-8">
      <p className="text-white text-sm font-medium mb-2">Risk</p>
      <span
        className={`inline-block text-xs font-semibold rounded-full px-2.5 py-1 border ${RISK_STYLES[risk.level]}`}
      >
        {risk.level}
      </span>
      {risk.reasons.length > 0 && (
        <ul className="mt-2 space-y-1">
          {risk.reasons.map((reason) => (
            <li key={reason} className="text-zinc-500 text-xs">
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Wire risk into the project page**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` entirely with:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeProjectRisk } from '@/lib/risk'
import { ProjectStatusForm } from './project-status-form'
import { RiskBadge } from './risk-badge'
import { ReportsSection } from './reports-section'
import { DeliverablesSection } from './deliverables-section'
import { MeetingsSection } from './meetings-section'
import { RecommendationsSection } from './recommendations-section'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_id, name, phase, progress')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
    }>()

  if (!project) notFound()

  const [{ data: reports }, { data: deliverables }, { data: meetings }, { data: recommendations }] =
    await Promise.all([
      supabase
        .from('reports')
        .select('id, title, report_type, report_date, status, file_path')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('deliverables')
        .select('id, item, status, week_label, due_date, delay_explanation, file_path')
        .eq('project_id', projectId)
        .order('updated_at'),
      supabase
        .from('meetings')
        .select('id, title, meeting_type, scheduled_at, status, mom_file_path')
        .eq('project_id', projectId)
        .order('created_at'),
      supabase
        .from('recommendations')
        .select('id, finding, priority, effort')
        .eq('project_id', projectId)
        .order('created_at'),
    ])

  const risk = computeProjectRisk(deliverables ?? [], meetings ?? [])

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/clients/${project.client_id}`}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-8">{project.name}</h1>

        <ProjectStatusForm project={project} />
        <RiskBadge risk={risk} />
        <ReportsSection projectId={project.id} reports={reports ?? []} />
        <DeliverablesSection projectId={project.id} deliverables={deliverables ?? []} />
        <MeetingsSection projectId={project.id} meetings={meetings ?? []} />
        <RecommendationsSection projectId={project.id} recommendations={recommendations ?? []} />
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Stop showing the now-frozen `status` column on the client's project list**

In `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\page.tsx`, change the projects query (remove `status` from the select list):

```typescript
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, phase')
    .eq('client_id', clientId)
    .order('created_at')
```

And change the list item display (drop the `&middot; {project.status}` part):

```typescript
              <p className="text-white text-sm font-medium">{project.name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{project.phase || 'No phase set'}</p>
```

- [ ] **Step 6: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 7: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects/\[projectId\]/project-actions.ts src/app/admin/projects/\[projectId\]/project-status-form.tsx src/app/admin/projects/\[projectId\]/risk-badge.tsx src/app/admin/projects/\[projectId\]/page.tsx src/app/admin/clients/\[clientId\]/page.tsx && git commit -m "$(cat <<'EOF'
feat: remove manual project status, show computed risk badge instead

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Deliverables — due date and delay explanation

**Files:**
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-actions.ts`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-section.tsx`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx`

**Interfaces:**
- Consumes: `deliverables.due_date`/`delay_explanation` columns (Task 1).
- Produces: nothing later tasks import.

- [ ] **Step 1: Accept due date and explanation in the Server Actions**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-actions.ts` entirely with:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { uploadWorkspaceFile } from '@/lib/supabase/upload-workspace-file'
import type { DeliverableStatus } from '@/lib/supabase/types'

export interface AddDeliverableState {
  error?: string
}

export async function addDeliverableAction(
  projectId: string,
  _prevState: AddDeliverableState,
  formData: FormData
): Promise<AddDeliverableState> {
  const item = String(formData.get('item') ?? '').trim()
  const weekLabel = String(formData.get('weekLabel') ?? '').trim()
  const dueDate = String(formData.get('dueDate') ?? '').trim()

  if (!item) {
    return { error: 'Item is required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('deliverables').insert({
    project_id: projectId,
    item,
    week_label: weekLabel,
    due_date: dueDate || null,
  })

  if (error) {
    return { error: `Could not add deliverable: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}

export interface UpdateDeliverableStatusState {
  error?: string
}

export async function updateDeliverableStatusAction(
  projectId: string,
  deliverableId: string,
  _prevState: UpdateDeliverableStatusState,
  formData: FormData
): Promise<UpdateDeliverableStatusState> {
  const status = String(formData.get('status') ?? '') as DeliverableStatus
  const explanation = String(formData.get('explanation') ?? '').trim()
  const file = formData.get('file')

  const supabase = await createServerSupabaseClient()

  let filePath: string | undefined
  if (file instanceof File && file.size > 0) {
    try {
      filePath = await uploadWorkspaceFile(supabase, projectId, 'deliverables', file)
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'File upload failed.' }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const update: {
    status: DeliverableStatus
    updated_by: string | null
    delay_explanation: string | null
    file_path?: string
  } = {
    status,
    updated_by: user?.id ?? null,
    delay_explanation: explanation || null,
  }
  if (filePath) update.file_path = filePath

  const { error } = await supabase.from('deliverables').update(update).eq('id', deliverableId)

  if (error) {
    return { error: `Could not update deliverable: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}
```

- [ ] **Step 2: Add the due-date input, delay-explanation textarea, and overdue styling**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-section.tsx` entirely with:

```typescript
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
  due_date: string | null
  delay_explanation: string | null
  file_path: string | null
}

function isOverdue(deliverable: Deliverable): boolean {
  if (deliverable.status === 'complete' || !deliverable.due_date) return false
  return new Date(deliverable.due_date).getTime() < Date.now()
}

function DeliverableRow({ projectId, deliverable }: { projectId: string; deliverable: Deliverable }) {
  const boundAction = updateDeliverableStatusAction.bind(null, projectId, deliverable.id)
  const [state, formAction, isPending] = useActionState(boundAction, updateInitialState)
  const overdue = isOverdue(deliverable)

  return (
    <form
      action={formAction}
      className={`rounded-lg border p-3 ${overdue ? 'border-red-600/40 bg-red-600/5' : 'border-zinc-800 bg-zinc-950'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white text-sm truncate">{deliverable.item}</p>
          <p className={`text-xs mt-0.5 ${overdue ? 'text-red-500' : 'text-zinc-500'}`}>
            {deliverable.week_label}
            {deliverable.due_date ? ` · Due ${deliverable.due_date}${overdue ? ' (overdue)' : ''}` : ''}
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
      </div>
      <div className="mt-2">
        <textarea
          name="explanation"
          defaultValue={deliverable.delay_explanation ?? ''}
          placeholder={
            overdue ? 'This item is overdue — explain the delay for the client' : 'Delay explanation (optional)'
          }
          rows={2}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs px-3 py-2 outline-none focus:border-red-600 transition-colors resize-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="mt-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {isPending ? 'Saving...' : 'Save explanation'}
        </button>
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
        <div className="grid grid-cols-3 gap-3">
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
          <div>
            <label htmlFor="dueDate" className="block text-zinc-400 text-xs mb-1.5">
              Due date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
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
```

- [ ] **Step 3: Sort deliverables by due date (soonest/most-overdue first)**

In `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx`, change the deliverables query's `.order(...)` call from:

```typescript
        .eq('project_id', projectId)
        .order('updated_at'),
```

(the one immediately following `.select('id, item, status, week_label, due_date, delay_explanation, file_path')`) to:

```typescript
        .eq('project_id', projectId)
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('updated_at'),
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects/\[projectId\]/deliverables-actions.ts src/app/admin/projects/\[projectId\]/deliverables-section.tsx src/app/admin/projects/\[projectId\]/page.tsx && git commit -m "$(cat <<'EOF'
feat: deliverable due dates, delay explanations, and overdue styling

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Meetings — real scheduling and overdue styling

**Files:**
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\meetings-section.tsx`

**Interfaces:**
- Consumes: `meetings.scheduled_at` now a real timestamp (Task 1).
- Produces: nothing later tasks import — this is the last section touched by this plan.

- [ ] **Step 1: Switch to a real datetime input and format the display**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\meetings-section.tsx` entirely with:

```typescript
'use client'

import { useActionState } from 'react'
import {
  addMeetingAction,
  completeMeetingAction,
  type AddMeetingState,
  type CompleteMeetingState,
} from './meetings-actions'
import type { MeetingStatus } from '@/lib/supabase/types'

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

function formatScheduledAt(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function isOverdue(meeting: Meeting): boolean {
  if (meeting.status === 'completed') return false
  return new Date(meeting.scheduled_at).getTime() < Date.now()
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
```

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects/\[projectId\]/meetings-section.tsx && git commit -m "$(cat <<'EOF'
feat: real meeting scheduling with formatted display and overdue styling

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: End-to-end manual verification

**Files:** none (Supabase dashboard + browser preview only)

**Interfaces:**
- Consumes: everything from Tasks 1-5.
- Produces: confidence that risk computes correctly across all three levels and that delay explanations save. No code artifact.

- [ ] **Step 1: Create a temporary PM test user and a test client**

Same process as phase 3's Task 9: create `verify-pm-risk@mitigence.com` via the Supabase dashboard (Auto Confirm ON), give it a `pm` profile via SQL Editor:

```sql
insert into public.profiles (id, role, client_id)
select id, 'pm', null from auth.users where email = 'verify-pm-risk@mitigence.com';
```

- [ ] **Step 2: Start the app, log in, create a test client + project**

```bash
cd "E:/mit/WEBAPP" && npm run build && npm run start
```

Log in as `verify-pm-risk@mitigence.com`, use the "New client" form to create `Verify Risk Co` with first project `Risk Test Project`.

- [ ] **Step 3: Verify "On track" with no deliverables**

Open the project. Expected: Risk badge shows "On track" with no reasons listed (empty deliverables/meetings).

- [ ] **Step 4: Verify "At risk" — one overdue deliverable**

Add a deliverable with a due date set to yesterday. Expected: Risk badge changes to "At risk" and lists a reason like "`<item>` is 1 day overdue". The deliverable's row shows red "overdue" styling and its due date in red.

- [ ] **Step 5: Verify the delay explanation saves**

In that overdue deliverable's row, type an explanation into the textarea and click "Save explanation". Reload the page. Expected: the textarea still shows the saved text (persisted via `delay_explanation`).

- [ ] **Step 6: Verify "Delayed" — two overdue items**

Add a meeting with a scheduled time in the past (leave it "upcoming", don't mark completed). Expected: Risk badge changes to "Delayed" (2 missed items now: the deliverable and the meeting), listing both reasons. The meeting row shows red "overdue" styling.

- [ ] **Step 7: Verify marking the deliverable complete removes it from risk**

Change the overdue deliverable's status to "Complete". Expected: risk drops back down (only the meeting still counts), badge updates to "At risk" (only 1 missed item left: the meeting).

- [ ] **Step 8: Verify the client project list no longer shows a status badge**

Navigate to `/admin/clients/[clientId]` for this test client. Expected: each project row shows only its phase, no status text.

- [ ] **Step 9: Clean up test data**

In the SQL Editor:

```sql
delete from public.clients where slug = 'verify-risk-co';
```

Then delete the `verify-pm-risk@mitigence.com` auth user via the dashboard, same as prior phases.

- [ ] **Step 10: No commit needed**

This task only exercised the running app and the live database — there is no file to commit. Mark this task done in your own tracking.
