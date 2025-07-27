import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TemplateSelector from '@/app/components/kid/TemplateSelector'

async function getKidData(kidId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: kid } = await supabase
    .from('kids')
    .select('id, name')
    .eq('id', kidId)
    .eq('user_id', user.id)
    .single()
  
  return kid
}

export default async function TemplatePage({
  params,
}: {
  params: { kidId: string }
}) {
  const { kidId } = await params
  const kid = await getKidData(kidId)
  
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