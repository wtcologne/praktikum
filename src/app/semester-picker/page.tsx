'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase-client'
import { updateProfileSemester } from '@/lib/actions'

export default function SemesterPickerPage() {
  const [selectedSemester, setSelectedSemester] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSemester) {
      setError('Bitte wähle ein Semester aus')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
        return
      }

      await updateProfileSemester(user.id, selectedSemester)
      router.push('/dashboard')
    } catch (err) {
      console.error('Error updating semester:', err)
      setError('Fehler beim Speichern des Semesters')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Semester wählen
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Bitte wähle dein aktuelles Semester aus
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Welches Semester absolvierst du?
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="semester"
                    value="SS25"
                    checked={selectedSemester === 'SS25'}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-lg font-medium text-gray-900">Sommersemester 2025</div>
                    <div className="text-sm text-gray-500">April - September 2025</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="semester"
                    value="WS25"
                    checked={selectedSemester === 'WS25'}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-lg font-medium text-gray-900">Wintersemester 2025/26</div>
                    <div className="text-sm text-gray-500">Oktober 2025 - März 2026</div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="text-red-600 text-sm text-center font-medium">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || !selectedSemester}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Speichern...
                  </div>
                ) : (
                  'Semester speichern'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
