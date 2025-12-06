'use client'

import { Pet as PetType, PetHealthState } from '@/lib/types'
import { calculateHealthState } from '@/lib/utils/scoring'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface PetProps {
  pet: PetType
  temporaryState?: PetHealthState | null
}

/**
 * Pet component that displays a virtual pet with different visual states
 * based on health score using Figma-designed SVG assets.
 * Can temporarily show a different state (e.g., when reacting to new content).
 */
export default function Pet({ pet, temporaryState = null }: PetProps) {
  const [currentState, setCurrentState] = useState<PetHealthState>('neutral')

  // Calculate health state whenever pet health score changes
  useEffect(() => {
    const healthStateInfo = calculateHealthState(pet.healthScore)
    const newState = healthStateInfo.state

    if (newState !== currentState) {
      setCurrentState(newState)
    }
  }, [pet.healthScore, currentState])

  // Use temporary state if provided, otherwise use calculated state
  const displayState = temporaryState || currentState

  // Get pet SVG file based on health state
  const getPetSVG = (state: PetHealthState) => {
    switch (state) {
      case 'very-happy':
        return {
          src: '/pet-veryhappy.svg',
          width: 303,
          height: 315,
          label: 'Very Happy'
        }
      case 'healthy':
        return {
          src: '/pet-healthy.svg',
          width: 329,
          height: 315,
          label: 'Healthy'
        }
      case 'neutral':
        return {
          src: '/pet-neutral.svg',
          width: 305,
          height: 287,
          label: 'Neutral'
        }
      case 'unhappy':
        return {
          src: '/pet-unhappy.svg',
          width: 307,
          height: 315,
          label: 'Unhappy'
        }
      case 'sick':
        return {
          src: '/pet-sick.svg',
          width: 369,
          height: 315,
          label: 'Sick'
        }
    }
  }

  const petVisual = getPetSVG(displayState)

  return (
    <div className="flex items-center justify-center">
      {/* Pet SVG visual - No animations */}
      <div>
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
