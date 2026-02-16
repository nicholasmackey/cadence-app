'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { LOGIN_PATH } from '@/lib/domain/auth'
import { createClient } from '@/lib/supabase/client'

type SubmitState = 'idle' | 'submitting' | 'error'

export function LogOutButton() {
  const router = useRouter()
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  const onLogOut = async () => {
    setState('submitting')
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        setState('error')
        setMessage('Unable to log out right now. Please try again.')
        return
      }

      router.replace(`${LOGIN_PATH}?next=/log`)
    } catch {
      setState('error')
      setMessage('Unable to log out right now. Please try again.')
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={onLogOut}
        disabled={state === 'submitting'}
        className="h-10 rounded-md border border-border bg-background px-4 text-sm text-[var(--text-primary)] disabled:opacity-70">
        {state === 'submitting' ? 'Logging out' : 'Log out'}
      </button>
      <p
        aria-live="polite"
        className={
          'mt-2 min-h-[20px] text-right text-sm ' +
          (state === 'error' ? 'text-destructive' : 'text-[var(--text-secondary)]')
        }>
        {message}
      </p>
    </div>
  )
}
