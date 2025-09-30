'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import { getJournalEntry, updateJournalEntry, deleteJournalEntry } from '@/lib/actions'
import { exportJournalToPDF } from '@/utils/pdfExport'
import JournalEditor, { JournalEntry } from '@/components/JournalEditor'
import BackButton from '@/components/BackButton'
import LogoutButton from '@/components/LogoutButton'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function JournalDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [entry, setEntry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<JournalEntry>({
    content: '',
    mood: 3,
    effort: 3,
    shareWithSupervisor: false
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      const data = await getJournalEntry(params.id as string, currentUser.id)
      if (!data) {
        router.push('/journal')
        return
      }

      setEntry(data)
      setFormData({
        content: data.body,
        mood: data.mood,
        effort: data.effort,
        shareWithSupervisor: data.shared_with_tutor
      })

      // Check if we should be in edit mode
      if (searchParams.get('edit') === 'true') {
        setEditing(true)
      }
    } catch (error) {
      console.error('Error loading journal entry:', error)
      router.push('/journal')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !entry) return

    setSaving(true)
    setError('')

    try {
      await updateJournalEntry(entry.id, user.id, {
        body: formData.content,
        mood: formData.mood,
        effort: formData.effort,
        shared_with_tutor: formData.shareWithSupervisor
      })
      setEditing(false)
      // Reload data to get updated information
      await loadData()
      router.refresh() // Refresh the router cache
    } catch (error) {
      console.error('Error updating journal entry:', error)
      setError('Fehler beim Speichern des Eintrags')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user || !entry) return

    if (!confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
      return
    }

    try {
      await deleteJournalEntry(entry.id, user.id)
      router.push('/journal')
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      setError('Fehler beim Löschen des Eintrags')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Eintrag nicht gefunden</h1>
          <p className="mt-2 text-gray-600">Dieser Journal-Eintrag existiert nicht oder du hast keinen Zugriff darauf.</p>
          <Link href="/journal" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            Zurück zur Liste
          </Link>
        </div>
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
                { label: 'Eintrag' }
              ]} 
            />
            <div className="flex items-center space-x-3">
              {!editing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportJournalToPDF(entry)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF Export
                  </button>
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Bearbeiten
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Löschen
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    {saving ? 'Speichern...' : 'Speichern'}
                  </button>
                </div>
              )}
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
          initialData={formData}
          onDataChange={setFormData}
          readOnly={!editing}
        />
      </div>
    </div>
  )
}