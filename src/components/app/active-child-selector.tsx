'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ChildOption = {
  id: string
  name: string
}

type ActiveChildSelectorProps = {
  children: ChildOption[]
  activeChildId: string
}

export function ActiveChildSelector({ children, activeChildId }: ActiveChildSelectorProps) {
  const router = useRouter()
  const [value, setValue] = React.useState(activeChildId)
  const [message, setMessage] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const onChange = async (nextValue: string) => {
    setValue(nextValue)
    setIsSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/active-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ childId: nextValue }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setMessage(payload?.error ?? 'Unable to set active child.')
        setIsSaving(false)
        return
      }

      router.refresh()
      setMessage('Active child updated.')
    } catch {
      setMessage('Unable to set active child.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="active-child" className="text-sm font-medium text-[var(--text-primary)]">
        Active child
      </label>
      <Select value={value} onValueChange={onChange} disabled={isSaving}>
        <SelectTrigger id="active-child" className="h-11">
          <SelectValue placeholder="Select child" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id}>
              {child.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p aria-live="polite" className="min-h-[20px] text-sm text-[var(--text-secondary)]">
        {message}
      </p>
    </div>
  )
}
