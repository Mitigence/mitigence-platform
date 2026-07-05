import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SIGNED_URL_BATCH_SIZE = 50

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

export async function getSignedFileUrls(
  supabase: SupabaseClient<Database>,
  paths: string[]
): Promise<Record<string, string>> {
  if (paths.length === 0) return {}

  const urls: Record<string, string> = {}

  for (const batch of chunk(paths, SIGNED_URL_BATCH_SIZE)) {
    const { data, error } = await supabase.storage.from('workspace-files').createSignedUrls(batch, 3600)

    if (error) {
      console.error('getSignedFileUrls: createSignedUrls failed', error)
      continue
    }
    if (!data) continue

    for (const entry of data) {
      if (entry.error) {
        console.error('getSignedFileUrls: entry failed', entry.path, entry.error)
      } else if (entry.path && entry.signedUrl) {
        urls[entry.path] = entry.signedUrl
      }
    }
  }

  return urls
}
