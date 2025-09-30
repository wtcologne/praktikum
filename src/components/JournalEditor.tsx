'use client'

import { useState } from 'react'

export interface JournalEntry {
  id?: string
  content: string
  mood: number
  effort: number
  shareWithSupervisor: boolean
  createdAt?: string
  updatedAt?: string
}

interface JournalEditorProps {
  initialData?: Partial<JournalEntry>
  onDataChange?: (data: JournalEntry) => void
  readOnly?: boolean
}

export default function JournalEditor({ 
  initialData = {}, 
  onDataChange,
  readOnly = false 
}: JournalEditorProps) {
  const [data, setData] = useState<JournalEntry>({
    content: '',
    mood: 3,
    effort: 3,
    shareWithSupervisor: false,
    ...initialData
  })

  const updateData = (field: keyof JournalEntry, value: any) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onDataChange?.(newData)
  }

  const getMoodLabel = (value: number) => {
    const labels = ['Sehr schlecht', 'Schlecht', 'Neutral', 'Gut', 'Sehr gut']
    return labels[value - 1] || 'Neutral'
  }

  const getEffortLabel = (value: number) => {
    const labels = ['Sehr wenig', 'Wenig', 'Mittel', 'Viel', 'Sehr viel']
    return labels[value - 1] || 'Mittel'
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
        <h3 className="text-xl font-bold text-gray-900">Journal-Eintrag</h3>
      </div>

      <div className="p-8 space-y-8">
        {/* Textarea für Inhalt */}
        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-900 mb-4">
            Was möchtest du festhalten?
          </label>
          {readOnly ? (
            <div className="min-h-[160px] p-6 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {data.content || 'Kein Inhalt vorhanden'}
              </p>
            </div>
          ) : (
            <textarea
              id="content"
              value={data.content}
              onChange={(e) => updateData('content', e.target.value)}
              placeholder="Schreibe hier deine Gedanken, Erlebnisse oder Reflexionen..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
          )}
        </div>

        {/* Slider für Stimmung */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Wie war deine Stimmung? <span className="text-blue-600 font-bold">({getMoodLabel(data.mood)})</span>
          </label>
          {readOnly ? (
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${(data.mood / 5) * 100}%` }}
                />
              </div>
              <span className="text-lg font-bold text-gray-900 w-12 text-center bg-blue-50 px-3 py-1 rounded-xl">
                {data.mood}/5
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="5"
                value={data.mood}
                onChange={(e) => updateData('mood', parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider shadow-inner"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(data.mood / 5) * 100}%, #e5e7eb ${(data.mood / 5) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          )}
        </div>

        {/* Slider für Anstrengung */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Wie anstrengend war es? <span className="text-green-600 font-bold">({getEffortLabel(data.effort)})</span>
          </label>
          {readOnly ? (
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${(data.effort / 5) * 100}%` }}
                />
              </div>
              <span className="text-lg font-bold text-gray-900 w-12 text-center bg-green-50 px-3 py-1 rounded-xl">
                {data.effort}/5
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="5"
                value={data.effort}
                onChange={(e) => updateData('effort', parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider shadow-inner"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${(data.effort / 5) * 100}%, #e5e7eb ${(data.effort / 5) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          )}
        </div>

        {/* Checkbox für Betreuer:in teilen */}
        <div>
          {readOnly ? (
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                data.shareWithSupervisor 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 shadow-lg' 
                  : 'bg-white border-gray-300'
              }`}>
                {data.shareWithSupervisor && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="ml-3 text-lg font-medium text-gray-900">
                Mit Betreuer:in teilen
              </span>
            </div>
          ) : (
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={data.shareWithSupervisor}
                onChange={(e) => updateData('shareWithSupervisor', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
                data.shareWithSupervisor 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 shadow-lg' 
                  : 'bg-white border-gray-300 group-hover:border-blue-400'
              }`}>
                {data.shareWithSupervisor && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="ml-3 text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                Mit Betreuer:in teilen
              </span>
            </label>
          )}
        </div>

        {/* Zusammenfassung */}
        {readOnly && (
          <div className="bg-gradient-to-br from-gray-50/80 to-white/80 rounded-2xl p-6 border border-gray-200/50">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Zusammenfassung</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-blue-600 font-semibold">Stimmung</div>
                <div className="text-gray-900 font-bold">{getMoodLabel(data.mood)}</div>
                <div className="text-gray-600">({data.mood}/5)</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-green-600 font-semibold">Anstrengung</div>
                <div className="text-gray-900 font-bold">{getEffortLabel(data.effort)}</div>
                <div className="text-gray-600">({data.effort}/5)</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-purple-600 font-semibold">Teilen</div>
                <div className="text-gray-900 font-bold">{data.shareWithSupervisor ? 'Ja' : 'Nein'}</div>
                <div className="text-gray-600">mit Betreuer:in</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
