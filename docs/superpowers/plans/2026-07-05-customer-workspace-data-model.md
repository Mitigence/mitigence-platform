# Customer Workspace Phase 1: Data Model & Access Control — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a real Supabase project (Postgres + Auth + Storage) with the schema and row-level security policies described in `docs/superpowers/specs/2026-07-05-customer-workspace-data-model-design.md`, and give the Next.js app typed client helpers to talk to it — with nothing yet built on top (no login screens, no admin tool, no client UI — those are phases 2-5).

**Architecture:** One Supabase project, one Postgres schema (`public`), RLS enabled on every table so a client-role login can only ever see rows tied to its own `client_id`. Access to Postgres from the Next.js app goes through `@supabase/ssr` (browser + server clients) plus a service-role admin client for privileged operations later phases will need. No ORM — plain SQL migrations, hand-maintained TypeScript types.

**Tech Stack:** Supabase (Postgres, Auth, Storage), `@supabase/supabase-js`, `@supabase/ssr`, existing Next.js 16 / TypeScript / Vercel setup.

## Global Constraints

- The Supabase account, and every other new external account created for this project, must be created and owned by **mitigence@gmail.com only** — no other email/account.
- No client-role database user may ever read another client's rows. Enforce this in Postgres (RLS), not application code.
- No self-signup for client accounts. No email-confirmation flow for client logins (their "email" is an internal alias, not a real checked inbox).
- Any authenticated PM-role user has full read/write access to all clients/projects — no per-project assignment restriction.
- Repo has no test framework (`package.json` has no jest/vitest/testing-library). Verification in this phase is via `npm run build` (TypeScript correctness) and direct SQL checks in the Supabase SQL Editor — do not add a test framework as part of this plan.
- Never commit real secrets. `SUPABASE_SERVICE_ROLE_KEY` goes in `.env.local` (gitignored) and Vercel env vars only.

---

### Task 1: Create the Supabase project

**Files:** none (browser/dashboard work only)

**Interfaces:**
- Produces: a Supabase project URL (`https://<ref>.supabase.co`), an `anon` public API key, and a `service_role` secret API key — needed by every later task in this plan.

- [ ] **Step 1: Sign in to Supabase with mitigence@gmail.com**

Go to `https://supabase.com/dashboard` in the browser. Sign in with Google using **mitigence@gmail.com only** (this account was already used for Resend in a prior phase of this project — use the same one). Do not create the project under any other email.

- [ ] **Step 2: Create a new project**

Click "New Project". Settings:
- Name: `mitigence-platform`
- Database password: generate a strong one, save it somewhere safe (needed only if connecting via raw Postgres connection string later — not needed for this plan)
- Region: pick the region closest to your primary user base (Mumbai/Singapore if available, otherwise the closest offered)
- Plan: Free tier is fine to start

Wait for provisioning to finish (1-2 minutes).

- [ ] **Step 3: Collect the API credentials**

In the project dashboard: **Settings → API**. Record three values (you'll paste these into `.env.local` and Vercel in Task 2):
- `Project URL` (looks like `https://abcdefghijk.supabase.co`)
- `anon` `public` key (long JWT string)
- `service_role` `secret` key (long JWT string — never expose this to the browser)

- [ ] **Step 4: Confirm no other project/account was touched**

Double check the Supabase organization/account shown top-left is `mitigence@gmail.com`'s personal org, not any other account. This is a manual check — no command to run.

---

### Task 2: Install Supabase client libraries and wire up environment variables

**Files:**
- Modify: `E:\mit\WEBAPP\package.json`
- Create: `E:\mit\WEBAPP\.env.local` (if it doesn't already have these keys — it currently only has `RESEND_API_KEY`)
- Modify: Vercel project environment variables (via Vercel dashboard, Production + Preview)

**Interfaces:**
- Produces: `process.env.NEXT_PUBLIC_SUPABASE_URL`, `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`, `process.env.SUPABASE_SERVICE_ROLE_KEY` — consumed by Task 5's client helper files.

- [ ] **Step 1: Install dependencies**

```bash
cd "E:/mit/WEBAPP" && npm install @supabase/supabase-js@^2 @supabase/ssr@^0.5
```

Expected: `package.json` `dependencies` gains `@supabase/supabase-js` and `@supabase/ssr`, `package-lock.json` updates, no errors.

- [ ] **Step 2: Add local env vars**

Read the current `.env.local`:

```bash
cat "E:/mit/WEBAPP/.env.local"
```

Append the three Supabase values collected in Task 1 (replace the placeholders with the real values you copied — do not leave them as literal placeholder text):

```bash
cat >> "E:/mit/WEBAPP/.env.local" << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
EOF
```

- [ ] **Step 3: Confirm `.env.local` is gitignored**

```bash
cd "E:/mit/WEBAPP" && git check-ignore .env.local && echo "IGNORED (good)" || echo "NOT IGNORED — STOP, do not commit secrets"
```

Expected: `IGNORED (good)`. If it prints the "NOT IGNORED" branch, add `.env.local` to `.gitignore` before continuing.

- [ ] **Step 4: Add the same three variables to Vercel**

In the browser, go to the Vercel project → Settings → Environment Variables (same page used earlier for `RESEND_API_KEY`). Add all three (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) for Production and Preview environments. Mark `SUPABASE_SERVICE_ROLE_KEY` as **Sensitive**.

- [ ] **Step 5: Commit the dependency change**

```bash
cd "E:/mit/WEBAPP" && git add package.json package-lock.json && git commit -m "$(cat <<'EOF'
chore: add Supabase client libraries

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds, `.env.local` does not appear in `git status` (already ignored).

---

### Task 3: Schema migration — tables

**Files:**
- Create: `E:\mit\WEBAPP\supabase\migrations\0001_schema.sql`

**Interfaces:**
- Produces: tables `public.clients`, `public.profiles`, `public.projects`, `public.reports`, `public.deliverables`, `public.meetings`, `public.recommendations` — consumed by Task 4 (RLS policies) and every later phase.

- [ ] **Step 1: Create the migrations folder and file**

```bash
mkdir -p "E:/mit/WEBAPP/supabase/migrations"
```

Write `E:\mit\WEBAPP\supabase\migrations\0001_schema.sql`:

```sql
-- Customer Workspace: core schema (phase 1)

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('pm', 'client')),
  client_id uuid references public.clients(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  constraint client_role_requires_client_id check (
    (role = 'client' and client_id is not null) or
    (role = 'pm' and client_id is null)
  )
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  phase text not null default '',
  progress int not null default 0 check (progress between 0 and 100),
  status text not null default 'On track',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  report_type text not null default '',
  report_date text not null default '',
  status text not null default 'Available',
  file_path text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  item text not null,
  status text not null default 'pending' check (status in ('pending', 'in-progress', 'complete')),
  week_label text not null default '',
  file_path text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  meeting_type text not null default '',
  scheduled_at timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed')),
  mom_file_path text,
  created_at timestamptz not null default now()
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  finding text not null,
  priority text not null check (priority in ('High', 'Medium', 'Low')),
  effort text not null check (effort in ('Low', 'Medium', 'High')),
  created_at timestamptz not null default now()
);

create index projects_client_id_idx on public.projects(client_id);
create index reports_project_id_idx on public.reports(project_id);
create index deliverables_project_id_idx on public.deliverables(project_id);
create index meetings_project_id_idx on public.meetings(project_id);
create index recommendations_project_id_idx on public.recommendations(project_id);
```

- [ ] **Step 2: Run the migration in the Supabase SQL Editor**

In the browser, go to the Supabase project → SQL Editor → New query. Paste the full contents of `0001_schema.sql` and run it.

Expected: "Success. No rows returned." No red error banner.

- [ ] **Step 3: Verify the tables exist**

In the same SQL Editor, run:

```sql
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Expected: rows returned are exactly `clients`, `deliverables`, `meetings`, `profiles`, `projects`, `recommendations`, `reports`.

- [ ] **Step 4: Commit the migration file**

```bash
cd "E:/mit/WEBAPP" && git add supabase/migrations/0001_schema.sql && git commit -m "$(cat <<'EOF'
feat: customer workspace schema migration

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Row Level Security policies

**Files:**
- Create: `E:\mit\WEBAPP\supabase\migrations\0002_rls.sql`

**Interfaces:**
- Consumes: tables from Task 3.
- Produces: `public.current_role()` and `public.current_client_id()` SQL functions, and RLS policies on all 7 tables — relied on by Task 6's verification and every later phase's data access.

- [ ] **Step 1: Write the RLS migration**

Write `E:\mit\WEBAPP\supabase\migrations\0002_rls.sql`:

```sql
-- Customer Workspace: row level security (phase 1)

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select client_id from public.profiles where id = auth.uid()
$$;

-- clients
alter table public.clients enable row level security;

create policy "pm full access clients" on public.clients
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own clients row" on public.clients
  for select
  using (id = public.current_client_id());

-- profiles
alter table public.profiles enable row level security;

create policy "read own profile" on public.profiles
  for select
  using (id = auth.uid());

create policy "pm reads all profiles" on public.profiles
  for select
  using (public.current_role() = 'pm');

-- projects
alter table public.projects enable row level security;

create policy "pm full access projects" on public.projects
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own projects" on public.projects
  for select
  using (client_id = public.current_client_id());

-- reports
alter table public.reports enable row level security;

create policy "pm full access reports" on public.reports
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own reports" on public.reports
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = reports.project_id
      and p.client_id = public.current_client_id()
    )
  );

-- deliverables
alter table public.deliverables enable row level security;

create policy "pm full access deliverables" on public.deliverables
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own deliverables" on public.deliverables
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = deliverables.project_id
      and p.client_id = public.current_client_id()
    )
  );

-- meetings
alter table public.meetings enable row level security;

create policy "pm full access meetings" on public.meetings
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own meetings" on public.meetings
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = meetings.project_id
      and p.client_id = public.current_client_id()
    )
  );

-- recommendations
alter table public.recommendations enable row level security;

create policy "pm full access recommendations" on public.recommendations
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own recommendations" on public.recommendations
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = recommendations.project_id
      and p.client_id = public.current_client_id()
    )
  );
```

- [ ] **Step 2: Run the migration in the Supabase SQL Editor**

Paste and run the full file in a new SQL Editor query.

Expected: "Success. No rows returned."

- [ ] **Step 3: Verify RLS is enabled on every table**

```sql
select relname, relrowsecurity
from pg_class
where relname in ('clients', 'profiles', 'projects', 'reports', 'deliverables', 'meetings', 'recommendations')
order by relname;
```

Expected: all 7 rows show `relrowsecurity = true`.

- [ ] **Step 4: Commit the migration file**

```bash
cd "E:/mit/WEBAPP" && git add supabase/migrations/0002_rls.sql && git commit -m "$(cat <<'EOF'
feat: customer workspace row-level security policies

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Storage bucket and policies

**Files:**
- Create: `E:\mit\WEBAPP\supabase\migrations\0003_storage.sql`

**Interfaces:**
- Consumes: `public.current_role()`, `public.current_client_id()` from Task 4.
- Produces: private bucket `workspace-files` with path convention `{project_id}/{reports|deliverables|meetings}/{filename}` — relied on by phase 3 (uploads) and phase 4 (downloads).

- [ ] **Step 1: Create the bucket**

In the browser: Supabase project → Storage → New bucket. Name: `workspace-files`. **Public bucket: OFF** (must stay private).

- [ ] **Step 2: Write the storage policy migration**

Write `E:\mit\WEBAPP\supabase\migrations\0003_storage.sql`:

```sql
-- Customer Workspace: storage policies (phase 1)
-- Path convention: {project_id}/{reports|deliverables|meetings}/{filename}

create policy "pm full access workspace files" on storage.objects
  for all
  using (bucket_id = 'workspace-files' and public.current_role() = 'pm')
  with check (bucket_id = 'workspace-files' and public.current_role() = 'pm');

create policy "client reads own workspace files" on storage.objects
  for select
  using (
    bucket_id = 'workspace-files'
    and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
      and p.client_id = public.current_client_id()
    )
  );
```

- [ ] **Step 3: Run the migration in the Supabase SQL Editor**

Paste and run the full file.

Expected: "Success. No rows returned."

- [ ] **Step 4: Verify the policies exist**

```sql
select policyname, cmd from pg_policies
where schemaname = 'storage' and tablename = 'objects'
and policyname like '%workspace files%';
```

Expected: 2 rows — `pm full access workspace files` and `client reads own workspace files`.

- [ ] **Step 5: Commit the migration file**

```bash
cd "E:/mit/WEBAPP" && git add supabase/migrations/0003_storage.sql && git commit -m "$(cat <<'EOF'
feat: customer workspace storage bucket and access policies

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Typed Supabase client helpers

**Files:**
- Create: `E:\mit\WEBAPP\src\lib\supabase\types.ts`
- Create: `E:\mit\WEBAPP\src\lib\supabase\client.ts`
- Create: `E:\mit\WEBAPP\src\lib\supabase\server.ts`
- Create: `E:\mit\WEBAPP\src\lib\supabase\admin.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` from Task 2; table shapes from Task 3.
- Produces: `Database` type, `createBrowserSupabaseClient()`, `createServerSupabaseClient()`, `createAdminSupabaseClient()` — every later phase's data access goes through these.

- [ ] **Step 1: Write the Database type**

Write `E:\mit\WEBAPP\src\lib\supabase\types.ts`:

```typescript
export type ProfileRole = 'pm' | 'client'
export type DeliverableStatus = 'pending' | 'in-progress' | 'complete'
export type MeetingStatus = 'upcoming' | 'completed'
export type Priority = 'High' | 'Medium' | 'Low'
export type Effort = 'Low' | 'Medium' | 'High'

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: Partial<{
          id: string
          name: string
          slug: string
          created_at: string
        }>
      }
      profiles: {
        Row: {
          id: string
          role: ProfileRole
          client_id: string | null
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: ProfileRole
          client_id?: string | null
          full_name?: string | null
          created_at?: string
        }
        Update: Partial<{
          role: ProfileRole
          client_id: string | null
          full_name: string | null
        }>
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          phase: string
          progress: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          phase?: string
          progress?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<{
          name: string
          phase: string
          progress: number
          status: string
          updated_at: string
        }>
      }
      reports: {
        Row: {
          id: string
          project_id: string
          title: string
          report_type: string
          report_date: string
          status: string
          file_path: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          report_type?: string
          report_date?: string
          status?: string
          file_path?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: Partial<{
          title: string
          report_type: string
          report_date: string
          status: string
          file_path: string | null
        }>
      }
      deliverables: {
        Row: {
          id: string
          project_id: string
          item: string
          status: DeliverableStatus
          week_label: string
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
          file_path?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: Partial<{
          item: string
          status: DeliverableStatus
          week_label: string
          file_path: string | null
          updated_by: string | null
          updated_at: string
        }>
      }
      meetings: {
        Row: {
          id: string
          project_id: string
          title: string
          meeting_type: string
          scheduled_at: string
          status: MeetingStatus
          mom_file_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          meeting_type?: string
          scheduled_at: string
          status?: MeetingStatus
          mom_file_path?: string | null
          created_at?: string
        }
        Update: Partial<{
          title: string
          meeting_type: string
          scheduled_at: string
          status: MeetingStatus
          mom_file_path: string | null
        }>
      }
      recommendations: {
        Row: {
          id: string
          project_id: string
          finding: string
          priority: Priority
          effort: Effort
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          finding: string
          priority: Priority
          effort: Effort
          created_at?: string
        }
        Update: Partial<{
          finding: string
          priority: Priority
          effort: Effort
        }>
      }
    }
  }
}
```

- [ ] **Step 2: Write the browser client**

Write `E:\mit\WEBAPP\src\lib\supabase\client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Write the server client**

Write `E:\mit\WEBAPP\src\lib\supabase\server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component with no request context —
            // safe to ignore when middleware handles session refresh.
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: Write the admin client**

Write `E:\mit\WEBAPP\src\lib\supabase\admin.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Service-role client — bypasses Row Level Security entirely.
// Server-only: never import this file from a Client Component.
export function createAdminSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
```

- [ ] **Step 5: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -30
```

Expected: build completes successfully (`✓ Compiled successfully`), no TypeScript errors referencing `src/lib/supabase/*`.

- [ ] **Step 6: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/lib/supabase && git commit -m "$(cat <<'EOF'
feat: typed Supabase client helpers (browser, server, admin)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: End-to-end RLS verification with real test data

**Files:** none (SQL Editor + Supabase Dashboard only — this task proves Task 4's policies actually work, using real auth users, before any later phase builds on top of them)

**Interfaces:**
- Consumes: everything from Tasks 3-5.
- Produces: confidence that RLS is correctly enforced. No code artifact — this is the "run the test suite" step for a phase that has no application code yet.

- [ ] **Step 1: Create two test auth users via the dashboard**

Supabase project → Authentication → Users → Add user → Create new user. Create two:
- Email: `test-pm@mitigence.com`, password: any test password, **Auto Confirm User: ON**
- Email: `test-client@mitigence.com`, password: any test password, **Auto Confirm User: ON**

Copy both users' UUIDs from the Users table (click each user to see its ID).

- [ ] **Step 2: Seed two clients, one project each, and matching profiles**

In the SQL Editor, run (replace `<PM_UUID>` and `<CLIENT_UUID>` with the real UUIDs from Step 1):

```sql
insert into public.clients (name, slug) values
  ('Acme Test Co', 'acme-test'),
  ('Globex Test Co', 'globex-test');

insert into public.projects (client_id, name, phase, progress, status)
select id, 'Acme Test Project', 'Engineering — Week 1', 10, 'On track'
from public.clients where slug = 'acme-test';

insert into public.projects (client_id, name, phase, progress, status)
select id, 'Globex Test Project', 'Engineering — Week 1', 10, 'On track'
from public.clients where slug = 'globex-test';

insert into public.profiles (id, role, client_id)
values ('<PM_UUID>', 'pm', null);

insert into public.profiles (id, role, client_id)
select '<CLIENT_UUID>', 'client', id
from public.clients where slug = 'acme-test';
```

Expected: all statements succeed, no errors.

- [ ] **Step 3: Verify the client test user can only see Acme's project**

In the SQL Editor, run (replace `<CLIENT_UUID>` with the real UUID):

```sql
set local role authenticated;
set local "request.jwt.claims" = '{"sub": "<CLIENT_UUID>"}';

select name from public.projects;
```

Expected: exactly one row, `Acme Test Project`. `Globex Test Project` must NOT appear.

- [ ] **Step 4: Verify the PM test user can see both projects**

In the same SQL Editor (new query, so the previous `set local` doesn't carry over — `set local` is transaction-scoped), run (replace `<PM_UUID>`):

```sql
set local role authenticated;
set local "request.jwt.claims" = '{"sub": "<PM_UUID>"}';

select name from public.projects order by name;
```

Expected: two rows, `Acme Test Project` and `Globex Test Project`.

- [ ] **Step 5: Verify an anonymous request sees nothing**

```sql
set local role anon;

select name from public.projects;
```

Expected: 0 rows (RLS default-denies; `anon` role matches no policy since `current_role()` returns null for a non-existent profile).

- [ ] **Step 6: Clean up all test data**

```sql
delete from public.clients where slug in ('acme-test', 'globex-test');
```

Expected: cascades delete the test projects and profile rows (via `on delete cascade`). Confirm with:

```sql
select count(*) from public.projects where name like '%Test Project';
```

Expected: `0`.

Then delete the two test auth users via the Dashboard (Authentication → Users → delete `test-pm@mitigence.com` and `test-client@mitigence.com`).

- [ ] **Step 7: No commit needed**

This task only ran and verified SQL against the live database — there is no file to commit. Note the plan as fully verified in your own tracking (e.g. mark this task done in the plan checklist).
