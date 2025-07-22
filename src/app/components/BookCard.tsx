'use client'

interface BookCardProps {
  name: string
  pdfUrl: string
}

export default function BookCard({ name, pdfUrl }: BookCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}'s Storybook</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">Your personalized storybook is ready!</p>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Download PDF
      </a>
    </div>
  )
} 