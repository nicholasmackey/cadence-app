type SiteOriginOptions = {
  requestUrl?: string | URL | null
}

function normalizeOrigin(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const hasProtocol = /^https?:\/\//i.test(trimmed)
  const candidate =
    hasProtocol ? trimmed : trimmed.startsWith('localhost') ? `http://${trimmed}` : `https://${trimmed}`

  try {
    return new URL(candidate).origin
  } catch {
    return null
  }
}

function getOriginFromRequestUrl(requestUrl?: string | URL | null): string | null {
  if (!requestUrl) return null

  try {
    return new URL(requestUrl.toString()).origin
  } catch {
    return null
  }
}

export function resolveSiteOrigin(options: SiteOriginOptions = {}): string | null {
  if (typeof window !== 'undefined') {
    return normalizeOrigin(window.location.origin)
  }

  const requestOrigin = getOriginFromRequestUrl(options.requestUrl)
  if (requestOrigin) return requestOrigin

  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? '') ??
    normalizeOrigin(process.env.VERCEL_URL ?? '') ??
    normalizeOrigin(process.env.NEXT_PUBLIC_VERCEL_URL ?? '')
  )
}

export function getSiteOrigin(options: SiteOriginOptions = {}): string {
  const origin = resolveSiteOrigin(options)
  if (!origin) {
    throw new Error('Unable to resolve site origin.')
  }

  return origin
}
