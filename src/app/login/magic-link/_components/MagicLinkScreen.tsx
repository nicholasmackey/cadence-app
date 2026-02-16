'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { sendMagicLink } from '@/lib/data/auth.repo'
import { LOGIN_PATH } from '@/lib/domain/auth'
import { createClient } from '@/lib/supabase/client'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type MagicLinkScreenProps = {
  initialEmail: string
  nextPath: string
}

export default function MagicLinkScreen({ initialEmail, nextPath }: MagicLinkScreenProps) {
  const router = useRouter()
  const [email, setEmail] = useState(initialEmail)
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  const isSubmitting = state === 'submitting'
  const isSuccess = state === 'success'

  const toEmailRateLimitMessage = () =>
    'Email sending is temporarily limited. Try again in a few minutes.'
  const toAuthErrorMessage = () => 'Unable to send a login link right now. Please try again.'
  const isEmailRateLimited = (errorMessage: string) => {
    const normalized = errorMessage.toLowerCase()
    return normalized.includes('rate') || normalized.includes('too many')
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) {
      setState('error')
      setMessage('Enter your email before requesting a sign-in link.')
      return
    }

    setState('submitting')
    setMessage('')

    const redirectTo = new URL('/auth/callback', window.location.origin)
    redirectTo.searchParams.set('next', nextPath)

    const supabase = createClient()
    const { error } = await sendMagicLink(supabase, email, redirectTo.toString())

    if (error) {
      setState('error')
      setMessage(isEmailRateLimited(error.message) ? toEmailRateLimitMessage() : toAuthErrorMessage())
      return
    }

    setState('success')
    setMessage('')
  }

  const onBackToLogin = () => {
    router.push(`${LOGIN_PATH}?next=${encodeURIComponent(nextPath)}`)
  }

  return (
    <main className="min-h-screen bg-[var(--cadence-inverse)] px-4 py-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
        <section className="rounded-3xl px-5 py-8 sm:px-6">
          <div className="flex justify-center">
            <Image
              src="/cadence-logo-main.svg"
              alt="Cadence"
              width={320}
              height={90}
              className="h-12 w-auto sm:h-14"
              priority
            />
          </div>

          <h1 className="mt-9 text-center text-[2.125rem] font-medium leading-tight text-[var(--text-heading)]">
            {isSuccess ? 'Check your inbox' : 'Enter your email'}
          </h1>

          <p className="mt-3 text-center text-base text-[var(--text-secondary)]">
            {isSuccess
              ? 'We sent a login link to your email. Open it to continue.'
              : 'We will email you a secure link to sign in.'}
          </p>

          {isSuccess ? (
            <div className="mt-7 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--cadence-brilliant-blue)] animate-pulse" />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-[var(--cadence-brilliant-blue)] animate-pulse"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-[var(--cadence-brilliant-blue)] animate-pulse"
                  style={{ animationDelay: '300ms' }}
                />
              </div>

              <button
                type="button"
                onClick={onBackToLogin}
                className="h-11 w-full rounded-xl px-4 text-base font-medium text-[var(--cadence-brilliant-blue)] transition-colors duration-200 motion-reduce:transition-none">
                Use a different login method
              </button>

              <p className="min-h-[24px] text-center text-sm text-[var(--text-secondary)]" aria-live="polite" />
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none text-[var(--text-primary)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-[var(--text-primary)] transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[var(--cadence-brilliant-blue)] px-4 text-base font-semibold text-[var(--text-inverse)] transition-colors duration-200 motion-reduce:transition-none disabled:opacity-70">
                {isSubmitting ? 'Sending link' : 'Email me a login link'}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="h-11 w-full rounded-xl px-4 text-base font-medium text-[var(--cadence-brilliant-blue)] transition-colors duration-200 motion-reduce:transition-none">
                Use a different login method
              </button>

              <p
                aria-live="polite"
                className={
                  'min-h-[24px] text-center text-sm ' +
                  (state === 'error' ? 'text-destructive' : 'text-[var(--text-secondary)]')
                }>
                {message}
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
