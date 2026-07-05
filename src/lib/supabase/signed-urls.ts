import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function getSignedFileUrls(
  supabase: SupabaseClient<Database>,
  paths: string[]
): Promise<Record<string, string>> {
  if (paths.length === 0) return {}

  const { data, error } = await supabase.storage.from('workspace-files').createSignedUrls(paths, 3600)

  if (error || !data) return {}

  const urls: Record<string, string> = {}
  for (const entry of data) {
    if (entry.path && entry.signedUrl && !entry.error) {
      urls[entry.path] = entry.signedUrl
    }
  }
  return urls
}
