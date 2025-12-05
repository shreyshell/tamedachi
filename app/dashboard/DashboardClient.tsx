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
      {/* Decorative clouds - positioned to match Figma */}
      <div className="absolute top-[23px] left-[-293px] text-4xl cloud-decoration animate-pulse opacity-70">☁️</div>
      <div className="absolute top-[106px] left-[255px] text-5xl cloud-decoration animate-pulse opacity-80" style={{ animationDelay: '2s' }}>☁️</div>
      <div className="absolute top-[238px] right-[-283px] text-6xl cloud-decoration animate-pulse opacity-70" style={{ animationDelay: '1s' }}>☁️</div>
      
      {/* Satellite decoration */}
      <div className="absolute top-[145px] left-[131px] text-3xl opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}>🛰️</div>

      {/* Main content - centered vertically */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-[440px] relative">
          {/* Pet Glass Container */}
          <div className="absolute top-[269px] left-[11px] w-[418px] h-[418px] rounded-3xl glass-container shadow-2xl flex items-center justify-center">
            {pet && (
              <div className="w-full h-full flex items-center justify-center">
                <PetComponent pet={pet} />
              </div>
            )}
          </div>

          {/* Egg display (outside glass container) */}
          {!pet && !isHatching && (
            <>
              <div className="absolute top-[279px] left-[70px]">
                <Egg onHatch={handleHatch} />
              </div>
              <div className="absolute top-[737px] left-[69px] w-[303px] text-center">
                <p className="text-2xl font-semibold text-gray-800">
                  Tap the egg to hatch your Tamedachi!
                </p>
              </div>
              {error && (
                <p className="absolute top-[800px] left-0 right-0 text-center text-sm text-red-600">
                  {error}
                </p>
              )}
            </>
          )}

          {/* Hatching state */}
          {isHatching && !pet && (
            <div className="absolute top-[350px] left-0 right-0 text-center">
              <div className="text-7xl animate-bounce">🐣</div>
              <p className="mt-4 text-lg font-semibold text-sky-600">
                Creating your Tamedachi...
              </p>
            </div>
          )}

          {/* Navigation buttons - positioned at bottom */}
          {showNavigation && (
            <div className="absolute bottom-[39px] left-0 right-0">
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

      {/* Nature elements at bottom */}
      <div className="absolute bottom-0 left-[-85px] right-0 flex justify-around text-5xl nature-decoration opacity-60">
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
