# Customer Workspace Phase 2: Auth & Roles — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single login page, session-refreshing middleware that guards `/workspace` (client role) and `/admin` (pm role), role-based post-login redirect, and throwaway placeholder pages that prove the whole login → redirect → protected access → logout loop works, on top of the Supabase schema/RLS/client helpers built in phase 1.

**Architecture:** Standard Supabase + Next.js App Router auth pattern — `@supabase/ssr` in `src/middleware.ts` refreshes the session and reads the caller's role from `public.profiles` (readable via the phase 1 "read own profile" RLS policy) to decide redirects. The login form is a Client Component using React's `useActionState` against a Server Action that calls `signInWithPassword`. Placeholder `/workspace` and `/admin` pages exist only to prove the guard works — phases 3 and 4 replace their bodies with real content without touching the guard itself.

**Tech Stack:** `@supabase/ssr`, `@supabase/supabase-js`, Next.js 16 Server Actions, React 19 `useActionState`. Reuses `src/lib/supabase/server.ts` and `src/lib/supabase/types.ts` from phase 1 — no new dependencies.

## Global Constraints

- No self-signup, no password-reset/"forgot password" flow, no email verification screen. (From phase 2 spec.)
- Client accounts are never created by this phase — that's phase 3's admin tool using the service-role client. (From phase 2 spec.)
- The existing global site chrome (`Navigation`, `Footer`, `MatrixBackground`, `LeadCaptureBot` in `src/app/layout.tsx`) stays in place around these new routes — do not strip it or add a competing root layout in this phase. (From phase 2 spec.)
- Repo has no test framework. Verification is `npm run build` (TypeScript correctness) plus manual browser verification via the preview tool, using real Supabase Auth test users created and deleted the same way as phase 1's Task 7. (Established in phase 1 plan, still true.)
- Never commit real secrets. Test user passwords used for manual verification are throwaway and deleted at the end of this plan.

---

### Task 1: Shared role-lookup helper

**Files:**
- Create: `E:\mit\WEBAPP\src\lib\supabase\profile.ts`

**Interfaces:**
- Consumes: `Database`, `ProfileRole` types from `src/lib/supabase/types.ts` (phase 1).
- Produces: `getCurrentUserRole(supabase: SupabaseClient<Database>): Promise<ProfileRole | null>` — used by Task 2 (middleware), Task 3 (login action), and implicitly safe to reuse in phases 3/4.

- [ ] **Step 1: Write the helper**

Write `E:\mit\WEBAPP\src\lib\supabase\profile.ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, ProfileRole } from './types'

export async function getCurrentUserRole(
  supabase: SupabaseClient<Database>
): Promise<ProfileRole | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role ?? null
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, no TypeScript errors referencing `profile.ts`.

- [ ] **Step 3: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/lib/supabase/profile.ts && git commit -m "$(cat <<'EOF'
feat: shared role-lookup helper for auth guard and login redirect

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Session-refreshing, role-guarding middleware

**Files:**
- Create: `E:\mit\WEBAPP\src\lib\supabase\middleware.ts`
- Create: `E:\mit\WEBAPP\src\middleware.ts`

**Interfaces:**
- Consumes: `getCurrentUserRole` from Task 1; `Database` type from phase 1.
- Produces: every request to `/login`, `/workspace/:path*`, `/admin/:path*` is guarded — later tasks (3, 4) can assume unauthenticated/wrong-role visitors never reach their page bodies.

- [ ] **Step 1: Write the middleware Supabase client + guard logic**

Write `E:\mit\WEBAPP\src\lib\supabase\middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'
import { getCurrentUserRole } from './profile'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user ? await getCurrentUserRole(supabase) : null

  const pathname = request.nextUrl.pathname
  const isWorkspacePath = pathname.startsWith('/workspace')
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPath = pathname === '/login'

  if (!user && (isWorkspacePath || isAdminPath)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPath) {
    return NextResponse.redirect(new URL(role === 'pm' ? '/admin' : '/workspace', request.url))
  }

  if (user && role === 'client' && isAdminPath) {
    return NextResponse.redirect(new URL('/workspace', request.url))
  }

  if (user && role === 'pm' && isWorkspacePath) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}
```

- [ ] **Step 2: Write the root middleware entry point**

Write `E:\mit\WEBAPP\src\middleware.ts`:

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/workspace/:path*', '/admin/:path*', '/login'],
}
```

- [ ] **Step 3: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. It's fine (expected) that `/login`, `/workspace`, `/admin` don't exist as routes yet — Tasks 3/4 add them. The middleware file itself must type-check with no errors.

- [ ] **Step 4: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/middleware.ts src/lib/supabase/middleware.ts && git commit -m "$(cat <<'EOF'
feat: session-refreshing middleware with role-based route guard

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Login page

**Files:**
- Create: `E:\mit\WEBAPP\src\app\login\actions.ts`
- Create: `E:\mit\WEBAPP\src\app\login\login-form.tsx`
- Create: `E:\mit\WEBAPP\src\app\login\page.tsx`

**Interfaces:**
- Consumes: `createServerSupabaseClient` from `src/lib/supabase/server.ts` (phase 1); `getCurrentUserRole` from Task 1.
- Produces: `signInAction(prevState: LoginState, formData: FormData): Promise<LoginState>` and `LoginState` type — self-contained to this page, nothing later depends on them directly (Task 5 exercises this page through the browser, not by importing it).

- [ ] **Step 1: Write the Server Action**

Write `E:\mit\WEBAPP\src\app\login\actions.ts`:

```typescript
'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUserRole } from '@/lib/supabase/profile'

export interface LoginState {
  error?: string
}

export async function signInAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  const role = await getCurrentUserRole(supabase)
  redirect(role === 'pm' ? '/admin' : '/workspace')
}
```

- [ ] **Step 2: Write the login form (Client Component)**

Write `E:\mit\WEBAPP\src\app\login\login-form.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import { signInAction, type LoginState } from './actions'

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-zinc-400 text-xs mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-zinc-400 text-xs mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Write the page**

Write `E:\mit\WEBAPP\src\app\login\page.tsx`:

```typescript
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, and the route list in the build output includes `/login`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/login && git commit -m "$(cat <<'EOF'
feat: login page with role-based redirect

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Placeholder workspace/admin pages and sign-out

**Files:**
- Create: `E:\mit\WEBAPP\src\app\actions\auth.ts`
- Create: `E:\mit\WEBAPP\src\app\workspace\page.tsx`
- Create: `E:\mit\WEBAPP\src\app\admin\page.tsx`

**Interfaces:**
- Consumes: `createServerSupabaseClient` from phase 1.
- Produces: `signOutAction(): Promise<never>` (always redirects) — phases 3/4 reuse this exact action when they replace these page bodies.

- [ ] **Step 1: Write the shared sign-out action**

Write `E:\mit\WEBAPP\src\app\actions\auth.ts`:

```typescript
'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function signOutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

- [ ] **Step 2: Write the client placeholder page**

Write `E:\mit\WEBAPP\src\app\workspace\page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/actions/auth'

export default async function WorkspacePage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-1">Signed in as</p>
        <p className="text-white text-lg font-medium mb-6">{user.email}</p>
        <p className="text-zinc-500 text-xs mb-8">Role: client</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Write the PM placeholder page**

Write `E:\mit\WEBAPP\src\app\admin\page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/actions/auth'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-1">Signed in as</p>
        <p className="text-white text-lg font-medium mb-6">{user.email}</p>
        <p className="text-zinc-500 text-xs mb-8">Role: pm</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully`, and the route list includes `/workspace` and `/admin`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/actions src/app/workspace src/app/admin && git commit -m "$(cat <<'EOF'
feat: placeholder workspace/admin pages and sign-out action

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: End-to-end manual verification with real test users

**Files:** none (Supabase dashboard + browser preview only — this proves Tasks 1-4 work together before phases 3/4 build on top)

**Interfaces:**
- Consumes: everything from Tasks 1-4.
- Produces: confidence the login → redirect → guard → logout loop works for both roles. No code artifact.

- [ ] **Step 1: Create two test auth users**

Same process as phase 1's Task 7. In the Supabase dashboard (project `kjcvlqrsnudyearzuuan`) → Authentication → Users → Add user → Create new user, twice, both with **Auto Confirm User: ON**:
- `verify-pm@mitigence.com` / a throwaway password
- `verify-client@mitigence.com` / a throwaway password

Copy both UUIDs.

- [ ] **Step 2: Give both test users a profile**

In the SQL Editor (replace `<PM_UUID>` and `<CLIENT_UUID>`):

```sql
insert into public.clients (name, slug) values ('Verify Test Co', 'verify-test');

insert into public.profiles (id, role, client_id)
values ('<PM_UUID>', 'pm', null);

insert into public.profiles (id, role, client_id)
select '<CLIENT_UUID>', 'client', id
from public.clients where slug = 'verify-test';
```

Expected: both inserts succeed with no errors.

- [ ] **Step 3: Start the app and verify the PM login**

```bash
cd "E:/mit/WEBAPP" && npm run build && npm run start
```

Using the browser preview tool: go to `/login`, sign in as `verify-pm@mitigence.com`. Expected: redirected to `/admin`, page shows "Signed in as verify-pm@mitigence.com" and "Role: pm".

- [ ] **Step 4: Verify the PM cannot reach `/workspace`**

While still signed in as the PM test user, navigate directly to `/workspace`.

Expected: immediately redirected to `/admin` (middleware guard, not the client placeholder).

- [ ] **Step 5: Sign out and verify the guard blocks anonymous access**

Click "Sign out" on `/admin`. Expected: redirected to `/login`. Then navigate directly to `/admin`.

Expected: redirected to `/login` (not the admin page — proves the guard works for logged-out visitors too).

- [ ] **Step 6: Verify the client login and reverse guard**

Sign in as `verify-client@mitigence.com`. Expected: redirected to `/workspace`, showing "Role: client".

Navigate directly to `/admin`. Expected: redirected to `/workspace`.

Click "Sign out". Expected: redirected to `/login`.

- [ ] **Step 7: Clean up test data**

In the SQL Editor:

```sql
delete from public.clients where slug = 'verify-test';
```

Expected: cascades away the client-role profile row. Then delete both test auth users (`verify-pm@mitigence.com`, `verify-client@mitigence.com`) via the dashboard, same as phase 1's Task 7.

- [ ] **Step 8: No commit needed**

This task only exercised the running app and the live database — there is no file to commit. Mark this task done in your own tracking.
