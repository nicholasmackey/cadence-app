import { redirect } from 'next/navigation'

import { getCurrentUser, updatePassword } from '@/lib/data/auth.repo'
import { LOGIN_PATH } from '@/lib/domain/auth'
import { createClient } from '@/lib/supabase/server'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const user = await getCurrentUser(supabase)

  if (!user) {
    redirect(`${LOGIN_PATH}?next=/account`)
  }

  async function setPasswordAction(formData: FormData) {
    'use server'

    const password = String(formData.get('password') ?? '').trim()
    if (password.length < 8) {
      redirect('/account?error=Password%20must%20be%20at%20least%208%20characters.')
    }

    const client = await createClient()
    const currentUser = await getCurrentUser(client)
    if (!currentUser) {
      redirect(`${LOGIN_PATH}?next=/account`)
    }

    const { error } = await updatePassword(client, password)
    if (error) {
      redirect(`/account?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/account?status=Password%20updated.')
  }

  const message = params.error ?? params.status ?? ''
  const isError = Boolean(params.error)

  return (
    <main className="min-h-screen bg-[var(--surface-primary)] px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-[var(--surface-secondary)] p-6">
        <h1 className="text-2xl font-semibold text-[var(--text-heading)]">Account</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Set a new password for your account.
        </p>

        <form action={setPasswordAction} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none text-[var(--text-primary)]">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-[var(--text-primary)]"
            />
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-md bg-[var(--brand-primary)] px-4 text-sm font-medium text-[var(--text-inverse)]">
            Save password
          </button>

          <p
            aria-live="polite"
            className={
              'min-h-[20px] text-sm ' +
              (isError ? 'text-destructive' : 'text-[var(--text-secondary)]')
            }>
            {message}
          </p>
        </form>
      </div>
    </main>
  )
}
