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
  const [eggTapCount, setEggTapCount] = useState(0)



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
      <div className="relative w-[440px] h-[956px] bg-gradient-to-b from-[#b7bffb] to-[#ffc2c2] overflow-hidden">
        {/* Background Decorative Vectors - Exact Figma Positions */}
        
        {/* Cloud 3 - Peek from left edge */}
        <div className="absolute" style={{ left: '-100px', top: '23px' }}>
          <img src="/cloud3.svg" alt="" width={265} height={118} />
        </div>

        {/* Cloud 2 - Peek from left edge */}
        <div className="absolute" style={{ left: '-150px', top: '238px' }}>
          <img src="/cloud2.svg" alt="" width={400} height={163} />
        </div>

        {/* Cloud 1 - Peek from right edge */}
        <div className="absolute" style={{ left: '300px', top: '106px' }}>
          <img src="/cloud1.svg" alt="" width={414.38} height={143.73} />
        </div>

        {/* Satellite - X=116, Y=145 */}
        <div className="absolute" style={{ left: '116px', top: '145px' }}>
          <img src="/satellite.svg" alt="" width={79.36} height={79.36} />
        </div>

        {/* Station - X=352, Y=795 */}
        <div className="absolute" style={{ left: '352px', top: '795px' }}>
          <img src="/station.svg" alt="" width={71} height={89} />
        </div>

        {/* Field - Bottom landscape */}
        <div className="absolute" style={{ left: '0px', bottom: '0px', width: '440px', height: '163px', overflow: 'hidden' }}>
          <img src="/field.svg" alt="" width={610} height={163} style={{ position: 'absolute', left: '-85px', bottom: '0px' }} />
        </div>

        {/* Logout Button - X=337, Y=23 */}
        <div 
          className="absolute cursor-pointer"
          style={{
            left: '337px',
            top: '23px',
            width: '80px',
            height: '36px'
          }}
        >
          <LogoutButton />
        </div>

        {/* Egg Component - X=70, Y=279, W=300, H=399 (no glass container) */}
        {!pet && !isHatching && (
          <div 
            className="absolute"
            style={{
              left: '70px',
              top: '279px'
            }}
          >
            <Egg onHatch={handleHatch} onTapCountChange={setEggTapCount} />
          </div>
        )}

        {/* Hatching Animation */}
        {isHatching && !pet && (
          <div 
            className="absolute flex flex-col items-center justify-center"
            style={{
              left: '70px',
              top: '279px',
              width: '300px',
              height: '399px'
            }}
          >
            <div className="text-7xl animate-bounce">🐣</div>
            <p 
              className="mt-4 text-lg font-semibold text-center"
              style={{
                fontFamily: 'Fredoka, sans-serif',
                color: '#1F2937'
              }}
            >
              Creating your Tamedachi...
            </p>
          </div>
        )}

        {/* Pet Glass Container - X=11, Y=269, W=418, H=418 (only shown when pet exists) */}
        {pet && (
          <div 
            className="absolute flex items-center justify-center"
            style={{
              left: '11px',
              top: '269px',
              width: '418px',
              height: '418px',
              borderRadius: '228px',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
            }}
          >
            <PetComponent pet={pet} />
          </div>
        )}

        {/* Text below egg */}
        {!pet && !isHatching && (
          <>
            <p 
              className="absolute font-normal text-center whitespace-nowrap"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                top: '737px',
                fontSize: eggTapCount > 0 ? '20px' : '24px',
                lineHeight: eggTapCount > 0 ? '20px' : '24px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#000000'
              }}
            >
              Tap the egg to hatch your Tamedachi!
            </p>
            
            {/* Tap count message with drop shadow */}
            {eggTapCount > 0 && eggTapCount < 3 && (
              <p 
                className="absolute font-normal text-center whitespace-nowrap"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: '768px',
                  fontSize: '20px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#FFF5A6',
                  textShadow: '0px 4px 8px rgba(0,0,0,0.25)'
                }}
              >
                {eggTapCount === 1 ? '2 more taps to hatch!' : '1 more tap to hatch!'}
              </p>
            )}
            
            {error && (
              <p 
                className="absolute text-center"
                style={{
                  left: '50%',
                  top: '800px',
                  transform: 'translateX(-50%)',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#DC2626'
                }}
              >
                {error}
              </p>
            )}
          </>
        )}

        {/* Modals - Rendered inside dashboard container */}
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

        {/* Navigation Buttons - Exact Figma Positions */}
        {showNavigation && (
          <>
            {/* Health Button - X=38, Y=827 */}
            <button
              onClick={handleOpenHealthModal}
              className="absolute flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                left: '38px',
                top: '827px',
                width: '90px',
                height: '90px',
                borderRadius: '122px',
                background: activeButton === 'health' 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: activeButton === 'health'
                  ? '3px solid rgba(135, 206, 235, 1)'
                  : '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: activeButton === 'health'
                  ? '0 8px 32px 0 rgba(135, 206, 235, 0.6)'
                  : '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
              }}
            >
              <img src="/icon-health.svg" alt="Health" width={50} height={45} />
            </button>

            {/* URL Button - X=175, Y=827 */}
            <button
              onClick={handleOpenURLModal}
              className="absolute flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                left: '175px',
                top: '827px',
                width: '90px',
                height: '90px',
                borderRadius: '122px',
                background: activeButton === 'url' 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: activeButton === 'url'
                  ? '3px solid rgba(135, 206, 235, 1)'
                  : '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: activeButton === 'url'
                  ? '0 8px 32px 0 rgba(135, 206, 235, 0.6)'
                  : '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
              }}
            >
              <img src="/icon-url.svg" alt="URL" width={50} height={52} />
            </button>

            {/* Growth Button - X=312, Y=827 */}
            <button
              onClick={handleOpenGrowthModal}
              className="absolute flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                left: '312px',
                top: '827px',
                width: '90px',
                height: '90px',
                borderRadius: '122px',
                background: activeButton === 'growth' 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: activeButton === 'growth'
                  ? '3px solid rgba(135, 206, 235, 1)'
                  : '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: activeButton === 'growth'
                  ? '0 8px 32px 0 rgba(135, 206, 235, 0.6)'
                  : '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
              }}
            >
              <img src="/icon-growth.svg" alt="Growth" width={50} height={50} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
