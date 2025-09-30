'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase-client'
import { getProfile } from '@/lib/actions'

interface AuthGuardProps {
  children: React.ReactNode
  requireSemester?: boolean
}

export default function AuthGuard({ children, requireSemester = false }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const publicRoutes = ['/', '/login']

  useEffect(() => {
    if (publicRoutes.includes(pathname)) {
      setLoading(false)
      return
    }

    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Get profile - don't redirect on error, just log it
      try {
        const userProfile = await getProfile(currentUser.id)
        if (userProfile) {
          setProfile(userProfile)

          // Check if semester is required but not set
          if (requireSemester && !userProfile.semester_id) {
            router.push('/semester-picker')
            return
          }
        } else {
          console.warn('Profile not found for user:', currentUser.id)
          // Don't redirect, just continue without profile
        }
      } catch (profileError) {
        console.error('Error loading profile:', profileError)
        // Don't redirect on profile error, just continue
      }

    } catch (error) {
      console.error('Auth check error:', error)
      // Don't redirect on auth error, just continue
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lädt...</p>
        </div>
      </div>
    )
  }

  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
