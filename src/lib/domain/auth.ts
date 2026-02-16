export const LOGIN_PATH = '/login'
export const DEFAULT_POST_AUTH_PATH = '/log'
export const RECOVERY_POST_AUTH_PATH = '/account'

const PROTECTED_ROUTE_PREFIXES = ['/log', '/dashboard', '/account'] as const

type AuthErrorLike = {
  code?: string
  message?: string
  status?: number
}

export function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.includes('\\')) return false
  return true
}

export function toSafeInternalPath(
  path: string | null | undefined,
  fallback = DEFAULT_POST_AUTH_PATH,
): string {
  if (!path) return fallback
  return isSafeInternalPath(path) ? path : fallback
}

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function getPostAuthDestination(options: {
  next: string | null
  type: string | null
}): string {
  const safeNext = options.next && isSafeInternalPath(options.next) ? options.next : null

  if (safeNext) return safeNext
  if (options.type === 'recovery') return RECOVERY_POST_AUTH_PATH

  return DEFAULT_POST_AUTH_PATH
}

export function toPasswordSignInErrorMessage(error: AuthErrorLike | null | undefined): string {
  if (!error) return 'Unable to sign in right now. Please try again.'

  if (error.code === 'invalid_credentials') {
    return 'Incorrect email or password. Please try again.'
  }

  if (error.code === 'email_not_confirmed') {
    return 'Check your email to confirm your address.'
  }

  const normalizedMessage = error.message?.toLowerCase() ?? ''
  if (
    error.code === 'too_many_requests' ||
    normalizedMessage.includes('rate') ||
    normalizedMessage.includes('too many')
  ) {
    return 'Email sending is temporarily limited. Try again in a few minutes.'
  }

  return 'Unable to sign in right now. Please try again.'
}
