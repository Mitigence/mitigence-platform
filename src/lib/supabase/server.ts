import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// @supabase/ssr's createServerClient return type doesn't line up with the
// installed @supabase/supabase-js's SupabaseClient generic signature, which
// makes .from(...).insert()/.update() resolve to `never`. Asserting the
// well-formed single-generic SupabaseClient<Database> type here (which
// resolves correctly) fixes every table write everywhere this is used.
export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component with no request context —
            // safe to ignore when middleware handles session refresh.
          }
        },
      },
    }
  )

  return client as unknown as SupabaseClient<Database>
}
