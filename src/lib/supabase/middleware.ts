import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'
import { getCurrentUserRole } from './profile'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user ? await getCurrentUserRole(supabase) : null

  const pathname = request.nextUrl.pathname
  const isWorkspacePath = pathname.startsWith('/workspace')
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPath = pathname === '/login'

  if (!user && (isWorkspacePath || isAdminPath)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPath) {
    return NextResponse.redirect(new URL(role === 'pm' ? '/admin' : '/workspace', request.url))
  }

  if (user && role === 'client' && isAdminPath) {
    return NextResponse.redirect(new URL('/workspace', request.url))
  }

  if (user && role === 'pm' && isWorkspacePath) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}
