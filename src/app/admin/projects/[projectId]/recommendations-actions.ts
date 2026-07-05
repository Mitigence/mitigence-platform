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
