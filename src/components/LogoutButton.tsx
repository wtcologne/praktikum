'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, getCurrentUser } from '@/lib/supabase-client'
import ProfileModal from './ProfileModal'

interface LogoutButtonProps {
  variant?: 'default' | 'minimal' | 'icon'
  className?: string
  showEmail?: boolean
}

export default function LogoutButton({ variant = 'default', className = '', showEmail = false }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (showEmail) {
      loadUserEmail()
    }
  }, [showEmail])

  const loadUserEmail = async () => {
    const user = await getCurrentUser()
    if (user?.email) {
      setUserEmail(user.email)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Error signing out:', error)
        alert('Fehler beim Abmelden')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Fehler beim Abmelden')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        title="Abmelden"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
      </button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100/50 hover:bg-gray-200/50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
        ) : (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
        Abmelden
      </button>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        {showEmail && userEmail && (
          <button
            onClick={() => setShowProfileModal(true)}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200 cursor-pointer"
          >
            {userEmail}
          </button>
        )}
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${className}`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Abmelden...
            </div>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Abmelden
            </>
          )}
        </button>
      </div>
      
      {showEmail && userEmail && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userEmail={userEmail}
        />
      )}
    </>
  )
}
