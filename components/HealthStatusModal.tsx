'use client'

import { useState, useEffect } from 'react'
import { Pet } from '@/lib/types'
import { calculateHealthState } from '@/lib/utils/petHelpers'

interface HealthStatusModalProps {
  isOpen: boolean
  onClose: () => void
  pet: Pet | null
}

interface HealthStats {
  totalChecks: number
  goodContentCount: number
  averageScore: number
}

export default function HealthStatusModal({ isOpen, onClose, pet }: HealthStatusModalProps) {
  const [stats, setStats] = useState<HealthStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && pet) {
      fetchStats()
    }
  }, [isOpen, pet])

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/submissions/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
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

  const healthState = pet ? calculateHealthState(pet.healthScore) : null

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

  const getContextualTip = () => {
    if (!pet) return ''

    const score = pet.healthScore

    if (score >= 80) {
      return "Amazing work! You're a media literacy champion! 🏆"
    } else if (score >= 60) {
      return "Great job! Keep choosing quality sources to maintain your pet's health."
    } else if (score >= 40) {
      return "Your pet needs better media nutrition. Focus on reliable sources."
    } else if (score >= 20) {
      return "Time to improve! Seek out credible, fact-checked content."
    } else {
      return "Your pet is struggling. Please prioritize high-quality, trustworthy sources."
    }
  }

  const getHealthColor = () => {
    if (!pet) return '#9CA3AF'
    const score = pet.healthScore
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#3B82F6'
    if (score >= 40) return '#F59E0B'
    if (score >= 20) return '#F97316'
    return '#EF4444'
  }

  return (
    <div className="absolute inset-0 z-50">
      {/* Modal Container - X=27, Y=200, W=387, H=556 */}
      <div 
        className="absolute rounded-[32px]"
        style={{
          left: '27px',
          top: '200px',
          width: '387px',
          height: '556px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        {/* Header - X=24, Y=24 */}
        <div 
          className="absolute flex items-center justify-between"
          style={{
            left: '24px',
            top: '24px',
            width: '339px',
            height: '36px'
          }}
        >
          <div className="flex items-center gap-2">
            <img src="/icon-health.svg" alt="" width={26} height={24} />
            <h2 
              className="font-normal"
              style={{
                fontSize: '24px',
                lineHeight: '24px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#000000'
              }}
            >
              Health Status
            </h2>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex items-center justify-center transition-opacity disabled:opacity-50 hover:opacity-70"
            style={{
              width: '36px',
              height: '36px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Health Panel - X=24, Y=84 */}
        {isLoading && (
          <div 
            className="absolute flex items-center justify-center"
            style={{
              left: '24px',
              top: '84px',
              width: '339px',
              height: '448px'
            }}
          >
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p style={{ fontFamily: 'Fredoka, sans-serif', color: '#6B7280' }}>Loading...</p>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div 
            className="absolute"
            style={{
              left: '24px',
              top: '84px',
              width: '339px'
            }}
          >
            <p style={{ fontFamily: 'Fredoka, sans-serif', color: '#DC2626', textAlign: 'center' }}>{error}</p>
          </div>
        )}

        {!isLoading && !error && pet && (
          <div 
            className="absolute"
            style={{
              left: '24px',
              top: '84px',
              width: '339px'
            }}
          >
            {/* Current Mood */}
            <div className="mb-6">
              <p 
                className="font-normal mb-2"
                style={{
                  fontSize: '16px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6B7280'
                }}
              >
                Current Mood
              </p>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '40px' }}>{getMoodEmoji()}</span>
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '32px',
                    lineHeight: '32px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#000000'
                  }}
                >
                  {healthState?.label || 'Neutral'}
                </p>
              </div>
            </div>

            {/* Health Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#6B7280'
                  }}
                >
                  Health Score
                </p>
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '32px',
                    lineHeight: '32px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#000000'
                  }}
                >
                  {pet.healthScore}/100
                </p>
              </div>
              <div 
                className="w-full rounded-full overflow-hidden"
                style={{
                  height: '16px',
                  background: 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <div 
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pet.healthScore}%`,
                    background: getHealthColor()
                  }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className="rounded-xl"
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <img src="/icon-health.svg" alt="" width={20} height={20} className="mb-2" />
                <p 
                  className="font-normal mb-1"
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#6B7280'
                  }}
                >
                  Good Content
                </p>
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '32px',
                    lineHeight: '32px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#000000'
                  }}
                >
                  {pet.goodContentCount}
                </p>
              </div>

              <div 
                className="rounded-xl"
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <p 
                  className="font-normal mb-2"
                  style={{
                    fontSize: '20px',
                    lineHeight: '20px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#6B7280'
                  }}
                >
                  #
                </p>
                <p 
                  className="font-normal mb-1"
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#6B7280'
                  }}
                >
                  Total Checks
                </p>
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '32px',
                    lineHeight: '32px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#000000'
                  }}
                >
                  {stats?.totalChecks || 0}
                </p>
              </div>
            </div>

            {/* Tip */}
            <div 
              className="rounded-xl"
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <p 
                className="font-normal"
                style={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#4B5563'
                }}
              >
                {getContextualTip()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
