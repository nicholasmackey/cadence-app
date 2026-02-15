'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function AccountPage() {
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [state, setState] = React.useState<SubmitState>('idle')
  const [message, setMessage] = React.useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('submitting')
    setMessage(null)

    if (password !== confirmPassword) {
      setState('error')
      setMessage('Passwords do not match.')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setState('error')
        setMessage('Unable to set password. Try again.')
        return
      }

      setState('success')
      setMessage('Password saved.')
      setPassword('')
      setConfirmPassword('')
    } catch {
      setState('error')
      setMessage('Unable to set password. Try again.')
    }
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-[var(--text-heading)]">
            Account
          </CardTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            Set a password so future sign-ins are faster.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-[var(--text-primary)]">
                New password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium leading-none text-[var(--text-primary)]">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full" disabled={state === 'submitting'}>
              {state === 'submitting' ? 'Saving password' : 'Set password'}
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
    </section>
  )
}
