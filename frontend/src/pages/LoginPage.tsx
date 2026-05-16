import React, { useState } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user, signInWithEmail } = useAuth()

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage('Please enter your email address')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await signInWithEmail(email.trim())
      
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Check your email for a sign-in link!')
      }
    } catch (err) {
      setMessage('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ backgroundColor: 'var(--color-origin-surface)' }}>
      <div className="w-full max-w-md">
        <div 
          className="bg-white rounded-lg shadow-sm border p-8"
          style={{ borderColor: 'var(--color-origin-border)' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="wired-nav text-2xl" style={{ color: 'var(--color-origin-ink)' }}>
              NEXUS
            </h1>
            <p className="origin-body mt-2" style={{ color: 'var(--color-origin-body)' }}>
              Sign in to access your documents
            </p>
          </div>

          {/* Sign in form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="origin-label block mb-2" style={{ color: 'var(--color-origin-ink)' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent origin-body"
                style={{ 
                  borderColor: 'var(--color-origin-border)',
                  color: 'var(--color-origin-ink)'
                }}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full origin-button py-3 px-4 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-origin-accent)' }}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center origin-caption ${
              message.includes('Check your email') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="origin-caption" style={{ color: 'var(--color-origin-body)' }}>
              We'll send you a secure sign-in link via email
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
