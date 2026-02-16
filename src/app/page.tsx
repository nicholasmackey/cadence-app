import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/data/auth.repo'
import { DEFAULT_POST_AUTH_PATH, LOGIN_PATH } from '@/lib/domain/auth'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const user = await getCurrentUser(supabase)

  if (user) {
    redirect(DEFAULT_POST_AUTH_PATH)
  }

  redirect(`${LOGIN_PATH}?next=${encodeURIComponent(DEFAULT_POST_AUTH_PATH)}`)
}
