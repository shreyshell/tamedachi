'use client'

import { Pet } from '@/lib/types'
import { calculateAge } from '@/lib/utils/petHelpers'
import LogoutButton from './LogoutButton'

interface GrowthTimelineModalProps {
  isOpen: boolean
  onClose: () => void
  pet: Pet | null
}

interface GrowthStage {
  name: string
  emoji: string
  minCount: number
  maxCount: number
}

const GROWTH_STAGES: GrowthStage[] = [
  { name: 'Baby', emoji: '🍼', minCount: 0, maxCount: 99 },
  { name: 'Child', emoji: '🧒', minCount: 100, maxCount: 199 },
  { name: 'Teen', emoji: '🧑', minCount: 200, maxCount: 299 },
  { name: 'Adult', emoji: '🧑‍💼', minCount: 300, maxCount: 399 },
  { name: 'Elder', emoji: '🧓', minCount: 400, maxCount: Infinity },
]

/**
 * GrowthTimelineModal component for displaying pet growth and age information
 * 
 * Requirements:
 * - 5.1: Display Pet age and growth statistics screen when right navigation button is clicked
 * - 5.2: Calculate age as the count of Good Content pieces divided by 100
 * - 5.5: Show the total count of Good Content pieces and current Pet age in years
 */
export default function GrowthTimelineModal({
  isOpen,
  onClose,
  pet,
}: GrowthTimelineModalProps) {
  if (!isOpen) return null

  const handleClose = () => {
    onClose()
  }

  // Calculate current growth data
  const goodContentCount = pet?.goodContentCount || 0
  const ageYears = pet ? calculateAge(goodContentCount) : 0
  const progressToNextYear = goodContentCount % 100

  // Determine current growth stage
  const getCurrentStage = (): GrowthStage => {
    for (const stage of GROWTH_STAGES) {
      if (goodContentCount >= stage.minCount && goodContentCount <= stage.maxCount) {
        return stage
      }
    }
    return GROWTH_STAGES[0] // Default to Baby
  }

  const currentStage = getCurrentStage()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F2F7]">
      {/* Logout Button */}
      <LogoutButton />

      {/* Background Decorative Vectors - Same as Dashboard */}
      <div className="absolute top-[80px] left-[-100px] opacity-90">
        <img src="/cloud1.svg" alt="" width={425} height={155} />
      </div>
      <div className="absolute bottom-0 left-0 opacity-90">
        <img src="/cloud2.svg" alt="" width={400} height={163} />
      </div>
      <div className="absolute top-[120px] right-[-150px] opacity-90">
        <img src="/cloud3.svg" alt="" width={265} height={118} />
      </div>
      <div className="absolute top-[40px] right-[60px] opacity-85">
        <img src="/satellite.svg" alt="" width={93} height={93} />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <img src="/nature.svg" alt="" className="w-full" />
      </div>

      {/* Modal Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-8">
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
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors touch-manipulation"
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
            Check Growth Stage
          </h2>
          <p className="text-base text-white/90">
            See how your Tamedachi is growing
          </p>
        </div>

        {!pet && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No pet data available. Please hatch your egg first!
            </p>
          </div>
        )}

        {pet && (
          <div className="space-y-6">
            {/* Current Stage Display */}
            <div className="text-center">
              <div className="text-7xl mb-4">{currentStage.emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentStage.name}
              </h3>
              <p className="text-lg text-white/90 mb-4">
                Age: {ageYears} {ageYears === 1 ? 'year' : 'years'} old
              </p>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-white/80 mb-1">
                  <span>Progress to Next Year</span>
                  <span>{progressToNextYear}/100</span>
                </div>
                <div className="w-full rounded-full h-4 overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progressToNextYear}%`,
                      background: 'linear-gradient(to right, #4CAF50, #8BC34A)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Growth Stages */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white/90 mb-2">
                Growth Stages
              </h4>
              {GROWTH_STAGES.map((stage) => {
                const isCurrentStage = stage.name === currentStage.name
                const isPastStage = goodContentCount > stage.maxCount
                
                return (
                  <div
                    key={stage.name}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all`}
                    style={{
                      background: isCurrentStage 
                        ? 'rgba(76, 175, 80, 0.3)' 
                        : isPastStage
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(255, 255, 255, 0.1)',
                      border: `2px solid ${isCurrentStage ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`
                    }}
                  >
                    <div className="text-3xl">{stage.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-white">
                          {stage.name}
                        </span>
                        {isCurrentStage && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        {stage.maxCount === Infinity
                          ? `${stage.minCount}+ good content`
                          : `${stage.minCount}-${stage.maxCount} good content`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
