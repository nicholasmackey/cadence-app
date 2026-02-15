import 'server-only'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const ACTIVE_CHILD_COOKIE = 'cadence_active_child_id'

export type ChildRecord = {
  id: string
  family_id: string
  name: string
  birth_year: number | null
  created_at: string
}

async function getAuthenticatedUserId() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { supabase, userId: user.id }
}

export async function getCurrentFamilyId() {
  const { supabase, userId } = await getAuthenticatedUserId()
  const { data, error } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data?.family_id) {
    throw new Error('No family found for the current user.')
  }

  return data.family_id
}

export async function listChildren() {
  const supabase = await createClient()
  const familyId = await getCurrentFamilyId()

  const { data, error } = await supabase
    .from('children')
    .select('id, family_id, name, birth_year, created_at')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ChildRecord[]
}

export async function createChild(input: { name: string; birthYear?: number | null }) {
  const supabase = await createClient()
  const familyId = await getCurrentFamilyId()

  const payload = {
    family_id: familyId,
    name: input.name.trim(),
    birth_year: input.birthYear ?? null,
  }

  const { data, error } = await supabase
    .from('children')
    .insert(payload)
    .select('id, family_id, name, birth_year, created_at')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as ChildRecord
}

export async function setActiveChildCookie(childId: string) {
  const store = await cookies()
  store.set(ACTIVE_CHILD_COOKIE, childId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getActiveChildIdFromCookie() {
  const store = await cookies()
  return store.get(ACTIVE_CHILD_COOKIE)?.value ?? null
}

export async function assertChildInCurrentFamily(childId: string) {
  const supabase = await createClient()
  const familyId = await getCurrentFamilyId()

  const { data, error } = await supabase
    .from('children')
    .select('id, family_id, name, birth_year, created_at')
    .eq('family_id', familyId)
    .eq('id', childId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Child not found in your family.')
  }

  return data as ChildRecord
}
