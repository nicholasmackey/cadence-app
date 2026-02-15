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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ChildOption = {
  id: string
  name: string
}

type QuickLogFormProps = {
  children: ChildOption[]
  defaultChildId: string
}

const quickLogSchema = z.object({
  childId: z.string().uuid('Select a child.'),
  subject: z.string().min(1, 'Subject is required.').max(120, 'Use 120 characters or fewer.'),
  occurredAt: z.string().min(1, 'Date and time are required.'),
  durationMinutes: z
    .string()
    .optional()
    .refine(
      (value) => !value || (/^\d+$/.test(value) && Number(value) > 0 && Number(value) <= 1440),
      'Duration must be between 1 and 1440 minutes.'
    ),
  notes: z.string().max(2000, 'Use 2000 characters or fewer.').optional(),
})

type QuickLogValues = {
  childId: string
  subject: string
  occurredAt: string
  durationMinutes: string
  notes: string
}

function currentDateTimeLocal() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - offset * 60_000)
  return localDate.toISOString().slice(0, 16)
}

export function QuickLogForm({ children, defaultChildId }: QuickLogFormProps) {
  const router = useRouter()
  const [status, setStatus] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const form = useForm<QuickLogValues>({
    defaultValues: {
      childId: defaultChildId,
      subject: '',
      occurredAt: currentDateTimeLocal(),
      durationMinutes: '',
      notes: '',
    },
  })

  const onSubmit = async (values: QuickLogValues) => {
    const parsed = quickLogSchema.safeParse(values)
    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors
      if (issues.childId?.[0]) form.setError('childId', { message: issues.childId[0] })
      if (issues.subject?.[0]) form.setError('subject', { message: issues.subject[0] })
      if (issues.occurredAt?.[0]) form.setError('occurredAt', { message: issues.occurredAt[0] })
      if (issues.durationMinutes?.[0]) {
        form.setError('durationMinutes', { message: issues.durationMinutes[0] })
      }
      if (issues.notes?.[0]) form.setError('notes', { message: issues.notes[0] })
      return
    }

    setIsSaving(true)
    setStatus('')

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: parsed.data.childId,
          subject: parsed.data.subject,
          occurredAt: parsed.data.occurredAt,
          durationMinutes: parsed.data.durationMinutes ? Number(parsed.data.durationMinutes) : null,
          notes: parsed.data.notes,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setStatus(payload?.error ?? 'Unable to save activity log.')
        setIsSaving(false)
        return
      }

      setStatus('Activity saved.')
      router.push('/app')
      router.refresh()
    } catch {
      setStatus('Unable to save activity log.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="childId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Child</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" placeholder="Reading" autoComplete="off" />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occurredAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occurred at</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" type="datetime-local" />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration minutes (optional)</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" inputMode="numeric" placeholder="45" />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="What did they do today?" />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11 w-full" disabled={isSaving}>
          {isSaving ? 'Saving' : 'Save log'}
        </Button>
        <p aria-live="polite" className="min-h-[20px] text-sm text-[var(--text-secondary)]">
          {status}
        </p>
      </form>
    </Form>
  )
}
