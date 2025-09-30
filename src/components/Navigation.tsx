'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import LogoutButton from './LogoutButton'

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      // Warte länger, damit die Supabase-Session geladen wird
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) {
    return null // Keine Navigation wenn nicht eingeloggt
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-tight">
                Praktikumsjournal
              </span>
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/observations"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200"
              >
                Beobachtungen
              </Link>
              <Link
                href="/journal"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200"
              >
                Journal
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-sm text-gray-500 font-medium">
              {user.email}
            </div>
            <LogoutButton variant="minimal" />
          </div>
        </div>
      </div>
    </nav>
  )
}
