import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function ensureUserBootstrap() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  await supabase.from('profiles').upsert(
    {
      id: user.id,
      // Supabase auth can omit email for some providers; keep deterministic fallback.
      email: user.email ?? `${user.id}@local.invalid`,
    },
    { onConflict: 'id' }
  )

  const { data: membership } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (membership?.family_id) {
    return membership.family_id
  }

  const { data: family, error: familyError } = await supabase
    .from('families')
    .insert({
      owner_profile_id: user.id,
      name: 'My Family',
    })
    .select('id')
    .single()

  if (familyError || !family) {
    throw new Error(familyError?.message ?? 'Failed to create family.')
  }

  const { error: memberError } = await supabase.from('family_members').insert({
    family_id: family.id,
    user_id: user.id,
    role: 'owner',
  })

  if (memberError) {
    throw new Error(memberError.message)
  }

  return family.id
}
