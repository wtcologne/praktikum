'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import { submitJournalEntry, getProfile } from '@/lib/actions'
import JournalEditor, { JournalEntry } from '@/components/JournalEditor'
import BackButton from '@/components/BackButton'
import LogoutButton from '@/components/LogoutButton'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function NewJournalPage() {
  const [entry, setEntry] = useState<JournalEntry>({
    content: '',
    mood: 3,
    effort: 3,
    shareWithSupervisor: false
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
      
      const userProfile = await getProfile(currentUser.id)
      if (!userProfile || !userProfile.semester_id) {
        setError('Bitte wähle zuerst ein Semester im Dashboard aus')
        return
      }
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading user:', error)
      router.push('/login')
    }
  }

  const handleSave = async () => {
    if (!entry.content.trim()) {
      setError('Bitte gib einen Inhalt ein')
      return
    }

    if (!user || !profile || !profile.semester_id) {
      setError('Benutzerdaten nicht verfügbar')
      return
    }

    setSaving(true)
    setError('')
    
    try {
             await submitJournalEntry({
               author_id: user.id,
               body: entry.content.trim(),
               mood: entry.mood,
               effort: entry.effort,
               shared_with_tutor: entry.shareWithSupervisor,
               semester_id: profile.semester_id
             })
             
             // Redirect nach erfolgreichem Speichern
             router.push('/journal')
             router.refresh()
    } catch (error) {
      console.error('Error saving journal entry:', error)
      setError('Fehler beim Speichern des Eintrags')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
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
                { label: 'Journal', href: '/journal' },
                { label: 'Neu' }
              ]} 
            />
            <div className="flex items-center space-x-3">
              <BackButton href="/journal" />
              <LogoutButton showEmail />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-600 text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Journal Editor */}
        <JournalEditor
          initialData={entry}
          onDataChange={setEntry}
          readOnly={false}
        />

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <BackButton href="/journal" />
          <button
            onClick={handleSave}
            disabled={saving || !entry.content.trim()}
            className="px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  )
}
