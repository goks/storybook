import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { replicate } from '@/lib/replicate'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Use the cookies helper directly when creating the Supabase client
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return new NextResponse('Job ID is required', { status: 400 })
  }

  try {
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('status, replicate_training_id')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return new NextResponse('Job not found', { status: 404 })
    }

    // If the job is already processed, just return its status.
    if (job.status !== 'training') {
      return NextResponse.json({ status: job.status, progressSeconds: null })
    }

    // Fetch the latest training status from Replicate.
    const training = await replicate.trainings.get(job.replicate_training_id)

    let updatedStatus = job.status
    if (training.status === 'succeeded') {
      updatedStatus = 'ready'
      const output = training.output as { version: string }
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ status: 'ready', model_version: output.version })
        .eq('id', jobId)
      if (updateError) throw updateError
    } else if (training.status === 'failed' || training.status === 'canceled') {
      updatedStatus = 'failed'
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ status: 'failed' })
        .eq('id', jobId)
      if (updateError) throw updateError
    }

    // The 'metrics' object and its properties are not guaranteed to exist on the Training type.
    const metrics = training.metrics as { train_time_in_seconds?: number } | undefined

    return NextResponse.json({
      status: updatedStatus,
      progressSeconds: metrics?.train_time_in_seconds || 0,
    })
  } catch (error: unknown) {
    console.error('Polling error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return new NextResponse(message, { status: 500 })
  }
} 