export const LOGIN_PATH = '/login'
export const DEFAULT_POST_AUTH_PATH = '/log'
export const RECOVERY_POST_AUTH_PATH = '/account'

const PROTECTED_ROUTE_PREFIXES = ['/log', '/dashboard', '/account'] as const

export function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.includes('\\')) return false
  return true
}

export function toSafeInternalPath(
  path: string | null | undefined,
  fallback = DEFAULT_POST_AUTH_PATH
): string {
  if (!path) return fallback
  return isSafeInternalPath(path) ? path : fallback
}

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
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
