import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')

    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error_description || error)}`, request.url)
      )
    }

    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      await supabase.auth.exchangeCodeForSession(code)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If we get here, we have an invalid request
    return NextResponse.redirect(
      new URL('/?error=Invalid authorization request', request.url)
    )
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL('/?error=An unexpected error occurred', request.url)
    )
  }
} 