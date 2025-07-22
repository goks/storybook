import Replicate from 'replicate'

// Version for the fast-flux-trainer model
// from https://replicate.com/replicate/fast-flux-trainer
export const REPLICATE_VERSION_ID = '8b10794665aed907bb98a1a5324cd1d3a8bea0e9b31e65210967fb9c9e2e08ed'

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

type ReplicateError = Error & { response?: { status: number } }

/**
 * Ensures the destination model repository exists on Replicate.
 * Creates it if it doesn't.
 */
export async function ensureRepo() {
  const repo = `${process.env.REPLICATE_USERNAME}/child-book-faces`
  const [owner, name] = repo.split('/')
  
  try {
    // Check if the model repository exists
    await replicate.models.get(owner, name)
  } catch (error: unknown) {
    // If it doesn't exist (404), create it
    if (error instanceof Error && (error as ReplicateError).response?.status === 404) {
      await replicate.models.create(owner, name, {
        visibility: 'private',
        hardware: 'gpu-h100',
        description: 'Child book face models repository'
      })
    } else {
      // Re-throw other errors
      console.error('Error checking or creating Replicate repo:', error)
      throw error
    }
  }
  return repo
} 