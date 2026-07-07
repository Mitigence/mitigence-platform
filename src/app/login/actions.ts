'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUserRole } from '@/lib/supabase/profile'

export interface LoginState {
  error?: string
}

// 5 attempts / 60s per IP -- tighter than Supabase's own 360/hour default,
// specifically to slow down credential-stuffing/brute-force against this form.
const ipMap = new Map<string, { n: number; reset: number }>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  // prune expired entries so the map cannot grow unbounded
  if (ipMap.size > 5000) {
    for (const [k, v] of ipMap) if (now > v.reset) ipMap.delete(k)
  }
  const e = ipMap.get(ip)
  if (!e || now > e.reset) { ipMap.set(ip, { n: 1, reset: now + 60_000 }); return false }
  if (e.n >= 5) return true
  e.n++
  return false
}

export async function signInAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const requestHeaders = await headers()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (rateLimited(ip)) {
    return { error: 'Too many sign-in attempts. Please wait a minute and try again.' }
  }

  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  const role = await getCurrentUserRole(supabase)
  redirect(role === 'pm' ? '/admin' : '/workspace')
}
