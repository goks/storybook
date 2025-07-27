'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TemplateSelectorProps {
  kidId: string
}

const templates = [
  { name: 'jungle', title: 'Jungle Adventure', icon: '🐯' },
  { name: 'space', title: 'Space Adventure', icon: '🚀' },
]

export default function TemplateSelector({ kidId }: TemplateSelectorProps) {
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null)
  const router = useRouter()

  const handleSelect = async (templateName: string) => {
    setLoadingTemplate(templateName)
    try {
      const response = await fetch('/api/generate_images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kidId, templateName }),
      })

      if (!response.ok) {
<<<<<<< HEAD
        // The API returns plain text for errors, so we use .text()
        const errorText = await response.text().catch(() => 'Image generation failed')
        throw new Error(errorText)
      }

      // The API route should return image URLs. We append them to the redirect query string.
      const { images } = await response.json()
      console.log('TemplateSelector redirect images:', images)
      const searchParams = new URLSearchParams()
      searchParams.set('template', templateName)
      if (Array.isArray(images) && images.length > 0) {
        images.forEach(url => searchParams.append('imageUrl', url))
        router.push(`/kid/${kidId}/result?${searchParams.toString()}`)
      } else {
        alert('No images were generated. Please try again.')
        setLoadingTemplate(null)
      }
=======
        throw new Error('Image generation failed')
      }

      const { images } = await response.json()
      
      const queryParams = new URLSearchParams()
      images.forEach((url: string) => queryParams.append('imageUrl', url))
      
      router.push(`/kid/${kidId}/result?template=${templateName}&${queryParams.toString()}`)

>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
    } catch (error) {
      console.error('Failed to generate images:', error)
      alert('Something went wrong. Please try again.')
      setLoadingTemplate(null)
    }
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {templates.map((template) => (
        <button
          key={template.name}
          onClick={() => handleSelect(template.name)}
          disabled={!!loadingTemplate}
          className="relative flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-6xl mb-4">{template.icon}</div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{template.title}</h4>
          {loadingTemplate === template.name && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
              <p className="text-gray-800 dark:text-gray-200">Generating...</p>
            </div>
          )}
        </button>
      ))}
    </div>
  )
} 