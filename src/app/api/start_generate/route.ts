import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { replicate } from '@/lib/replicate'
// import storyTemplate from '@/lib/storyTemplate.json' - Removed static import

export const dynamic = 'force-dynamic'

async function generateImage(prompt: string, modelVersion: string): Promise<{bytes: Buffer, type: 'png' | 'jpeg'}> {
  const identifier = modelVersion as `${string}/${string}:${string}`
  const output = (await replicate.run(identifier, {
    input: { prompt },
  })) as string[]

  if (!output || !output[0]) {
    throw new Error('Image generation failed to produce an output.')
  }
  
  const imageUrl = output[0]
  const response = await fetch(imageUrl, { headers: { Accept: 'image/png,*/*' } })

  if (!response.ok) {
    throw new Error(`Failed to fetch generated image: ${response.statusText}`)
  }

  const contentType = response.headers.get('content-type')
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEBUG] img content-type', contentType)
    const buf = new Uint8Array(arrayBuffer)
    console.log('[DEBUG] img first 8 bytes', buf.slice(0, 8))
  }
  
  const imageType = contentType === 'image/png' ? 'png' : 'jpeg'

  return { bytes: buffer, type: imageType }
}

export async function POST(request: Request) {
<<<<<<< HEAD
  const supabaseCookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: async () => supabaseCookieStore })
=======
  // Pass the cookies helper directly as expected by the Supabase client.
  const supabase = createRouteHandlerClient({ cookies })
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { kidId, templateName } = await request.json()
  if (!kidId) return new NextResponse('Kid ID is required', { status: 400 })
  if (!templateName) return new NextResponse('Template name is required', { status: 400 })

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Received request to generate book for kidId: ${kidId}`)
  }

  try {
    const query = supabase
      .from('jobs')
      .select('id, status, model_version, trigger_word')
      .eq('kid_id', kidId)
      .order('updated_at', { ascending: false })
      .limit(1)
      
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Executing query for latest job:`, query)
    }

    const { data: job, error: jobError } = await query.single()

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Query result:`, {
        jobExists: !!job,
        rowCount: job ? 1 : 0,
        job: job ? { id: job.id, status: job.status, model_version: job.model_version, trigger_word: job.trigger_word } : null,
        error: jobError,
      })
    }
    
    if (jobError || !job) {
      if (jobError && jobError.code !== 'PGRST116') { // Ignore "exact one row" error for logging
        console.error('[DEBUG] Supabase error fetching job:', jobError)
      }
      return new NextResponse('Ready job not found', { status: 404 })
    }
    if (job.status !== 'ready') {
      return new NextResponse(`Job is not ready (status: ${job.status})`, { status: 400 })
    }
    
    await supabase.from('jobs').update({ status: 'generating' }).eq('kid_id', kidId)
    
    const { data: kid } = await supabase.from('kids').select('name').eq('id', kidId).single()
    const childName = kid?.name || 'the child'

    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const { default: storyTemplates } = await import('@/lib/storyTemplates.json')
    const storyTemplate = storyTemplates[templateName as keyof typeof storyTemplates]

<<<<<<< HEAD
    // Collect image URLs for results page
    const imageUrls: string[] = [];
    for (const pageData of storyTemplate) {
      const text = pageData.text.replace('{child_name}', childName)
      const prompt = `storybook illustration of ${text}, featuring a photo of ${job.trigger_word}`
      // Generate image and get URL
      const output = (await replicate.run(job.model_version as `${string}/${string}:${string}`, {
        input: { prompt },
      })) as string[];
      if (output && output[0]) {
        imageUrls.push(output[0]);
      }
      // ...existing PDF logic...
      const { bytes: imageBytes, type: imageType } = await generateImage(prompt, job.model_version)
=======
    for (const pageData of storyTemplate) {
      const text = pageData.text.replace('{child_name}', childName)
      const prompt = `storybook illustration of ${text}, featuring a photo of ${job.trigger_word}`
      
      const { bytes: imageBytes, type: imageType } = await generateImage(prompt, job.model_version)
      
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
      let image
      if (imageType === 'png') {
        image = await pdfDoc.embedPng(imageBytes)
      } else {
        image = await pdfDoc.embedJpg(imageBytes)
      }
<<<<<<< HEAD
      const page = pdfDoc.addPage()
      const { width, height } = page.getSize()
      const imageDims = image.scale(0.5)
=======

      const page = pdfDoc.addPage()
      const { width, height } = page.getSize()
      const imageDims = image.scale(0.5)

>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
      page.drawImage(image, {
        x: (width - imageDims.width) / 2,
        y: height - imageDims.height - 50,
        width: imageDims.width,
        height: imageDims.height,
      })
<<<<<<< HEAD
=======
      
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
      page.drawText(text, {
        x: 50,
        y: 100,
        font,
        size: 18,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
      })
    }
<<<<<<< HEAD
    const pdfBytes = await pdfDoc.save()
    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(`${kidId}.pdf`, pdfBytes, { contentType: 'application/pdf', upsert: true })
    if (uploadError) throw uploadError
    const { data: { publicUrl } } = supabase.storage.from('books').getPublicUrl(`${kidId}.pdf`)
    await supabase.from('books').insert({ kid_id: kidId, pdf_url: publicUrl, status: 'completed' })
    await supabase.from('jobs').update({ status: 'completed' }).eq('kid_id', kidId)
    // Return both PDF and image URLs for results page
    return NextResponse.json({ pdfUrl: publicUrl, imageUrls })
=======
    
    const pdfBytes = await pdfDoc.save()
    
    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(`${kidId}.pdf`, pdfBytes, { contentType: 'application/pdf', upsert: true })

    if (uploadError) throw uploadError
    
    const { data: { publicUrl } } = supabase.storage.from('books').getPublicUrl(`${kidId}.pdf`)

    await supabase.from('books').insert({ kid_id: kidId, pdf_url: publicUrl, status: 'completed' })
    await supabase.from('jobs').update({ status: 'completed' }).eq('kid_id', kidId)

    return NextResponse.json({ pdfUrl: publicUrl })
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b

  } catch (error: unknown) {
    console.error('Generation error:', error)
    await supabase.from('jobs').update({ status: 'failed' }).eq('kid_id', kidId)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return new NextResponse(message, { status: 500 })
  }
} 