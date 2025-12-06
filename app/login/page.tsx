'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      // Log in existing user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Handle authentication errors
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
    } catch (err) {
      // Handle network errors
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
    <div className="flex justify-center items-center min-h-screen bg-black">
      {/* Fixed iPhone 16 Pro Max container (440x956) */}
      <div className="relative w-[440px] h-[956px] overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F2F7] flex items-center justify-center px-6 py-8">
      {/* Main Container */}
      <div className="w-full max-w-[392px] flex flex-col gap-8">
        {/* Headline with Logo */}
        <div className="relative flex flex-col items-center">
          {/* Egg Logo */}
          <div className="mb-16 flex items-center justify-center">
            <div className="w-[108px] h-[108px] rounded-full shadow-2xl bg-gradient-to-br from-[#FFF085] via-[#FFDF20] to-[#FDC700] flex items-center justify-center rotate-3">
              <div className="-rotate-3 w-[45px] h-[60px] flex items-center justify-center">
                {/* Egg shape with gradient matching Figma */}
                <div 
                  className="w-full h-full" 
                  style={{
                    background: 'linear-gradient(180deg, #692B5F 0%, #7A386B 20%, #8B4475 40%, #9C5280 60%, #AD608C 80%, #C07199 90%, #D282A5 95%, #E593B3 98%, #F8A6C1 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Tamedachi Heading */}
          <h1 className="text-2xl font-bold text-black text-center mb-2">
            Tamedachi
          </h1>
          
          {/* Tagline */}
          <p className="text-base text-black text-center">
            Your media health companion
          </p>
        </div>

        {/* Login Container */}
        <div className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/20 border border-white/30 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Container */}
            <div>
              <label htmlFor="email" className="block text-sm text-[#4a5565] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M2 5l8 5 8-5" stroke="white" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg pl-10 pr-3 py-2 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Container */}
            <div>
              <label htmlFor="password" className="block text-sm text-[#4a5565] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="8" width="14" height="9" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M6 8V5a4 4 0 018 0v3" stroke="white" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg pl-10 pr-3 py-2 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-100/90 border border-red-300 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#FFF085] via-[#FFDF20] to-[#FDC700] hover:shadow-2xl rounded-lg py-2.5 text-sm font-medium text-black shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <Link
              href="/signup"
              className="text-sm text-white/80 underline hover:text-white transition-colors"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="text-sm text-black text-center">
          Navigate your media consumption with confidence
        </p>
      </div>
      </div>
    </div>
  )
}
