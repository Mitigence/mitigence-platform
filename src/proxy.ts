import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const WORKSPACE_SUBDOMAIN = 'workspace.mitigence.com'

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  if (host === WORKSPACE_SUBDOMAIN && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }

  return updateSession(request)
}

export const config = {
  matcher: ['/', '/workspace/:path*', '/admin/:path*', '/login'],
}
