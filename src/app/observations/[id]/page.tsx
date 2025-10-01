'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import { getObservationForm, updateObservationForm, addObservationEntry, updateObservationEntry, deleteObservationEntry, deleteObservationForm } from '@/lib/actions'
import { exportObservationToPDF } from '@/utils/pdfExport'
import ObservationTable, { ObservationRow } from '@/components/ObservationTable'
import BackButton from '@/components/BackButton'
import LogoutButton from '@/components/LogoutButton'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function ObservationDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [observation, setObservation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    school: '',
    grade: '',
    duration: 45,
    class_comment: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const tempRowsRef = useRef<any[]>([])

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

      const data = await getObservationForm(params.id as string, currentUser.id)
      if (!data) {
        router.push('/observations')
        return
      }

      setObservation(data)
      setFormData({
        school: data.school,
        grade: data.grade,
        duration: data.duration,
        class_comment: data.class_comment || ''
      })

      // Check if we should be in edit mode
      if (searchParams.get('edit') === 'true') {
        setEditing(true)
      }
    } catch (error) {
      console.error('Error loading observation:', error)
      router.push('/observations')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveForm = async () => {
    if (!user || !observation) return

    setSaving(true)
    setError('')

    console.log('Saving form with data:', formData)

    try {
      // First, save any new table rows (temp rows)
      const tempRows = tempRowsRef.current
      
      for (const row of tempRows) {
        if (row.time && row.description) {
          await handleAddEntry({
            time: row.time,
            description: row.description,
            comment: row.comment || ''
          })
        }
      }
      
      // Then update the form
      const result = await updateObservationForm(observation.id, user.id, formData)
      console.log('Update result:', result)
      
      // Clear temp rows
      tempRowsRef.current = []
      
      setEditing(false)
      // Reload data to get updated information
      await loadData()
      router.refresh() // Refresh the router cache
    } catch (error) {
      console.error('Error updating observation:', error)
      setError('Fehler beim Speichern der Beobachtung')
    } finally {
      setSaving(false)
    }
  }

  const handleAddEntry = async (entry: { time: string; description: string; comment: string }) => {
    if (!user || !observation) return

    try {
      await addObservationEntry(observation.id, user.id, entry)
      await loadData() // Reload to get updated entries
      router.refresh() // Refresh the router cache
    } catch (error) {
      console.error('Error adding entry:', error)
      setError('Fehler beim Hinzufügen des Eintrags')
    }
  }

  const handleUpdateEntry = async (entryId: string, updates: { time?: string; description?: string; comment?: string }) => {
    if (!user) return

    try {
      await updateObservationEntry(entryId, user.id, updates)
      await loadData() // Reload to get updated entries
      router.refresh() // Refresh the router cache
    } catch (error) {
      console.error('Error updating entry:', error)
      setError('Fehler beim Aktualisieren des Eintrags')
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return

    if (!window.confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
      return
    }

    try {
      await deleteObservationEntry(entryId, user.id)
      await loadData() // Reload to get updated entries
      router.refresh() // Refresh the router cache
    } catch (error) {
      console.error('Error deleting entry:', error)
      setError('Fehler beim Löschen des Eintrags')
    }
  }

  const handleDeleteForm = async () => {
    if (!user || !observation) return

    if (!window.confirm('Möchtest du diesen Beobachtungsbogen wirklich löschen? Dies kann nicht rückgängig gemacht werden.')) {
      return
    }

    setSaving(true)
    setError('')

    try {
      await deleteObservationForm(observation.id, user.id)
      router.push('/observations')
      router.refresh()
    } catch (error) {
      console.error('Error deleting observation form:', error)
      setError('Fehler beim Löschen des Beobachtungsbogens')
    } finally {
      setSaving(false)
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

  if (!observation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Beobachtung nicht gefunden</h1>
          <p className="mt-2 text-gray-600">Diese Beobachtung existiert nicht oder du hast keinen Zugriff darauf.</p>
          <Link href="/observations" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
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
          <Breadcrumbs 
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Beobachtungsbögen', href: '/observations' },
              { label: 'Eintrag' }
            ]} 
          />
          
          {/* Action Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <BackButton href="/observations" />
            <div className="flex items-center space-x-3">
              {!editing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportObservationToPDF(observation, observation.observation_entries || [])}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF Export
                  </button>
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Bearbeiten
                  </button>
                  <button
                    onClick={handleDeleteForm}
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
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveForm}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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

        {/* Form Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grundinformationen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schule</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{observation.school}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Klasse</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{observation.grade}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dauer (Minuten)</label>
              {editing ? (
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{observation.duration}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Klassenkommentar</label>
              {editing ? (
                <textarea
                  value={formData.class_comment}
                  onChange={(e) => setFormData({ ...formData, class_comment: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              ) : (
                <p className="text-gray-900">{observation.class_comment || 'Kein Kommentar'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Observation Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Beobachtungseinträge</h3>
          <ObservationTable
            initialData={observation.observation_entries?.map((entry: any) => ({
              id: entry.id,
              time: entry.time_min || '',
              description: entry.happened || '',
              comment: entry.comment || ''
            })) || []}
            onDataChange={(data) => {
              // Track temp rows
              tempRowsRef.current = data.filter(r => r.id.startsWith('temp-'))
            }}
            readOnly={!editing}
            onAddEntry={editing ? handleAddEntry : undefined}
            onUpdateEntry={editing ? handleUpdateEntry : undefined}
            onDeleteEntry={editing ? handleDeleteEntry : undefined}
          />
        </div>
      </div>
    </div>
  )
}