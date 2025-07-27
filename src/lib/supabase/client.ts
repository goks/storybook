'use client'

<<<<<<< HEAD
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
=======
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
 
export const createBrowserSupabaseClient = () =>
  createClientComponentClient() 
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
