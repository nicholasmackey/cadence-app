import MagicLinkScreen from './_components/MagicLinkScreen'

import { DEFAULT_POST_AUTH_PATH, toSafeInternalPath } from '@/lib/domain/auth'

type MagicLinkPageProps = {
  searchParams: Promise<{
    next?: string
    email?: string
  }>
}

export default async function MagicLinkPage({ searchParams }: MagicLinkPageProps) {
  const params = await searchParams
  const nextPath = toSafeInternalPath(params?.next, DEFAULT_POST_AUTH_PATH)
  const initialEmail = params?.email ?? ''

  return <MagicLinkScreen initialEmail={initialEmail} nextPath={nextPath} />
}
