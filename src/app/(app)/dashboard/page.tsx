import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/data/auth.repo'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const user = await getCurrentUser(supabase)

  if (!user) {
    redirect('/login?next=/dashboard')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-[var(--text-heading)]">Dashboard (protected)</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{user.email ?? 'Unknown user'}</p>
    </main>
  )
}
