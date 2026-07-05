# Customer Workspace — Phase 4: Client-Facing Workspace UI

## Context

Phases 1-3 built the schema, RLS, auth/roles, and the PM admin tool that
writes real project data (reports, deliverables with due dates and delay
explanations, meetings, recommendations, and a computed risk level). Phase 2
left `/workspace` as a throwaway placeholder ("Signed in as `{email}`").

This phase replaces that placeholder with the real thing: each client logs
in and sees their own project(s) rendered in the exact same visual format as
the static preview at `platform/operate/customer-workspace`
(`src/components/customer-workspace/CustomerWorkspacePreview.tsx`), except
built from their real data instead of the mock arrays — including the
computed risk badge and delay explanations phase 3's PM-side change
introduced, so the client always has a full picture of the project, not
just a snapshot of tasks.

## Decisions locked in during brainstorming

- Clients can have more than one project (phase 1 decision). `/workspace`
  always shows a simple list of the client's own projects first — even
  for a client with exactly one — mirroring the admin tool's
  client→project drill-down. No auto-skip-to-the-only-project shortcut.
- File downloads are built now, not deferred: reports, deliverables, and
  meeting minutes with a stored `file_path`/`mom_file_path` get a real
  "Download" link, generated via Supabase Storage signed URLs using the
  client's own session (already permitted by phase 1's "client reads own
  workspace files" storage policy — no service-role client involved).
- The mock's hardcoded "This week's activity" list is replaced with a
  short feed derived from real data (recently updated deliverables, an
  upcoming meeting, a recently added report) — no new schema.
- Site chrome (`Navigation`, `Footer`, etc.) stays around these routes,
  matching the same choice already made for `/admin` in phase 3.

## Routes

```
/workspace                — client's own project list
/workspace/[projectId]    — the actual workspace (5-tab view)
```

Both are guarded by the existing phase 2 proxy (`client`-only, already
enforced). `/workspace/[projectId]` needs no additional ownership check
beyond what RLS already does: the project/reports/deliverables/meetings/
recommendations queries all run through the client's own session, which
phase 1's RLS scopes to `client_id = current_client_id()`. If the
`projectId` in the URL doesn't belong to the logged-in client, every query
returns zero rows and the page 404s — the same pattern already used by
`/admin/clients/[clientId]`.

## `/workspace` — project list

Server Component: queries the client's own `projects` (RLS-scoped
automatically), renders each as a small card (name + computed risk badge),
linking to `/workspace/[projectId]`. Same plain-list visual style already
established for the admin tool's lists — this picker page is not part of
the "match the preview exactly" requirement, only the workspace content
itself is.

## `/workspace/[projectId]` — the workspace

Server Component fetches the project plus reports/deliverables/meetings/
recommendations (same shape phase 3's admin page already fetches), computes:

- `risk` via the existing `computeProjectRisk` (`src/lib/risk.ts`, phase 3
  change) — the client sees the identical risk level and reasons the PM
  sees, nothing hidden or different.
- `recentActivity: string[]` via a new small pure function,
  `computeRecentActivity` (`src/lib/recent-activity.ts`), mirroring
  `risk.ts`'s style:

  ```typescript
  export function computeRecentActivity(
    deliverables: { item: string; status: DeliverableStatus; updated_at: string }[],
    meetings: { title: string; status: MeetingStatus; scheduled_at: string }[],
    reports: { title: string; created_at: string }[]
  ): string[]
  ```

  Rules: a deliverable updated in the last 7 days → `"{item} — {status}"`;
  an upcoming meeting scheduled in the next 7 days →
  `"{title} scheduled for {formatted date}"`; a report created in the last
  7 days → `"{title} report added"`. Sorted most-recent-first, capped at 5
  entries. Empty list → the Overview tab shows "No recent activity."
  instead of the list.
- A `Map<string, string>` of `file_path` → signed download URL via a new
  helper, `getSignedFileUrls` (`src/lib/supabase/signed-urls.ts`):

  ```typescript
  export async function getSignedFileUrls(
    supabase: SupabaseClient<Database>,
    paths: string[]
  ): Promise<Map<string, string>>
  ```

  Collects every non-null `file_path`/`mom_file_path` across the fetched
  reports/deliverables/meetings, calls
  `supabase.storage.from('workspace-files').createSignedUrls(paths, 3600)`
  once (batched, not one call per file), and returns a path→URL map. Rows
  render a "Download" link only when their path has an entry in the map
  (a failed signed-URL generation for one file doesn't break the others).

These are passed into a new Client Component,
`E:\mit\WEBAPP\src\app\workspace\[projectId]\client-workspace.tsx` — a
real-data fork of `CustomerWorkspacePreview.tsx` (same tab structure,
`AnimatePresence`/`motion.div` transition, and Tailwind classes), with these
additions layered onto the existing look:

- **Project header pill**: replaces the mock's static "On track" text with
  the computed risk level, same color mapping already used by phase 3's
  `RiskBadge` (green/amber/red).
- **Overview tab**: "Deliverables completed" becomes a real
  `{completeCount} / {total}` count; "Open recommendations" becomes the
  real recommendations count; "Next meeting" becomes the nearest upcoming
  (`status = 'upcoming'`) meeting's formatted time, or "No meetings
  scheduled" if none; "This week's activity" renders `recentActivity`.
- **Reports tab**: unchanged row layout, adds a "Download" link when a
  signed URL exists for that report's `file_path`.
- **Deliverables tab**: unchanged checkbox-row layout, adds the due date
  and an "(overdue)" flag (same definition as phase 3: not `complete` and
  `due_date` has passed), the PM's `delay_explanation` text when present,
  and a "Download" link when a file exists.
- **Meetings tab**: unchanged row layout, formats `scheduled_at` the same
  way phase 3's admin meetings section does, adds an "(overdue)" flag for
  a non-`completed` meeting past its scheduled time, and a "Download" link
  for the MoM file when present.
- **Recommendations tab**: unchanged — already fully data-driven in the
  mock, no new fields to add.

## Out of scope

- Any change to `/admin` — this phase only touches the client-facing side.
- Editing anything from the client's side — this remains strictly a
  read-only view. Clients cannot upload files, change deliverable status,
  or add comments; that's the PM's tool.
- Real-time updates (e.g. live-refreshing while the PM edits elsewhere) —
  the page reflects data as of the client's last navigation/reload, same
  as every other page in this app.
- Subdomain routing (phase 5).
