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
  const dueDate = String(formData.get('dueDate') ?? '').trim()

  if (!item) {
    return { error: 'Item is required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('deliverables').insert({
    project_id: projectId,
    item,
    week_label: weekLabel,
    due_date: dueDate || null,
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
  const explanation = String(formData.get('explanation') ?? '').trim()
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

  const update: {
    status: DeliverableStatus
    updated_by: string | null
    delay_explanation: string | null
    file_path?: string
  } = {
    status,
    updated_by: user?.id ?? null,
    delay_explanation: explanation || null,
  }
  if (filePath) update.file_path = filePath

  const { error } = await supabase.from('deliverables').update(update).eq('id', deliverableId)

  if (error) {
    return { error: `Could not update deliverable: ${error.message}` }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return {}
}
