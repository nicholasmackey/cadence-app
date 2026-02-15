import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/db.types'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables.')
  }

  if (!client) {
    client = createBrowserClient<Database>(supabaseUrl, supabaseKey)
  }

  return client
}
