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
