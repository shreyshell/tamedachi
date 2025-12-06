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



  // Refresh pet data immediately (called after URL submission)
  const refreshPetData = async () => {
    if (!pet) return

    try {
      const response = await fetch('/api/pet/get')
      
      if (response.ok) {
        const data = await response.json()
        if (data.pet) {
          setPet(data.pet)
        }
      }
    } catch (err) {
      console.error('Error refreshing pet data:', err)
    }
  }

  const handleAnalysisComplete = async (result: AnalysisResult) => {
    setAnalysisResult(result)
    // Immediately refresh pet data to show updated health
    await refreshPetData()
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
    <div className="flex justify-center items-center min-h-screen bg-black">
      {/* Fixed iPhone 16 Pro Max container (440x956) */}
      <div className="relative w-[440px] h-[956px] overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F2F7]">
        {/* Logout Button */}
        <LogoutButton />

        {/* Background Decorative Vectors - Exact Figma Positions */}
        
        {/* Cloud 1 - X=255, Y=106 */}
        <div className="absolute" style={{ left: '255px', top: '106px' }}>
          <img src="/cloud1.svg" alt="" width={414.38} height={143.73} />
        </div>

        {/* Cloud 2 - X=-283, Y=238 */}
        <div className="absolute" style={{ left: '-283px', top: '238px' }}>
          <img src="/cloud2.svg" alt="" width={676.94} height={151.91} />
        </div>

        {/* Cloud 3 - X=-293, Y=23 */}
        <div className="absolute" style={{ left: '-293px', top: '23px' }}>
          <img src="/cloud3.svg" alt="" width={552.38} height={106.89} />
        </div>

        {/* Satellite - X=116, Y=145 */}
        <div className="absolute" style={{ left: '116px', top: '145px' }}>
          <img src="/satellite.svg" alt="" width={79.36} height={79.36} />
        </div>

        {/* Nature - X=-85, Y=793 */}
        <div className="absolute" style={{ left: '-85px', top: '793px' }}>
          <img src="/nature.svg" alt="" width={610} height={163} />
        </div>

        {/* Main content area */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-8">
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
    </div>
  )
}
