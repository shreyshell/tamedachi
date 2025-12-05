'use client'

import { Pet } from '@/lib/types'
import { calculateAge } from '@/lib/utils/petHelpers'

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4"
      onClick={handleClose}
      onTouchEnd={handleClose}
    >
      <div
        className="relative w-full max-w-md md:max-w-lg rounded-3xl bg-white p-5 md:p-6 lg:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto border-4 border-green-100"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Close button - responsive sizing */}
        <button
          onClick={handleClose}
          onTouchEnd={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 transition-colors touch-manipulation"
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
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Growth Timeline 📈
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Watch your Tamedachi grow with every good content choice!
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
          <div className="space-y-4 md:space-y-6">
            {/* Current Growth Stage - responsive sizing */}
            <div className="text-center p-5 md:p-7 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-200 shadow-lg">
              <div className="text-6xl md:text-7xl lg:text-8xl mb-3 md:mb-4 animate-bounce">{currentStage.emoji}</div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-800 mb-2">
                {currentStage.name}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                Current Growth Stage
              </p>
            </div>

            {/* Age Display - responsive sizing */}
            <div className="p-4 md:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base font-bold text-blue-700">
                  Age
                </span>
                <span className="text-2xl md:text-3xl font-extrabold text-blue-700">
                  {ageYears} {ageYears === 1 ? 'year' : 'years'} old
                </span>
              </div>
            </div>

            {/* Progress to Next Year - responsive sizing */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-semibold text-gray-700">
                  Progress to Next Year
                </span>
                <span className="text-xs md:text-sm font-bold text-green-600">
                  {progressToNextYear}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNextYear}%` }}
                />
              </div>
              <p className="text-[10px] md:text-xs text-gray-600 mt-2">
                {100 - progressToNextYear} more good content pieces to grow!
              </p>
            </div>

            {/* Growth Timeline - responsive sizing */}
            <div>
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                Growth Timeline
              </h4>
              <div className="space-y-2 md:space-y-3">
                {GROWTH_STAGES.map((stage) => {
                  const isCurrentStage = stage.name === currentStage.name
                  const isPastStage = goodContentCount > stage.maxCount
                  
                  return (
                    <div
                      key={stage.name}
                      className={`flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg transition-all ${
                        isCurrentStage
                          ? 'bg-green-100 border-2 border-green-400'
                          : isPastStage
                          ? 'bg-gray-100 border border-gray-300'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="text-2xl md:text-3xl">{stage.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                          <span className={`text-sm md:text-base font-semibold ${
                            isCurrentStage ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            {stage.name}
                          </span>
                          {isCurrentStage && (
                            <span className="text-[10px] md:text-xs bg-green-500 text-white px-1.5 md:px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                          {isPastStage && (
                            <span className="text-[10px] md:text-xs bg-gray-500 text-white px-1.5 md:px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-600 mt-1">
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

            {/* Encouragement Message - responsive sizing */}
            <div className="p-4 md:p-5 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200 rounded-xl shadow-md">
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl">🌟</span>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-purple-800 mb-2">
                    Keep Growing!
                  </h4>
                  <p className="text-sm md:text-base text-purple-700 font-medium">
                    {ageYears === 0
                      ? "Your Tamedachi is just starting its journey! Feed it quality content to help it grow."
                      : ageYears < 2
                      ? "Your Tamedachi is growing wise! Keep choosing credible sources."
                      : ageYears < 4
                      ? "Amazing progress! Your Tamedachi is becoming a media literacy expert!"
                      : "Incredible! Your Tamedachi has reached elder wisdom. You're a champion of quality content!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
