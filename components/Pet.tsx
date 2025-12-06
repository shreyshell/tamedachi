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
    <div className="flex items-center justify-center">
      {/* Pet visual */}
      <div
        className={`
          text-9xl transition-all duration-500
          ${visual.animation}
          ${isTransitioning ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
        `}
      >
        {visual.emoji}
      </div>
    </div>
  )
}
