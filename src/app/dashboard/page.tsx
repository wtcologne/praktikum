'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase-client'
import LogoutButton from '@/components/LogoutButton'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      // Don't redirect on error, just set loading to false
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-start justify-end">
          <LogoutButton showEmail />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Beobachtungsbögen Kachel */}
          <Link 
            href="/observations"
            className="group relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/90"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  Beobachtungsbögen
                </h3>
                <p className="text-gray-600 mt-2 text-lg">
                  Dokumentiere deine Beobachtungen und Notizen
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center text-blue-600 text-sm font-semibold group-hover:text-blue-700 transition-colors duration-300">
                    Beobachtungen verwalten
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Journal Kachel */}
          <Link 
            href="/journal"
            className="group relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/90"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  Journal
                </h3>
                <p className="text-gray-600 mt-2 text-lg">
                  Führe dein persönliches Tagebuch
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center text-green-600 text-sm font-semibold group-hover:text-green-700 transition-colors duration-300">
                    Journal verwalten
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Schnellzugriff */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Schnellzugriff</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/observations/new"
              className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 text-center hover:bg-white/80"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-blue-600 text-sm font-semibold group-hover:text-blue-700">Neue Beobachtung</div>
            </Link>
            <Link
              href="/journal/new"
              className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 text-center hover:bg-white/80"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-green-600 text-sm font-semibold group-hover:text-green-700">Neuer Eintrag</div>
            </Link>
            <Link
              href="/observations"
              className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 text-center hover:bg-white/80"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-gray-600 text-sm font-semibold group-hover:text-gray-700">Alle Beobachtungen</div>
            </Link>
            <Link
              href="/journal"
              className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 text-center hover:bg-white/80"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="text-gray-600 text-sm font-semibold group-hover:text-gray-700">Alle Einträge</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
