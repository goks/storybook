import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignInButton from './components/SignInButton'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const { error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white-900">
            Welcome to Storybook AI
          </h2>
          <p className="mt-2 text-center text-sm text-white-600">
            Sign in to get started
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {decodeURIComponent(error)}
                </div>
              </div>
            </div>
          </div>
        )}
        <SignInButton />
      </div>
    </main>
  )
}
