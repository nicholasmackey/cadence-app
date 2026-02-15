'use client'

import * as React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

const waitlistSchema = z.object({
  email: z.string().min(1, 'Enter a valid email address.').email('Enter a valid email address.'),
})

type WaitlistFormValues = z.infer<typeof waitlistSchema>

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzbpylp'

export function WaitlistForm() {
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
    },
  })

  const [status, setStatus] = React.useState<SubmitStatus>('idle')
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)

  const onSubmit = async (values: WaitlistFormValues) => {
    setStatus('submitting')
    setStatusMessage(null)

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
        }),
      })

      if (!response.ok) {
        setStatus('error')
        setStatusMessage('Something went wrong. Try again.')
        return
      }

      setStatus('success')
      setStatusMessage('You\u2019re on the list.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setStatusMessage('Something went wrong. Try again.')
    }
  }

  const statusTone = status === 'error' ? 'text-destructive' : 'text-[var(--text-secondary)]'

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="mk-form-title text-lg font-semibold text-[var(--text-heading)]">
          Join the waitlist
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-[var(--text-primary)]">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-11 text-[16px]"
                    />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage className="text-[13px] leading-[20px]" />
                  </div>
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <Button type="submit" className="h-11 w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Joining' : 'Join the waitlist'}
              </Button>
              <p className="text-[13px] leading-[20px] text-[var(--text-secondary)]">
                Invites roll out in small groups. We’ll email when it’s your turn.
              </p>
              <div
                aria-live="polite"
                className={'min-h-[20px] text-[13px] leading-[20px] ' + statusTone}>
                {status === 'success' ? (
                  <span className="inline-flex items-center gap-2 text-[var(--status-success)]">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {statusMessage}
                  </span>
                ) : (
                  statusMessage ?? null
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
