import { ApplicationError } from '@/lib/errors'
// import { Database } from '@/schemas/supabase'
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new ApplicationError('Missing environment variable SUPABASE_URL')
}

if (!supabaseServiceKey) {
  throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
