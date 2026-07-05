# Customer Workspace — Phase 3: PM Admin Tool

## Context

Phase 1 built the schema, RLS, and storage bucket. Phase 2 built login,
session-refreshing route guards, and placeholder `/admin` and `/workspace`
pages. This phase replaces `/admin`'s placeholder body with the real tool a
PM uses to onboard clients and manage their project data — the write side
that phase 4's client-facing workspace reads from.

RLS from phase 1 already grants any `pm`-role user full read/write access to
`clients`, `projects`, `reports`, `deliverables`, `meetings`,
`recommendations`, and the `workspace-files` storage bucket, using the PM's
own logged-in session. The one exception is creating a brand-new client's
login: only the service-role client (`src/lib/supabase/admin.ts`, phase 1)
can create another user's `auth.users` account, so that one action alone
uses the admin client — everything else in this phase uses the PM's own
session and is already covered by existing RLS policies.

## Decisions locked in during brainstorming

- PMs create new clients and their first project directly in this tool —
  no more manual SQL Editor inserts for onboarding.
- Creating a client also creates that client's login account
  (`<slug>@mitigence.com`, random generated password), using the phase 1
  service-role client. The password is shown once on a result screen for
  the PM to hand off manually — no automated email send is built here.
- The admin UI is a plain, separate admin layout (lists + forms), not a
  reuse of the client-facing tabbed preview UI. PM and client views share
  the same underlying data, not the same component.
- Reports and Recommendations are append-only in this phase: PM can add and
  view, no edit/delete.
- Deliverables and Meetings support a status/completion update in addition
  to add + view, since "update status" was the original ask.
- File uploads (report/deliverable/meeting-minutes files) go through the
  PM's own session directly to the `workspace-files` bucket, no admin
  client needed there.

## Routes

```
/admin                        — list of clients + "New client" form
/admin/clients/[clientId]     — that client's projects + "New project" form
/admin/projects/[projectId]   — project status editor + 4 data sections
```

All three are Server Components guarded by the existing phase 2 proxy
(`pm`-only, already enforced — no new guard logic needed).

## `/admin` — client list

- Server Component: queries `clients` (PM RLS allows reading all), renders
  a list of client name + slug, each linking to
  `/admin/clients/[clientId]`.
- "New client" is a form (Client Component + Server Action) with two
  fields: client name, first project name.
- `createClientAction`:
  1. Slugifies the client name (lowercase, spaces → hyphens, strip
     non-alphanumeric) for both the `clients.slug` column and the login
     email local-part.
  2. Generates a random password (e.g. 16 chars, crypto-random).
  3. Uses the admin client to call `supabase.auth.admin.createUser` with
     `email: '<slug>@mitigence.com'`, the generated password, and
     `email_confirm: true` (no confirmation email flow needed internally).
  4. Inserts a `clients` row (name, slug).
  5. Inserts a `profiles` row for the new auth user
     (`role: 'client'`, `client_id` = the new client's id).
  6. Inserts a `projects` row (client_id, the given project name).
  7. Returns the generated email + password to the caller instead of
     redirecting immediately, so the page can display a one-time
     "here are the client's login details" panel above the client list.
- If any step after user creation fails, the admin client deletes the
  just-created auth user before returning an error, so a failed onboarding
  never leaves an orphaned login with no client/profile behind it.

## `/admin/clients/[clientId]` — project list

- Server Component: queries the client's row (for the heading) and its
  `projects` (PM RLS), renders name/phase/status, each linking to
  `/admin/projects/[projectId]`.
- "New project" form (name only) — a Server Action inserting a `projects`
  row for this `client_id`. `phase`, `progress`, `status` start at their
  table defaults (`''`, `0`, `'On track'`), edited afterward on the project
  page.

## `/admin/projects/[projectId]` — project management

Server Component page, data fetched once, passed to Client Component
sections for interactivity. Layout is five stacked sections, no tabs:

**Project status editor** — form pre-filled with current `phase`,
`progress`, `status`; Server Action does a straight `update` on the
`projects` row.

**Reports** — list of existing reports (title, type, date, status,
download link if `file_path` is set); "Add report" form (title, type,
date, status, optional file). Server Action inserts the row; if a file is
present, uploads it first to
`workspace-files/{project_id}/reports/{original filename}` via the PM's
server-side Supabase client, then stores the returned storage path in
`file_path`.

**Deliverables** — list of existing deliverables (item, week label,
status, file link if present); each row has a status `<select>`
(pending/in-progress/complete) that on change re-submits a Server Action
updating that row's `status` (and `updated_by` to the current user id).
"Add deliverable" form (item, week label; status starts `pending`).
Marking a deliverable complete offers an optional file upload, same
storage path convention as reports (`.../deliverables/...`).

**Meetings** — list of existing meetings (title, type, scheduled_at,
status, MoM link if present); each upcoming meeting has a "Mark completed"
action taking an optional MoM file upload, updating `status` to
`completed` and setting `mom_file_path` if a file was given. "Add meeting"
form (title, type, scheduled_at; status starts `upcoming`).

**Recommendations** — list of existing recommendations (finding, priority,
effort); "Add recommendation" form (finding, priority, effort — both
priority and effort are `<select>` of the existing `Priority`/`Effort`
union values from `src/lib/supabase/types.ts`).

## File upload mechanics

All uploads go through a single shared helper
(`src/lib/supabase/upload-workspace-file.ts`) used by the Reports,
Deliverables, and Meetings Server Actions:

```typescript
export async function uploadWorkspaceFile(
  supabase: SupabaseClient<Database>,
  projectId: string,
  category: 'reports' | 'deliverables' | 'meetings',
  file: File
): Promise<string> // returns the storage path to save in *_path column
```

It uploads to `workspace-files/{projectId}/{category}/{Date.now()}-{file.name}`
(timestamp prefix avoids collisions on repeated filenames) and returns that
path. Download links elsewhere in the app resolve a path to a signed URL
on demand (not built in this phase — phase 4 needs read access to these
files too, so the signed-URL helper is shared between phases 3 and 4; this
phase only needs to produce and store the path).

## Out of scope for this phase

- Editing or deleting existing reports/recommendations.
- Editing project name or deleting projects/clients.
- Automated email to the client with their new login.
- Creating additional PM staff accounts (still manual via the Supabase
  dashboard — rare, sensitive, and separate from client onboarding).
- Signed-URL download UI (phase 4 concern, sharing the same underlying
  storage paths this phase writes).
- Any of phase 4's read-only client-facing UI.
