import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** Returns a Supabase client, or null when env vars are not configured (e.g. during CI build). */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return null
  }
  if (!client) {
    client = createClient(url, key)
  }
  return client
}

/** @deprecated Prefer getSupabase() — kept for existing imports. */
export const supabase = {
  from(table: string) {
    const instance = getSupabase()
    if (!instance) {
      throw new Error(
        'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project environment variables.'
      )
    }
    return instance.from(table)
  },
}
