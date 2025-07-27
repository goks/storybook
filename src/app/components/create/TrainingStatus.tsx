'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TrainingStatusProps {
  jobId: string
}

interface JobStatus {
  status: 'training' | 'ready' | 'failed'
  progressSeconds?: number
  error?: string
}

export default function TrainingStatus({ jobId }: TrainingStatusProps) {
  const [status, setStatus] = useState<JobStatus>({ status: 'training' })
  const router = useRouter()

  useEffect(() => {
    if (!jobId) return

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/poll?jobId=${jobId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch training status')
        }

        const data: JobStatus = await response.json()
        setStatus(data)

        if (data.status === 'ready') {
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else if (data.status === 'failed') {
          // Stop polling on failure
          clearInterval(interval)
        }
      } catch (err) {
        console.error(err)
        setStatus({ status: 'failed', error: 'An error occurred while polling.' })
        clearInterval(interval)
      }
    }

    const interval = setInterval(pollStatus, 5000)
    pollStatus() // Initial poll

    return () => clearInterval(interval)
  }, [jobId, router])

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="mt-8 rounded-md bg-gray-50 dark:bg-gray-700/50 p-4">
      <div className="flex items-center">
        {/* SVG icons */}
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {status.status === 'training' && 'Training in progress...'}
            {status.status === 'ready' && 'Training complete!'}
            {status.status === 'failed' && 'Training failed'}
          </h3>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            {status.status === 'training' && (
              <p>Elapsed time: {formatTime(status.progressSeconds || 0)}</p>
            )}
            {status.status === 'ready' && <p>Redirecting to dashboard...</p>}
            {status.status === 'failed' && (
              <p className="text-red-600 dark:text-red-400">
                {status.error || 'Something went wrong. Please try again.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 