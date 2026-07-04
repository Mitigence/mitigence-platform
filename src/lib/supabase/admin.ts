import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Service-role client — bypasses Row Level Security entirely.
// Server-only: never import this file from a Client Component.
export function createAdminSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
