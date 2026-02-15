'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
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

const childSchema = z.object({
  name: z.string().min(1, 'Child name is required.').max(120, 'Use 120 characters or fewer.'),
  birthYear: z
    .string()
    .optional()
    .refine(
      (value) => !value || (/^\d{4}$/.test(value) && Number(value) >= 1900 && Number(value) <= 2100),
      'Enter a valid year between 1900 and 2100.'
    ),
})

type ChildValues = {
  name: string
  birthYear: string
}

export function AddChildForm() {
  const router = useRouter()
  const [status, setStatus] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const form = useForm<ChildValues>({
    defaultValues: {
      name: '',
      birthYear: '',
    },
  })

  const onSubmit = async (values: ChildValues) => {
    const parsed = childSchema.safeParse(values)
    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors
      if (issues.name?.[0]) form.setError('name', { message: issues.name[0] })
      if (issues.birthYear?.[0]) form.setError('birthYear', { message: issues.birthYear[0] })
      return
    }

    setIsSaving(true)
    setStatus('')

    try {
      const response = await fetch('/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: parsed.data.name,
          birthYear: parsed.data.birthYear ? Number(parsed.data.birthYear) : null,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setStatus(payload?.error ?? 'Unable to create child profile.')
        setIsSaving(false)
        return
      }

      form.reset({ name: '', birthYear: '' })
      setStatus('Child profile created.')
      router.push('/app')
      router.refresh()
    } catch {
      setStatus('Unable to create child profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Child name</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" placeholder="Ava" autoComplete="off" />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth year (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="numeric"
                  className="h-11"
                  placeholder="2016"
                  autoComplete="off"
                />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="h-11 w-full" disabled={isSaving}>
          {isSaving ? 'Saving' : 'Add child'}
        </Button>
        <p aria-live="polite" className="min-h-[20px] text-sm text-[var(--text-secondary)]">
          {status}
        </p>
      </form>
    </Form>
  )
}
