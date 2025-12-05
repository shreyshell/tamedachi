'use client'

import { useEffect, useState } from 'react'
import { Pet } from '@/lib/types'
import { calculateHealthState } from '@/lib/utils/petHelpers'

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4"
      onClick={handleClose}
      onTouchEnd={handleClose}
    >
      <div
        className="relative w-full max-w-md md:max-w-lg rounded-3xl bg-white p-5 md:p-6 lg:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto border-4 border-pink-100"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Close button - responsive sizing */}
        <button
          onClick={handleClose}
          onTouchEnd={handleClose}
          disabled={isLoading}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 touch-manipulation"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
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

        {/* Header - responsive sizing */}
        <div className="mb-5 md:mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
            Health Status ❤️
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Check how your Tamedachi is feeling!
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
          <div className="space-y-4 md:space-y-6">
            {/* Current Mood - responsive sizing */}
            <div className="text-center p-5 md:p-7 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl border-2 border-pink-100 shadow-lg">
              <div className="text-6xl md:text-7xl lg:text-8xl mb-3 md:mb-4 animate-bounce">{getMoodEmoji()}</div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-800 mb-2">
                {healthState?.state.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                Current Mood
              </p>
            </div>

            {/* Health Score with Progress Bar - responsive sizing */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-semibold text-gray-700">
                  Health Score
                </span>
                <span className="text-base md:text-lg font-bold text-sky-600">
                  {Math.round(pet.healthScore)}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pet.healthScore >= 80
                      ? 'bg-green-500'
                      : pet.healthScore >= 60
                      ? 'bg-blue-500'
                      : pet.healthScore >= 40
                      ? 'bg-yellow-500'
                      : pet.healthScore >= 20
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, pet.healthScore))}%` }}
                />
              </div>
            </div>

            {/* Statistics Grid - responsive sizing */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Good Content Counter */}
              <div className="p-4 md:p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-md">
                <div className="text-2xl md:text-3xl font-extrabold text-green-700">
                  {pet.goodContentCount}
                </div>
                <div className="text-xs md:text-sm text-green-600 mt-1 font-semibold">
                  Good Content
                </div>
              </div>

              {/* Total Checks Counter */}
              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl shadow-md">
                <div className="text-2xl md:text-3xl font-extrabold text-blue-700">
                  {stats?.totalChecks || 0}
                </div>
                <div className="text-xs md:text-sm text-blue-600 mt-1 font-semibold">
                  Total Checks
                </div>
              </div>
            </div>

            {/* Accuracy Rate - responsive sizing */}
            {stats && stats.totalChecks > 0 && (
              <div className="p-4 md:p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base font-bold text-purple-700">
                    Accuracy Rate
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-purple-700">
                    {Math.round(stats.accuracyRate)}%
                  </span>
                </div>
                <div className="mt-2 text-xs md:text-sm text-purple-600 font-medium">
                  Percentage of good content consumed
                </div>
              </div>
            )}

            {/* Contextual Tip - responsive sizing */}
            <div className="p-4 md:p-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-md">
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl">💡</span>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-amber-800 mb-2">
                    Tip
                  </h4>
                  <p className="text-sm md:text-base text-amber-700 font-medium">
                    {getContextualTip()}
                  </p>
                </div>
              </div>
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
  )
}
