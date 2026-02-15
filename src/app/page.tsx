'use client'

import * as React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { SubjectCard } from '@/components/cadence/subject-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formAction = 'https://formspree.io/f/mvzbpylp'

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Enter a valid email address.',
    })
    .email({
      message: 'Enter a valid email address.',
    }),
})

type FormValues = z.infer<typeof formSchema>

type Status = 'idle' | 'submitting' | 'success' | 'error'

function SubjectIcon() {
  return (
    <svg
      width="24"
      height="21"
      viewBox="0 0 24 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-[var(--brand-primary)]"
      aria-hidden="true"
    >
      <path
        d="M11.9977 3.55702L11.2947 2.58224C10.123 0.960723 8.2437 0 6.23784 0C2.7932 0 0 2.79313 0 6.23767V6.35952C0 7.46552 0.290568 8.60902 0.777973 9.74782H5.74575C5.89572 9.74782 6.03163 9.65878 6.09256 9.51819L7.58289 5.94242C7.7563 5.53002 8.15934 5.2582 8.60457 5.24883C9.0498 5.23946 9.46221 5.5019 9.64499 5.90962L12.0492 11.2475L13.9895 7.36711C14.1816 6.9875 14.5706 6.74381 14.9971 6.74381C15.4236 6.74381 15.8125 6.98282 16.0047 7.36711L17.092 9.53693C17.1576 9.66347 17.2841 9.74314 17.4294 9.74314H23.222C23.7141 8.60433 24 7.46084 24 6.35483V6.23298C23.9953 2.79313 21.2021 0 17.7575 0C15.7563 0 13.8723 0.960723 12.7006 2.58224L11.9977 3.55233V3.55702ZM22.0082 11.9973H17.4247C16.4312 11.9973 15.522 11.4349 15.0767 10.5445L14.9971 10.3852L13.0053 14.3734C12.8131 14.7623 12.4101 15.006 11.9742 14.9967C11.5384 14.9873 11.1494 14.7295 10.9713 14.3359L8.66081 9.2042L8.16872 10.3852C7.76098 11.3647 6.80492 12.002 5.74575 12.002H1.98711C4.19918 15.4606 7.75161 18.6427 9.97305 20.3392C10.5542 20.7797 11.2665 21 11.993 21C12.7194 21 13.4364 20.7844 14.0129 20.3392C16.2437 18.638 19.7961 15.4559 22.0082 11.9973Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function BetaWaitlistPage() {
  const [status, setStatus] = React.useState<Status>('idle')
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = async (values: FormValues) => {
    setStatus('submitting')

    try {
      const formData = new FormData()
      formData.append('email', values.email)

      const response = await fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        setStatus('error')
        return
      }

      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const handleJoinAnother = () => {
    form.reset()
    setStatus('idle')
  }

  return (
    <div className="cd-page">
      <main className="cd-wrap">
        <div className="cd-grid">
          <div className="cd-left">
            <section className="cd-hero">
              <div className="cd-heroText">
                <p className="cd-eyebrow">Waitlist</p>
                <h1 className="cd-h1">It all counts.</h1>
                <p className="cd-bodyLg">
                  Built for families who learn differently.
                  <span className="block">
                    Cadence keeps a clear, structured record of the learning already happening in your
                    home.
                  </span>
                </p>
              </div>
            </section>

            <section className="cd-formWrap">
              <Card className="cd-formCard">
                <CardContent className="cd-cardBody">
                  {status === 'success' ? (
                    <div className="cd-successWrap">
                      <h2 className="cd-successTitle">You’re on the waitlist.</h2>
                      <p className="cd-successBody">We’ll reach out if a spot opens. Timing varies.</p>
                      <button type="button" className="cd-successLink" onClick={handleJoinAnother}>
                        Join with another email
                      </button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="cd-form" noValidate>
                        <div className="cd-cardHeader">
                          <h2 className="cd-cardTitle">Join the waitlist</h2>
                          <p className="cd-cardHelper">
                            We’re inviting families in small groups. If you’re selected, we’ll email you
                            with next steps.
                          </p>
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="cd-field">
                              <FormLabel className="cd-label">Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="cd-input"
                                  inputMode="email"
                                  placeholder="you@example.com"
                                  type="email"
                                />
                              </FormControl>
                              <FormMessage className="cd-message" />
                            </FormItem>
                          )}
                        />
                        <div className="cd-actions">
                          <Button
                            type="submit"
                            className="cd-submit cd-primaryBtn"
                            disabled={status === 'submitting'}
                          >
                            {status === 'submitting' ? 'Joining' : 'Join the waitlist'}
                          </Button>
                          <div aria-live="polite" className="cd-status">
                            {status === 'error' ? 'Something went wrong. Try again.' : null}
                          </div>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="cd-subjectPreview">
              <SubjectCard
                title="Physical Education"
                durationLabel="45 min"
                hasNote
                noteText="Emily and I had a blast trying yoga for PE today."
                attachmentCount={2}
                attachments={[
                  { id: 'a', name: 'PE Log.pdf', sizeLabel: '1.2 KB' },
                  { id: 'b', name: 'Photos.zip', sizeLabel: '0.7 KB' },
                ]}
                leadingIcon={<SubjectIcon />}
              />
            </section>
          </div>
          <div className="cd-right" />
        </div>
      </main>
    </div>
  )
}
