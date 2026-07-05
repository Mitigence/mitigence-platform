# Customer Workspace Phase 3: PM Admin Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the phase 2 `/admin` placeholder with a real tool where a PM onboards new clients (with their login), manages each client's projects, and edits reports/deliverables/meetings/recommendations for a project — the write side that phase 4's client-facing workspace will read.

**Architecture:** Server Components fetch data using the PM's own logged-in Supabase session (already granted full RLS access to every table from phase 1); Client Components hold forms wired to Server Actions via React 19's `useActionState`. The one exception is creating a brand-new client's login, which requires the phase 1 service-role client (`src/lib/supabase/admin.ts`) since only an admin client can create another user's `auth.users` row.

**Tech Stack:** Next.js 16 Server Actions, React 19 `useActionState`, `@supabase/ssr` server client, `@supabase/supabase-js` admin client, Supabase Storage. Reuses `src/lib/supabase/{server,admin,types}.ts` from phase 1 — no new dependencies.

## Global Constraints

- Repo has no test framework. Verification is `npm run build` (TypeScript correctness) plus manual browser verification via the preview tool, using real Supabase Auth test data created and deleted the same way as phases 1/2. (Established in phase 1/2 plans, still true.)
- The admin UI is a plain, separate layout (lists + forms) — not a reuse of the client-facing tabbed preview component. (From phase 3 spec.)
- Reports and Recommendations are add + view only in this phase, no edit/delete. Deliverables and Meetings additionally support a status/completion update. (From phase 3 spec.)
- File uploads go through the PM's own session directly to the `workspace-files` bucket at `{project_id}/{reports|deliverables|meetings}/{filename}` — no admin client needed for uploads. (From phase 3 spec.)
- Creating a client also creates its login (`<slug>@mitigence.com`, random password), shown once on a result screen — no automated email send. (From phase 3 spec.)
- Never commit real secrets. Test client/project data used for manual verification is throwaway and deleted at the end of this plan.

---

### Task 1: Shared utility helpers

**Files:**
- Create: `E:\mit\WEBAPP\src\lib\slugify.ts`
- Create: `E:\mit\WEBAPP\src\lib\generate-password.ts`
- Create: `E:\mit\WEBAPP\src\lib\supabase\upload-workspace-file.ts`

**Interfaces:**
- Consumes: `Database` type from `src/lib/supabase/types.ts` (phase 1).
- Produces: `slugify(name: string): string`, `generatePassword(length?: number): string`, `uploadWorkspaceFile(supabase, projectId, category, file): Promise<string>` — used by every later task in this plan.

- [ ] **Step 1: Write the slugify helper**

Write `E:\mit\WEBAPP\src\lib\slugify.ts`:

```typescript
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

- [ ] **Step 2: Write the password generator**

Write `E:\mit\WEBAPP\src\lib\generate-password.ts`:

```typescript
import { randomBytes } from 'crypto'

export function generatePassword(length = 20): string {
  return randomBytes(length * 2)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length)
}
```

- [ ] **Step 3: Write the shared file upload helper**

Write `E:\mit\WEBAPP\src\lib\supabase\upload-workspace-file.ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function uploadWorkspaceFile(
  supabase: SupabaseClient<Database>,
  projectId: string,
  category: 'reports' | 'deliverables' | 'meetings',
  file: File
): Promise<string> {
  const path = `${projectId}/${category}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('workspace-files').upload(path, file)

  if (error) {
    throw new Error(`File upload failed: ${error.message}`)
  }

  return path
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, no TypeScript errors referencing the three new files.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/lib/slugify.ts src/lib/generate-password.ts src/lib/supabase/upload-workspace-file.ts && git commit -m "$(cat <<'EOF'
feat: shared slugify, password, and workspace-file-upload helpers

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `/admin` client list and onboarding

**Files:**
- Modify: `E:\mit\WEBAPP\src\app\admin\page.tsx` (currently the phase 2 placeholder)
- Create: `E:\mit\WEBAPP\src\app\admin\actions.ts`
- Create: `E:\mit\WEBAPP\src\app\admin\new-client-form.tsx`

**Interfaces:**
- Consumes: `slugify`, `generatePassword` (Task 1); `createServerSupabaseClient` (phase 1); `createAdminSupabaseClient` (phase 1); `signOutAction` (phase 2).
- Produces: nothing later tasks import directly — this is a leaf route. Establishes the pattern (bound Server Action + `useActionState` form) every later section in this plan repeats.

- [ ] **Step 1: Write the onboarding Server Action**

Write `E:\mit\WEBAPP\src\app\admin\actions.ts`:

```typescript
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/slugify'
import { generatePassword } from '@/lib/generate-password'

export interface CreateClientState {
  error?: string
  success?: { email: string; password: string }
}

export async function createClientAction(
  _prevState: CreateClientState,
  formData: FormData
): Promise<CreateClientState> {
  const clientName = String(formData.get('clientName') ?? '').trim()
  const projectName = String(formData.get('projectName') ?? '').trim()

  if (!clientName || !projectName) {
    return { error: 'Client name and first project name are required.' }
  }

  const slug = slugify(clientName)
  if (!slug) {
    return { error: 'Client name must contain at least one letter or number.' }
  }

  const supabase = await createServerSupabaseClient()

  const { data: clientRow, error: clientError } = await supabase
    .from('clients')
    .insert({ name: clientName, slug })
    .select('id')
    .single<{ id: string }>()

  if (clientError || !clientRow) {
    return { error: `Could not create client: ${clientError?.message ?? 'slug may already be in use'}` }
  }

  const { error: projectError } = await supabase
    .from('projects')
    .insert({ client_id: clientRow.id, name: projectName })

  if (projectError) {
    await supabase.from('clients').delete().eq('id', clientRow.id)
    return { error: `Could not create project: ${projectError.message}` }
  }

  const email = `${slug}@mitigence.com`
  const password = generatePassword()
  const admin = createAdminSupabaseClient()

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (userError || !userData.user) {
    await supabase.from('clients').delete().eq('id', clientRow.id)
    return { error: `Could not create login: ${userError?.message ?? 'unknown error'}` }
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: userData.user.id,
    role: 'client',
    client_id: clientRow.id,
  })

  if (profileError) {
    await admin.auth.admin.deleteUser(userData.user.id)
    await supabase.from('clients').delete().eq('id', clientRow.id)
    return { error: `Could not create profile: ${profileError.message}` }
  }

  return { success: { email, password } }
}
```

- [ ] **Step 2: Write the new-client form**

Write `E:\mit\WEBAPP\src\app\admin\new-client-form.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import { createClientAction, type CreateClientState } from './actions'

const initialState: CreateClientState = {}

export function NewClientForm() {
  const [state, formAction, isPending] = useActionState(createClientAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-600/30 bg-green-600/5 p-4 mb-6">
        <p className="text-green-500 text-sm font-medium mb-2">Client created</p>
        <p className="text-zinc-300 text-sm">
          Email: <span className="font-mono">{state.success.email}</span>
        </p>
        <p className="text-zinc-300 text-sm">
          Password: <span className="font-mono">{state.success.password}</span>
        </p>
        <p className="text-zinc-500 text-xs mt-2">
          Hand these off to the client now — this password will not be shown again.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-6 space-y-3">
      <div>
        <label htmlFor="clientName" className="block text-zinc-400 text-xs mb-1.5">
          Client name
        </label>
        <input
          id="clientName"
          name="clientName"
          type="text"
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="projectName" className="block text-zinc-400 text-xs mb-1.5">
          First project name
        </label>
        <input
          id="projectName"
          name="projectName"
          type="text"
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {isPending ? 'Creating...' : 'Create client'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Replace the placeholder `/admin` page**

Write `E:\mit\WEBAPP\src\app\admin\page.tsx` (replacing its current contents entirely):

```typescript
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/actions/auth'
import { NewClientForm } from './new-client-form'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, slug')
    .order('name')

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <NewClientForm />

        <div className="space-y-2">
          {(clients ?? []).map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="block rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 p-4 transition-colors"
            >
              <p className="text-white text-sm font-medium">{client.name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{client.slug}@mitigence.com</p>
            </Link>
          ))}
          {(clients ?? []).length === 0 && (
            <p className="text-zinc-600 text-sm">No clients yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, `/admin` still listed as a dynamic route.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/page.tsx src/app/admin/actions.ts src/app/admin/new-client-form.tsx && git commit -m "$(cat <<'EOF'
feat: PM admin client list and onboarding flow

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Client detail page and new-project form

**Files:**
- Create: `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\page.tsx`
- Create: `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\actions.ts`
- Create: `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\new-project-form.tsx`

**Interfaces:**
- Consumes: `createServerSupabaseClient` (phase 1). Dynamic route params follow this repo's existing convention: `params: Promise<{ clientId: string }>`, read via `const { clientId } = await params` (see `src/app/success-stories/[slug]/page.tsx`).
- Produces: nothing later tasks import — leaf route. Establishes the `.bind(null, id)` pattern for passing a route param into a Server Action used with `useActionState`, reused by every section in Tasks 4-8.

- [ ] **Step 1: Write the create-project Server Action**

Write `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\actions.ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface CreateProjectState {
  error?: string
}

export async function createProjectAction(
  clientId: string,
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const name = String(formData.get('name') ?? '').trim()

  if (!name) {
    return { error: 'Project name is required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('projects').insert({ client_id: clientId, name })

  if (error) {
    return { error: `Could not create project: ${error.message}` }
  }

  revalidatePath(`/admin/clients/${clientId}`)
  return {}
}
```

- [ ] **Step 2: Write the new-project form**

Write `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\new-project-form.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import { createProjectAction, type CreateProjectState } from './actions'

const initialState: CreateProjectState = {}

export function NewProjectForm({ clientId }: { clientId: string }) {
  const boundAction = createProjectAction.bind(null, clientId)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-6 space-y-3">
      <div>
        <label htmlFor="name" className="block text-zinc-400 text-xs mb-1.5">
          New project name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {isPending ? 'Creating...' : 'Add project'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Write the client detail page**

Write `E:\mit\WEBAPP\src\app\admin\clients\[clientId]\page.tsx`:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NewProjectForm } from './new-project-form'

interface Props {
  params: Promise<{ clientId: string }>
}

export default async function ClientDetailPage({ params }: Props) {
  const { clientId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, slug')
    .eq('id', clientId)
    .single<{ id: string; name: string; slug: string }>()

  if (!client) notFound()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, phase, status')
    .eq('client_id', clientId)
    .order('created_at')

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
          &larr; All clients
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-1">{client.name}</h1>
        <p className="text-zinc-500 text-xs mb-8">{client.slug}@mitigence.com</p>

        <NewProjectForm clientId={client.id} />

        <div className="space-y-2">
          {(projects ?? []).map((project) => (
            <Link
              key={project.id}
              href={`/admin/projects/${project.id}`}
              className="block rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 p-4 transition-colors"
            >
              <p className="text-white text-sm font-medium">{project.name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                {project.phase || 'No phase set'} &middot; {project.status}
              </p>
            </Link>
          ))}
          {(projects ?? []).length === 0 && (
            <p className="text-zinc-600 text-sm">No projects yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, route list includes `/admin/clients/[clientId]`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/clients && git commit -m "$(cat <<'EOF'
feat: client detail page with project list and new-project form

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Project page skeleton and status editor

**Files:**
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx`
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-actions.ts`
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-status-form.tsx`

**Interfaces:**
- Consumes: `createServerSupabaseClient` (phase 1).
- Produces: `page.tsx`'s `Props` interface (`{ params: Promise<{ projectId: string }> }`) and its `project` fetch shape (`{ id, client_id, name, phase, progress, status }`) — Tasks 5-8 modify this same file to add sibling fetches and sections below `ProjectStatusForm`.

- [ ] **Step 1: Write the project-status Server Action**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-actions.ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface UpdateProjectState {
  error?: string
  success?: boolean
}

export async function updateProjectAction(
  projectId: string,
  _prevState: UpdateProjectState,
  formData: FormData
): Promise<UpdateProjectState> {
  const phase = String(formData.get('phase') ?? '').trim()
  const status = String(formData.get('status') ?? '').trim()
  const progressRaw = String(formData.get('progress') ?? '0')
  const progress = Math.min(100, Math.max(0, Number(progressRaw) || 0))

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('projects')
    .update({ phase, status, progress, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (error) {
    return { error: `Could not update project: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return { success: true }
}
```

- [ ] **Step 2: Write the project status form**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\project-status-form.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import { updateProjectAction, type UpdateProjectState } from './project-actions'

const initialState: UpdateProjectState = {}

interface Project {
  id: string
  name: string
  phase: string
  progress: number
  status: string
}

export function ProjectStatusForm({ project }: { project: Project }) {
  const boundAction = updateProjectAction.bind(null, project.id)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-8 space-y-3">
      <p className="text-white text-sm font-medium mb-1">Project status</p>
      <div>
        <label htmlFor="phase" className="block text-zinc-400 text-xs mb-1.5">
          Phase
        </label>
        <input
          id="phase"
          name="phase"
          type="text"
          defaultValue={project.phase}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="progress" className="block text-zinc-400 text-xs mb-1.5">
          Progress (%)
        </label>
        <input
          id="progress"
          name="progress"
          type="number"
          min={0}
          max={100}
          defaultValue={project.progress}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-zinc-400 text-xs mb-1.5">
          Status
        </label>
        <input
          id="status"
          name="status"
          type="text"
          defaultValue={project.status}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state.success && <p className="text-green-500 text-sm">Saved.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Write the project page**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx`:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProjectStatusForm } from './project-status-form'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_id, name, phase, progress, status')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
      status: string
    }>()

  if (!project) notFound()

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/clients/${project.client_id}`}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-8">{project.name}</h1>

        <ProjectStatusForm project={project} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, route list includes `/admin/projects/[projectId]`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects && git commit -m "$(cat <<'EOF'
feat: project page skeleton with status editor

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Reports section

**Files:**
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\reports-actions.ts`
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\reports-section.tsx`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` (add reports fetch + section)

**Interfaces:**
- Consumes: `uploadWorkspaceFile` (Task 1); `createServerSupabaseClient` (phase 1).
- Produces: nothing later tasks import — sibling section, same pattern reused by Tasks 6-8.

- [ ] **Step 1: Write the add-report Server Action**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\reports-actions.ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { uploadWorkspaceFile } from '@/lib/supabase/upload-workspace-file'

export interface AddReportState {
  error?: string
}

export async function addReportAction(
  projectId: string,
  _prevState: AddReportState,
  formData: FormData
): Promise<AddReportState> {
  const title = String(formData.get('title') ?? '').trim()
  const reportType = String(formData.get('reportType') ?? '').trim()
  const reportDate = String(formData.get('reportDate') ?? '').trim()
  const status = String(formData.get('status') ?? '').trim() || 'Available'
  const file = formData.get('file')

  if (!title) {
    return { error: 'Title is required.' }
  }

  const supabase = await createServerSupabaseClient()

  let filePath: string | null = null
  if (file instanceof File && file.size > 0) {
    try {
      filePath = await uploadWorkspaceFile(supabase, projectId, 'reports', file)
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'File upload failed.' }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('reports').insert({
    project_id: projectId,
    title,
    report_type: reportType,
    report_date: reportDate,
    status,
    file_path: filePath,
    uploaded_by: user?.id ?? null,
  })

  if (error) {
    return { error: `Could not add report: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}
```

- [ ] **Step 2: Write the reports section**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\reports-section.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import { addReportAction, type AddReportState } from './reports-actions'

const initialState: AddReportState = {}

interface Report {
  id: string
  title: string
  report_type: string
  report_date: string
  status: string
  file_path: string | null
}

export function ReportsSection({ projectId, reports }: { projectId: string; reports: Report[] }) {
  const boundAction = addReportAction.bind(null, projectId)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Reports</h2>

      <div className="space-y-2 mb-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <div>
              <p className="text-white text-sm">{r.title}</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                {r.report_type} &middot; {r.report_date} &middot; {r.status}
              </p>
            </div>
            {r.file_path && <span className="text-zinc-600 text-xs flex-shrink-0">File attached</span>}
          </div>
        ))}
        {reports.length === 0 && <p className="text-zinc-600 text-sm">No reports yet.</p>}
      </div>

      <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div>
          <label htmlFor="title" className="block text-zinc-400 text-xs mb-1.5">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reportType" className="block text-zinc-400 text-xs mb-1.5">
              Type
            </label>
            <input
              id="reportType"
              name="reportType"
              type="text"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="reportDate" className="block text-zinc-400 text-xs mb-1.5">
              Date label
            </label>
            <input
              id="reportDate"
              name="reportDate"
              type="text"
              placeholder="Week 6"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>
        <div>
          <label htmlFor="file" className="block text-zinc-400 text-xs mb-1.5">
            File (optional)
          </label>
          <input id="file" name="file" type="file" className="w-full text-zinc-300 text-sm" />
        </div>
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {isPending ? 'Adding...' : 'Add report'}
        </button>
      </form>
    </section>
  )
}
```

- [ ] **Step 3: Add the reports fetch and section to the project page**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` entirely with:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProjectStatusForm } from './project-status-form'
import { ReportsSection } from './reports-section'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_id, name, phase, progress, status')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
      status: string
    }>()

  if (!project) notFound()

  const { data: reports } = await supabase
    .from('reports')
    .select('id, title, report_type, report_date, status, file_path')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/clients/${project.client_id}`}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-8">{project.name}</h1>

        <ProjectStatusForm project={project} />
        <ReportsSection projectId={project.id} reports={reports ?? []} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects/\[projectId\]/reports-actions.ts src/app/admin/projects/\[projectId\]/reports-section.tsx src/app/admin/projects/\[projectId\]/page.tsx && git commit -m "$(cat <<'EOF'
feat: reports section with file upload

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Deliverables section

**Files:**
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-actions.ts`
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-section.tsx`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` (add deliverables fetch + section)

**Interfaces:**
- Consumes: `uploadWorkspaceFile` (Task 1); `DeliverableStatus` type from `src/lib/supabase/types.ts` (phase 1).
- Produces: nothing later tasks import.

- [ ] **Step 1: Write the deliverables Server Actions**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-actions.ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { uploadWorkspaceFile } from '@/lib/supabase/upload-workspace-file'
import type { DeliverableStatus } from '@/lib/supabase/types'

export interface AddDeliverableState {
  error?: string
}

export async function addDeliverableAction(
  projectId: string,
  _prevState: AddDeliverableState,
  formData: FormData
): Promise<AddDeliverableState> {
  const item = String(formData.get('item') ?? '').trim()
  const weekLabel = String(formData.get('weekLabel') ?? '').trim()

  if (!item) {
    return { error: 'Item is required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('deliverables').insert({
    project_id: projectId,
    item,
    week_label: weekLabel,
  })

  if (error) {
    return { error: `Could not add deliverable: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}

export interface UpdateDeliverableStatusState {
  error?: string
}

export async function updateDeliverableStatusAction(
  projectId: string,
  deliverableId: string,
  _prevState: UpdateDeliverableStatusState,
  formData: FormData
): Promise<UpdateDeliverableStatusState> {
  const status = String(formData.get('status') ?? '') as DeliverableStatus
  const file = formData.get('file')

  const supabase = await createServerSupabaseClient()

  let filePath: string | undefined
  if (file instanceof File && file.size > 0) {
    try {
      filePath = await uploadWorkspaceFile(supabase, projectId, 'deliverables', file)
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'File upload failed.' }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const update: { status: DeliverableStatus; updated_by: string | null; file_path?: string } = {
    status,
    updated_by: user?.id ?? null,
  }
  if (filePath) update.file_path = filePath

  const { error } = await supabase.from('deliverables').update(update).eq('id', deliverableId)

  if (error) {
    return { error: `Could not update deliverable: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}
```

- [ ] **Step 2: Write the deliverables section**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\deliverables-section.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import {
  addDeliverableAction,
  updateDeliverableStatusAction,
  type AddDeliverableState,
  type UpdateDeliverableStatusState,
} from './deliverables-actions'
import type { DeliverableStatus } from '@/lib/supabase/types'

const addInitialState: AddDeliverableState = {}
const updateInitialState: UpdateDeliverableStatusState = {}

interface Deliverable {
  id: string
  item: string
  status: DeliverableStatus
  week_label: string
  file_path: string | null
}

function DeliverableRow({ projectId, deliverable }: { projectId: string; deliverable: Deliverable }) {
  const boundAction = updateDeliverableStatusAction.bind(null, projectId, deliverable.id)
  const [state, formAction, isPending] = useActionState(boundAction, updateInitialState)

  return (
    <form
      action={formAction}
      className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
    >
      <div className="min-w-0">
        <p className="text-white text-sm truncate">{deliverable.item}</p>
        <p className="text-zinc-500 text-xs mt-0.5">
          {deliverable.week_label}
          {deliverable.file_path ? ' · File attached' : ''}
          {state.error ? ` · ${state.error}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input type="file" name="file" className="text-zinc-400 text-xs w-28" />
        <select
          name="status"
          defaultValue={deliverable.status}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          disabled={isPending}
          className="bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs px-2 py-1.5 outline-none focus:border-red-600"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>
    </form>
  )
}

export function DeliverablesSection({
  projectId,
  deliverables,
}: {
  projectId: string
  deliverables: Deliverable[]
}) {
  const boundAddAction = addDeliverableAction.bind(null, projectId)
  const [addState, addFormAction, isAdding] = useActionState(boundAddAction, addInitialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Deliverables</h2>

      <div className="space-y-2 mb-4">
        {deliverables.map((d) => (
          <DeliverableRow key={d.id} projectId={projectId} deliverable={d} />
        ))}
        {deliverables.length === 0 && <p className="text-zinc-600 text-sm">No deliverables yet.</p>}
      </div>

      <form action={addFormAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="item" className="block text-zinc-400 text-xs mb-1.5">
              Item
            </label>
            <input
              id="item"
              name="item"
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="weekLabel" className="block text-zinc-400 text-xs mb-1.5">
              Week label
            </label>
            <input
              id="weekLabel"
              name="weekLabel"
              type="text"
              placeholder="Week 7"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>
        {addState.error && <p className="text-red-500 text-sm">{addState.error}</p>}
        <button
          type="submit"
          disabled={isAdding}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {isAdding ? 'Adding...' : 'Add deliverable'}
        </button>
      </form>
    </section>
  )
}
```

- [ ] **Step 3: Add the deliverables fetch and section to the project page**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` entirely with:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProjectStatusForm } from './project-status-form'
import { ReportsSection } from './reports-section'
import { DeliverablesSection } from './deliverables-section'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_id, name, phase, progress, status')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
      status: string
    }>()

  if (!project) notFound()

  const [{ data: reports }, { data: deliverables }] = await Promise.all([
    supabase
      .from('reports')
      .select('id, title, report_type, report_date, status, file_path')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
    supabase
      .from('deliverables')
      .select('id, item, status, week_label, file_path')
      .eq('project_id', projectId)
      .order('updated_at'),
  ])

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/clients/${project.client_id}`}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-8">{project.name}</h1>

        <ProjectStatusForm project={project} />
        <ReportsSection projectId={project.id} reports={reports ?? []} />
        <DeliverablesSection projectId={project.id} deliverables={deliverables ?? []} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects/\[projectId\]/deliverables-actions.ts src/app/admin/projects/\[projectId\]/deliverables-section.tsx src/app/admin/projects/\[projectId\]/page.tsx && git commit -m "$(cat <<'EOF'
feat: deliverables section with status update and optional file

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Meetings section

**Files:**
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\meetings-actions.ts`
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\meetings-section.tsx`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` (add meetings fetch + section)

**Interfaces:**
- Consumes: `uploadWorkspaceFile` (Task 1); `MeetingStatus` type from `src/lib/supabase/types.ts` (phase 1).
- Produces: nothing later tasks import.

- [ ] **Step 1: Write the meetings Server Actions**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\meetings-actions.ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { uploadWorkspaceFile } from '@/lib/supabase/upload-workspace-file'

export interface AddMeetingState {
  error?: string
}

export async function addMeetingAction(
  projectId: string,
  _prevState: AddMeetingState,
  formData: FormData
): Promise<AddMeetingState> {
  const title = String(formData.get('title') ?? '').trim()
  const meetingType = String(formData.get('meetingType') ?? '').trim()
  const scheduledAt = String(formData.get('scheduledAt') ?? '').trim()

  if (!title || !scheduledAt) {
    return { error: 'Title and scheduled time are required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('meetings').insert({
    project_id: projectId,
    title,
    meeting_type: meetingType,
    scheduled_at: scheduledAt,
  })

  if (error) {
    return { error: `Could not add meeting: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}

export interface CompleteMeetingState {
  error?: string
}

export async function completeMeetingAction(
  projectId: string,
  meetingId: string,
  _prevState: CompleteMeetingState,
  formData: FormData
): Promise<CompleteMeetingState> {
  const file = formData.get('file')
  const supabase = await createServerSupabaseClient()

  let filePath: string | undefined
  if (file instanceof File && file.size > 0) {
    try {
      filePath = await uploadWorkspaceFile(supabase, projectId, 'meetings', file)
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'File upload failed.' }
    }
  }

  const update: { status: 'completed'; mom_file_path?: string } = { status: 'completed' }
  if (filePath) update.mom_file_path = filePath

  const { error } = await supabase.from('meetings').update(update).eq('id', meetingId)

  if (error) {
    return { error: `Could not update meeting: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}
```

- [ ] **Step 2: Write the meetings section**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\meetings-section.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import {
  addMeetingAction,
  completeMeetingAction,
  type AddMeetingState,
  type CompleteMeetingState,
} from './meetings-actions'
import type { MeetingStatus } from '@/lib/supabase/types'

const addInitialState: AddMeetingState = {}
const completeInitialState: CompleteMeetingState = {}

interface Meeting {
  id: string
  title: string
  meeting_type: string
  scheduled_at: string
  status: MeetingStatus
  mom_file_path: string | null
}

function MeetingRow({ projectId, meeting }: { projectId: string; meeting: Meeting }) {
  const boundAction = completeMeetingAction.bind(null, projectId, meeting.id)
  const [state, formAction, isPending] = useActionState(boundAction, completeInitialState)

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-white text-sm">{meeting.title}</p>
          <p className="text-zinc-500 text-xs mt-0.5">
            {meeting.meeting_type} &middot; {meeting.scheduled_at} &middot; {meeting.status}
            {meeting.mom_file_path ? ' · MoM attached' : ''}
          </p>
        </div>
      </div>
      {meeting.status === 'upcoming' && (
        <form action={formAction} className="flex items-center gap-2 mt-2">
          <input type="file" name="file" className="text-zinc-400 text-xs w-32" />
          <button
            type="submit"
            disabled={isPending}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {isPending ? 'Saving...' : 'Mark completed'}
          </button>
          {state.error && <span className="text-red-500 text-xs">{state.error}</span>}
        </form>
      )}
    </div>
  )
}

export function MeetingsSection({ projectId, meetings }: { projectId: string; meetings: Meeting[] }) {
  const boundAddAction = addMeetingAction.bind(null, projectId)
  const [addState, addFormAction, isAdding] = useActionState(boundAddAction, addInitialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Meetings</h2>

      <div className="space-y-2 mb-4">
        {meetings.map((m) => (
          <MeetingRow key={m.id} projectId={projectId} meeting={m} />
        ))}
        {meetings.length === 0 && <p className="text-zinc-600 text-sm">No meetings yet.</p>}
      </div>

      <form action={addFormAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div>
          <label htmlFor="title" className="block text-zinc-400 text-xs mb-1.5">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="meetingType" className="block text-zinc-400 text-xs mb-1.5">
              Type
            </label>
            <input
              id="meetingType"
              name="meetingType"
              type="text"
              placeholder="Workshop"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="scheduledAt" className="block text-zinc-400 text-xs mb-1.5">
              Scheduled
            </label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="text"
              placeholder="Thursday 10:00"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>
        {addState.error && <p className="text-red-500 text-sm">{addState.error}</p>}
        <button
          type="submit"
          disabled={isAdding}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {isAdding ? 'Adding...' : 'Add meeting'}
        </button>
      </form>
    </section>
  )
}
```

- [ ] **Step 3: Add the meetings fetch and section to the project page**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` entirely with:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProjectStatusForm } from './project-status-form'
import { ReportsSection } from './reports-section'
import { DeliverablesSection } from './deliverables-section'
import { MeetingsSection } from './meetings-section'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_id, name, phase, progress, status')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
      status: string
    }>()

  if (!project) notFound()

  const [{ data: reports }, { data: deliverables }, { data: meetings }] = await Promise.all([
    supabase
      .from('reports')
      .select('id, title, report_type, report_date, status, file_path')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
    supabase
      .from('deliverables')
      .select('id, item, status, week_label, file_path')
      .eq('project_id', projectId)
      .order('updated_at'),
    supabase
      .from('meetings')
      .select('id, title, meeting_type, scheduled_at, status, mom_file_path')
      .eq('project_id', projectId)
      .order('created_at'),
  ])

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/clients/${project.client_id}`}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-8">{project.name}</h1>

        <ProjectStatusForm project={project} />
        <ReportsSection projectId={project.id} reports={reports ?? []} />
        <DeliverablesSection projectId={project.id} deliverables={deliverables ?? []} />
        <MeetingsSection projectId={project.id} meetings={meetings ?? []} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects/\[projectId\]/meetings-actions.ts src/app/admin/projects/\[projectId\]/meetings-section.tsx src/app/admin/projects/\[projectId\]/page.tsx && git commit -m "$(cat <<'EOF'
feat: meetings section with mark-completed and optional MoM upload

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Recommendations section

**Files:**
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\recommendations-actions.ts`
- Create: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\recommendations-section.tsx`
- Modify: `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` (add recommendations fetch + section)

**Interfaces:**
- Consumes: `Priority`, `Effort` types from `src/lib/supabase/types.ts` (phase 1).
- Produces: nothing later tasks import — this is the final section, completing the project page.

- [ ] **Step 1: Write the add-recommendation Server Action**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\recommendations-actions.ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Priority, Effort } from '@/lib/supabase/types'

export interface AddRecommendationState {
  error?: string
}

export async function addRecommendationAction(
  projectId: string,
  _prevState: AddRecommendationState,
  formData: FormData
): Promise<AddRecommendationState> {
  const finding = String(formData.get('finding') ?? '').trim()
  const priority = String(formData.get('priority') ?? '') as Priority
  const effort = String(formData.get('effort') ?? '') as Effort

  if (!finding) {
    return { error: 'Finding is required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('recommendations').insert({
    project_id: projectId,
    finding,
    priority,
    effort,
  })

  if (error) {
    return { error: `Could not add recommendation: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}
```

- [ ] **Step 2: Write the recommendations section**

Write `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\recommendations-section.tsx`:

```typescript
'use client'

import { useActionState } from 'react'
import { addRecommendationAction, type AddRecommendationState } from './recommendations-actions'
import type { Priority, Effort } from '@/lib/supabase/types'

const initialState: AddRecommendationState = {}

interface Recommendation {
  id: string
  finding: string
  priority: Priority
  effort: Effort
}

export function RecommendationsSection({
  projectId,
  recommendations,
}: {
  projectId: string
  recommendations: Recommendation[]
}) {
  const boundAction = addRecommendationAction.bind(null, projectId)
  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  return (
    <section className="mb-8">
      <h2 className="text-white text-sm font-semibold mb-3">Recommendations</h2>

      <div className="space-y-2 mb-4">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-semibold rounded-full px-2.5 py-1 flex-shrink-0 bg-zinc-800 text-zinc-300">
                {r.priority}
              </span>
              <p className="text-zinc-300 text-sm truncate">{r.finding}</p>
            </div>
            <span className="text-zinc-500 text-xs flex-shrink-0">Effort: {r.effort}</span>
          </div>
        ))}
        {recommendations.length === 0 && <p className="text-zinc-600 text-sm">No recommendations yet.</p>}
      </div>

      <form action={formAction} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div>
          <label htmlFor="finding" className="block text-zinc-400 text-xs mb-1.5">
            Finding
          </label>
          <input
            id="finding"
            name="finding"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="priority" className="block text-zinc-400 text-xs mb-1.5">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue="Medium"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label htmlFor="effort" className="block text-zinc-400 text-xs mb-1.5">
              Effort
            </label>
            <select
              id="effort"
              name="effort"
              defaultValue="Medium"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {isPending ? 'Adding...' : 'Add recommendation'}
        </button>
      </form>
    </section>
  )
}
```

- [ ] **Step 3: Add the recommendations fetch and section to the project page**

Replace `E:\mit\WEBAPP\src\app\admin\projects\[projectId]\page.tsx` entirely with:

```typescript
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProjectStatusForm } from './project-status-form'
import { ReportsSection } from './reports-section'
import { DeliverablesSection } from './deliverables-section'
import { MeetingsSection } from './meetings-section'
import { RecommendationsSection } from './recommendations-section'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_id, name, phase, progress, status')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
      status: string
    }>()

  if (!project) notFound()

  const [{ data: reports }, { data: deliverables }, { data: meetings }, { data: recommendations }] =
    await Promise.all([
      supabase
        .from('reports')
        .select('id, title, report_type, report_date, status, file_path')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('deliverables')
        .select('id, item, status, week_label, file_path')
        .eq('project_id', projectId)
        .order('updated_at'),
      supabase
        .from('meetings')
        .select('id, title, meeting_type, scheduled_at, status, mom_file_path')
        .eq('project_id', projectId)
        .order('created_at'),
      supabase
        .from('recommendations')
        .select('id, finding, priority, effort')
        .eq('project_id', projectId)
        .order('created_at'),
    ])

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/clients/${project.client_id}`}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-8">{project.name}</h1>

        <ProjectStatusForm project={project} />
        <ReportsSection projectId={project.id} reports={reports ?? []} />
        <DeliverablesSection projectId={project.id} deliverables={deliverables ?? []} />
        <MeetingsSection projectId={project.id} meetings={meetings ?? []} />
        <RecommendationsSection projectId={project.id} recommendations={recommendations ?? []} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd "E:/mit/WEBAPP" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd "E:/mit/WEBAPP" && git add src/app/admin/projects/\[projectId\]/recommendations-actions.ts src/app/admin/projects/\[projectId\]/recommendations-section.tsx src/app/admin/projects/\[projectId\]/page.tsx && git commit -m "$(cat <<'EOF'
feat: recommendations section

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: End-to-end manual verification

**Files:** none (Supabase dashboard + browser preview only — proves Tasks 1-8 work together)

**Interfaces:**
- Consumes: everything from Tasks 1-8.
- Produces: confidence the full onboarding-to-management loop works. No code artifact.

- [ ] **Step 1: Create a temporary PM test user**

Same process as phase 2's Task 5. In the Supabase dashboard (project `kjcvlqrsnudyearzuuan`) → Authentication → Users → Add user → Create new user, with **Auto Confirm User: ON**:
- `verify-pm-phase3@mitigence.com` / a throwaway password

Copy the UUID, then in the SQL Editor:

```sql
insert into public.profiles (id, role, client_id)
select id, 'pm', null from auth.users where email = 'verify-pm-phase3@mitigence.com';
```

- [ ] **Step 2: Start the app and log in**

```bash
cd "E:/mit/WEBAPP" && npm run build && npm run start
```

Using the browser preview tool: go to `/login`, sign in as `verify-pm-phase3@mitigence.com`. Expected: redirected to `/admin`, showing "Clients" with an empty list and the "New client" form.

- [ ] **Step 3: Create a test client**

Fill in the "New client" form: client name `Verify Admin Co`, first project name `Verify Project`. Submit.

Expected: a success panel appears showing `verify-admin-co@mitigence.com` and a generated password. Scroll down — `Verify Admin Co` now appears in the client list.

- [ ] **Step 4: Verify the client and project drill-down**

Click into `Verify Admin Co`. Expected: `/admin/clients/[clientId]`, showing the client name, email, and `Verify Project` in the project list.

Click into `Verify Project`. Expected: `/admin/projects/[projectId]`, showing the project status form pre-filled with phase `''`, progress `0`, status `On track`, and empty Reports/Deliverables/Meetings/Recommendations sections.

- [ ] **Step 5: Verify the project status editor**

Change Phase to `Testing`, Progress to `50`, Status to `At risk`. Click Save.

Expected: "Saved." appears, and the three fields keep their new values after the page's next render.

- [ ] **Step 6: Verify Reports**

In the Reports "Add report" form, fill Title `Test Report`, Type `Executive Summary`, Date label `Week 1`, attach any small file. Submit.

Expected: the new report appears in the list above the form, showing "File attached".

- [ ] **Step 7: Verify Deliverables**

Add a deliverable: Item `Test Deliverable`, Week label `Week 1`. Submit. Expected: it appears with a "Pending" status select.

Change its status select to "Complete" and attach a file in the same row.

Expected: the row's status select immediately reflects "Complete" after the page refresh, and "File attached" appears in its subtext.

- [ ] **Step 8: Verify Meetings**

Add a meeting: Title `Test Meeting`, Type `Workshop`, Scheduled `Tomorrow 10:00`. Submit. Expected: it appears with a "Mark completed" button.

Click "Mark completed" (optionally attaching a file first).

Expected: the meeting's status changes to "completed" and the "Mark completed" button disappears (since the row only shows it while `status === 'upcoming'`).

- [ ] **Step 9: Verify Recommendations**

Add a recommendation: Finding `Test finding`, Priority `High`, Effort `Low`. Submit.

Expected: it appears in the list with a "High" badge and "Effort: Low".

- [ ] **Step 10: Clean up test data**

In the SQL Editor:

```sql
delete from public.clients where slug = 'verify-admin-co';
```

Expected: cascades away the project, reports, deliverables, meetings, recommendations, and the client-role profile row (all via `on delete cascade` foreign keys already in the phase 1 schema).

Then, in the Supabase dashboard: delete the `verify-pm-phase3@mitigence.com` and `verify-admin-co@mitigence.com` auth users (Authentication → Users → select both → Delete), and remove the test files from the `workspace-files` storage bucket (Storage → `workspace-files` → the folder named after the deleted project's id, if it's still listed) via the dashboard's Storage browser.

- [ ] **Step 11: No commit needed**

This task only exercised the running app and the live database — there is no file to commit. Mark this task done in your own tracking.
