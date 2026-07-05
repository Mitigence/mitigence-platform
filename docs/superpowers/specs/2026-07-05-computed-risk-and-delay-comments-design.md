# Customer Workspace — Computed Risk & Delay Explanations

## Context

Phase 3's PM admin tool currently lets a PM type a free-text `status` value
("On track", "At risk", anything) directly onto a project. That's a
subjective, easy-to-forget manual step, and there's no way for a client to
know *why* a project is at risk beyond whatever the PM happened to type.

This change removes the PM's ability to set risk manually and replaces it
with a value computed live from real due dates: if deliverables or meetings
are missed, risk goes up automatically; if everything is on schedule, it
stays on track. It also gives the PM a place to explain a delay in their own
words, per deliverable, so the client isn't left guessing.

This is a change to the already-built phase 3 (PM admin tool), not a new
phase — it touches the existing schema, RLS, and admin UI.

## Decisions locked in during brainstorming

- Meetings and Recommendations sections stay as they are; only Deliverables,
  the project risk badge, and Meetings' scheduling gain new behavior.
- `deliverables` gains a real `due_date` and a `delay_explanation` (PM's
  own words on why something is late). `meetings.scheduled_at` becomes a
  real timestamp instead of free text, since risk needs to compare against
  "now."
- Risk has three levels: **On track**, **At risk**, **Delayed**.
  - At risk: exactly one item overdue, or a deliverable due within 3 days.
  - Delayed: two or more items overdue, or any single item overdue by more
    than 7 days.
  - "Item" = a non-`complete` deliverable past its `due_date`, or a
    non-`completed` meeting past its `scheduled_at`.
- Risk is never stored. It's computed on every page render from the
  project's current deliverables and meetings, so it can never go stale —
  no cron job, no trigger, no write path to keep in sync.
- The delay explanation is a single text field per deliverable (not a
  threaded comment log) — the PM's current explanation for that item,
  editable any time, replacing SQL-editor-only data entry with a real form
  field.

## Risk computation

A pure function, `computeProjectRisk`, shared by every place that needs to
show risk (the admin project page today; the client-facing workspace when
phase 4 is built) — one source of truth, no duplicated logic:

```typescript
export type ProjectRisk = 'On track' | 'At risk' | 'Delayed'

export interface RiskResult {
  level: ProjectRisk
  reasons: string[]
}

export function computeProjectRisk(
  deliverables: { item: string; status: DeliverableStatus; due_date: string | null }[],
  meetings: { title: string; status: MeetingStatus; scheduled_at: string }[]
): RiskResult
```

It returns not just the level but a list of human-readable reasons (e.g.
"IAM Policy Framework is 3 days overdue", "Weekly Engineering Review is
overdue") — this is the "efficient and professional" touch: the PM sees
*why* the badge changed without guessing, and it's built from data that's
already there, not something the PM has to type. This is separate from
`delay_explanation`, which is the PM's own narrative ("client asked for
extra scope") — the auto-generated reasons say *what* is late, the PM's
explanation says *why*.

## Schema changes (migration `0004`)

```sql
alter table public.deliverables
  add column due_date date,
  add column delay_explanation text;

alter table public.meetings
  alter column scheduled_at type timestamptz using scheduled_at::timestamptz;
```

The `meetings.scheduled_at` type change is a hard cut, not a soft migration:
before writing it, check whether any real (non-test) rows exist in
`public.meetings` in production. If none exist yet, the `using` clause
above is irrelevant (empty table); if real rows do exist with non-parseable
free text (e.g. "Thursday 10:00"), those rows must be fixed by hand in the
SQL Editor *before* running this migration, since `text::timestamptz` will
error on anything that isn't a real timestamp string.

`due_date` and `delay_explanation` are both nullable — a deliverable with
no due date simply never counts toward risk, so no backfill is required for
any existing rows.

## PM admin tool changes

**Project status editor** (`project-status-form.tsx` / `project-actions.ts`):
drops the "Status" text input entirely. `updateProjectAction` no longer
accepts or writes `status`. The project page now renders a read-only risk
badge (color-coded: green "On track", amber "At risk", red "Delayed") next
to the Phase/Progress form, with the `reasons` list shown as small muted
text beneath it when non-empty. Phase and Progress stay PM-editable exactly
as they are today — this change is scoped to risk only.

**Deliverables** (`deliverables-section.tsx` / `deliverables-actions.ts`):
- "Add deliverable" form gains a "Due date" date-picker input, stored on
  `due_date`.
- Each deliverable row gains a "Delay explanation" textarea, submitted
  together with the existing status-select/file-upload in the same
  `updateDeliverableStatusAction` call (one action, three optional
  changes) — no new Server Action needed.
- Rows are sorted soonest/most-overdue due date first (falling back to
  `updated_at` for rows with no due date), so the PM's attention goes to
  what needs it, not creation order.
- A row whose `due_date` has passed and isn't `complete` gets a visible red
  "overdue" treatment on its due-date text, prompting the PM to fill in the
  explanation if they haven't.

**Meetings** (`meetings-section.tsx` / `meetings-actions.ts`): "Scheduled"
becomes a `datetime-local` input instead of free text; the row display
formats the stored timestamp (e.g. "Jul 10, 2026, 10:00 AM") instead of
echoing raw text. A meeting past its scheduled time that's still `upcoming`
gets the same red "overdue" treatment as deliverables.

## Out of scope

- Phase 4 (client-facing workspace) — `computeProjectRisk` is written now,
  shared-ready, but not wired into any client-facing page since that page
  doesn't exist yet.
- Editing/deleting reports or recommendations (unchanged from phase 3).
- Notifying anyone (PM or client) when risk changes — this is a read-time
  computation, not an alerting system.
- A full multi-entry comment thread — `delay_explanation` is a single
  current-state field per deliverable, not a log.
