# Customer Workspace — Phase 1: Data Model & Access Control

## Context

The site currently ships a static mock (`CustomerWorkspacePreview.tsx`, rendered at
`/platform/operate/customer-workspace`) showing what an active engagement looks like:
a project header (name/phase/progress/status) and five tabs — Overview, Reports,
Deliverables, Meetings, Recommendations — all backed by hardcoded arrays.

The goal across five phases is to make this real:

1. **Data model** (this doc) — Supabase schema, roles, RLS, storage
2. Auth & roles (client vs. Mitigence PM logins)
3. PM admin tool (upload reports, update deliverable status, log meetings, add recommendations)
4. Client-facing workspace (read-only, same UI/tabs as the current preview, real data)
5. Subdomain wiring (e.g. `workspace.mitigence.com`, DNS + Vercel + routing)

Each phase gets its own spec → plan → build cycle. This document covers phase 1 only.

## Decisions locked in during brainstorming

- One login per client company, not per person at the client. Username is an
  email-shaped alias like `acmecorp@mitigence.com` that Mitigence creates —
  it does not need to be a real, checked inbox. No self-signup, no email
  confirmation flow.
- Mitigence PM/staff each get their own individual login.
- Any logged-in PM can view and edit any client's project (no per-project
  assignment restriction).
- A client can have multiple projects (past and current) — the client
  workspace needs a project switcher, not just a single fixed project.
- Reports: real file uploads (PDF/doc), downloadable by the client.
- Deliverables: a status checklist (pending / in-progress / complete) that
  can *optionally* also carry an attached file.
- Meetings: informational rows entered manually by the PM (title, type,
  date/time) — no calendar/Zoom integration — plus an optional
  Minutes-of-Meeting file attached once the meeting is marked completed.
- Recommendations: text entries (finding, priority, effort) — no files.

## Approach

Single Supabase project provides Postgres + Auth + Storage. The workspace is
built as a new route group inside the existing Next.js app (not a separate
app/repo), so it shares the current design system, Tailwind theme, and brand
components — this is what lets the client-facing UI in phase 4 match the
existing preview exactly rather than being rebuilt from scratch. The
subdomain (phase 5) is routing/deployment configuration on top of this same
app, not a separate codebase.

Access control is enforced with Postgres Row Level Security (RLS), not just
hidden in the UI — a client login has no path to another client's data even
if it guesses an ID or URL, because the database itself refuses the query.

## Schema

```
clients
  id            uuid, pk
  name          text                 -- "Acme Corp"
  slug          text, unique         -- "acmecorp" (login prefix, display)
  created_at    timestamptz

profiles                              -- one row per Supabase Auth user
  id            uuid, pk              -- = auth.users.id
  role          text                 -- 'pm' | 'client'
  client_id     uuid, fk -> clients   -- set only when role = 'client'
  full_name     text
  created_at    timestamptz

projects
  id            uuid, pk
  client_id     uuid, fk -> clients
  name          text                 -- "Cloud Security Engineering"
  phase         text                 -- "Engineering — Week 6 of 12"
  progress      int                  -- 0-100
  status        text                 -- "On track" / "At risk" / "Delayed" / "Complete"
  created_at    timestamptz
  updated_at    timestamptz

reports
  id            uuid, pk
  project_id    uuid, fk -> projects
  title         text
  report_type   text                 -- "Executive Summary" / "Technical Findings" / ...
  report_date   text                 -- "Week 6" (display label, matches current UI)
  status        text default 'Available'
  file_path     text                 -- Supabase Storage path
  uploaded_by   uuid, fk -> profiles
  created_at    timestamptz

deliverables
  id            uuid, pk
  project_id    uuid, fk -> projects
  item          text                 -- "IAM Policy Framework"
  status        text                 -- 'pending' | 'in-progress' | 'complete'
  week_label    text                 -- "Week 7"
  file_path     text, nullable
  updated_by    uuid, fk -> profiles
  updated_at    timestamptz

meetings
  id            uuid, pk
  project_id    uuid, fk -> projects
  title         text
  meeting_type  text                 -- "Recurring" / "Workshop" / "Steering"
  scheduled_at  timestamptz
  status        text                 -- 'upcoming' | 'completed'
  mom_file_path text, nullable       -- minutes of meeting, added after completion
  created_at    timestamptz

recommendations
  id            uuid, pk
  project_id    uuid, fk -> projects
  finding       text
  priority      text                 -- 'High' | 'Medium' | 'Low'
  effort        text                 -- 'Low' | 'Medium' | 'High'
  created_at    timestamptz
```

## Row Level Security

- `profiles`: a user can read their own row. PM role can read all profiles
  (needed to show "updated by" in the admin tool).
- `clients`: PM role has full read/write. Client role can read only the one
  `clients` row matching their own `profiles.client_id`.
- `projects`: PM role has full read/write. Client role can read only rows
  where `client_id` matches their own `profiles.client_id`.
- `reports` / `deliverables` / `meetings` / `recommendations`: PM role has
  full read/write. Client role has read-only access, scoped by joining
  `project_id → projects.client_id` against their own `profiles.client_id`.
  Clients can never insert, update, or delete.

## File storage

One private Supabase Storage bucket (`workspace-files`), organized by path:
`{project_id}/{reports|deliverables|meetings}/{filename}`. Nothing is public.
Client downloads go through a short-lived signed URL generated server-side
after confirming the requester's `profiles.client_id` matches the project's
`client_id`.

## Out of scope for this phase

- Any login UI or auth flow (phase 2)
- Any PM admin screens (phase 3)
- Any client-facing screens (phase 4)
- Subdomain/DNS/deployment routing (phase 5)
- Calendar/Zoom integration for meetings (explicitly declined)
- Per-project PM assignment/restriction (explicitly declined — any PM can
  touch any project)
