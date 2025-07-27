<<<<<<< HEAD
"use client"

import { createClient } from '@/lib/supabase/client'
=======
'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
import { useState, useRef } from 'react'
import TrainingStatus from './TrainingStatus'

interface CreateKidFormProps {
  userId: string
}

<<<<<<< HEAD

=======
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
export default function CreateKidForm({ userId }: CreateKidFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const files = Array.from(formData.getAll('images')) as File[]
<<<<<<< HEAD

=======
      
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
      if (files.length < 8 || files.length > 12) {
        throw new Error('Please upload between 8 and 12 images')
      }

<<<<<<< HEAD
      // Create a client instance for Supabase
      const supabase = createClient()

      // Create kid record in Supabase
=======
      // Create kid record in Supabase
      const supabase = createBrowserSupabaseClient()
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
      const { data: kid, error: kidError } = await supabase
        .from('kids')
        .insert({
          user_id: userId,
          name: formData.get('child_name'),
          age: parseInt(formData.get('age') as string),
          gender: formData.get('gender'),
        })
        .select()
        .single()

      if (kidError) throw kidError

      // Upload images to Supabase storage
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
          const { error: uploadError } = await supabase.storage
            .from('raw')
            .upload(`${kid.id}/${filename}`, file)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('raw')
            .getPublicUrl(`${kid.id}/${filename}`)

          return publicUrl
        })
      )

      // Start training process
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kidId: kid.id, imageUrls }),
      })

      if (!response.ok) {
        throw new Error('Failed to start training process')
      }

      const { jobId: newJobId } = await response.json()
      setJobId(newJobId)
      formRef.current?.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="child_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Child&apos;s Name
          </label>
          <input
            type="text"
            name="child_name"
            id="child_name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 shadow-sm focus:border-black dark:focus:border-white focus:outline-none focus:ring-black dark:focus:ring-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Age
          </label>
          <input
            type="number"
            name="age"
            id="age"
            min="1"
            max="12"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 shadow-sm focus:border-black dark:focus:border-white focus:outline-none focus:ring-black dark:focus:ring-white sm:text-sm"
          />
<<<<<<< HEAD
        </div> 
=======
        </div>
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-black dark:focus:border-white focus:outline-none focus:ring-black dark:focus:ring-white sm:text-sm"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Photos (8-12 images)
          </label>
          <div className="mt-1">
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              required
              className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Upload 8-12 clear photos of your child&apos;s face from different angles
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-200">{error}</div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md bg-black dark:bg-white px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Create Character'}
        </button>
      </form>

      {jobId && <TrainingStatus jobId={jobId} />}
    </div>
  )
} 