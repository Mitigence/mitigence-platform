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
