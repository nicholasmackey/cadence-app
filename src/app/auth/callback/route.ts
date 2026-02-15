import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/db.types'

function toSafeNextPath(next: string | null) {
  if (!next) return '/app'
  if (!next.startsWith('/')) return '/app'
  if (next.startsWith('//')) return '/app'
  return next
}

function toSentenceCaseError(message: string) {
  if (!message) return 'Unable to complete sign in.'
  const normalized = message.replace(/\+/g, ' ').trim()
  const capped = normalized.charAt(0).toUpperCase() + normalized.slice(1)
  return capped.endsWith('.') ? capped : `${capped}.`
}

function loginRedirect(requestUrl: URL, message: string) {
  const url = new URL('/login', requestUrl.origin)
  url.searchParams.set('error', message)
  const response = NextResponse.redirect(url)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const safeNext = toSafeNextPath(requestUrl.searchParams.get('next'))
  const callbackError = requestUrl.searchParams.get('error')
  const callbackDescription = requestUrl.searchParams.get('error_description')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (callbackError) {
    return loginRedirect(
      requestUrl,
      toSentenceCaseError(callbackDescription ?? 'Sign-in link is invalid or has expired')
    )
  }

  if (!code) {
    return loginRedirect(requestUrl, 'Sign-in link is invalid or has expired.')
  }

  if (!supabaseUrl || !supabaseKey) {
    return loginRedirect(requestUrl, 'Auth configuration is missing.')
  }

  const response = NextResponse.redirect(new URL(safeNext, requestUrl.origin))
  response.headers.set('Cache-Control', 'no-store')
  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return loginRedirect(requestUrl, toSentenceCaseError(error.message))
  }

  return response
}
