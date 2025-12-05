'use client'

import { useState } from 'react'

interface EggProps {
  onHatch: () => void
}

export default function Egg({ onHatch }: EggProps) {
  const [tapCount, setTapCount] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [isCracking, setIsCracking] = useState(false)
  const [isDisappearing, setIsDisappearing] = useState(false)

  const handleTap = () => {
    if (tapCount >= 2 || isDisappearing) return

    const newTapCount = tapCount + 1
    setTapCount(newTapCount)

    // Trigger shake animation
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)

    // On third tap, start hatching sequence
    if (newTapCount === 3) {
      setTimeout(() => {
        setIsCracking(true)
        
        // After crack animation, start disappear
        setTimeout(() => {
          setIsDisappearing(true)
          
          // Call onHatch after disappear animation
          setTimeout(() => {
            onHatch()
          }, 500)
        }, 800)
      }, 500)
    }
  }

  // Determine shake direction based on tap count
  const getShakeClass = () => {
    if (!isShaking) return ''
    if (tapCount === 1) return 'animate-shake-left'
    if (tapCount === 2) return 'animate-shake-right'
    return ''
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={handleTap}
        onTouchEnd={handleTap}
        disabled={tapCount >= 3}
        className={`
          relative cursor-pointer transition-all duration-300 touch-manipulation
          ${getShakeClass()}
          ${isCracking ? 'animate-crack' : ''}
          ${isDisappearing ? 'animate-disappear' : ''}
          ${tapCount >= 3 ? 'cursor-default' : 'hover:scale-105 active:scale-95'}
        `}
        aria-label="Tap the egg to hatch your pet"
      >
        {/* Egg SVG - responsive sizing */}
        <svg
          width="180"
          height="216"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl w-[180px] h-[216px] md:w-[200px] md:h-[240px] lg:w-[220px] lg:h-[264px]"
        >
          {/* Main egg shape */}
          <ellipse
            cx="100"
            cy="140"
            rx="80"
            ry="100"
            fill="url(#eggGradient)"
            stroke="#E0E7FF"
            strokeWidth="4"
          />
          
          {/* Crack lines - appear when cracking */}
          {isCracking && (
            <>
              <path
                d="M 100 40 L 95 80 L 105 100 L 100 140"
                stroke="#8B7355"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-fade-in"
              />
              <path
                d="M 60 120 L 80 130 L 70 150"
                stroke="#8B7355"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-fade-in"
                style={{ animationDelay: '0.1s' }}
              />
              <path
                d="M 140 120 L 120 130 L 130 150"
                stroke="#8B7355"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              />
            </>
          )}
          
          {/* Shine effect */}
          <ellipse
            cx="75"
            cy="100"
            rx="20"
            ry="30"
            fill="white"
            opacity="0.4"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="eggGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#FCD34D" />
            </linearGradient>
          </defs>
        </svg>
      </button>

      {/* Tap counter hint - responsive sizing */}
      {tapCount < 3 && !isDisappearing && (
        <p className="mt-4 md:mt-5 text-center text-sm md:text-base font-bold text-gray-700 animate-pulse bg-white/80 px-4 py-2 rounded-full shadow-lg">
          ✨ Tap the egg to hatch! ({tapCount}/3)
        </p>
      )}

      {tapCount === 3 && !isDisappearing && (
        <p className="mt-4 md:mt-5 text-center text-lg md:text-xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent animate-bounce">
          Your pet is hatching! 🐣
        </p>
      )}
    </div>
  )
}
