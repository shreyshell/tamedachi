'use client'

import { useState } from 'react'
import Image from 'next/image'

interface EggProps {
  onHatch: () => void
  onTapCountChange?: (count: number) => void
}

export default function Egg({ onHatch, onTapCountChange }: EggProps) {
  const [tapCount, setTapCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'tap1' | 'tap2' | 'tap3-left' | 'tap3-right' | 'tap3-left2' | 'tap3-disappear'>('idle')

  const handleEggTap = () => {
    if (isAnimating || tapCount >= 3) return

    setIsAnimating(true)
    const newTapCount = tapCount + 1
    setTapCount(newTapCount)
    onTapCountChange?.(newTapCount)

    if (newTapCount === 1) {
      // Tap 1: Show crack 1
      setAnimationPhase('tap1')
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    } else if (newTapCount === 2) {
      // Tap 2: Show crack 2 and crack 3
      setAnimationPhase('tap2')
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    } else if (newTapCount === 3) {
      // Tap 3: Complex animation sequence matching Figma
      // 1. Shake left (X=53.9, Y=322.2, W=332.2, H=422.6)
      setAnimationPhase('tap3-left')
      setTimeout(() => {
        // 2. Shake right (X=86.2, Y=297.8, W=330.5, H=421.4)
        setAnimationPhase('tap3-right')
        setTimeout(() => {
          // 3. Shake left again
          setAnimationPhase('tap3-left2')
          setTimeout(() => {
            // 4. Disappear (shrink to center point)
            setAnimationPhase('tap3-disappear')
            setTimeout(() => {
              // Call onHatch callback
              onHatch()
            }, 500)
          }, 150)
        }, 150)
      }, 150)
    }
  }

  // Calculate transform based on animation phase (relative to original position)
  const getTransform = () => {
    switch (animationPhase) {
      case 'tap3-left':
        // Move to X=53.9, Y=322.2 (from X=70, Y=279)
        // Delta: X=-16.1, Y=+43.2
        return 'translate(-16.1px, 43.2px) scale(1.107, 1.059)'
      case 'tap3-right':
        // Move to X=86.2, Y=297.8 (from X=70, Y=279)
        // Delta: X=+16.2, Y=+18.8
        return 'translate(16.2px, 18.8px) scale(1.102, 1.056)'
      case 'tap3-left2':
        // Same as tap3-left
        return 'translate(-16.1px, 43.2px) scale(1.107, 1.059)'
      case 'tap3-disappear':
        // Shrink to center of egg (no translation, just scale down)
        return 'scale(0.0001)'
      default:
        return 'none'
    }
  }

  return (
    <button
      onClick={handleEggTap}
      disabled={tapCount >= 3}
      className="relative cursor-pointer touch-manipulation"
      style={{
        transform: getTransform(),
        transition: animationPhase.startsWith('tap3') ? 'transform 0.15s ease-in-out' : 'none'
      }}
      aria-label="Tap the egg to hatch your pet"
    >
      <div className="relative w-[300px] h-[399px]">
        {/* Base Egg */}
        <Image 
          src="/egg-base.svg" 
          alt="Egg" 
          width={300} 
          height={399}
          className="absolute inset-0"
          priority
        />

        {/* Crack 1 - Appears after tap 1 at X=9, Y=199 (relative to egg container at X=70, Y=279) */}
        {tapCount >= 1 && (
          <Image 
            src="/egg-crack1.svg" 
            alt="" 
            width={144} 
            height={169}
            className={`absolute transition-opacity duration-300 ${
              animationPhase === 'tap1' ? 'animate-fade-in' : 'opacity-100'
            }`}
            style={{
              left: '9px',
              top: '199px'
            }}
            priority
          />
        )}

        {/* Crack 2 - Appears after tap 2 at X=93, Y=52 */}
        {tapCount >= 2 && (
          <Image 
            src="/egg-crack2.svg" 
            alt="" 
            width={109} 
            height={138}
            className={`absolute transition-opacity duration-300 ${
              animationPhase === 'tap2' ? 'animate-fade-in' : 'opacity-100'
            }`}
            style={{
              left: '93px',
              top: '52px'
            }}
          />
        )}

        {/* Crack 3 - Appears after tap 2 at X=181, Y=105 */}
        {tapCount >= 2 && (
          <Image 
            src="/egg-crack3.svg" 
            alt="" 
            width={93} 
            height={222}
            className={`absolute transition-opacity duration-300 ${
              animationPhase === 'tap2' ? 'animate-fade-in' : 'opacity-100'
            }`}
            style={{
              left: '181px',
              top: '105px',
              animationDelay: '0.1s'
            }}
          />
        )}
      </div>
    </button>
  )
}
