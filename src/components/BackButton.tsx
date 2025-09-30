'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BackButtonProps {
  href?: string
  variant?: 'default' | 'minimal' | 'icon'
  className?: string
  children?: React.ReactNode
}

export default function BackButton({ 
  href, 
  variant = 'default', 
  className = '',
  children = 'Zurück'
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        title="Zurück"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100/50 hover:bg-gray-200/50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {children}
      </button>
    )
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-2xl text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${className}`}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {children}
      </Link>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-2xl text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${className}`}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {children}
    </button>
  )
}
