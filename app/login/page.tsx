'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError('Please enter both email and password')
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          // Handle authentication errors (Requirement 7.5)
          if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
            setError('An account with this email already exists')
          } else if (signUpError.message.includes('rate limit')) {
            setError('Too many attempts. Please wait a moment and try again.')
          } else if (signUpError.message.includes('network')) {
            setError('No internet connection. Please check your network.')
          } else {
            setError(signUpError.message || 'Failed to create account. Please try again.')
          }
          return
        }

        if (data.user) {
          // Redirect to dashboard after successful signup
          router.push('/dashboard')
        }
      } else {
        // Log in existing user
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          // Handle authentication errors (Requirement 7.5)
          if (signInError.message.includes('Invalid login credentials') || signInError.message.includes('Invalid')) {
            setError('Invalid email or password')
          } else if (signInError.message.includes('Email not confirmed')) {
            setError('Please confirm your email address before logging in')
          } else if (signInError.message.includes('rate limit')) {
            setError('Too many login attempts. Please wait a moment and try again.')
          } else if (signInError.message.includes('network')) {
            setError('No internet connection. Please check your network.')
          } else {
            setError(signInError.message || 'Failed to log in. Please try again.')
          }
          return
        }

        if (data.user) {
          // Redirect to dashboard after successful login
          router.push('/dashboard')
        }
      }
    } catch (err) {
      // Handle network errors (Requirement 7.5)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('No internet connection. Please check your network.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-gradient px-4 py-8 relative overflow-hidden">
      {/* Decorative clouds */}
      <div className="absolute top-10 left-10 text-6xl cloud-decoration animate-pulse">☁️</div>
      <div className="absolute top-20 right-20 text-5xl cloud-decoration animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute bottom-20 left-1/4 text-4xl cloud-decoration animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
      
      <div className="w-full max-w-md space-y-6 md:space-y-8 rounded-3xl bg-white p-6 md:p-8 lg:p-10 shadow-2xl relative z-10">
        {/* Header - responsive sizing */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            🥚 Tamedachi
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-600 font-medium">
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </p>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            Navigate media with confidence 🌟
          </p>
        </div>

        {/* Form - responsive sizing */}
        <form onSubmit={handleSubmit} className="mt-6 md:mt-8 space-y-5 md:space-y-6">
          <div className="space-y-4">
            {/* Email Input - responsive sizing */}
            <div>
              <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border-2 border-gray-200 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Input - responsive sizing */}
            <div>
              <label htmlFor="password" className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border-2 border-gray-200 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error Message - responsive sizing */}
          {error && (
            <div className="rounded-xl bg-red-50 border-2 border-red-200 p-3 md:p-4 text-xs md:text-sm text-red-700 font-medium animate-fade-in">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button - responsive sizing */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 md:py-3.5 text-sm md:text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 touch-manipulation"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : isSignUp ? '🚀 Sign Up' : '🔑 Log In'}
          </button>
        </form>

        {/* Toggle Sign Up / Log In - responsive sizing */}
        <div className="text-center pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-xs md:text-sm text-sky-600 hover:text-sky-700 active:text-sky-800 font-medium hover:underline transition-colors touch-manipulation"
          >
            {isSignUp
              ? '👋 Already have an account? Log in'
              : "✨ Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}
