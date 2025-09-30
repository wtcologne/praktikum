'use client'

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg 
              className="w-5 h-5 text-gray-400 mx-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
