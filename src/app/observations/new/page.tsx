'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import { getProfile } from '@/lib/actions'
import ObservationTable, { ObservationRow } from '@/components/ObservationTable'
import BackButton from '@/components/BackButton'
import LogoutButton from '@/components/LogoutButton'
import Breadcrumbs from '@/components/Breadcrumbs'
import { submitObservationForm } from '@/lib/actions'

export default function NewObservationPage() {
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [duration, setDuration] = useState(45)
  const [classComment, setClassComment] = useState('')
  const [rows, setRows] = useState<ObservationRow[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      const userProfile = await getProfile(currentUser.id)
      if (!userProfile) {
        router.push('/login')
        return
      }
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading user data:', error)
      router.push('/login')
    }
  }

  const handleSave = async () => {
    if (!school.trim() || !grade.trim()) {
      setError('Bitte fülle alle Pflichtfelder aus')
      return
    }

    if (!user || !profile) {
      setError('Benutzerdaten nicht verfügbar')
      return
    }

    setSaving(true)
    setError('')
    
    try {
             await submitObservationForm({
               school: school.trim(),
               grade: grade.trim(),
               duration,
               class_comment: classComment.trim(),
               semester_id: profile.semester_id,
               author_id: user.id,
               entries: rows.map(row => ({
                 time: row.time,
                 description: row.description,
                 comment: row.comment
               }))
             })
             
             // Redirect nach erfolgreichem Speichern
             router.push('/observations')
             router.refresh()
    } catch (error) {
      console.error('Error saving observation:', error)
      setError('Fehler beim Speichern der Beobachtung')
    } finally {
      setSaving(false)
    }
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Breadcrumbs 
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Beobachtungsbögen', href: '/observations' },
                { label: 'Neu' }
              ]} 
            />
            <div className="flex items-center space-x-3">
              <BackButton href="/observations" />
              <LogoutButton showEmail />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grundinformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                  Schule *
                </label>
                       <input
                         type="text"
                         id="school"
                         value={school}
                         onChange={(e) => setSchool(e.target.value)}
                         placeholder="Name der Schule"
                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                         required
                       />
              </div>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  Klasse *
                </label>
                       <input
                         type="text"
                         id="grade"
                         value={grade}
                         onChange={(e) => setGrade(e.target.value)}
                         placeholder="z.B. 3a, 5b"
                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                         required
                       />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Dauer (Minuten)
                </label>
                       <input
                         type="number"
                         id="duration"
                         value={duration}
                         onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                         min="1"
                         max="480"
                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                       />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="classComment" className="block text-sm font-medium text-gray-700 mb-2">
                  Klassenkommentar
                </label>
                       <textarea
                         id="classComment"
                         value={classComment}
                         onChange={(e) => setClassComment(e.target.value)}
                         placeholder="Allgemeine Bemerkungen zur Klasse..."
                         rows={3}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                       />
              </div>
            </div>
          </div>

          {/* Observation Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Beobachtungseinträge</h3>
            <ObservationTable
              initialData={rows}
              onDataChange={setRows}
              readOnly={false}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600 text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 mt-8">
          <BackButton href="/observations" />
          <button
            onClick={handleSave}
            disabled={saving || !school.trim() || !grade.trim()}
            className="px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  )
}
