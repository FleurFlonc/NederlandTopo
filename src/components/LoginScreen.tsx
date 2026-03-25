import { useState } from 'react'
import { supabase } from '../lib/supabase'

const DOMAIN = '@nederlandtopo.local'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) return
    setLoading(true)
    setError('')

    const email = username.trim().toLowerCase() + DOMAIN
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })

    if (err) {
      setError('Gebruikersnaam of wachtwoord is onjuist.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🇳🇱</div>
          <h1 className="text-2xl font-bold text-gray-800">Nederland Topo</h1>
          <p className="text-gray-400 text-sm mt-1">Log in om te oefenen</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gebruikersnaam
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="jouw naam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-orange-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors mt-2"
          >
            {loading ? 'Bezig…' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}
