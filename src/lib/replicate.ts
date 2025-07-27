import Replicate from 'replicate'

// Version for the fast-flux-trainer model
// from https://replicate.com/replicate/fast-flux-trainer
export const REPLICATE_VERSION_ID = '8b10794665aed907bb98a1a5324cd1d3a8bea0e9b31e65210967fb9c9e2e08ed'

// --- Configuration ---
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_USERNAME = process.env.REPLICATE_USERNAME;

if (!REPLICATE_API_TOKEN) {
  throw new Error('The REPLICATE_API_TOKEN environment variable is not set.');
}
if (!REPLICATE_USERNAME) {
    throw new Error('The REPLICATE_USERNAME environment variable is not set.');
}

export const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
})

const REPO_NAME = 'child-book-faces';
const REPO_OWNER = REPLICATE_USERNAME;
const REPO_CONFIG = {
  visibility: 'private' as const,
  hardware: 'gpu-h100' as const,
  description: 'Child book face models repository',
};
// --- End Configuration ---

type ReplicateError = Error & { response?: { status: number } };

function isReplicateNotFoundError(error: unknown): error is ReplicateError {
  return (
    error instanceof Error &&
    'response' in error &&
    typeof (error as { response: unknown }).response === 'object' &&
    (error as { response: { status?: unknown } }).response !== null &&
    (error as { response: { status?: unknown } }).response.status === 404
  );
}

/**
 * Ensures the destination model repository exists on Replicate.
 * Creates it if it doesn't.
 */
export async function ensureRepo() {
  const repo = `${REPO_OWNER}/${REPO_NAME}`
  
  try {
    // Check if the model repository exists
    await replicate.models.get(REPO_OWNER, REPO_NAME)
  } catch (error: unknown) {
    // If it doesn't exist (404), create it
    if (isReplicateNotFoundError(error)) {
      await replicate.models.create(REPO_OWNER, REPO_NAME, REPO_CONFIG)
    } else {
      // Re-throw other errors
      console.error('Error checking or creating Replicate repo:', error)
      throw error
    }
  }
  return repo
}