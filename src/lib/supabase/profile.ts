import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, ProfileRole } from './types'

export async function getCurrentUserRole(
  supabase: SupabaseClient<Database>
): Promise<ProfileRole | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: ProfileRole }>()

  return data?.role ?? null
}
