import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateKidForm from '@/app/components/create/CreateKidForm'

export default async function CreatePage() {
  const supabase = await createClient()
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