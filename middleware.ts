import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/db.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function toSafeNextPath(pathname: string, search: string) {
  const candidate = `${pathname}${search}`
  if (!candidate.startsWith('/')) return '/app'
  if (candidate.startsWith('//')) return '/app'
  return candidate
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })

        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAppRoute = pathname.startsWith('/app')
  const isLoginRoute = pathname === '/login'

  if (isAppRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', toSafeNextPath(pathname, request.nextUrl.search))
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginRoute && user) {
    const appUrl = request.nextUrl.clone()
    appUrl.pathname = '/app'
    appUrl.search = ''
    return NextResponse.redirect(appUrl)
  }

  if (isLoginRoute) {
    response.headers.set('Cache-Control', 'no-store')
  }

  return response
}

export const config = {
  matcher: ['/app/:path*', '/login'],
}
