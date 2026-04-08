import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Evita criar múltiplas instâncias
let supabase

if (!global._supabase) {
  global._supabase = createClient(supabaseUrl, supabaseAnonKey)
}

supabase = global._supabase

export { supabase }