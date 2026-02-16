'use client'

import { FormEvent, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { sendPasswordResetEmail, signInWithGoogle, signInWithPassword } from '@/lib/data/auth.repo'
import { DEFAULT_POST_AUTH_PATH, toSafeInternalPath } from '@/lib/domain/auth'
import { createClient } from '@/lib/supabase/client'
import { GoogleIcon } from './_components/GoogleIcon'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[var(--text-secondary)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const initialError = searchParams.get('error')
  const nextPath = useMemo(
    () => toSafeInternalPath(searchParams.get('next'), DEFAULT_POST_AUTH_PATH),
    [searchParams],
  )
  const statusMessage = message ?? initialError
  const isSubmitting = state === 'submitting'

  const toAuthErrorMessage = () => 'Unable to complete sign in right now. Please try again.'
  const toEmailRateLimitMessage = () =>
    'Email sending is temporarily limited. Try again in a few minutes.'
  const isEmailRateLimited = (errorMessage: string) => {
    const normalized = errorMessage.toLowerCase()
    return normalized.includes('rate') || normalized.includes('too many')
  }
  const getCallbackRedirect = (next: string) => {
    const redirectTo = new URL('/auth/callback', window.location.origin)
    redirectTo.searchParams.set('next', next)
    return redirectTo.toString()
  }

  const onGoogleSignIn = async () => {
    setState('submitting')
    setMessage(null)

    const supabase = createClient()
    const { error } = await signInWithGoogle(supabase, getCallbackRedirect(nextPath))

    if (error) {
      setState('error')
      setMessage(toAuthErrorMessage())
      return
    }
  }

  const onMagicLink = async () => {
    const magicLinkUrl = new URL('/login/magic-link', window.location.origin)
    magicLinkUrl.searchParams.set('next', nextPath)
    if (email) {
      magicLinkUrl.searchParams.set('email', email)
    }
    router.push(`${magicLinkUrl.pathname}${magicLinkUrl.search}`)
  }

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('submitting')
    setMessage(null)

    const supabase = createClient()
    const { error } = await signInWithPassword(supabase, email, password)

    if (error) {
      setState('error')
      setMessage(toAuthErrorMessage())
      return
    }

    setState('success')
    router.replace(nextPath)
  }

  const onForgotPassword = async () => {
    if (!email) {
      setState('error')
      setMessage('Enter your email before requesting a password reset.')
      return
    }

    setState('submitting')
    setMessage(null)

    const redirectTo = new URL('/auth/callback', window.location.origin)
    redirectTo.searchParams.set('next', '/account')

    const supabase = createClient()
    redirectTo.searchParams.set('type', 'recovery')
    const { error } = await sendPasswordResetEmail(supabase, email, redirectTo.toString())

    if (error) {
      setState('error')
      setMessage(
        isEmailRateLimited(error.message) ? toEmailRateLimitMessage() : toAuthErrorMessage(),
      )
      return
    }

    setState('success')
    setMessage('Password reset email sent. Check your inbox for the next step.')
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
              className="h-24 w-auto sm:h-28"
              priority
            />
          </div>

          <h1 className="mt-9 text-center text-[2.125rem] font-medium leading-tight text-[var(--text-heading)]">
            Welcome back
          </h1>

          <form onSubmit={onSignIn} className="mt-7 space-y-4">
            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-[var(--surface-login-button)] px-4 text-base font-medium text-[var(--text-primary)] transition-colors duration-200 motion-reduce:transition-none disabled:opacity-70">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={onMagicLink}
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-[var(--surface-login-button)] px-4 text-base font-medium text-[var(--text-primary)] transition-colors duration-200 motion-reduce:transition-none disabled:opacity-70">
              <MailIcon />
              <span>Email me a link</span>
            </button>

            <div className="flex items-center gap-3 py-1 text-sm font-medium text-[var(--text-secondary)]">
              <div className="h-px flex-1 bg-border" />
              <span>or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

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

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-[var(--text-primary)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-[var(--text-primary)] transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[var(--cadence-brilliant-blue)] px-4 text-base font-semibold text-[var(--text-inverse)] transition-colors duration-200 motion-reduce:transition-none disabled:opacity-70">
              {isSubmitting ? 'Signing in' : 'Continue'}
            </button>

            <button
              type="button"
              onClick={onForgotPassword}
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl px-4 text-base font-medium text-[var(--cadence-brilliant-blue)] transition-colors duration-200 motion-reduce:transition-none disabled:opacity-70">
              Forgot your password?
            </button>

            <p
              aria-live="polite"
              className={
                'min-h-[24px] text-center text-sm ' +
                (state === 'error' ? 'text-destructive' : 'text-[var(--text-secondary)]')
              }>
              {statusMessage}
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
