'use client'

import { useState } from 'react'
import Image from 'next/image'

interface EggProps {
  onHatch: () => void
}

export default function Egg({ onHatch }: EggProps) {
  const [tapCount, setTapCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'tap1' | 'tap2' | 'tap3-down' | 'tap3-left' | 'tap3-right' | 'tap3-left2' | 'tap3-disappear'>('idle')

  const handleEggTap = () => {
    if (isAnimating || tapCount >= 3) return

    setIsAnimating(true)
    const newTapCount = tapCount + 1
    setTapCount(newTapCount)

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
      // Tap 3: Complex animation sequence
      // 1. Come down
      setAnimationPhase('tap3-down')
      setTimeout(() => {
        // 2. Shake left
        setAnimationPhase('tap3-left')
        setTimeout(() => {
          // 3. Shake right
          setAnimationPhase('tap3-right')
          setTimeout(() => {
            // 4. Shake left again
            setAnimationPhase('tap3-left2')
            setTimeout(() => {
              // 5. Disappear
              setAnimationPhase('tap3-disappear')
              setTimeout(() => {
                // Call onHatch callback
                onHatch()
              }, 500)
            }, 150)
          }, 150)
        }, 150)
      }, 200)
    }
  }

  return (
    <button
      onClick={handleEggTap}
      disabled={tapCount >= 3}
      className={`
        relative cursor-pointer transition-all duration-300 touch-manipulation
        ${tapCount >= 3 ? 'cursor-default' : 'hover:scale-105 active:scale-95'}
        ${animationPhase === 'tap3-down' ? 'animate-egg-down' : ''}
        ${animationPhase === 'tap3-left' ? 'animate-egg-shake-left' : ''}
        ${animationPhase === 'tap3-right' ? 'animate-egg-shake-right' : ''}
        ${animationPhase === 'tap3-left2' ? 'animate-egg-shake-left' : ''}
        ${animationPhase === 'tap3-disappear' ? 'animate-egg-disappear' : ''}
      `}
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

        {/* Crack 1 - Appears after tap 1 */}
        {tapCount >= 1 && (
          <Image 
            src="/egg-crack1.svg" 
            alt="" 
            width={144} 
            height={169}
            className={`absolute top-[100px] left-[80px] transition-opacity duration-300 ${
              animationPhase === 'tap1' ? 'animate-fade-in' : 'opacity-100'
            }`}
            priority
          />
        )}

        {/* Crack 2 - Appears after tap 2 */}
        {tapCount >= 2 && (
          <Image 
            src="/egg-crack2.svg" 
            alt="" 
            width={109} 
            height={138}
            className={`absolute top-[130px] left-[95px] transition-opacity duration-300 ${
              animationPhase === 'tap2' ? 'animate-fade-in' : 'opacity-100'
            }`}
          />
        )}

        {/* Crack 3 - Appears after tap 2 */}
        {tapCount >= 2 && (
          <Image 
            src="/egg-crack3.svg" 
            alt="" 
            width={93} 
            height={222}
            className={`absolute top-[90px] left-[105px] transition-opacity duration-300 ${
              animationPhase === 'tap2' ? 'animate-fade-in' : 'opacity-100'
            }`}
            style={{ animationDelay: '0.1s' }}
          />
        )}
      </div>
    </button>
  )
}
