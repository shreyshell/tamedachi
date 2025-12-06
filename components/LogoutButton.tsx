'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

/**
 * LogoutButton component - Matches Figma design
 * Positioned at X=337, Y=23, W=80, H=36
 */
export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full h-full rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15)'
      }}
      aria-label="Logout"
    >
      <span 
        className="font-normal text-white"
        style={{
          fontSize: '14px',
          lineHeight: '19px',
          fontFamily: 'Fredoka, sans-serif'
        }}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </span>
    </button>
  )
}
