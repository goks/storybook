'use client'

import { useState } from 'react'
import Link from 'next/link'

interface KidCardProps {
  name: string
  kidId: string
}

export default function KidCard({ name, kidId }: KidCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center">
        <span className="text-4xl" role="img" aria-label="child emoji">
          👧
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 mt-1">Model is ready to create a story!</p>

      <Link
        href={`/kid/${kidId}/templates`}
        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Generate Book
      </Link>
    </div>
  )
} 