'use client'

import { useState, useEffect } from 'react'
import Egg from '@/components/Egg'
import PetComponent from '@/components/Pet'
import ScoreDisplay from '@/components/ScoreDisplay'
import URLInputModal from '@/components/URLInputModal'
import HealthStatusModal from '@/components/HealthStatusModal'
import GrowthTimelineModal from '@/components/GrowthTimelineModal'
import NavigationButtons from '@/components/NavigationButtons'
import { Pet } from '@/lib/types'

interface DashboardClientProps {
  initialPet: Pet | null
  userEmail: string
}

interface AnalysisResult {
  score: number
  qualityMessage: string
  analysis?: string
}

export default function DashboardClient({ initialPet, userEmail }: DashboardClientProps) {
  const [pet, setPet] = useState<Pet | null>(initialPet)
  const [isHatching, setIsHatching] = useState(false)
  const [showNavigation, setShowNavigation] = useState(!!initialPet)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showURLModal, setShowURLModal] = useState(false)
  const [showHealthModal, setShowHealthModal] = useState(false)
  const [showGrowthModal, setShowGrowthModal] = useState(false)
  const [activeButton, setActiveButton] = useState<'health' | 'url' | 'growth' | null>(null)

  // Poll for pet updates to reflect health changes from submissions
  useEffect(() => {
    if (!pet) return

    const refreshPetData = async () => {
      try {
        const response = await fetch('/api/pet/get')
        
        if (response.ok) {
          const data = await response.json()
          if (data.pet) {
            setPet(data.pet)
          }
        } else if (response.status === 401) {
          // Session expired - stop polling
          console.error('Session expired during pet refresh')
          // Could redirect to login here if needed
        }
      } catch (err) {
        // Silently handle refresh errors to avoid disrupting user experience
        // Network errors during background refresh are not critical
        console.error('Error refreshing pet data:', err)
      }
    }

    // Refresh pet data every 5 seconds to catch health updates
    const interval = setInterval(refreshPetData, 5000)

    return () => clearInterval(interval)
  }, [pet?.id])

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
  }

  const handleCloseScoreDisplay = () => {
    setAnalysisResult(null)
  }

  const handleOpenURLModal = () => {
    setShowURLModal(true)
    setActiveButton('url')
  }

  const handleCloseURLModal = () => {
    setShowURLModal(false)
    setActiveButton(null)
  }

  const handleOpenHealthModal = () => {
    setShowHealthModal(true)
    setActiveButton('health')
  }

  const handleCloseHealthModal = () => {
    setShowHealthModal(false)
    setActiveButton(null)
  }

  const handleOpenGrowthModal = () => {
    setShowGrowthModal(true)
    setActiveButton('growth')
  }

  const handleCloseGrowthModal = () => {
    setShowGrowthModal(false)
    setActiveButton(null)
  }

  const handleHatch = async () => {
    setIsHatching(true)
    setError(null)

    try {
      const response = await fetch('/api/pet/create', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        
        // Handle specific error types (Requirement 7.5)
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.')
        } else if (response.status === 500) {
          throw new Error('Failed to create your pet. Please try again.')
        } else {
          throw new Error(errorData.error || errorData.message || 'Failed to create pet')
        }
      }

      const data = await response.json()
      setPet(data.pet)
      
      // Show navigation buttons after pet is created
      setTimeout(() => {
        setShowNavigation(true)
      }, 500)
    } catch (err) {
      console.error('Error hatching egg:', err)
      
      // Handle different error types (Requirement 7.5)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('No internet connection. Please check your network.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to hatch egg. Please try again.')
      }
      setIsHatching(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-sky-gradient overflow-hidden">
      {/* Decorative clouds - responsive sizing */}
      <div className="absolute top-6 left-4 text-4xl md:top-10 md:left-10 md:text-6xl lg:text-7xl cloud-decoration animate-pulse">☁️</div>
      <div className="absolute top-12 right-8 text-3xl md:top-20 md:right-20 md:text-4xl lg:text-5xl cloud-decoration animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute top-24 left-1/3 text-3xl md:top-40 md:text-5xl lg:text-6xl cloud-decoration animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
      <div className="absolute bottom-32 right-1/4 text-4xl md:text-5xl cloud-decoration animate-pulse" style={{ animationDelay: '3s' }}>☁️</div>
      
      {/* Satellite decoration - responsive sizing */}
      <div className="absolute top-20 right-4 text-2xl md:top-32 md:right-10 md:text-3xl lg:text-4xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>🛰️</div>
      
      {/* Sun decoration */}
      <div className="absolute top-8 right-8 text-3xl md:top-12 md:right-12 md:text-4xl opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>☀️</div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 md:py-8 lg:py-12">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Welcome message */}
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl">
              Welcome to Tamedachi! 🌟
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/90 font-medium drop-shadow-lg truncate px-4">
              {userEmail}
            </p>
          </div>

          {/* Egg or Pet display - responsive sizing */}
          <div className="flex min-h-[350px] md:min-h-[400px] lg:min-h-[450px] items-center justify-center rounded-3xl glass-container p-6 md:p-8 lg:p-10 shadow-2xl">
            {!pet && !isHatching && (
              <div className="text-center">
                <Egg onHatch={handleHatch} />
                {error && (
                  <p className="mt-4 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>
            )}

            {isHatching && !pet && (
              <div className="text-center">
                <div className="text-5xl md:text-6xl lg:text-7xl animate-bounce">🐣</div>
                <p className="mt-4 text-base md:text-lg font-semibold text-sky-600">
                  Creating your Tamedachi...
                </p>
              </div>
            )}

            {pet && (
              <div className="w-full">
                <PetComponent pet={pet} />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          {showNavigation && (
            <div className="mt-6 md:mt-8">
              <NavigationButtons
                onHealthClick={handleOpenHealthModal}
                onURLClick={handleOpenURLModal}
                onGrowthClick={handleOpenGrowthModal}
                activeButton={activeButton}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nature elements at bottom - responsive sizing */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pb-2 md:pb-4 text-3xl md:text-4xl lg:text-5xl nature-decoration">
        <span>🌳</span>
        <span>🌲</span>
        <span>🌿</span>
        <span>🌳</span>
        <span>🌲</span>
      </div>

      {/* Health Status Modal */}
      <HealthStatusModal
        isOpen={showHealthModal}
        onClose={handleCloseHealthModal}
        pet={pet}
      />

      {/* URL Input Modal */}
      <URLInputModal
        isOpen={showURLModal}
        onClose={handleCloseURLModal}
        onAnalysisComplete={handleAnalysisComplete}
        petId={pet?.id || null}
      />

      {/* Growth Timeline Modal */}
      <GrowthTimelineModal
        isOpen={showGrowthModal}
        onClose={handleCloseGrowthModal}
        pet={pet}
      />

      {/* Score Display Overlay */}
      {analysisResult && (
        <ScoreDisplay
          score={analysisResult.score}
          qualityMessage={analysisResult.qualityMessage}
          analysis={analysisResult.analysis}
          onClose={handleCloseScoreDisplay}
        />
      )}
    </div>
  )
}
