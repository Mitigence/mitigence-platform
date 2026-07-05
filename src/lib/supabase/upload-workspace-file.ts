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
