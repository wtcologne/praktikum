'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/supabase-client'
import { getProfile, updateProfileSemester, updateProfileName } from '@/lib/actions'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export default function ProfileModal({ isOpen, onClose, userEmail }: ProfileModalProps) {
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState('')
  const [semester, setSemester] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadProfile()
    }
  }, [isOpen])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (user) {
        const profileData = await getProfile(user.id)
        setProfile(profileData)
        setName(profileData?.name || '')
        setSemester(profileData?.semester_id || '')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const user = await getCurrentUser()
      if (!user) return

      // Update name
      if (name !== profile?.name) {
        await updateProfileName(user.id, name)
      }

      // Update semester
      if (semester !== profile?.semester_id) {
        await updateProfileSemester(user.id, semester)
      }

      // Reload profile
      await loadProfile()
      onClose()
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Fehler beim Speichern des Profils')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Profil bearbeiten</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
                  {userEmail}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dein Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="ss25">SS25</option>
                  <option value="ws25">WS25/26</option>
                  <option value="ss26">SS26</option>
                  <option value="ws26">WS26/27</option>
                </select>
              </div>

              {/* Role (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rolle
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
                  {profile?.role === 'intern' ? 'Praktikant:in' : profile?.role || '-'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  )
}
