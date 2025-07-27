<<<<<<< HEAD
import { createClient } from '@/lib/supabase/server'
=======
import { createServerSupabaseClient } from '@/lib/supabase/server'
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
import { redirect } from 'next/navigation'
import TemplateSelector from '@/app/components/kid/TemplateSelector'

async function getKidData(kidId: string) {
<<<<<<< HEAD
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
=======
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
    return null
  }

  const { data: kid } = await supabase
    .from('kids')
    .select('id, name')
    .eq('id', kidId)
<<<<<<< HEAD
    .eq('user_id', user.id)
=======
    .eq('user_id', session.user.id)
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
    .single()
  
  return kid
}

export default async function TemplatePage({
  params,
}: {
<<<<<<< HEAD
  params: { kidId: string }
}) {
  const { kidId } = await params
  const kid = await getKidData(kidId)
  
=======
  params: Promise<{ kidId: string }>
}) {
  const { kidId } = await params
  const kid = await getKidData(kidId)

>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
  if (!kid) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Choose a Story for {kid.name}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Select an adventure and we&apos;ll create the illustrations!
          </p>
          <TemplateSelector kidId={kid.id} />
        </div>
      </div>
    </div>
  )
} 