import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '../components/SignOutButton'
import BookCard from '../components/BookCard'
import KidCard from '../components/KidCard'

export const dynamic = 'force-dynamic'

type CharacterStatus = {
  kid_id: string
  kid_name: string
  job_status: string
  book_pdf_url: string | null
}

export default async function Dashboard() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  // This RPC function needs to be updated to get the latest job per kid
  const { data: characters, error } = await supabase.rpc('get_character_status')

  if (error) {
    console.error('Error fetching character status:', error)
  }

  const filteredCharacters = characters?.filter(
    (char: CharacterStatus) => char.job_status === 'ready' || char.job_status === 'completed'
  ) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Storybook AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {session.user.email}
              </p>
              <Link
                href="/create"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Storybook
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((char: CharacterStatus) => (
              <div key={char.kid_id}>
                {char.book_pdf_url && char.job_status === 'completed' ? (
                  <BookCard name={char.kid_name} pdfUrl={char.book_pdf_url} />
                ) : (
                  <KidCard name={char.kid_name} kidId={char.kid_id} />
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No characters ready!</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a new character or wait for training to complete.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 