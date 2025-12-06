'use client'

import { useEffect, useState } from 'react'
import { Pet } from '@/lib/types'
import { calculateHealthState } from '@/lib/utils/petHelpers'
import LogoutButton from './LogoutButton'

interface HealthStatusModalProps {
  isOpen: boolean
  onClose: () => void
  pet: Pet | null
}

interface SubmissionStats {
  totalChecks: number
  goodContentCount: number
  accuracyRate: number
}

/**
 * HealthStatusModal component for displaying pet health information
 * 
 * Requirements:
 * - 4.1: Display current Pet health status screen when left navigation button is clicked
 * - 4.7: Calculate and display Pet Health Score as average of all submissions
 */
export default function HealthStatusModal({
  isOpen,
  onClose,
  pet,
}: HealthStatusModalProps) {
  const [stats, setStats] = useState<SubmissionStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && pet) {
      fetchHealthData()
    }
  }, [isOpen, pet])

  const fetchHealthData = async () => {
    if (!pet) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch submission statistics
      const response = await fetch('/api/submissions/stats')
      
      if (!response.ok) {
        // Handle specific error types (Requirement 7.5)
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.')
        } else if (response.status === 404) {
          // No stats yet - use defaults
          setStats({
            totalChecks: 0,
            goodContentCount: 0,
            accuracyRate: 0,
          })
          return
        } else {
          throw new Error('Failed to fetch submission statistics')
        }
      }

      const data = await response.json()
      
      setStats({
        totalChecks: data.totalChecks || 0,
        goodContentCount: data.goodContentCount || 0,
        accuracyRate: data.accuracyRate || 0,
      })
    } catch (err) {
      console.error('Error fetching health data:', err)
      
      // Handle network errors (Requirement 7.5)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('No internet connection. Please check your network.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load health statistics')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  // Calculate health state and get contextual message
  const healthState = pet ? calculateHealthState(pet.healthScore) : null

  // Get emoji for current mood
  const getMoodEmoji = () => {
    if (!healthState) return '😐'
    
    switch (healthState.state) {
      case 'very-happy':
        return '😄'
      case 'healthy':
        return '😊'
      case 'neutral':
        return '😐'
      case 'unhappy':
        return '😟'
      case 'sick':
        return '😷'
      default:
        return '😐'
    }
  }

  // Get contextual tip based on health
  const getContextualTip = () => {
    if (!pet) return ''

    const score = pet.healthScore

    if (score >= 80) {
      return "Amazing work! You're a media literacy champion! 🏆"
    } else if (score >= 60) {
      return "Great job! Keep choosing quality sources to maintain your pet's health."
    } else if (score >= 40) {
      return "Try to focus on more credible sources to boost your pet's mood!"
    } else if (score >= 20) {
      return "Your pet needs better content! Look for reputable news sources and fact-checked articles."
    } else {
      return "Emergency! Your pet is very sick. Focus on high-quality, credible sources immediately!"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black">
      {/* Fixed iPhone 16 Pro Max container (440x956) */}
      <div className="relative w-[440px] h-[956px] overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F2F7]">
        {/* Logout Button */}
        <LogoutButton />

        {/* Background Decorative Vectors - Exact Figma Positions */}
        <div className="absolute" style={{ left: '255px', top: '106px' }}>
          <img src="/cloud1.svg" alt="" width={414.38} height={143.73} />
        </div>
        <div className="absolute" style={{ left: '-283px', top: '238px' }}>
          <img src="/cloud2.svg" alt="" width={676.94} height={151.91} />
        </div>
        <div className="absolute" style={{ left: '-293px', top: '23px' }}>
          <img src="/cloud3.svg" alt="" width={552.38} height={106.89} />
        </div>
        <div className="absolute" style={{ left: '116px', top: '145px' }}>
          <img src="/satellite.svg" alt="" width={79.36} height={79.36} />
        </div>
        <div className="absolute" style={{ left: '-85px', top: '793px' }}>
          <img src="/nature.svg" alt="" width={610} height={163} />
        </div>

        {/* Modal Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-6 py-8">
        <div
          className="relative w-full max-w-md rounded-[32px] p-8 animate-fade-in max-h-[90vh] overflow-y-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
        {/* Close button */}
        <button
          onClick={handleClose}
          onTouchEnd={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors disabled:opacity-50 touch-manipulation"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Check Health
          </h2>
          <p className="text-base text-white/90">
            See how your Tamedachi is feeling
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-sky-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!isLoading && pet && (
          <div className="space-y-6">
            {/* Health Score Display */}
            <div className="text-center">
              <div className="text-7xl mb-4">{getMoodEmoji()}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {healthState?.state.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h3>
              <p className="text-lg text-white/90 mb-4">
                Health Score: {Math.round(pet.healthScore)}/100
              </p>
              
              {/* Progress Bar */}
              <div className="w-full rounded-full h-4 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500`}
                  style={{ 
                    width: `${Math.min(100, Math.max(0, pet.healthScore))}%`,
                    background: pet.healthScore >= 80
                      ? '#4CAF50'
                      : pet.healthScore >= 60
                      ? '#8BC34A'
                      : pet.healthScore >= 40
                      ? '#FFC107'
                      : pet.healthScore >= 20
                      ? '#FF9800'
                      : '#F44336'
                  }}
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="text-3xl font-bold text-white">
                  {pet.goodContentCount}
                </div>
                <div className="text-sm text-white/80 mt-1">
                  Good Content
                </div>
              </div>

              <div className="text-center p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="text-3xl font-bold text-white">
                  {stats?.totalChecks || 0}
                </div>
                <div className="text-sm text-white/80 mt-1">
                  Total Checks
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <p className="text-sm text-white/90">
                {getContextualTip()}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !pet && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No pet data available. Please hatch your egg first!
            </p>
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  )
}
