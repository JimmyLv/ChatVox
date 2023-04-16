import { ApplicationError } from '@/lib/errors'
// import { Database } from '@/schemas/supabase'
import { createClient } from '@supabase/supabase-js'
export const SUPABASE_FILES_STORAGE_NAME = 'user-local-files'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new ApplicationError('Missing environment variable SUPABASE_URL')
}
if (!supabaseKey) {
  throw new ApplicationError('Missing environment variable SUPABASE_KEY')
}
/*
if (!supabaseServiceKey) {
  throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
}*/

export const supabaseClient = createClient(supabaseUrl, supabaseKey)
