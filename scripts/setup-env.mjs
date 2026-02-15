import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const envLocalPath = resolve(process.cwd(), '.env.local')

if (!existsSync(envLocalPath)) {
  console.error('Missing .env.local')
  console.error('Create .env.local with:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE')
  process.exit(1)
}

console.log('Found .env.local')
