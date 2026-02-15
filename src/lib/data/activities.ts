import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { assertChildInCurrentFamily, getCurrentFamilyId } from '@/lib/data/children'

export type ActivityRecord = {
  id: string
  family_id: string
  child_id: string
  occurred_at: string
  subject: string
  duration_minutes: number | null
  notes: string | null
  created_at: string
}

export async function listRecentActivities(childId: string, limit = 20) {
  await assertChildInCurrentFamily(childId)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activities')
    .select('id, family_id, child_id, occurred_at, subject, duration_minutes, notes, created_at')
    .eq('child_id', childId)
    .order('occurred_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ActivityRecord[]
}

export async function createActivity(input: {
  childId: string
  subject: string
  occurredAt: string
  durationMinutes?: number | null
  notes?: string | null
}) {
  const familyId = await getCurrentFamilyId()
  await assertChildInCurrentFamily(input.childId)
  const supabase = await createClient()

  const payload = {
    family_id: familyId,
    child_id: input.childId,
    subject: input.subject.trim(),
    occurred_at: input.occurredAt,
    duration_minutes: input.durationMinutes ?? null,
    notes: input.notes?.trim() ? input.notes.trim() : null,
  }

  const { data, error } = await supabase
    .from('activities')
    .insert(payload)
    .select('id, family_id, child_id, occurred_at, subject, duration_minutes, notes, created_at')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as ActivityRecord
}
