'use client'

import { Pet as PetType, PetHealthState } from '@/lib/types'
import { calculateHealthState } from '@/lib/utils/scoring'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface PetProps {
  pet: PetType
}

/**
 * Pet component that displays a virtual pet with different visual states
 * based on health score using Figma-designed SVG assets.
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

  // Get pet SVG file based on health state
  const getPetSVG = (state: PetHealthState) => {
    switch (state) {
      case 'very-happy':
        return {
          src: '/pet-veryhappy.svg',
          width: 303,
          height: 315,
          animation: 'animate-bounce',
          label: 'Very Happy'
        }
      case 'healthy':
        return {
          src: '/pet-healthy.svg',
          width: 329,
          height: 315,
          animation: 'animate-pulse',
          label: 'Healthy'
        }
      case 'neutral':
        return {
          src: '/pet-neutral.svg',
          width: 305,
          height: 287,
          animation: '',
          label: 'Neutral'
        }
      case 'unhappy':
        return {
          src: '/pet-unhappy.svg',
          width: 307,
          height: 315,
          animation: '',
          label: 'Unhappy'
        }
      case 'sick':
        return {
          src: '/pet-sick.svg',
          width: 369,
          height: 315,
          animation: 'animate-pulse',
          label: 'Sick'
        }
    }
  }

  const petVisual = getPetSVG(currentState)

  return (
    <div className="flex items-center justify-center">
      {/* Pet SVG visual */}
      <div
        className={`
          transition-all duration-500
          ${petVisual.animation}
          ${isTransitioning ? 'scale-0 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'}
        `}
      >
        <Image 
          src={petVisual.src}
          alt={petVisual.label}
          width={petVisual.width}
          height={petVisual.height}
          priority
          style={{ maxWidth: '320px', height: 'auto' }}
        />
      </div>
    </div>
  )
}
