import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase public environment variables are missing.')
}

// Reuse the client across hot reloads in dev without relying on Node-only globals.
const globalForSupabase = globalThis

if (!globalForSupabase._supabase) {
  globalForSupabase._supabase = createClient(supabaseUrl, supabaseAnonKey)
}

const supabase = globalForSupabase._supabase

export { supabase }
