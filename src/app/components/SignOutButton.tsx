'use client'

<<<<<<< HEAD
import { createClient } from '@/lib/supabase/client'
=======
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const handleSignOut = async () => {
<<<<<<< HEAD
    const supabase = createClient()
=======
    const supabase = createBrowserSupabaseClient()
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      Sign out
    </button>
  )
} 