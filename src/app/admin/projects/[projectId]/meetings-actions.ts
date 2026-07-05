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
