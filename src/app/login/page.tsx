'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase-client'
import { createProfile, getProfile } from '@/lib/actions'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = isLogin 
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password)

      if (error) {
        setError(error.message)
      } else if (data.user) {
        if (!isLogin) {
          // After sign-up, create profile
          try {
            await createProfile(data.user.id, data.user.email!)
          } catch (profileError) {
            console.error('Error creating profile:', profileError)
            setError('Profil konnte nicht erstellt werden')
            return
          }
        } else {
          // After login, check if profile exists and has semester
          try {
            const profile = await getProfile(data.user.id)
            if (profile && !profile.semester_id) {
              router.push('/semester-picker')
              return
            }
          } catch (profileError) {
            console.error('Error checking profile:', profileError)
            // Don't show error, just continue to dashboard
          }
        }

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            {isLogin ? 'Willkommen zurück' : 'Konto erstellen'}
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            {isLogin ? 'Melde dich in deinem Praktikumsjournal an' : 'Erstelle dein Praktikumsjournal Konto'}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              {isLogin ? 'Jetzt registrieren' : 'Jetzt anmelden'}
            </button>
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="deine@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Passwort
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Dein Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Lädt...
                  </div>
                ) : (
                  isLogin ? 'Anmelden' : 'Konto erstellen'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
