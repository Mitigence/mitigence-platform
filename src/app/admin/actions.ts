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

  // Phase 1's RLS only grants PMs SELECT on profiles (no INSERT policy —
  // profile creation is intentionally a privileged, admin-only operation),
  // so this insert must go through the service-role client, not the PM's
  // own session.
  const { error: profileError } = await admin.from('profiles').insert({
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
