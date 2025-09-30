'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import { getJournalEntries, deleteJournalEntry } from '@/lib/actions'
import { exportJournalToPDF } from '@/utils/pdfExport'
import LogoutButton from '@/components/LogoutButton'
import BackButton from '@/components/BackButton'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      const data = await getJournalEntries(user.id)
      setEntries(data)
    } catch (error) {
      console.error('Error loading journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entryId: string, entryDate: string) => {
    if (!window.confirm(`Möchtest du den Eintrag vom ${formatDate(entryDate)} wirklich löschen? Dies kann nicht rückgängig gemacht werden.`)) {
      return
    }

    setDeleting(entryId)

    try {
      const user = await getCurrentUser()
      if (!user) return

      await deleteJournalEntry(entryId, user.id)
      await loadEntries() // Reload list
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      alert('Fehler beim Löschen des Eintrags')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getMoodLabel = (value: number) => {
    const labels = ['Sehr schlecht', 'Schlecht', 'Neutral', 'Gut', 'Sehr gut']
    return labels[value - 1] || 'Neutral'
  }

  const getEffortLabel = (value: number) => {
    const labels = ['Sehr wenig', 'Wenig', 'Mittel', 'Viel', 'Sehr viel']
    return labels[value - 1] || 'Mittel'
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
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

  const handleExportSelected = async () => {
    const selected = entries.filter(e => selectedIds.has(e.id))
    for (const entry of selected) {
      await exportJournalToPDF(entry)
      // Small delay between exports to avoid browser issues
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumbs 
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Journal' }
              ]}
              className="text-base"
            />
            <div className="flex items-center space-x-3">
              {selectedIds.size > 0 && (
                <>
                  <button
                    onClick={handleExportSelected}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-2xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {selectedIds.size} {selectedIds.size === 1 ? 'PDF' : 'PDFs'} exportieren
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Auswahl aufheben
                  </button>
                </>
              )}
              <BackButton href="/dashboard" />
              <LogoutButton showEmail />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
          <p className="mt-2 text-gray-600">Deine persönlichen Einträge und Reflexionen</p>
        </div>

        {/* Journal Entries List */}
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Einträge</h3>
            <p className="mt-1 text-sm text-gray-500">Erstelle deinen ersten Journal-Eintrag.</p>
            <div className="mt-6">
              <Link
                href="/journal/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-2xl text-white bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neuen Eintrag erstellen
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Select All Checkbox */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === entries.length && entries.length > 0}
                  onChange={() => {
                    if (selectedIds.size === entries.length) {
                      setSelectedIds(new Set())
                    } else {
                      setSelectedIds(new Set(entries.map(e => e.id)))
                    }
                  }}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  Alle auswählen ({entries.length} {entries.length === 1 ? 'Eintrag' : 'Einträge'})
                </span>
              </label>
            </div>

            {/* Neuer Eintrag Card */}
            <Link
              href="/journal/new"
              className="block bg-white/50 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 hover:shadow-md group"
            >
              <div className="p-6 flex items-center justify-center">
                <div className="flex items-center space-x-3 text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-lg font-medium">Neuer Journal-Eintrag</span>
                </div>
              </div>
            </Link>

            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(entry.id)}
                        onChange={() => toggleSelection(entry.id)}
                        className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(entry.entry_date)}
                        </span>
                        {entry.shared_with_tutor && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Geteilt
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 mb-4">
                        {truncateContent(entry.body)}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="font-medium">Stimmung:</span>
                          <span className="ml-1 text-blue-600">{getMoodLabel(entry.mood)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Anstrengung:</span>
                          <span className="ml-1 text-green-600">{getEffortLabel(entry.effort)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/journal/${entry.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105"
                      >
                        Ansehen
                      </Link>
                      <Link
                        href={`/journal/${entry.id}?edit=true`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105"
                      >
                        Bearbeiten
                      </Link>
                      <button
                        onClick={() => handleDelete(entry.id, entry.entry_date)}
                        disabled={deleting === entry.id}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                      >
                        {deleting === entry.id ? (
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
