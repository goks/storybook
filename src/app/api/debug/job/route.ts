import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 })
  }

<<<<<<< HEAD
  const supabaseCookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: async () => supabaseCookieStore })
=======
  // Use the cookies helper directly when creating the Supabase client
  const supabase = createRouteHandlerClient({ cookies })
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { searchParams } = new URL(request.url)
  const kidId = searchParams.get('kidId')

  if (!kidId) {
    return new NextResponse('kidId query parameter is required', { status: 400 })
  }

  try {
    const { data: latestJob } = await supabase
      .from('jobs')
      .select('*')
      .eq('kid_id', kidId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data: allJobsForKid } = await supabase
      .from('jobs')
      .select('*')
      .eq('kid_id', kidId)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      kidId,
      latestJob: latestJob || null,
      allJobsForKid: allJobsForKid || [],
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[DEBUG] Error fetching job data:', error.message)
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 