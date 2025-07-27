'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import storyTemplates from '@/lib/storyTemplates.json'
import Image from 'next/image'

function ResultContent() {
  const searchParams = useSearchParams()
  const imageUrls = searchParams.getAll('imageUrl')
  const templateName = searchParams.get('template')

  // Debug log: show all received image URLs
  if (typeof window !== 'undefined') {
    console.log('Result page imageUrls:', imageUrls)
  }

  // Deduplicate and slice to the first 2 URLs
  const uniqueImageUrls = [...new Set(imageUrls)].slice(0, 2)

  const templates = storyTemplates as Record<string, { prompt: string, text: string }[]>
  const templatePages = templateName ? templates[templateName] : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Your Storybook Pages
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {uniqueImageUrls.map((url, index) => (
            <div key={url} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="relative w-full h-96">
                <Image
                  src={url}
                  alt={`Storybook page ${index + 1}`}
                  fill={true}
                  style={{ objectFit: 'contain' }}
                  className="w-full h-auto"
                />
              </div>
              <p className="p-6 text-gray-700 dark:text-gray-300">
                {templatePages[index]?.text || `Page ${index + 1}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-center p-12">Loading images...</div>}>
      <ResultContent />
    </Suspense>
  )
} 