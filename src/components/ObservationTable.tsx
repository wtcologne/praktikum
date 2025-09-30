'use client'

import { useState } from 'react'

export interface ObservationRow {
  id: string
  time: string
  description: string
  comment: string
}

interface ObservationTableProps {
  initialData?: ObservationRow[]
  onDataChange?: (data: ObservationRow[]) => void
  readOnly?: boolean
  onAddEntry?: (entry: { time: string; description: string; comment: string }) => Promise<void>
  onUpdateEntry?: (entryId: string, updates: { time?: string; description?: string; comment?: string }) => void
  onDeleteEntry?: (entryId: string) => void
  onSave?: () => Promise<void>
}

export default function ObservationTable({ 
  initialData = [], 
  onDataChange,
  readOnly = false,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onSave
}: ObservationTableProps) {
  const [rows, setRows] = useState<ObservationRow[]>(initialData)

  const addRow = () => {
    const newRow: ObservationRow = {
      id: `temp-${Date.now()}`,
      time: '',
      description: '',
      comment: ''
    }
    const newRows = [...rows, newRow]
    setRows(newRows)
    onDataChange?.(newRows)
  }

  const removeRow = (id: string) => {
    const newRows = rows.filter(row => row.id !== id)
    setRows(newRows)
    onDataChange?.(newRows)
  }

  const updateRow = (id: string, field: keyof ObservationRow, value: string) => {
    const newRows = rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    )
    setRows(newRows)
    onDataChange?.(newRows)
  }

  const handleBlur = (id: string, field: keyof ObservationRow, value: string) => {
    // Only auto-save for existing entries (not temp ones)
    if (!id.startsWith('temp-') && onUpdateEntry) {
      const fieldMapping: Record<string, string> = {
        'time': 'time',
        'description': 'description',
        'comment': 'comment'
      }
      onUpdateEntry(id, {
        [fieldMapping[field]]: value
      })
    }
  }

  const saveNewRows = async () => {
    if (!onAddEntry) return
    
    // Find all temp rows that have required data
    const tempRows = rows.filter(r => r.id.startsWith('temp-') && r.time && r.description)
    
    // Save each temp row
    for (const row of tempRows) {
      await onAddEntry({
        time: row.time,
        description: row.description,
        comment: row.comment
      })
    }
    
    // Remove all temp rows after saving
    const newRows = rows.filter(r => !r.id.startsWith('temp-'))
    setRows(newRows)
    onDataChange?.(newRows)
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Beobachtungsbogen</h3>
          {!readOnly && (
            <button
              onClick={addRow}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Zeile hinzufügen
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-gray-50/80 to-white/80">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide w-32">
                Zeit (min)
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                Was ist passiert?
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                Kommentar
              </th>
              {!readOnly && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide w-20">
                  Aktion
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-200/50">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 3 : 4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">Noch keine Einträge vorhanden</p>
                    <p className="text-sm text-gray-400 mt-1">Füge deine erste Beobachtung hinzu</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {readOnly ? (
                      <span className="text-sm font-medium text-gray-900">{row.time || '-'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.time}
                        onChange={(e) => updateRow(row.id, 'time', e.target.value)}
                        onBlur={(e) => handleBlur(row.id, 'time', e.target.value)}
                        placeholder="z.B. 15"
                        className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {readOnly ? (
                      <span className="text-sm text-gray-900">{row.description || '-'}</span>
                    ) : (
                      <textarea
                        value={row.description}
                        onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                        onBlur={(e) => handleBlur(row.id, 'description', e.target.value)}
                        placeholder="Beschreibung der Beobachtung..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {readOnly ? (
                      <span className="text-sm text-gray-900">{row.comment || '-'}</span>
                    ) : (
                      <textarea
                        value={row.comment}
                        onChange={(e) => updateRow(row.id, 'comment', e.target.value)}
                        onBlur={(e) => handleBlur(row.id, 'comment', e.target.value)}
                        placeholder="Zusätzliche Kommentare..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      />
                    )}
                  </td>
                  {!readOnly && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.id.startsWith('temp-') ? (
                        <button
                          onClick={() => removeRow(row.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                          title="Zeile entfernen"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      ) : (
                        onDeleteEntry && (
                          <button
                            onClick={() => onDeleteEntry(row.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                            title="Zeile löschen"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-white/80 border-t border-gray-200/50">
          <div className="text-sm font-medium text-gray-700">
            {rows.length} {rows.length === 1 ? 'Eintrag' : 'Einträge'} gesamt
          </div>
        </div>
      )}
    </div>
  )
}
