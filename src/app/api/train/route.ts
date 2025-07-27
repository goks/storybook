import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import JSZip from 'jszip'
import { replicate, ensureRepo, REPLICATE_VERSION_ID } from '@/lib/replicate'

export const dynamic = 'force-dynamic'

// Helper to fetch image as buffer
async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function POST(request: Request) {
  try {
<<<<<<< HEAD
    const supabaseCookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: async () => supabaseCookieStore })
=======
    // Use the cookies helper directly when creating the Supabase client
    const supabase = createRouteHandlerClient({ cookies })
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { kidId, imageUrls } = await request.json()

    // --- CRITICAL FIX: Check for existing active jobs ---
    const { data: existingJob, error: existingJobError } = await supabase
      .from('jobs')
      .select('status')
      .eq('kid_id', kidId)
      .in('status', ['training', 'ready', 'generating', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingJobError) {
      console.error('Error checking for existing jobs:', existingJobError)
      throw new Error('Could not verify job status.')
    }

    if (existingJob) {
      console.warn(`Attempted to start a new training for kid ${kidId}, but an active or completed job already exists with status: ${existingJob.status}`)
      return new NextResponse(
        `A training job for this character is already in progress or has completed with status: ${existingJob.status}.`,
        { status: 409 } // 409 Conflict is the appropriate HTTP status code
      )
    }
    // --- END OF FIX ---

    const { data: kid, error: kidError } = await supabase
      .from('kids')
      .select('name')
      .eq('id', kidId)
      .single()

    if (kidError || !kid) {
      return new NextResponse('Kid not found', { status: 404 })
    }

    const safeName = kid.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const trigger = `${safeName}_${kidId.slice(0, 8)}`

    const zip = new JSZip()
    for (const [idx, url] of imageUrls.entries()) {
      const imageBuffer = await fetchImageAsBuffer(url)
      zip.file(`a_photo_of_${trigger}_${idx}.jpg`, imageBuffer)
    }
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    const { error: uploadError } = await supabase.storage
      .from('raw')
      .upload(`${kidId}.zip`, zipBuffer, {
        contentType: 'application/zip',
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return new NextResponse('Failed to upload training data', { status: 500 })
    }

    const zipUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/raw/${kidId}.zip`

    const destination = await ensureRepo()

    const training = await replicate.trainings.create(
      'replicate',
      'fast-flux-trainer',
      REPLICATE_VERSION_ID,
      {
        destination: destination as `${string}/${string}`,
        input: {
          input_images: zipUrl,
          trigger_word: trigger,
          lora_type: 'subject',
        },
      }
    )

    const modelVersion = training?.model

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        kid_id: kidId,
        replicate_training_id: training.id,
        trigger_word: trigger,
        model_version: modelVersion,
        status: 'training',
      })
      .select('id')
      .single()

    if (jobError) {
      console.error('Failed to insert job record:', jobError)
      return new NextResponse('Failed to create job record', { status: 500 })
    }

    return NextResponse.json({ jobId: job.id })
  } catch (error: unknown) {
    console.error('Training API error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return new NextResponse(message, { status: 500 })
  }
} 