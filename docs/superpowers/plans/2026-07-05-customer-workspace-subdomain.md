# Customer Workspace Phase 5: Subdomain — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `workspace.mitigence.com` a working entry point to the already-built customer workspace, with its root path showing the login page directly.

**Architecture:** One Next.js app already serves `/login`, `/workspace`, `/admin` regardless of hostname. Adding a second hostname to the same Vercel deployment plus one host-aware rewrite in `src/proxy.ts` is the entire change — no new routes, no duplicated pages, no schema changes.

**Tech Stack:** GoDaddy DNS (existing registrar for mitigence.com), Vercel domain configuration (existing project), Next.js 16 `proxy.ts` (`NextResponse.rewrite`).

## Global Constraints

- `workspace.mitigence.com/` rewrites to `/login` (URL bar keeps showing the subdomain — a rewrite, not a redirect). (From phase 5 spec.)
- `mitigence.com` is completely unaffected by this change. (From phase 5 spec.)
- No new accounts are created — DNS uses mitigence.com's existing GoDaddy registration, Vercel uses the existing `mitigence-platform` project. (From phase 5 spec, and the standing "mitigence@gmail.com only, no other emails for hosting" rule from earlier in this engagement — satisfied automatically here since nothing new is being created.)
- Marketing pages remaining reachable via the subdomain hostname is accepted, not a bug to fix in this phase. (From phase 5 spec.)

---

### Task 1: DNS and Vercel domain configuration

**Files:** none (GoDaddy DNS + Vercel dashboard only)

**Interfaces:**
- Consumes: nothing from this codebase.
- Produces: `workspace.mitigence.com` resolving to the Vercel deployment — Task 2's code change has no effect until this DNS/domain wiring exists, and this task's DNS change has no visible effect until Task 2's rewrite exists. Verify both together in Task 3.

- [ ] **Step 1: Add the CNAME record in GoDaddy**

In GoDaddy's DNS management for `mitigence.com`, add a new record:
- Type: `CNAME`
- Name: `workspace`
- Value: `cname.vercel-dns.com`
- TTL: default (1 hour is fine)

- [ ] **Step 2: Add the domain in Vercel**

In the Vercel dashboard, open the `mitigence-platform` project → Settings → Domains → Add `workspace.mitigence.com`. Assign it to the `main`/Production deployment (the same one `mitigence.com` itself deploys from).

- [ ] **Step 3: Wait for DNS propagation and SSL issuance**

Vercel's domain settings page shows a "Valid Configuration" (or equivalent) status once the CNAME resolves and its automatic SSL certificate is issued. This can take a few minutes up to a few hours; don't proceed to Task 3's verification until this shows valid.

- [ ] **Step 4: No commit needed**

This task is DNS/Vercel dashboard configuration only — no repo file changes. Mark this task done in your own tracking.

---

### Task 2: Host-aware rewrite in the proxy

**Files:**
- Modify: `E:\mit\WEBAPP\src\proxy.ts`

**Interfaces:**
- Consumes: `updateSession` from `src/lib/supabase/middleware.ts` (phase 2) — unchanged, still runs after the new host check.
- Produces: nothing later tasks import — this is the only code change in this plan.

- [ ] **Step 1: Add the subdomain-root rewrite**

Replace `E:\mit\WEBAPP\src\proxy.ts` entirely with:

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const WORKSPACE_SUBDOMAIN = 'workspace.mitigence.com'

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  if (host === WORKSPACE_SUBDOMAIN && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }

  return updateSession(request)
}

export const config = {
  matcher: ['/', '/workspace/:path*', '/admin/:path*', '/login'],
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Verify the main domain's homepage still renders locally**

```bash
cd "E:/mit/WEBAPP" && npm run build && npm run start
```

Using the browser preview tool, open `http://localhost:3000/`. Expected: the marketing homepage renders normally (the `host` header locally is `localhost:3000`, not `workspace.mitigence.com`, so the rewrite branch never triggers — this proves the change is a no-op for every hostname except the subdomain).

- [ ] **Step 4: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/proxy.ts && git commit -m "$(cat <<'EOF'
feat: rewrite workspace.mitigence.com root to the login page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Verify the live subdomain end-to-end

**Files:** none (deployed site only)

**Interfaces:**
- Consumes: Task 1's DNS/domain setup, Task 2's rewrite, once Vercel has deployed the pushed commit.
- Produces: confidence the subdomain works exactly as designed. No code artifact.

- [ ] **Step 1: Push and wait for the Vercel deployment**

```bash
cd "E:/mit/WEBAPP" && git push
```

Wait for Vercel to finish deploying the new commit to Production (check the Vercel dashboard's Deployments tab for a "Ready" status).

- [ ] **Step 2: Verify the subdomain root shows the login page with the subdomain URL preserved**

Visit `https://workspace.mitigence.com/` in the browser.

Expected: the login page renders, and the address bar still reads `workspace.mitigence.com` (not `workspace.mitigence.com/login`) — confirming a rewrite happened, not a redirect.

- [ ] **Step 3: Verify login still works on the subdomain**

Sign in as an existing PM or client user (reuse a real one, or create/delete a throwaway the same way prior phases did) at `https://workspace.mitigence.com/`.

Expected: redirected to `/admin` (PM) or `/workspace` (client) exactly as it does on the main domain, now under the `workspace.mitigence.com` host.

- [ ] **Step 4: Verify the main domain is unaffected**

Visit `https://mitigence.com/`. Expected: the marketing homepage, unchanged. Visit `https://mitigence.com/login`. Expected: still works exactly as before.

- [ ] **Step 5: No commit needed**

This task only exercises the live deployed site — there is no file to commit. Mark this task done in your own tracking.
