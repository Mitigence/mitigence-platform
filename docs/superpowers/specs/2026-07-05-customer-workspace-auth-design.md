# Customer Workspace — Phase 2: Auth & Roles

## Context

Phase 1 (`2026-07-05-customer-workspace-data-model-design.md`) built the Supabase
schema, RLS, storage, and typed client helpers — but no login screen, no
session handling, and nothing preventing an unauthenticated visitor from
hitting a workspace URL directly (there's nothing there yet to hit, but the
guard needs to exist before phase 3/4 add real content behind it).

This phase adds:

1. A single login page
2. Session refresh + route protection (middleware)
3. Role-based redirect after login
4. Minimal placeholder landing pages proving the login → redirect →
   protected access → logout loop works end-to-end
5. Logout

Phases 3 (PM admin tool) and 4 (client workspace UI) replace the placeholder
pages built here with real content. Phase 5 (subdomain) is unrelated routing
config layered on top later.

## Decisions locked in during brainstorming

- One shared `/login` page for both PM and client accounts — the site checks
  the account's role after authenticating and redirects accordingly, rather
  than having two separate login URLs.
- The existing global site chrome (`Navigation`, `Footer`, `MatrixBackground`,
  `LeadCaptureBot` — all rendered in the root `layout.tsx`) is left in place
  around `/login`, `/workspace`, and `/admin` for this phase. Whether the real
  phase 3/4 pages strip that chrome for an "app" feel is a decision for those
  phases, not this one — no unrelated refactor here.
- No self-signup and no password-reset flow. Client accounts are created by a
  PM via the phase 3 admin tool (using the service-role client already built
  in phase 1) — account creation itself is out of scope for this phase.

## Routes

```
/login          — public. Email + password form.
/workspace       — protected, role = 'client' only.
/admin           — protected, role = 'pm' only.
```

## Session & middleware

`src/middleware.ts` runs on every request matching `/workspace/:path*` and
`/admin/:path*` (and `/login` itself, to bounce an already-logged-in user
away from the login form):

- Uses `@supabase/ssr`'s `createServerClient` inside the middleware (the
  standard Supabase/Next.js middleware pattern) to read and, if needed,
  refresh the session cookie via `supabase.auth.getUser()`.
- No session → redirect to `/login`.
- Session exists, role is `client`, path starts with `/admin` → redirect to
  `/workspace`.
- Session exists, role is `pm`, path starts with `/workspace` → redirect to
  `/admin`.
- Session exists and path is `/login` → redirect to the role's own area
  (`/workspace` or `/admin`).
- Role is read from the `profiles` table (already covered by the "read own
  profile" RLS policy from phase 1 — a user can always read their own row).

## Login page (`/login`)

Server Component page rendering a form that posts to a Server Action
(`signInAction`) in the same file:

1. Calls `supabase.auth.signInWithPassword({ email, password })` using the
   server Supabase client (`createServerSupabaseClient` from phase 1).
2. On failure, returns an error string rendered above the form ("Invalid
   email or password.") — no distinction between "wrong password" and
   "account doesn't exist," to avoid leaking which accounts exist.
3. On success, queries `profiles` for the signed-in user's `role`, then
   `redirect()`s to `/workspace` (role = `client`) or `/admin` (role = `pm`).

## Placeholder landing pages

Both `/workspace/page.tsx` and `/admin/page.tsx` are Server Components that:

- Read the current user via the server Supabase client.
- Display "Signed in as `{email}`" and the role.
- Render a "Sign out" button that posts to a shared `signOutAction` Server
  Action (`src/app/(auth)/actions.ts` or similar) which calls
  `supabase.auth.signOut()` and redirects to `/login`.

These are explicitly throwaway — phase 3 replaces `/admin`'s body with the
real PM admin tool, phase 4 replaces `/workspace`'s body with the real client
workspace UI. The route, the auth guard, and the sign-out action they rely on
do not change when that happens.

## Out of scope for this phase

- Any real PM admin tool content (phase 3)
- Any real client workspace content (phase 4)
- Subdomain/DNS/deployment routing (phase 5)
- Self-signup, password reset, "forgot password," email verification
- Creating client or PM accounts (phase 3's admin tool handles this, using
  the service-role client)
- Stripping the marketing site chrome from these routes
