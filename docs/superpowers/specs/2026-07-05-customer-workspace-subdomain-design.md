# Customer Workspace — Phase 5: Subdomain

## Context

Phases 1-4 built the full customer workspace (schema, auth, PM admin tool,
client-facing UI) reachable at `mitigence.com/login`, `/workspace`, and
`/admin`. This phase adds `workspace.mitigence.com` as a dedicated entry
point for the workspace, without duplicating or restructuring anything
already built.

This is one Next.js app on Vercel, not separate apps — a subdomain here is
just an additional hostname pointed at the same deployment. Since `/login`,
`/workspace/*`, and `/admin/*` already work at those exact paths regardless
of which hostname served the request (Next.js routing doesn't inspect the
`Host` header by default), almost nothing needs to change.

## Decisions locked in during brainstorming

- Subdomain: `workspace.mitigence.com`.
- Visiting the subdomain's root (`workspace.mitigence.com/`) rewrites to
  `/login` — the client/PM sees the login page directly, with the clean
  subdomain URL staying in the address bar (no visible redirect to
  `.../login`).
- `mitigence.com` itself is completely unaffected — its homepage,
  `/login`, `/workspace`, `/admin` keep working exactly as they do today.
- Marketing pages (e.g. `/pricing`) remain technically reachable via the
  subdomain hostname too — not worth blocking for this phase.

## DNS and Vercel configuration

1. In GoDaddy (mitigence.com's existing registrar — no new account),
   add a CNAME record: `workspace` → `cname.vercel-dns.com`.
2. In the Vercel dashboard, add `workspace.mitigence.com` as a Domain on
   the existing `mitigence-platform` project, assigned to the `main`/
   Production deployment (the same project `/login`, `/workspace`,
   `/admin` already deploy from).
3. Wait for DNS propagation and Vercel's automatic SSL certificate
   issuance for the new domain before considering this phase done.

## Code change

`src/proxy.ts` gains one condition: when the incoming request's `Host`
header is `workspace.mitigence.com` and the pathname is exactly `/`,
rewrite the request to `/login` before the existing session/role logic
runs. The `config.matcher` gains `/` so the proxy actually runs on that
path (currently it only matches `/workspace/:path*`, `/admin/:path*`, and
`/login`).

No other file changes. `updateSession` (the existing session-refresh and
role-redirect logic) is unaffected and keeps running exactly as it does
today for every matched path, on every hostname.

## Testing

Since this touches real production DNS and a live Vercel deployment, this
phase is verified against the deployed site, not the local dev/preview
server:

- `https://workspace.mitigence.com/` shows the login page, with the URL
  bar still reading `workspace.mitigence.com` (confirms rewrite, not
  redirect).
- `https://workspace.mitigence.com/login`, logging in as a PM and as a
  client, both land on `/admin` and `/workspace` respectively, same as
  they do on the main domain today.
- `https://mitigence.com/` still shows the marketing homepage, and
  `https://mitigence.com/login` still works — confirming the main domain
  is untouched by this change.

## Out of scope

- Blocking or redirecting marketing-only pages away from the subdomain.
- Any change to `/login`, `/workspace`, `/admin`, or any Supabase/RLS
  logic — this phase is routing configuration only.
