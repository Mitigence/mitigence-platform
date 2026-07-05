# Codebase Quality & Scalability Refactor — Design

## Context

Following a full architecture audit (4 parallel research passes over routing/data-flow, the Supabase integration layer, structural duplication between the marketing preview and the real client workspace, and config/deps/security), plus a read-only scan of the live Vercel/Supabase/GoDaddy dashboards. The audit found the app functionally correct and reasonably secure (RLS, CSP, strict TypeScript, no leaked secrets) but flagged concrete quality, duplication, and scalability issues. This spec covers fixing those — no user-visible behavior changes except two small, deliberately-scoped correctness fixes called out explicitly below.

Out of scope (explicitly, not bundled here): the unexplained `_acme-challenge` DNS CNAME record in GoDaddy, and a Zoho email-forwarding-rules audit. Both need separate owner confirmation before anyone touches them.

## Decisions locked in during brainstorming

1. **Type safety** — hand-fix the `Relationships` arrays in `src/lib/supabase/types.ts` (all 7 tables currently declare `Relationships: []`), rather than switching to Supabase CLI codegen (which would need interactive `supabase login`).
2. **N+1 query fix** — `src/app/workspace/page.tsx` currently fires 2 Supabase queries per project inside a `.map()`. Replace with 2 batched queries using `.in('project_id', projectIds)`.
3. **Duplicate logic dedupe** — new `src/lib/risk-styles.ts` becomes the single source for the risk color map and the three overdue/date-formatting helpers, currently duplicated across 3-5 files.
4. **Duplicate structure dedupe** — extract the genuinely identical structural chrome (header bar, tab nav, tab-transition wrapper, overview stat card) shared between the marketing mock (`CustomerWorkspacePreview.tsx`) and the real client workspace (`client-workspace.tsx`) into `src/components/workspace/`. The tab *content* bodies (Reports/Deliverables/Meetings/Recommendations rows) stay separate in each file — they differ enough in real behavior (downloads, overdue flags, delay explanations) that forcing a shared component would need a large conditional prop surface for no real benefit, and would risk exactly the kind of visual drift this dedupe is trying to prevent.
5. **Config consolidation** — new `src/lib/site-config.ts` holds `SITE_DOMAIN`, `SITE_URL`, `WORKSPACE_SUBDOMAIN`, `BUSINESS_EMAIL`, `HR_EMAIL`, `NOREPLY_EMAIL`, and a `clientEmailForSlug(slug)` helper (this last one also dedupes a 3rd, previously-unflagged instance of the same `${slug}@mitigence.com` string built independently in three files). All ~19 hardcoded call sites import from here instead.
6. **Two scoped correctness fixes** (behavior changes, both explicitly approved, both small/isolated):
   - `src/lib/risk.ts`: due-date overdue comparison currently parses a date-only string (`due_date`) with `new Date(...)`, which JS interprets as UTC midnight — a deliverable can flip to "overdue" up to ~1 day early for users behind UTC. Fix: compare using calendar dates, not UTC-midnight timestamps.
   - `src/lib/supabase/signed-urls.ts`: `createSignedUrls` has an undocumented ~50-path batch limit; today a project with more files than that silently drops signed URLs for the excess with only a console error, no user-facing sign. Fix: chunk `paths` into batches of 50, call `createSignedUrls` per chunk, merge results.

## Architecture: file-by-file

### 1. Type safety — `src/lib/supabase/types.ts`

Add `Relationships` arrays derived directly from the FK constraints in `supabase/migrations/0001_schema.sql` (Postgres default constraint naming: `<table>_<column>_fkey`):

- `clients`: `Relationships: []` (nothing else to reference — stays empty, it's correct as-is)
- `profiles`: FK `client_id → clients.id`
- `projects`: FK `client_id → clients.id`
- `reports`: FK `project_id → projects.id`, FK `uploaded_by → profiles.id`
- `deliverables`: FK `project_id → projects.id`, FK `updated_by → profiles.id`
- `meetings`: FK `project_id → projects.id`
- `recommendations`: FK `project_id → projects.id`

Each non-empty entry follows the supabase-js `GenericRelationship` shape: `{ foreignKeyName, columns, isOneToOne, referencedRelation, referencedColumns }`.

### 2. N+1 fix — `src/app/workspace/page.tsx`

Current (lines 20-36): fetch `projects`, then `Promise.all` over a `.map()` that fires 2 more awaited queries per project (`deliverables`, `meetings`) filtered by that one `project_id`.

New: after fetching `projects` and extracting `projectIds`, fire exactly 2 queries total — `deliverables` and `meetings` each filtered with `.in('project_id', projectIds)` — then group each result set into a `Map<string, T[]>` keyed by `project_id`, and build `projectsWithRisk` by looking up each project's own slice from those two maps before calling `computeProjectRisk`. `RISK_STYLES` import moves to `site-config`/`risk-styles` per item 3.

### 3. `src/lib/risk-styles.ts` (new)

```typescript
import type { RiskResult } from './risk'
import type { DeliverableStatus, MeetingStatus } from './supabase/types'

export const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}

export function isDeliverableOverdue(deliverable: { status: DeliverableStatus; due_date: string | null }): boolean {
  if (deliverable.status === 'complete' || !deliverable.due_date) return false
  return isPastCalendarDate(deliverable.due_date)
}

export function isMeetingOverdue(meeting: { status: MeetingStatus; scheduled_at: string }): boolean {
  if (meeting.status === 'completed') return false
  return new Date(meeting.scheduled_at).getTime() < Date.now()
}

export function formatScheduledAt(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
```

`isPastCalendarDate` is the shared helper backing both this file's `isDeliverableOverdue` and item 6's fix to `risk.ts` (same UTC-midnight bug, same fix, same helper — see item 6 below for its implementation, exported from `risk.ts` since that's the file that owns date-only comparison semantics for this domain).

Consumers updated to import from here instead of defining locally:
- `src/app/workspace/page.tsx` (`RISK_STYLES`, was lines 7-11)
- `src/app/workspace/[projectId]/client-workspace.tsx` (`RISK_STYLES` was lines 12-16; `isDeliverableOverdue`/`isMeetingOverdue`/`formatScheduledAt` were lines 71-86)
- `src/app/admin/projects/[projectId]/risk-badge.tsx` (`RISK_STYLES` was lines 3-7)
- `src/app/admin/projects/[projectId]/deliverables-section.tsx` (local `isOverdue`, lines 25-28, replaced by imported `isDeliverableOverdue`)
- `src/app/admin/projects/[projectId]/meetings-section.tsx` (local `formatScheduledAt`/`isOverdue`, lines 24-34, replaced by imported `formatScheduledAt`/`isMeetingOverdue`)

### 4. Shared workspace chrome — `src/components/workspace/` (new folder)

Four new presentational components, extracted from the identical blocks in `CustomerWorkspacePreview.tsx` and `client-workspace.tsx`:

- `WorkspaceHeader.tsx` — the dots + "Mitigence Workspace" + live-session bar. Zero props, 100% identical in both today.
- `WorkspaceTabNav.tsx` — the tab button row. Props: `tabs: readonly string[]`, `activeTab: string`, `onTabChange: (tab: string) => void`.
- `WorkspaceTabTransition.tsx` — the `AnimatePresence`/`motion.div` wrapper. Props: `tabKey: string`, `children: React.ReactNode`.
- `OverviewStatCard.tsx` — the small label+value card used 3x in the Overview grid. Props: `label: string`, `children: React.ReactNode` (value content, since real value can be a number or formatted string).

Both `CustomerWorkspacePreview.tsx` and `client-workspace.tsx` import and use these four in place of their duplicated markup. The project-header block (progress bar + badge) stays separate in each file since the badge content differs structurally (static pill vs. `RiskBadge`-style risk output) enough that a shared component would need a slot prop for one line of JSX — not worth it. Tab content bodies (Reports/Deliverables/Meetings/Recommendations) stay separate per the decision in item 4 above.

### 5. `src/lib/site-config.ts` (new)

```typescript
export const SITE_DOMAIN = 'mitigence.com'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const WORKSPACE_SUBDOMAIN = `workspace.${SITE_DOMAIN}`
export const BUSINESS_EMAIL = `business@${SITE_DOMAIN}`
export const HR_EMAIL = `hr@${SITE_DOMAIN}`
export const NOREPLY_EMAIL = `noreply@${SITE_DOMAIN}`

export function clientEmailForSlug(slug: string): string {
  return `${slug}@${SITE_DOMAIN}`
}
```

Call sites updated to import from here (values unchanged, so rendered output is identical):

| File | Line(s) | Change |
|---|---|---|
| `src/proxy.ts` | 4 | `WORKSPACE_SUBDOMAIN` import replaces local const |
| `src/lib/seo.ts` | 1 | `BASE` becomes `SITE_URL` import |
| `src/app/layout.tsx` | 20, 47, 77, 80 | `SITE_URL`, `BUSINESS_EMAIL` |
| `src/app/robots.ts` | 9 | `` `${SITE_URL}/sitemap.xml` `` |
| `src/app/sitemap.ts` | 4 | `baseUrl` becomes `SITE_URL` import |
| `src/app/opengraph-image.tsx` | 75 | `{SITE_DOMAIN}` |
| `src/app/privacy/page.tsx` | 36, 48 | `BUSINESS_EMAIL`, `SITE_DOMAIN` interpolated into existing prose strings |
| `src/app/terms/page.tsx` | 15, 39, 50 | `SITE_DOMAIN`, `BUSINESS_EMAIL` interpolated into existing prose strings |
| `src/app/api/career/route.ts` | 89-91 | `NOREPLY_EMAIL`, `HR_EMAIL`, `BUSINESS_EMAIL` |
| `src/app/api/contact/route.ts` | 62-63 | `NOREPLY_EMAIL`, `BUSINESS_EMAIL` |
| `src/app/api/lead/route.ts` | 141-142 | `NOREPLY_EMAIL`, `BUSINESS_EMAIL` |
| `src/app/admin/actions.ts` | 50 | `clientEmailForSlug(slug)` replaces inline template literal |
| `src/app/admin/page.tsx` | 44 | `clientEmailForSlug(client.slug)` replaces inline template literal |
| `src/app/admin/clients/[clientId]/page.tsx` | 39 | `clientEmailForSlug(client.slug)` replaces inline template literal |

All prose strings (privacy/terms sections, opengraph watermark) keep the exact same rendered text — only the domain/email substring becomes an interpolated constant instead of a literal.

### 6. Two correctness fixes

**`src/lib/risk.ts`** — add and export `isPastCalendarDate(dateOnly: string): boolean`, comparing the due date's calendar day (in the viewer's local timezone) against today's calendar day, instead of `new Date(dueDateString).getTime() < Date.now()` (which treats the date-only string as UTC midnight). `computeProjectRisk`'s per-deliverable loop (currently lines 34-48) uses this helper for its overdue/due-soon checks instead of raw millisecond math. `risk-styles.ts`'s `isDeliverableOverdue` (item 3) imports this same helper — one implementation, two call sites, both currently buggy in the same way.

**`src/lib/supabase/signed-urls.ts`** — `getSignedFileUrls` currently calls `createSignedUrls(paths, 3600)` once with the full `paths` array (line 10). New: split `paths` into chunks of 50 with a small local helper, call `createSignedUrls` once per chunk, merge all successful entries into the same returned `Record<string, string>`. Error handling (per-entry `console.error`) stays the same, just runs per chunk.

## Testing approach

This is refactor-plus-two-scoped-fixes, not new feature work, so verification is:

1. `npm run build` — confirms the type-safety change (item 1) doesn't break any `.insert()`/`.update()` call site, and everything else compiles.
2. Local preview walkthrough (`npm run build && npm run start`, via the browser preview tool): `/admin` PM flow (client list, project detail, add/update deliverable with due date, add/complete meeting) and `/workspace` client flow (project list showing risk badges, project detail all 5 tabs) — confirm pixel-identical visuals and identical behavior to before the refactor.
3. One deliberate boundary test for the timezone fix: a deliverable with `due_date` set to today's date in the server's timezone, viewed from a simulated negative-UTC-offset client, should not show "overdue" (regression test for the bug found in the audit).
4. Marketing page spot-check (`/platform/operate/customer-workspace`) to confirm `CustomerWorkspacePreview` still renders identically after the shared-chrome extraction (item 4).

## Out of scope

- Any change to live Vercel/GoDaddy/Supabase dashboard entries.
- Pagination for clients/projects/deliverables/meetings/reports lists (flagged as a future scalability concern in the audit, not fixed here — no evidence of it being a problem at current scale).
- Zoho email alias/forwarding-rule audit.
- Switching type generation to the Supabase CLI (deferred per the brainstorming decision).
