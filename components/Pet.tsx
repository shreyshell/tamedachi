'use client'

import { Pet as PetType, PetHealthState } from '@/lib/types'
import { calculateHealthState } from '@/lib/utils/scoring'
import { useEffect, useState } from 'react'

interface PetProps {
  pet: PetType
}

/**
 * Pet component that displays a virtual pet with different visual states
 * based on health score. The pet lives in a glass container and transitions
 * smoothly between health states.
 */
export default function Pet({ pet }: PetProps) {
  const [currentState, setCurrentState] = useState<PetHealthState>('neutral')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Calculate health state whenever pet health score changes
  useEffect(() => {
    const healthStateInfo = calculateHealthState(pet.healthScore)
    const newState = healthStateInfo.state

    if (newState !== currentState) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentState(newState)
        setIsTransitioning(false)
      }, 300)
    }
  }, [pet.healthScore, currentState])

  // Get pet visual representation based on health state
  const getPetVisual = (state: PetHealthState) => {
    switch (state) {
      case 'very-happy':
        return {
          emoji: '😄',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          animation: 'animate-bounce',
          label: 'Very Happy'
        }
      case 'healthy':
        return {
          emoji: '😊',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          animation: 'animate-pulse',
          label: 'Healthy'
        }
      case 'neutral':
        return {
          emoji: '😐',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          animation: '',
          label: 'Neutral'
        }
      case 'unhappy':
        return {
          emoji: '😟',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          animation: '',
          label: 'Unhappy'
        }
      case 'sick':
        return {
          emoji: '😷',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          animation: 'animate-pulse',
          label: 'Sick'
        }
    }
  }

  const visual = getPetVisual(currentState)
  const healthStateInfo = calculateHealthState(pet.healthScore)

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Glass container - responsive sizing */}
      <div
        className={`
          relative rounded-3xl md:rounded-[2rem] p-8 md:p-10 lg:p-12 shadow-2xl backdrop-blur-md
          border-4 md:border-[6px] border-white/60
          transition-all duration-500 ease-in-out
          ${visual.bgColor}
          ${isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)',
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.4), inset 0 0 30px rgba(255,255,255,0.6)'
        }}
      >
        {/* Pet visual - responsive sizing */}
        <div
          className={`
            text-7xl md:text-9xl lg:text-[10rem] transition-all duration-500
            ${visual.animation}
            ${isTransitioning ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
          `}
        >
          {visual.emoji}
        </div>

        {/* Shine effect on glass - responsive sizing */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white opacity-40 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white opacity-20 blur-xl"
          aria-hidden="true"
        />
      </div>

      {/* Pet info - responsive spacing and sizing */}
      <div className="mt-5 md:mt-7 text-center space-y-2 md:space-y-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800">
          {pet.name}
        </h2>
        
        <div className={`text-lg md:text-xl lg:text-2xl font-bold ${visual.color}`}>
          {visual.label}
        </div>

        <p className="text-sm md:text-base text-gray-600 font-medium max-w-xs px-2">
          {healthStateInfo.message}
        </p>

        {/* Health score display - responsive sizing */}
        <div className="mt-4 md:mt-5 flex items-center justify-center gap-3">
          <span className="text-sm md:text-base text-gray-600 font-semibold">Health:</span>
          <div className="relative w-28 md:w-36 lg:w-44 h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className={`
                absolute top-0 left-0 h-full rounded-full transition-all duration-700
                ${pet.healthScore >= 50 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}
              `}
              style={{ width: `${pet.healthScore}%` }}
            />
          </div>
          <span className={`text-sm md:text-base font-bold ${pet.healthScore >= 50 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.round(pet.healthScore)}
          </span>
        </div>

        {/* Age display - responsive sizing */}
        <div className="text-sm md:text-base text-gray-600 font-semibold bg-white/60 px-4 py-2 rounded-full inline-block">
          🎂 Age: {pet.ageYears} {pet.ageYears === 1 ? 'year' : 'years'} old
        </div>
      </div>
    </div>
  )
}
