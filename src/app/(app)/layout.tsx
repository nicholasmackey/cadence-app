import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { ensureUserBootstrap } from '@/lib/data/bootstrap'
import { createClient } from '@/lib/supabase/server'

async function signOut() {
  'use server'

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  await ensureUserBootstrap()

  return (
    <div className="min-h-screen bg-[var(--surface-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        <header className="space-y-4 border-b border-border pb-4">
          <div className="space-y-1">
            <p className="text-sm text-[var(--text-secondary)]">Cadence App</p>
            <h1 className="text-2xl font-semibold text-[var(--text-heading)]">Family learning log</h1>
          </div>
          <nav className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="secondary" className="h-11 justify-start sm:justify-center">
              <Link href="/app">Dashboard</Link>
            </Button>
            <Button asChild variant="secondary" className="h-11 justify-start sm:justify-center">
              <Link href="/app/children">Children</Link>
            </Button>
            <Button asChild variant="secondary" className="h-11 justify-start sm:justify-center">
              <Link href="/app/log">Quick log</Link>
            </Button>
            <Button asChild variant="secondary" className="h-11 justify-start sm:justify-center">
              <Link href="/app/account">Account</Link>
            </Button>
          </nav>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="h-11 w-full sm:w-auto">
              Sign out
            </Button>
          </form>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
