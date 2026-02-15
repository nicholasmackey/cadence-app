'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

function toSafeNextPath(next: string | null) {
  if (!next) return '/app'
  if (!next.startsWith('/')) return '/app'
  if (next.startsWith('//')) return '/app'
  return next
}

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [state, setState] = React.useState<SubmitState>('idle')
  const [message, setMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    const errorMessage = new URLSearchParams(window.location.search).get('error')
    if (!errorMessage) return
    setState('error')
    setMessage(errorMessage)
  }, [])

  const sendRecoveryLink = async () => {
    setState('submitting')
    setMessage(null)

    try {
      const supabase = createClient()
      const next = new URLSearchParams(window.location.search).get('next') ?? '/app'
      const redirectTo = new URL('/auth/callback', window.location.origin)
      redirectTo.searchParams.set('next', toSafeNextPath(next))

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo.toString(),
        },
      })

      if (error) {
        setState('error')
        const errorMessage = error.message.toLowerCase()
        if (errorMessage.includes('rate') || errorMessage.includes('too many')) {
          setMessage('Email sending is temporarily limited. Try again in a few minutes.')
        } else {
          setMessage(error.message)
        }
        return
      }

      setState('success')
      setMessage('Check your email for a recovery sign-in link.')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send sign-in link. Try again.')
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('submitting')
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setState('error')
        const errorMessage = error.message.toLowerCase()
        if (
          errorMessage.includes('invalid login credentials') ||
          errorMessage.includes('invalid_credentials')
        ) {
          setMessage('Email or password is incorrect.')
        } else {
          setMessage('Unable to sign in. Try again.')
        }
        return
      }

      window.location.assign('/app')
    } catch {
      setState('error')
      setMessage('Unable to sign in. Try again.')
    }
  }

  return (
    <main className="min-h-screen bg-[var(--surface-primary)] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-[var(--text-heading)]">
              Sign in
            </CardTitle>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in with your email and password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none text-[var(--text-primary)]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none text-[var(--text-primary)]">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={state === 'submitting'}>
                {state === 'submitting' ? 'Signing in' : 'Sign in'}
              </Button>
              <Button
                type="button"
                variant="link"
                className="h-11 w-full px-0 text-[var(--text-secondary)]"
                disabled={state === 'submitting'}
                onClick={sendRecoveryLink}>
                Email sign-in link
              </Button>
              <p
                aria-live="polite"
                className={
                  'min-h-[20px] text-sm ' +
                  (state === 'error' ? 'text-destructive' : 'text-[var(--text-secondary)]')
                }>
                {message}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
