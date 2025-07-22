import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { replicate } from '@/lib/replicate'
import storyTemplates from '@/lib/storyTemplates.json'

export const dynamic = 'force-dynamic'

// Helper function to poll for prediction completion
async function pollPrediction(predictionId: string): Promise<any> {
  let prediction
  do {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between polls
    prediction = await replicate.predictions.get(predictionId)
  } while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled')
  return prediction
}

async function createPredictionWithRetry(model: string, version: string, input: object): Promise<any> {
  try {
    return await replicate.predictions.create({ model, version, input });
  } catch (error: any) {
    if (error.response && error.response.status >= 500) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[DEBUG] Replicate returned 5xx, retrying once...');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await replicate.predictions.create({ model, version, input });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { kidId, templateName } = await request.json()
  if (!kidId || !templateName) {
    return new NextResponse('kidId and templateName are required', { status: 400 })
  }

  try {
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('model_version, trigger_word')
      .eq('kid_id', kidId)
      .eq('status', 'ready')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (jobError || !job) {
      return new NextResponse('Ready job not found for this kid', { status: 404 })
    }

    const templates = storyTemplates as Record<string, { prompt: string, text: string }[]>
    const template = templates[templateName]
    if (!template) {
      return new NextResponse('Template not found', { status: 404 })
    }

    const imageGenerationPromises = template.map(async (page) => {
      const fullPrompt = `${job.trigger_word}, ${page.prompt}`
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Generating image with prompt: "${fullPrompt}" for model ${job.model_version}`)
      }
      
      const [ownerRepo, hash] = job.model_version.split(':')
      
      const prediction = await createPredictionWithRetry(
        ownerRepo,
        hash,
        { 
          prompt: fullPrompt,
          lora_scale: 1.25
        }
      )
      
      const completedPrediction = await pollPrediction(prediction.id)

      if (completedPrediction.status !== 'succeeded') {
        throw new Error(`Prediction failed for prompt: ${fullPrompt}`)
      }
      
      const imageUrl = completedPrediction.output[0]
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] Got image URL: ${imageUrl}`)
      }
      
      return imageUrl
    })

    const images = await Promise.all(imageGenerationPromises)
    const finalImages = images.slice(0, template.length)
    return NextResponse.json({ images: finalImages })

  } catch (error: any) {
    console.error('Image generation error:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
} 