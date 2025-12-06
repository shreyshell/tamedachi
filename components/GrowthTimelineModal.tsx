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
  index: number
}

const GROWTH_STAGES: GrowthStage[] = [
  { name: 'Baby', emoji: '🍼', minCount: 0, maxCount: 99, index: 0 },
  { name: 'Child', emoji: '🧒', minCount: 100, maxCount: 199, index: 1 },
  { name: 'Teen', emoji: '🧑', minCount: 200, maxCount: 299, index: 2 },
  { name: 'Adult', emoji: '🧑‍💼', minCount: 300, maxCount: 399, index: 3 },
  { name: 'Elder', emoji: '🧓', minCount: 400, maxCount: Infinity, index: 4 },
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

  // Calculate current growth data
  const goodContentCount = pet?.goodContentCount || 0
  const ageYears = pet ? calculateAge(goodContentCount) : 0
  const progressToNextYear = goodContentCount % 100
  const remainingToNextYear = 100 - progressToNextYear

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
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-50"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      />
      
      {/* Growth & Age Container - Overlay at X=24, Y=38, W=392, H=880 */}
      <div
        className="absolute rounded-[24px] overflow-y-auto z-50"
        onClick={(e) => e.stopPropagation()}
        style={{
          left: '24px',
          top: '38px',
          width: '392px',
          height: '880px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}
      >
        {/* Growth Header - X=24, Y=24 (relative to container) */}
        <div className="flex items-center justify-between mb-6" style={{ height: '36px' }}>
          {/* Headline Container with Icon */}
          <div className="flex items-center gap-2">
            <img src="/icon-growth.svg" alt="" width={26} height={26} />
            <h2 
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#0a0a0a',
                fontWeight: 400
              }}
            >
              Growth & Age
            </h2>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ width: '36px', height: '36px' }}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Growth Panel Container */}
        <div className="flex flex-col gap-6">
          {/* Current Growth Stage Container */}
          <div 
            className="rounded-[24px] flex flex-col items-center gap-3 py-6 px-6"
            style={{
              background: 'rgba(220, 252, 231, 0.5)',
              border: '2px solid #05df72'
            }}
          >
            {/* Emoji */}
            <div 
              style={{
                fontSize: '60px',
                lineHeight: '60px',
                fontFamily: 'Fredoka, sans-serif',
                textAlign: 'center'
              }}
            >
              {currentStage.emoji}
            </div>
            
            {/* Current Stage Text */}
            <p 
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#4a5565',
                textAlign: 'center'
              }}
            >
              Current Stage
            </p>
            
            {/* Stage Name */}
            <p 
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '24px',
                lineHeight: '32px',
                color: '#00a63e',
                textAlign: 'center',
                fontWeight: 400
              }}
            >
              {currentStage.name}
            </p>
          </div>

          {/* Age Container */}
          <div className="flex flex-col gap-2">
            <p 
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#4a5565'
              }}
            >
              Age
            </p>
            <div className="flex items-baseline gap-2">
              <span 
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '36px',
                  lineHeight: '40px',
                  color: '#0a0a0a',
                  fontWeight: 400
                }}
              >
                {ageYears}
              </span>
              <span 
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#4a5565'
                }}
              >
                years old
              </span>
            </div>
          </div>

          {/* Progress Container */}
          <div className="flex flex-col gap-2">
            {/* Text Container */}
            <div className="flex items-center justify-between">
              <p 
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#4a5565'
                }}
              >
                Progress to Next Year
              </p>
              <p 
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#0a0a0a'
                }}
              >
                {progressToNextYear}/100
              </p>
            </div>
            
            {/* Progress Bar */}
            <div 
              className="rounded-full overflow-hidden"
              style={{
                height: '16px',
                background: '#e5e7eb'
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressToNextYear}%`,
                  background: 'linear-gradient(to right, #05df72, #00a63e)'
                }}
              />
            </div>
            
            {/* Number left Text */}
            <p 
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#6a7282'
              }}
            >
              {remainingToNextYear} more credible content pieces to grow
            </p>
          </div>

          {/* Growth Timeline Container */}
          <div className="flex flex-col gap-3">
            <p 
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#4a5565'
              }}
            >
              Growth Timeline
            </p>
            
            {/* Growth Stage Timelines */}
            <div className="flex flex-col gap-2">
              {GROWTH_STAGES.map((stage) => {
                const isCurrentStage = stage.name === currentStage.name
                
                return (
                  <div
                    key={stage.name}
                    className="rounded-[14px] flex items-center gap-3 px-3 py-2"
                    style={{
                      height: isCurrentStage ? '68px' : '64px',
                      background: isCurrentStage ? '#dcfce7' : '#f9fafb',
                      border: isCurrentStage ? '2px solid #05df72' : 'none',
                      paddingLeft: isCurrentStage ? '14px' : '12px',
                      paddingRight: isCurrentStage ? '14px' : '12px'
                    }}
                  >
                    {/* Number Circle */}
                    <div 
                      className="rounded-full flex items-center justify-center shrink-0"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: isCurrentStage ? '#00c950' : '#d1d5dc'
                      }}
                    >
                      <span 
                        style={{
                          fontFamily: 'Fredoka, sans-serif',
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: isCurrentStage ? '#ffffff' : '#4a5565',
                          fontWeight: 400
                        }}
                      >
                        {stage.index}
                      </span>
                    </div>
                    
                    {/* Text */}
                    <div className="flex-1 flex flex-col">
                      <p 
                        style={{
                          fontFamily: 'Fredoka, sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px',
                          color: isCurrentStage ? '#008236' : '#4a5565',
                          fontWeight: 400
                        }}
                      >
                        {stage.name}
                      </p>
                      <p 
                        style={{
                          fontFamily: 'Fredoka, sans-serif',
                          fontSize: '12px',
                          lineHeight: '16px',
                          color: '#6a7282'
                        }}
                      >
                        {stage.maxCount === Infinity
                          ? `${stage.minCount}+ good content`
                          : `${stage.minCount}-${stage.maxCount} good content`}
                      </p>
                    </div>
                    
                    {/* Emoji */}
                    <div 
                      style={{
                        fontSize: '20px',
                        lineHeight: '28px',
                        fontFamily: 'Fredoka, sans-serif'
                      }}
                    >
                      {stage.emoji}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
