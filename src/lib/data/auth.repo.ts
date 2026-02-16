import type { SupabaseClient } from '@supabase/supabase-js'

type SupabaseAuthClient = Pick<SupabaseClient, 'auth'>

export async function getCurrentUser(client: SupabaseAuthClient) {
  const {
    data: { user },
  } = await client.auth.getUser()

  return user
}

export async function signInWithPassword(client: SupabaseAuthClient, email: string, password: string) {
  return client.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signInWithGoogle(client: SupabaseAuthClient, redirectTo: string) {
  return client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })
}

export async function sendMagicLink(client: SupabaseAuthClient, email: string, redirectTo: string) {
  return client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  })
}

export async function sendPasswordResetEmail(
  client: SupabaseAuthClient,
  email: string,
  redirectTo: string
) {
  return client.auth.resetPasswordForEmail(email, { redirectTo })
}

export async function updatePassword(client: SupabaseAuthClient, password: string) {
  return client.auth.updateUser({
    password,
  })
}

export async function exchangeCodeForSession(client: SupabaseAuthClient, code: string) {
  return client.auth.exchangeCodeForSession(code)
}
