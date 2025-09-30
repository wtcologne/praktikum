'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import { getObservationForms, deleteObservationForm } from '@/lib/actions'
import { exportObservationToPDF } from '@/utils/pdfExport'
import LogoutButton from '@/components/LogoutButton'
import BackButton from '@/components/BackButton'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function ObservationsPage() {
  const [observations, setObservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadObservations()
  }, [])

  const loadObservations = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      const data = await getObservationForms(user.id)
      setObservations(data)
    } catch (error) {
      console.error('Error loading observations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (observationId: string, observationName: string) => {
    if (!window.confirm(`Möchtest du "${observationName}" wirklich löschen? Dies kann nicht rückgängig gemacht werden.`)) {
      return
    }

    setDeleting(observationId)

    try {
      const user = await getCurrentUser()
      if (!user) return

      await deleteObservationForm(observationId, user.id)
      await loadObservations() // Reload list
    } catch (error) {
      console.error('Error deleting observation:', error)
      alert('Fehler beim Löschen des Beobachtungsbogens')
    } finally {
      setDeleting(null)
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

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleAll = () => {
    if (selectedIds.size === observations.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(observations.map(o => o.id)))
    }
  }

  const handleExportSelected = async () => {
    const selected = observations.filter(o => selectedIds.has(o.id))
    for (const obs of selected) {
      await exportObservationToPDF(obs, obs.observation_entries || [])
      // Small delay between exports to avoid browser issues
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <Breadcrumbs 
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Beobachtungsbögen' }
              ]}
              className="text-base"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {selectedIds.size > 0 && (
                <>
                  <button
                    onClick={handleExportSelected}
                    className="btn-mobile inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">{selectedIds.size} {selectedIds.size === 1 ? 'PDF' : 'PDFs'} exportieren</span>
                    <span className="sm:hidden">{selectedIds.size} PDFs</span>
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="btn-mobile inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <span className="hidden sm:inline">Auswahl aufheben</span>
                    <span className="sm:hidden">Abbrechen</span>
                  </button>
                </>
              )}
              <div className="flex space-x-2">
                <BackButton href="/dashboard" />
                <LogoutButton showEmail />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Beobachtungsbögen</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Verwalte deine Beobachtungen und Notizen</p>
        </div>

        {/* Observations List */}
        {observations.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Beobachtungen</h3>
            <p className="mt-1 text-sm text-gray-500">Erstelle deine erste Beobachtung.</p>
            <div className="mt-6">
                     <Link
                       href="/observations/new"
                       className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                     >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neue Beobachtung erstellen
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Select All Checkbox */}
            <div className="card-mobile bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === observations.length && observations.length > 0}
                  onChange={toggleAll}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-mobile font-medium text-gray-700">
                  Alle auswählen ({observations.length} {observations.length === 1 ? 'Beobachtung' : 'Beobachtungen'})
                </span>
              </label>
            </div>

            {/* Neuer Eintrag Card */}
            <Link
              href="/observations/new"
              className="block bg-white/50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 hover:shadow-md group"
            >
              <div className="p-6 flex items-center justify-center">
                <div className="flex items-center space-x-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-lg font-medium">Neue Beobachtung</span>
                </div>
              </div>
            </Link>

            {observations.map((observation) => (
              <div
                key={observation.id}
                className="card-mobile bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(observation.id)}
                          onChange={() => toggleSelection(observation.id)}
                          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {observation.school} - Klasse {observation.grade}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Erstellt am {formatDate(observation.created_at)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {observation.observation_entries?.length || 0} {observation.observation_entries?.length === 1 ? 'Eintrag' : 'Einträge'} • {observation.duration} Minuten
                        </p>
                        {observation.class_comment && (
                          <p className="text-sm text-gray-500 mt-1 italic">
                            "{observation.class_comment}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                               <Link
                                 href={`/observations/${observation.id}`}
                                 className="btn-mobile inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
                               >
                                 Ansehen
                               </Link>
                               <Link
                                 href={`/observations/${observation.id}?edit=true`}
                                 className="btn-mobile inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
                               >
                                 Bearbeiten
                               </Link>
                        <button
                          onClick={() => handleDelete(observation.id, `${observation.school} - ${observation.grade}`)}
                          disabled={deleting === observation.id}
                          className="btn-mobile inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                        >
                          {deleting === observation.id ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Löschen...
                            </>
                          ) : (
                          'Löschen'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
