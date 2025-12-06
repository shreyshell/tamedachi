'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
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

    if (password !== confirmPassword) {
      setError('Passwords do not match')
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
      // Sign up new user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        // Handle authentication errors
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please log in instead.')
        } else if (signUpError.message.includes('rate limit')) {
          setError('Too many sign up attempts. Please wait a moment and try again.')
        } else if (signUpError.message.includes('network')) {
          setError('No internet connection. Please check your network.')
        } else {
          setError(signUpError.message || 'Failed to sign up. Please try again.')
        }
        return
      }

      if (data.user) {
        // Redirect to dashboard after successful sign up
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
      <div className="relative w-[440px] h-[956px] overflow-hidden bg-gradient-to-b from-[#b7bffb] to-[#ffc2c2]">
        {/* Main Container - Positioned exactly as in Figma (same as login) */}
        <div 
          className="absolute flex flex-col"
          style={{
            left: '24px',
            top: '201.36px',
            width: '392.18px',
            gap: '31.99px'
          }}
        >
          {/* Headline with Logo */}
          <div className="relative" style={{ height: '167.98px' }}>
            {/* Logo */}
            <div 
              className="absolute flex items-center justify-center"
              style={{
                left: '148px',
                top: '-43.78px',
                width: '107.43px',
                height: '107.43px'
              }}
            >
              <div 
                className="flex items-center justify-center rounded-full shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
                style={{
                  width: '101.55px',
                  height: '101.55px',
                  background: 'linear-gradient(135deg, #FFF085 0%, #FFDF20 50%, #FDC700 100%)',
                  transform: 'rotate(3.42deg)'
                }}
              >
                <div style={{ transform: 'rotate(-3.42deg)' }}>
                  <img src="/egg-base.svg" alt="" style={{ width: '45px', height: '60px' }} />
                </div>
              </div>
            </div>
            
            {/* Tamedachi Heading */}
            <p 
              className="absolute text-center text-black font-normal"
              style={{
                left: '50%',
                top: '101.99px',
                transform: 'translateX(-50%)',
                fontSize: '24px',
                lineHeight: '24px',
                fontFamily: 'Fredoka, sans-serif',
                textShadow: '0px 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              Tamedachi
            </p>
            
            {/* Tagline */}
            <p 
              className="absolute text-center text-black font-normal whitespace-nowrap"
              style={{
                left: '50%',
                top: '143.98px',
                transform: 'translateX(-50%)',
                fontSize: '16px',
                lineHeight: '24px',
                fontFamily: 'Fredoka, sans-serif',
                textShadow: '0px 1px 4px rgba(0,0,0,0.1)'
              }}
            >
              Your media health companion
            </p>
          </div>

          {/* Sign Up Container */}
          <div 
            className="relative rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            style={{
              height: '389.31px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Sign Up Details */}
              <div 
                className="absolute flex flex-col"
                style={{
                  left: '32.68px',
                  top: '32.68px',
                  width: '326.82px',
                  gap: '20px'
                }}
              >
                {/* Email Container */}
                <div style={{ height: '59.99px' }}>
                  <label 
                    htmlFor="email"
                    className="block font-normal text-[#4a5565]"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontFamily: 'Fredoka, sans-serif',
                      marginBottom: '6px'
                    }}
                  >
                    Email
                  </label>
                  <div className="relative" style={{ height: '35.99px' }}>
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ width: '20px', height: '20px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="white" strokeWidth="1.5" fill="none"/>
                        <path d="M2 5l8 5 8-5" stroke="white" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full h-full rounded-lg pl-10 pr-3 text-white placeholder-white/50 font-normal focus:outline-none focus:ring-2 focus:ring-white/50"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '0.688px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '16px',
                        fontFamily: 'Fredoka, sans-serif'
                      }}
                    />
                  </div>
                </div>

                {/* Password Container */}
                <div style={{ height: '59.99px' }}>
                  <label 
                    htmlFor="password"
                    className="block font-normal text-[#4a5565]"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontFamily: 'Fredoka, sans-serif',
                      marginBottom: '6px'
                    }}
                  >
                    Password
                  </label>
                  <div className="relative" style={{ height: '35.99px' }}>
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ width: '20px', height: '20px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="8" width="14" height="9" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
                        <path d="M6 8V5a4 4 0 018 0v3" stroke="white" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-full rounded-lg pl-10 pr-3 text-white placeholder-white/50 font-normal focus:outline-none focus:ring-2 focus:ring-white/50"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '0.688px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '16px',
                        fontFamily: 'Fredoka, sans-serif'
                      }}
                    />
                  </div>
                </div>

                {/* Confirm Password Container */}
                <div style={{ height: '59.99px' }}>
                  <label 
                    htmlFor="confirmPassword"
                    className="block font-normal text-[#4a5565]"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontFamily: 'Fredoka, sans-serif',
                      marginBottom: '6px'
                    }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative" style={{ height: '35.99px' }}>
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ width: '20px', height: '20px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="8" width="14" height="9" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
                        <path d="M6 8V5a4 4 0 018 0v3" stroke="white" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-full rounded-lg pl-10 pr-3 text-white placeholder-white/50 font-normal focus:outline-none focus:ring-2 focus:ring-white/50"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '0.688px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '16px',
                        fontFamily: 'Fredoka, sans-serif'
                      }}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-red-100/90 border border-red-300 p-3 text-sm text-red-700 font-normal" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {error}
                  </div>
                )}

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] text-black font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl"
                  style={{
                    height: '35.99px',
                    background: 'linear-gradient(135deg, #FFF085 0%, #FFDF20 50%, #FDC700 100%)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontFamily: 'Fredoka, sans-serif'
                  }}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div 
              className="absolute text-center"
              style={{
                left: '98.64px',
                top: '335.39px',
                width: '194.90px',
                height: '20px'
              }}
            >
              <Link
                href="/login"
                className="text-white/80 underline hover:text-white transition-colors font-normal whitespace-nowrap"
                style={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif'
                }}
              >
                Already have an account? Log in
              </Link>
            </div>
          </div>

          {/* Bottom Tagline */}
          <p 
            className="text-center text-black font-normal"
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              fontFamily: 'Fredoka, sans-serif',
              height: '20px'
            }}
          >
            Navigate your media consumption with confidence
          </p>
        </div>
      </div>
    </div>
  )
}
