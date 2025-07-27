<<<<<<< HEAD
import { createClient } from '@/lib/supabase/server'
=======
import { createServerSupabaseClient } from '@/lib/supabase/server'
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
import { redirect } from 'next/navigation'
import CreateKidForm from '@/app/components/create/CreateKidForm'

export default async function CreatePage() {
<<<<<<< HEAD
  const supabase = await createClient()
=======
  const supabase = createServerSupabaseClient()
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Story Character</h1>
          <CreateKidForm userId={session.user.id} />
        </div>
      </div>
    </div>
  )
} 