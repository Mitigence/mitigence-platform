# Codebase Quality & Scalability Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the quality, duplication, and scalability issues found in the architecture audit (bad hand-written Supabase types, an N+1 query, 3-5x duplicated risk/date logic, ~65% duplicated JSX between the marketing preview and the real client workspace, 19 hardcoded domain/email strings, a signed-URL batch-size gap, and a date-only timezone bug) without changing any user-visible behavior except the two explicitly-scoped correctness fixes.

**Architecture:** Six independent-ish changes to an existing Next.js 16 App Router codebase: (1) hand-fix Supabase type relationships, (2) centralize risk/date-formatting logic, (3) batch the workspace list page's queries, (4) centralize domain/email strings, (5) extract shared presentational chrome between the marketing preview and the real client workspace, (6) fix a signed-URL batch cap and a timezone comparison bug. No new dependencies, no schema changes, no new routes.

**Tech Stack:** Next.js 16 App Router, React 19 Server/Client Components, TypeScript strict mode, Supabase (Postgres + Storage), Tailwind CSS v4.

## Global Constraints

- No functional/visual behavior change except the two explicitly-scoped fixes in Task 3 (timezone) and Task 4 (signed-URL batching) — everything else must render and behave identically before/after.
- This repo has no test runner configured (no Jest/Vitest/Playwright unit-test setup) — verification throughout this plan is `npm run build` (TypeScript compiles clean) plus manual browser-preview walkthroughs, matching how every prior phase of this project was verified. Do not add a test framework as part of this plan — out of scope.
- Follow existing code style: Tailwind utility classes inline, Server Components fetch data and pass plain props to `'use client'` components, Server Actions live in sibling `*-actions.ts` files.
- Commit after each task, following this repo's existing commit style (`type: short description`, `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`).

---

### Task 1: Fix Supabase type Relationships arrays

**Files:**
- Modify: `src/lib/supabase/types.ts:33-207` (profiles, projects, reports, deliverables, meetings, recommendations table definitions)

**Interfaces:**
- Consumes: nothing new — this only adds metadata to the existing `Database` type already imported everywhere via `import type { Database } from './types'` (or `@/lib/supabase/types`).
- Produces: nothing later tasks depend on — this is a standalone type-correctness fix. Confirmed safe because `Relationships` is read by supabase-js's join/embedding type resolution only; it does not change any `Row`/`Insert`/`Update` shape, so no consuming code changes.

- [ ] **Step 1: Replace `profiles`' `Relationships: []` (line 53) with the real FK**

In `src/lib/supabase/types.ts`, inside the `profiles` table object, change:

```typescript
        Relationships: []
```

(the one at line 53, immediately after the `profiles.Update` block) to:

```typescript
        Relationships: [
          {
            foreignKeyName: 'profiles_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
```

This matches the FK declared in `supabase/migrations/0001_schema.sql:13` (`client_id uuid references public.clients(id) on delete cascade`). Postgres auto-names unnamed FK constraints as `<table>_<column>_fkey`, so `profiles_client_id_fkey` is the real constraint name.

- [ ] **Step 2: Replace `projects`' `Relationships: []` (line 83) with its FK**

```typescript
        Relationships: [
          {
            foreignKeyName: 'projects_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
```

FK source: `supabase/migrations/0001_schema.sql:24`.

- [ ] **Step 3: Replace `reports`' `Relationships: []` (line 115) with its two FKs**

```typescript
        Relationships: [
          {
            foreignKeyName: 'reports_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reports_uploaded_by_fkey'
            columns: ['uploaded_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
```

FK sources: `supabase/migrations/0001_schema.sql:35` (`project_id`), `:41` (`uploaded_by`).

- [ ] **Step 4: Replace `deliverables`' `Relationships: []` (line 152) with its two FKs**

```typescript
        Relationships: [
          {
            foreignKeyName: 'deliverables_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deliverables_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
```

FK sources: `supabase/migrations/0001_schema.sql:47` (`project_id`), `:52` (`updated_by`).

- [ ] **Step 5: Replace `meetings`' `Relationships: []` (line 182) with its FK**

```typescript
        Relationships: [
          {
            foreignKeyName: 'meetings_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
```

FK source: `supabase/migrations/0001_schema.sql:58`.

- [ ] **Step 6: Replace `recommendations`' `Relationships: []` (line 206) with its FK**

```typescript
        Relationships: [
          {
            foreignKeyName: 'recommendations_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
```

FK source: `supabase/migrations/0001_schema.sql:69`. Leave `clients`' `Relationships: []` (line 31) untouched — `clients` has no outgoing FK.

- [ ] **Step 7: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` — no `.insert()`/`.update()` call site anywhere breaks (this change is additive-only to the type).

- [ ] **Step 8: Commit**

```bash
git add src/lib/supabase/types.ts && git commit -m "$(cat <<'EOF'
fix: add missing FK Relationships to hand-written Supabase types

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Centralize domain/email strings into site-config

**Files:**
- Create: `src/lib/site-config.ts`
- Modify: `src/proxy.ts:4`, `src/lib/seo.ts:1`, `src/app/layout.tsx:20,47,77,80`, `src/app/robots.ts:9`, `src/app/sitemap.ts:4`, `src/app/opengraph-image.tsx` (import + line with `mitigence.com` text), `src/app/privacy/page.tsx` (import + lines 36, 48), `src/app/terms/page.tsx` (import + lines 15, 39, 50), `src/app/api/career/route.ts:89-91`, `src/app/api/contact/route.ts:62-63`, `src/app/api/lead/route.ts:141-142`, `src/app/admin/actions.ts:50`, `src/app/admin/page.tsx:44`, `src/app/admin/clients/[clientId]/page.tsx:39`

**Interfaces:**
- Produces: `SITE_DOMAIN: string`, `SITE_URL: string`, `WORKSPACE_SUBDOMAIN: string`, `BUSINESS_EMAIL: string`, `HR_EMAIL: string`, `NOREPLY_EMAIL: string`, `clientEmailForSlug(slug: string): string` — all exported from `src/lib/site-config.ts`. Every file below imports from this module. No later task depends on these.

- [ ] **Step 1: Create the config module**

Create `src/lib/site-config.ts`:

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

- [ ] **Step 2: Update `src/proxy.ts`**

Change:

```typescript
const WORKSPACE_SUBDOMAIN = 'workspace.mitigence.com'
```

to:

```typescript
import { WORKSPACE_SUBDOMAIN } from '@/lib/site-config'
```

(remove the local `const`, add the import alongside the existing `import { updateSession } from '@/lib/supabase/middleware'` line). The rest of the file (the `host === WORKSPACE_SUBDOMAIN` check) is unchanged.

- [ ] **Step 3: Update `src/lib/seo.ts`**

Change line 1 from:

```typescript
const BASE = 'https://mitigence.com'
```

to:

```typescript
import { SITE_URL as BASE } from './site-config'
```

Every other line in the file already uses `BASE` and needs no further change.

- [ ] **Step 4: Update `src/app/layout.tsx`**

Add near the top (after the existing imports, before `export const metadata`):

```typescript
import { SITE_URL, BUSINESS_EMAIL } from '@/lib/site-config'
```

Then replace:
- Line 20: `metadataBase: new URL('https://mitigence.com'),` → `metadataBase: new URL(SITE_URL),`
- Line 47: `url: 'https://mitigence.com',` (inside `openGraph`) → `url: SITE_URL,`
- Line 77: `url: 'https://mitigence.com',` (inside `organizationJsonLd`) → `url: SITE_URL,`
- Line 80: `email: 'business@mitigence.com',` → `email: BUSINESS_EMAIL,`

- [ ] **Step 5: Update `src/app/robots.ts`**

Add `import { SITE_URL } from '@/lib/site-config'` at the top. Change line 9:

```typescript
    sitemap: 'https://mitigence.com/sitemap.xml',
```

to:

```typescript
    sitemap: `${SITE_URL}/sitemap.xml`,
```

- [ ] **Step 6: Update `src/app/sitemap.ts`**

Add `import { SITE_URL } from '@/lib/site-config'` at the top (alongside the existing `storiesData` import). Change line 4:

```typescript
const baseUrl = 'https://mitigence.com'
```

to:

```typescript
const baseUrl = SITE_URL
```

The rest of the file already uses `baseUrl` and needs no further change.

- [ ] **Step 7: Update `src/app/opengraph-image.tsx`**

Add `import { SITE_DOMAIN } from '@/lib/site-config'` at the top (alongside the existing `import { ImageResponse } from 'next/og'`). Change:

```typescript
          <div style={{ color: '#3f3f46', fontSize: 14 }}>mitigence.com</div>
```

to:

```typescript
          <div style={{ color: '#3f3f46', fontSize: 14 }}>{SITE_DOMAIN}</div>
```

- [ ] **Step 8: Update `src/app/privacy/page.tsx`**

Add `import { SITE_DOMAIN, BUSINESS_EMAIL } from '@/lib/site-config'` at the top (alongside the existing `breadcrumbJsonLd` import). Change the `sections` array entry (currently line 36):

```typescript
    body: 'Questions about this privacy policy can be sent to business@mitigence.com.',
```

to:

```typescript
    body: `Questions about this privacy policy can be sent to ${BUSINESS_EMAIL}.`,
```

Change the JSX paragraph (currently line 48, inside the intro `<p>`):

```typescript
          submitted through mitigence.com.
```

to:

```typescript
          submitted through {SITE_DOMAIN}.
```

- [ ] **Step 9: Update `src/app/terms/page.tsx`**

Add `import { SITE_DOMAIN, BUSINESS_EMAIL } from '@/lib/site-config'` at the top. Change the `sections` array entry (currently line 15):

```typescript
    body: 'By accessing mitigence.com, you agree to these terms of service. If you do not agree, please do not use this site.',
```

to:

```typescript
    body: `By accessing ${SITE_DOMAIN}, you agree to these terms of service. If you do not agree, please do not use this site.`,
```

Change the `sections` array entry (currently line 39):

```typescript
    body: 'Questions about these terms can be sent to business@mitigence.com.',
```

to:

```typescript
    body: `Questions about these terms can be sent to ${BUSINESS_EMAIL}.`,
```

Change the JSX paragraph (currently line 50):

```typescript
          Last updated: January 2026. These terms govern your use of mitigence.com.
```

to:

```typescript
          Last updated: January 2026. These terms govern your use of {SITE_DOMAIN}.
```

- [ ] **Step 10: Update `src/app/api/career/route.ts`**

Add `import { NOREPLY_EMAIL, HR_EMAIL, BUSINESS_EMAIL } from '@/lib/site-config'` at the top. Change lines 89-91:

```typescript
      from: 'Mitigence Platform <noreply@mitigence.com>',
      to: ['hr@mitigence.com'],
      cc: ['business@mitigence.com'],
```

to:

```typescript
      from: `Mitigence Platform <${NOREPLY_EMAIL}>`,
      to: [HR_EMAIL],
      cc: [BUSINESS_EMAIL],
```

- [ ] **Step 11: Update `src/app/api/contact/route.ts`**

Add `import { NOREPLY_EMAIL, BUSINESS_EMAIL } from '@/lib/site-config'` at the top. Change lines 62-63:

```typescript
      from: 'Mitigence Platform <noreply@mitigence.com>',
      to: ['business@mitigence.com'],
```

to:

```typescript
      from: `Mitigence Platform <${NOREPLY_EMAIL}>`,
      to: [BUSINESS_EMAIL],
```

- [ ] **Step 12: Update `src/app/api/lead/route.ts`**

Add `import { NOREPLY_EMAIL, BUSINESS_EMAIL } from '@/lib/site-config'` at the top. Change lines 141-142:

```typescript
      from: 'Mitigence Platform <noreply@mitigence.com>',
      to: ['business@mitigence.com'],
```

to:

```typescript
      from: `Mitigence Platform <${NOREPLY_EMAIL}>`,
      to: [BUSINESS_EMAIL],
```

- [ ] **Step 13: Update `src/app/admin/actions.ts`**

Add `import { clientEmailForSlug } from '@/lib/site-config'` at the top (alongside the existing `slugify`/`generatePassword` imports). Change line 50:

```typescript
  const email = `${slug}@mitigence.com`
```

to:

```typescript
  const email = clientEmailForSlug(slug)
```

- [ ] **Step 14: Update `src/app/admin/page.tsx`**

Add `import { clientEmailForSlug } from '@/lib/site-config'` at the top. Change line 44:

```typescript
              <p className="text-zinc-500 text-xs mt-0.5">{client.slug}@mitigence.com</p>
```

to:

```typescript
              <p className="text-zinc-500 text-xs mt-0.5">{clientEmailForSlug(client.slug)}</p>
```

- [ ] **Step 15: Update `src/app/admin/clients/[clientId]/page.tsx`**

Add `import { clientEmailForSlug } from '@/lib/site-config'` at the top. Change line 39:

```typescript
        <p className="text-zinc-500 text-xs mb-8">{client.slug}@mitigence.com</p>
```

to:

```typescript
        <p className="text-zinc-500 text-xs mb-8">{clientEmailForSlug(client.slug)}</p>
```

- [ ] **Step 16: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 17: Verify rendered output is unchanged (spot check)**

```bash
cd "E:/mit/WEBAPP" && npm run start
```

Using the browser preview tool, open `http://localhost:3000/privacy` and `http://localhost:3000/terms` — confirm the contact sentences still read exactly `business@mitigence.com` and `mitigence.com` (same visible text, now built from constants instead of literals). Stop the server after checking.

- [ ] **Step 18: Commit**

```bash
git add src/lib/site-config.ts src/proxy.ts src/lib/seo.ts src/app/layout.tsx src/app/robots.ts src/app/sitemap.ts src/app/opengraph-image.tsx src/app/privacy/page.tsx src/app/terms/page.tsx src/app/api/career/route.ts src/app/api/contact/route.ts src/app/api/lead/route.ts src/app/admin/actions.ts src/app/admin/page.tsx "src/app/admin/clients/[clientId]/page.tsx" && git commit -m "$(cat <<'EOF'
refactor: centralize hardcoded domain/email strings into site-config

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Fix the due-date timezone bug in risk.ts

**Files:**
- Modify: `src/lib/risk.ts`

**Interfaces:**
- Produces: `isPastCalendarDate(dateOnly: string): boolean` — exported from `src/lib/risk.ts`. Task 5 (`risk-styles.ts`) imports this exact function and name.
- Consumes: nothing new.

- [ ] **Step 1: Add the calendar-date comparison helper and use it in `computeProjectRisk`**

The bug: `due_date` is stored as a date-only string (e.g. `"2026-07-05"`). The current code does `new Date(d.due_date).getTime()`, which JS parses as UTC midnight of that date, then compares against `Date.now()` (the current instant). That means a deliverable is flagged "overdue" the moment the due date's UTC midnight has passed — i.e., for the entire calendar day it's actually due, not just after it's over. Fix: compare calendar dates directly (as `YYYY-MM-DD` strings, which sort correctly), not instants.

Replace the full contents of `src/lib/risk.ts` with:

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
```

Note: `meetings` use `scheduled_at`, a `timestamptz` (full instant, not date-only) — that comparison was never affected by this bug and is intentionally left as instant-based math.

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Manual boundary check**

Using the browser preview tool against a throwaway PM/client (same pattern as prior phases — create via `/admin`, delete afterward): add a deliverable with `due_date` set to **today's** date (server date, `YYYY-MM-DD`). Confirm the client's risk badge does **not** show it as overdue (it should only flip to overdue starting tomorrow). Add a second deliverable with `due_date` set to **yesterday**. Confirm that one *does* show as overdue with reason `"<item> is 1 day overdue"`. Clean up the throwaway client afterward.

- [ ] **Step 4: Commit**

```bash
git add src/lib/risk.ts && git commit -m "$(cat <<'EOF'
fix: compare due_date as calendar date, not UTC-midnight instant

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Chunk signed URL requests past Supabase's batch cap

**Files:**
- Modify: `src/lib/supabase/signed-urls.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: same public signature as before — `getSignedFileUrls(supabase, paths): Promise<Record<string, string>>`. No caller changes needed.

- [ ] **Step 1: Add chunking to `getSignedFileUrls`**

Replace the full contents of `src/lib/supabase/signed-urls.ts` with:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SIGNED_URL_BATCH_SIZE = 50

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

export async function getSignedFileUrls(
  supabase: SupabaseClient<Database>,
  paths: string[]
): Promise<Record<string, string>> {
  if (paths.length === 0) return {}

  const urls: Record<string, string> = {}

  for (const batch of chunk(paths, SIGNED_URL_BATCH_SIZE)) {
    const { data, error } = await supabase.storage.from('workspace-files').createSignedUrls(batch, 3600)

    if (error) {
      console.error('getSignedFileUrls: createSignedUrls failed', error)
      continue
    }
    if (!data) continue

    for (const entry of data) {
      if (entry.error) {
        console.error('getSignedFileUrls: entry failed', entry.path, entry.error)
      } else if (entry.path && entry.signedUrl) {
        urls[entry.path] = entry.signedUrl
      }
    }
  }

  return urls
}
```

At current data volumes every project has well under 50 files, so `chunk()` always produces exactly one batch — behavior is unchanged today, and stops silently dropping URLs once a project grows past 50 files.

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Manual regression check**

Using the browser preview tool, log in as any existing client with at least one report/deliverable/meeting file already uploaded, open `/workspace/<projectId>`, and confirm the existing "Download" links still work (signed URL still resolves) — this is a pure refactor of the same call, so a working download before this change must still work after.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/signed-urls.ts && git commit -m "$(cat <<'EOF'
fix: chunk signed URL requests to respect Supabase's per-call batch cap

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Extract risk-styles.ts and remove duplicated risk/date logic

**Files:**
- Create: `src/lib/risk-styles.ts`
- Modify: `src/app/workspace/page.tsx:1-11`, `src/app/workspace/[projectId]/client-workspace.tsx:1-16,71-86`, `src/app/admin/projects/[projectId]/risk-badge.tsx:1-7`, `src/app/admin/projects/[projectId]/deliverables-section.tsx:1-28`, `src/app/admin/projects/[projectId]/meetings-section.tsx:1-34`

**Interfaces:**
- Consumes: `isPastCalendarDate` from `src/lib/risk.ts` (Task 3).
- Produces: `RISK_STYLES: Record<RiskResult['level'], string>`, `isDeliverableOverdue(d): boolean`, `isMeetingOverdue(m): boolean`, `formatScheduledAt(s): string` — all exported from `src/lib/risk-styles.ts`. No later task depends on these beyond this task's own consumers.

- [ ] **Step 1: Create `src/lib/risk-styles.ts`**

```typescript
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
```

- [ ] **Step 2: Update `src/app/workspace/page.tsx`**

Remove the local `RISK_STYLES` constant (lines 7-11) and its now-unused `RiskResult` type import. Change:

```typescript
import { computeProjectRisk, type RiskResult } from '@/lib/risk'
import { signOutAction } from '@/app/actions/auth'

const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}
```

to:

```typescript
import { computeProjectRisk } from '@/lib/risk'
import { RISK_STYLES } from '@/lib/risk-styles'
import { signOutAction } from '@/app/actions/auth'
```

The rest of the file already references `RISK_STYLES[project.risk.level]` and needs no further change.

- [ ] **Step 3: Update `src/app/workspace/[projectId]/client-workspace.tsx`**

Remove the local `RISK_STYLES` constant (lines 12-16) and the three local helper functions `isDeliverableOverdue`, `isMeetingOverdue`, `formatScheduledAt` (lines 71-86). Change the top of the file from:

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
```

to:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'
import type { RiskResult } from '@/lib/risk'
import { RISK_STYLES, isDeliverableOverdue, isMeetingOverdue, formatScheduledAt } from '@/lib/risk-styles'
import type { DeliverableStatus, MeetingStatus, Priority, Effort } from '@/lib/supabase/types'

const TABS = ['Overview', 'Reports', 'Deliverables', 'Meetings', 'Recommendations'] as const
type Tab = (typeof TABS)[number]
```

And remove the three local function definitions that used to sit between the interfaces and `export function ClientWorkspace` (originally lines 71-86):

```typescript
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
```

Delete this whole block — the rest of the file's calls to `isDeliverableOverdue(d)`, `isMeetingOverdue(m)`, `formatScheduledAt(...)` now resolve to the imported versions and need no other change.

- [ ] **Step 4: Update `src/app/admin/projects/[projectId]/risk-badge.tsx`**

Change:

```typescript
import type { RiskResult } from '@/lib/risk'

const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}
```

to:

```typescript
import type { RiskResult } from '@/lib/risk'
import { RISK_STYLES } from '@/lib/risk-styles'
```

The rest of the file already uses `RISK_STYLES[risk.level]` and needs no further change.

- [ ] **Step 5: Update `src/app/admin/projects/[projectId]/deliverables-section.tsx`**

Change:

```typescript
import type { DeliverableStatus } from '@/lib/supabase/types'
```

to:

```typescript
import type { DeliverableStatus } from '@/lib/supabase/types'
import { isDeliverableOverdue as isOverdue } from '@/lib/risk-styles'
```

Remove the local function definition (lines 25-28):

```typescript
function isOverdue(deliverable: Deliverable): boolean {
  if (deliverable.status === 'complete' || !deliverable.due_date) return false
  return new Date(deliverable.due_date).getTime() < Date.now()
}
```

Importing `isDeliverableOverdue` under the local alias `isOverdue` means every existing call site in this file (`isOverdue(deliverable)`) keeps working with zero further edits.

- [ ] **Step 6: Update `src/app/admin/projects/[projectId]/meetings-section.tsx`**

Change:

```typescript
import type { MeetingStatus } from '@/lib/supabase/types'
```

to:

```typescript
import type { MeetingStatus } from '@/lib/supabase/types'
import { formatScheduledAt, isMeetingOverdue as isOverdue } from '@/lib/risk-styles'
```

Remove the two local function definitions (lines 24-34):

```typescript
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
```

Again, aliasing `isMeetingOverdue as isOverdue` on import keeps every existing call site working unchanged.

- [ ] **Step 7: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 8: Manual visual regression check**

Using the browser preview tool: open `/workspace` (project list) and confirm risk badges render with the same colors as before. Open `/admin/projects/<id>` for an existing project and confirm the Risk badge, deliverables overdue styling, and meetings overdue styling all look identical to before this change.

- [ ] **Step 9: Commit**

```bash
git add src/lib/risk-styles.ts src/app/workspace/page.tsx "src/app/workspace/[projectId]/client-workspace.tsx" "src/app/admin/projects/[projectId]/risk-badge.tsx" "src/app/admin/projects/[projectId]/deliverables-section.tsx" "src/app/admin/projects/[projectId]/meetings-section.tsx" && git commit -m "$(cat <<'EOF'
refactor: dedupe RISK_STYLES and overdue/date-format helpers into lib/risk-styles

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Fix the N+1 query in the workspace project list

**Files:**
- Modify: `src/app/workspace/page.tsx`

**Interfaces:**
- Consumes: `RISK_STYLES` from `@/lib/risk-styles` (Task 5 must land first — this task edits the same file).
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Replace the per-project query loop with two batched queries**

Replace the full contents of `src/app/workspace/page.tsx` with:

```typescript
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeProjectRisk } from '@/lib/risk'
import { RISK_STYLES } from '@/lib/risk-styles'
import { signOutAction } from '@/app/actions/auth'

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

  const projectIds = (projects ?? []).map((p) => p.id)

  const [{ data: allDeliverables }, { data: allMeetings }] = await Promise.all([
    supabase.from('deliverables').select('project_id, item, status, due_date').in('project_id', projectIds),
    supabase.from('meetings').select('project_id, title, status, scheduled_at').in('project_id', projectIds),
  ])

  const deliverablesByProject = new Map<string, typeof allDeliverables>()
  for (const d of allDeliverables ?? []) {
    const list = deliverablesByProject.get(d.project_id) ?? []
    list.push(d)
    deliverablesByProject.set(d.project_id, list)
  }

  const meetingsByProject = new Map<string, typeof allMeetings>()
  for (const m of allMeetings ?? []) {
    const list = meetingsByProject.get(m.project_id) ?? []
    list.push(m)
    meetingsByProject.set(m.project_id, list)
  }

  const projectsWithRisk = (projects ?? []).map((project) => ({
    ...project,
    risk: computeProjectRisk(
      deliverablesByProject.get(project.id) ?? [],
      meetingsByProject.get(project.id) ?? []
    ),
  }))

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

This replaces the old `Promise.all` over a `.map()` (which fired 2 queries per project) with exactly 2 queries total for any number of projects, each filtered with `.in('project_id', projectIds)`, then grouped into two `Map`s keyed by `project_id` before computing risk per project in memory. When `projectIds` is empty (a client with zero projects), Supabase's `.in()` with an empty array returns zero rows for both queries — this matches the old behavior (which also produced empty deliverables/meetings for a project with none) — no `if (projectIds.length === 0)` special case is needed.

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Manual regression check**

Using the browser preview tool, log in as an existing client with 2+ projects (or create a throwaway client with 2 projects, each with a different deliverable due-date mix, via `/admin`). Open `/workspace` and confirm each project's risk badge shows the correct, project-specific risk level (not swapped or blended with another project's data) — this is the key regression risk of the grouping-by-`project_id` logic. Clean up any throwaway data afterward.

- [ ] **Step 4: Commit**

```bash
git add src/app/workspace/page.tsx && git commit -m "$(cat <<'EOF'
perf: batch workspace project-list queries instead of per-project N+1

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Extract shared workspace chrome components

**Files:**
- Create: `src/components/workspace/WorkspaceHeader.tsx`, `src/components/workspace/WorkspaceTabNav.tsx`, `src/components/workspace/WorkspaceTabTransition.tsx`, `src/components/workspace/OverviewStatCard.tsx`
- Modify: `src/components/customer-workspace/CustomerWorkspacePreview.tsx`, `src/app/workspace/[projectId]/client-workspace.tsx`

**Interfaces:**
- Produces: `WorkspaceHeader(): JSX.Element` (no props), `WorkspaceTabNav({ tabs, activeTab, onTabChange }): JSX.Element`, `WorkspaceTabTransition({ tabKey, children }): JSX.Element`, `OverviewStatCard({ label, children }): JSX.Element` — all default-exported... actually named-exported (matches this codebase's existing convention of named exports, e.g. `export function RiskBadge`) from their respective files under `src/components/workspace/`.
- Consumes: `motion`, `AnimatePresence` from `framer-motion`, `defaultTransition` from `@/lib/animations` (both already dependencies used elsewhere in this codebase).

- [ ] **Step 1: Create `src/components/workspace/WorkspaceHeader.tsx`**

```typescript
export function WorkspaceHeader() {
  return (
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
  )
}
```

This is a byte-for-byte extraction of the block that was identical in both `CustomerWorkspacePreview.tsx:51-65` and `client-workspace.tsx:108-121`.

- [ ] **Step 2: Create `src/components/workspace/WorkspaceTabNav.tsx`**

```typescript
'use client'

interface WorkspaceTabNavProps {
  tabs: readonly string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function WorkspaceTabNav({ tabs, activeTab, onTabChange }: WorkspaceTabNavProps) {
  return (
    <div className="flex border-b border-zinc-800 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
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
  )
}
```

Byte-for-byte extraction of `CustomerWorkspacePreview.tsx:89-104` / `client-workspace.tsx:142-157`, generalized from the literal `TABS` array to a `tabs` prop.

- [ ] **Step 3: Create `src/components/workspace/WorkspaceTabTransition.tsx`**

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'

interface WorkspaceTabTransitionProps {
  tabKey: string
  children: React.ReactNode
}

export function WorkspaceTabTransition({ tabKey, children }: WorkspaceTabTransitionProps) {
  return (
    <div className="p-6 min-h-64">
      <AnimatePresence mode="wait">
        <motion.div
          key={tabKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={defaultTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
```

Byte-for-byte extraction of `CustomerWorkspacePreview.tsx:106-114`'s wrapper and `client-workspace.tsx:159-167`'s wrapper (the `{children}` slot replaces each file's own tab-content conditionals — those conditionals stay in the parent files, passed in as `children`).

- [ ] **Step 4: Create `src/components/workspace/OverviewStatCard.tsx`**

```typescript
interface OverviewStatCardProps {
  label: string
  children: React.ReactNode
  wide?: boolean
}

export function OverviewStatCard({ label, children, wide }: OverviewStatCardProps) {
  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900 p-4 ${wide ? 'sm:col-span-3' : ''}`}>
      <p className="text-zinc-500 text-xs mb-1">{label}</p>
      {children}
    </div>
  )
}
```

Byte-for-byte extraction of the repeated card shell in `CustomerWorkspacePreview.tsx:118-137` / `client-workspace.tsx:171-201` (4 cards each, 3 narrow + 1 wide `sm:col-span-3`). Note the "This week's activity" card used a `mb-3` label and no `text-2xl` value style — that card keeps its own inline label/content structure via `children` rather than being forced into the same typography as the numeric stat cards; `label` only supplies the small header text both share.

- [ ] **Step 5: Update `src/components/customer-workspace/CustomerWorkspacePreview.tsx`**

Replace the header block (lines 51-65), tab nav (lines 89-104), tab-transition wrapper (lines 106-114 opening / 206-208 closing), and the 4 Overview cards (lines 117-138) with the new shared components. Full replacement of the file:

```typescript
'use client'

import { useState } from 'react'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { WorkspaceTabNav } from '@/components/workspace/WorkspaceTabNav'
import { WorkspaceTabTransition } from '@/components/workspace/WorkspaceTabTransition'
import { OverviewStatCard } from '@/components/workspace/OverviewStatCard'

const TABS = ['Overview', 'Reports', 'Deliverables', 'Meetings', 'Recommendations'] as const
type Tab = (typeof TABS)[number]

const mockProject = {
  name: 'Cloud Security Engineering',
  phase: 'Engineering — Week 6 of 12',
  progress: 52,
  status: 'On track',
}

const mockReports = [
  { title: 'Mid-point Assessment Summary', date: 'Week 6', type: 'Executive Summary', status: 'Available' },
  { title: 'Cloud Posture Report — AWS', date: 'Week 5', type: 'Technical Findings', status: 'Available' },
  { title: 'IAM Gap Analysis', date: 'Week 4', type: 'Engineering Report', status: 'Available' },
]

const mockDeliverables = [
  { item: 'Assessment Report', status: 'complete', week: 'Week 3' },
  { item: 'Architecture Design Document', status: 'complete', week: 'Week 4' },
  { item: 'Landing Zone Configuration', status: 'complete', week: 'Week 5' },
  { item: 'IAM Policy Framework', status: 'in-progress', week: 'Week 7' },
  { item: 'Security Hub Configuration', status: 'pending', week: 'Week 8' },
  { item: 'Validation Report', status: 'pending', week: 'Week 10' },
  { item: 'Knowledge Transfer Package', status: 'pending', week: 'Week 12' },
]

const mockMeetings = [
  { title: 'Weekly Engineering Review', date: 'Next: Thursday 10:00', type: 'Recurring' },
  { title: 'IAM Architecture Walkthrough', date: 'Tomorrow 14:00', type: 'Workshop' },
  { title: 'Executive Mid-Point Briefing', date: 'Week 7', type: 'Steering' },
]

const mockRecommendations = [
  { priority: 'High', finding: 'Enable AWS CloudTrail in all regions', effort: 'Low' },
  { priority: 'High', finding: 'Remove wildcard IAM policies from production roles', effort: 'Medium' },
  { priority: 'Medium', finding: 'Enable S3 Object Lock for critical data buckets', effort: 'Low' },
  { priority: 'Medium', finding: 'Implement SCP guardrails to prevent public exposure', effort: 'Medium' },
]

export function CustomerWorkspacePreview() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <WorkspaceHeader />

      {/* Project header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-white font-semibold">{mockProject.name}</h3>
            <p className="text-zinc-500 text-xs mt-0.5">{mockProject.phase}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-zinc-800 rounded-full h-1.5">
              <div
                className="bg-red-600 h-1.5 rounded-full"
                style={{ width: `${mockProject.progress}%` }}
              />
            </div>
            <span className="text-zinc-400 text-xs">{mockProject.progress}%</span>
            <span className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
              {mockProject.status}
            </span>
          </div>
        </div>
      </div>

      <WorkspaceTabNav tabs={TABS} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />

      <WorkspaceTabTransition tabKey={activeTab}>
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <OverviewStatCard label="Deliverables completed">
              <p className="text-2xl font-bold text-white">3 / 7</p>
            </OverviewStatCard>
            <OverviewStatCard label="Open recommendations">
              <p className="text-2xl font-bold text-white">4</p>
            </OverviewStatCard>
            <OverviewStatCard label="Next meeting">
              <p className="text-white font-semibold text-sm">Thursday 10:00</p>
            </OverviewStatCard>
            <OverviewStatCard label="This week's activity" wide>
              <ul className="space-y-2 mt-2">
                <li className="flex items-center gap-2 text-zinc-300 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />IAM Policy Framework — engineering in progress</li>
                <li className="flex items-center gap-2 text-zinc-300 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />IAM Architecture Walkthrough scheduled for tomorrow</li>
                <li className="flex items-center gap-2 text-zinc-300 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Mid-point executive briefing prepared for next week</li>
              </ul>
            </OverviewStatCard>
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="space-y-3">
            {mockReports.map((r) => (
              <div key={r.title} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div>
                  <p className="text-white text-sm font-medium">{r.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{r.type} · {r.date}</p>
                </div>
                <span className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">{r.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Deliverables' && (
          <div className="space-y-2">
            {mockDeliverables.map((d) => (
              <div key={d.item} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-xs ${
                    d.status === 'complete' ? 'border-green-600 bg-green-600 text-white' :
                    d.status === 'in-progress' ? 'border-red-600 bg-red-600/20 text-red-500' :
                    'border-zinc-700'
                  }`}>
                    {d.status === 'complete' ? '✓' : d.status === 'in-progress' ? '·' : ''}
                  </span>
                  <span className={`text-sm ${d.status === 'complete' ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>{d.item}</span>
                </div>
                <span className="text-zinc-600 text-xs">{d.week}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Meetings' && (
          <div className="space-y-3">
            {mockMeetings.map((m) => (
              <div key={m.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white text-sm font-medium">{m.title}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{m.date}</p>
                  </div>
                  <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2.5 py-1 flex-shrink-0">{m.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Recommendations' && (
          <div className="space-y-3">
            {mockRecommendations.map((r) => (
              <div key={r.finding} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-semibold rounded-full px-2.5 py-1 flex-shrink-0 ${
                    r.priority === 'High' ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20'
                  }`}>{r.priority}</span>
                  <p className="text-zinc-300 text-sm">{r.finding}</p>
                </div>
                <span className="text-zinc-500 text-xs flex-shrink-0">Effort: {r.effort}</span>
              </div>
            ))}
          </div>
        )}
      </WorkspaceTabTransition>

      <div className="px-6 pb-6 border-t border-zinc-900 pt-4">
        <p className="text-zinc-600 text-xs">
          This is a preview of the Mitigence Customer Workspace — what active clients see throughout an engagement.
        </p>
      </div>
    </div>
  )
}
```

Note: the "This week's activity" card's `<ul>` gains `mt-2` (previously the parent card div had `p-4` and the heading had `mb-3` providing spacing; `OverviewStatCard` no longer wraps the label in a container with that exact spacing context) — verify visually in Step 7 below that spacing still matches; adjust the `mt-2` if the side-by-side comparison shows any gap difference.

- [ ] **Step 6: Update `src/app/workspace/[projectId]/client-workspace.tsx`**

Apply the same structural replacement pattern as Step 5, keeping all of this file's real-data logic (risk badge, downloads, overdue flags, delay explanations, `recentActivity`) unchanged in the tab bodies. Replace the top of the file:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'
import type { RiskResult } from '@/lib/risk'
import { RISK_STYLES, isDeliverableOverdue, isMeetingOverdue, formatScheduledAt } from '@/lib/risk-styles'
import type { DeliverableStatus, MeetingStatus, Priority, Effort } from '@/lib/supabase/types'
```

to:

```typescript
'use client'

import { useState } from 'react'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { WorkspaceTabNav } from '@/components/workspace/WorkspaceTabNav'
import { WorkspaceTabTransition } from '@/components/workspace/WorkspaceTabTransition'
import { OverviewStatCard } from '@/components/workspace/OverviewStatCard'
import type { RiskResult } from '@/lib/risk'
import { RISK_STYLES, isDeliverableOverdue, isMeetingOverdue, formatScheduledAt } from '@/lib/risk-styles'
import type { DeliverableStatus, MeetingStatus, Priority, Effort } from '@/lib/supabase/types'
```

(this drops the now-unused `motion`, `AnimatePresence`, `defaultTransition` imports since `WorkspaceTabTransition` owns them now).

Replace the workspace-header block:

```typescript
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
```

with:

```typescript
      <WorkspaceHeader />
```

Replace the tab-nav block:

```typescript
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
```

with:

```typescript
      <WorkspaceTabNav tabs={TABS} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />
```

Replace the tab-content opening/closing wrapper:

```typescript
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
```

with:

```typescript
      <WorkspaceTabTransition tabKey={activeTab}>
```

and its closing:

```typescript
          </motion.div>
        </AnimatePresence>
      </div>
```

with:

```typescript
      </WorkspaceTabTransition>
```

Replace the 4 Overview cards:

```typescript
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
```

with:

```typescript
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <OverviewStatCard label="Deliverables completed">
                  <p className="text-2xl font-bold text-white">
                    {completedCount} / {deliverables.length}
                  </p>
                </OverviewStatCard>
                <OverviewStatCard label="Open recommendations">
                  <p className="text-2xl font-bold text-white">{recommendations.length}</p>
                </OverviewStatCard>
                <OverviewStatCard label="Next meeting">
                  <p className="text-white font-semibold text-sm">
                    {nextMeeting ? formatScheduledAt(nextMeeting.scheduled_at) : 'No meetings scheduled'}
                  </p>
                </OverviewStatCard>
                <OverviewStatCard label="This week's activity" wide>
                  {recentActivity.length > 0 ? (
                    <ul className="space-y-2 mt-2">
                      {recentActivity.map((entry) => (
                        <li key={entry} className="flex items-center gap-2 text-zinc-300 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-600 text-xs mt-2">No recent activity.</p>
                  )}
                </OverviewStatCard>
              </div>
            )}
```

Everything else in the file (the `Reports`/`Deliverables`/`Meetings`/`Recommendations` tab bodies, the project-header progress bar + risk badge block, all props/interfaces/state) stays exactly as-is.

- [ ] **Step 7: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 8: Side-by-side visual regression check**

Using the browser preview tool: open `/platform/operate/customer-workspace` (marketing page using `CustomerWorkspacePreview`) and click through all 5 tabs — confirm it renders pixel-identical to before this task (header, progress bar, tab nav, all tab content, footer note). Then log in as an existing client, open `/workspace/<projectId>`, and click through all 5 tabs — confirm identical to before this task, including the "This week's activity" card spacing called out in Step 5.

- [ ] **Step 9: Commit**

```bash
git add src/components/workspace src/components/customer-workspace/CustomerWorkspacePreview.tsx "src/app/workspace/[projectId]/client-workspace.tsx" && git commit -m "$(cat <<'EOF'
refactor: extract shared workspace chrome components, dedupe preview/client JSX

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Final full-app verification

**Files:** none — verification only, no code changes.

**Interfaces:** none.

- [ ] **Step 1: Full production build**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully`, all routes listed with no errors.

- [ ] **Step 2: Full manual walkthrough**

```bash
cd "E:/mit/WEBAPP" && npm run start
```

Using the browser preview tool, walk through:
- Marketing homepage `/` and `/platform/operate/customer-workspace` — confirm normal rendering.
- `/privacy` and `/terms` — confirm contact-email sentences read correctly.
- `/login` → sign in as an existing PM → `/admin` client list → a client detail page → a project detail page: confirm client email display, risk badge, deliverables (add one, mark complete, save a delay explanation), meetings (add one, mark completed) all work exactly as before.
- Sign out, sign in as an existing client → `/workspace` project list (risk badges correct per project) → a project detail page, all 5 tabs, download links working.

- [ ] **Step 3: Stop the server**

Stop the `npm run start` process (or use the preview tool's stop action) once the walkthrough is complete.

- [ ] **Step 4: No commit needed**

This task is verification only — nothing to commit. Mark it done in your own tracking.
