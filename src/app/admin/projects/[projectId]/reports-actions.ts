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
