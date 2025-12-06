'use client'

import { useState, useEffect } from 'react'
import Egg from '@/components/Egg'
import PetComponent from '@/components/Pet'
import ScoreDisplay from '@/components/ScoreDisplay'
import URLInputModal from '@/components/URLInputModal'
import HealthStatusModal from '@/components/HealthStatusModal'
import GrowthTimelineModal from '@/components/GrowthTimelineModal'
import NavigationButtons from '@/components/NavigationButtons'
import LogoutButton from '@/components/LogoutButton'
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F2F7]">
      {/* Logout Button */}
      <LogoutButton />

      {/* Background Decorative Vectors - Same as Welcome Page */}
      
      {/* Cloud 1 - Top Left */}
      <div className="absolute top-[80px] left-[-100px] opacity-90">
        <img src="/cloud1.svg" alt="" width={425} height={155} />
      </div>

      {/* Cloud 2 - Bottom */}
      <div className="absolute bottom-0 left-0 opacity-90">
        <img src="/cloud2.svg" alt="" width={400} height={163} />
      </div>

      {/* Cloud 3 - Top Right */}
      <div className="absolute top-[120px] right-[-150px] opacity-90">
        <img src="/cloud3.svg" alt="" width={265} height={118} />
      </div>

      {/* Satellite - Top Right */}
      <div className="absolute top-[40px] right-[60px] opacity-85">
        <img src="/satellite.svg" alt="" width={93} height={93} />
      </div>

      {/* Nature - Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <img src="/nature.svg" alt="" className="w-full" />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8">
        {/* Pet Glass Container - Matching Figma Design */}
        <div className="w-full max-w-[418px] h-[418px] rounded-[32px] flex items-center justify-center mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          {!pet && !isHatching && (
            <div className="flex flex-col items-center">
              <Egg onHatch={handleHatch} />
            </div>
          )}

          {isHatching && !pet && (
            <div className="text-center">
              <div className="text-7xl animate-bounce">🐣</div>
              <p className="mt-4 text-lg font-semibold text-gray-800">
                Creating your Tamedachi...
              </p>
            </div>
          )}

          {pet && (
            <PetComponent pet={pet} />
          )}
        </div>

        {/* Text below egg */}
        {!pet && !isHatching && (
          <div className="text-center max-w-sm">
            <p className="text-xl font-semibold text-gray-800">
              Tap the egg to hatch your Tamedachi!
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        {showNavigation && (
          <div className="mt-8">
            <NavigationButtons
              onHealthClick={handleOpenHealthModal}
              onURLClick={handleOpenURLModal}
              onGrowthClick={handleOpenGrowthModal}
              activeButton={activeButton}
            />
          </div>
        )}
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
