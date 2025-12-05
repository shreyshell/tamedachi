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
    if (tapCount >= 3 || isDisappearing) return

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
    <button
      onClick={handleTap}
      disabled={tapCount >= 3}
      className={`
        relative cursor-pointer transition-all duration-300 touch-manipulation
        ${getShakeClass()}
        ${isCracking ? 'animate-crack' : ''}
        ${isDisappearing ? 'animate-disappear' : ''}
        ${tapCount >= 3 ? 'cursor-default' : 'hover:scale-105 active:scale-95'}
      `}
      aria-label="Tap the egg to hatch your pet"
      style={{
        width: '300px',
        height: '399px'
      }}
    >
      {/* Egg SVG - matching Figma dimensions */}
      <svg
        width="300"
        height="399"
        viewBox="0 0 300 399"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Main egg shape */}
        <ellipse
          cx="150"
          cy="230"
          rx="120"
          ry="150"
          fill="url(#eggGradient)"
          stroke="#E0E7FF"
          strokeWidth="4"
        />
        
        {/* Crack lines - appear when cracking */}
        {isCracking && (
          <>
            <path
              d="M 150 80 L 142 140 L 158 170 L 150 230"
              stroke="#8B7355"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-fade-in"
            />
            <path
              d="M 90 200 L 120 215 L 105 245"
              stroke="#8B7355"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            />
            <path
              d="M 210 200 L 180 215 L 195 245"
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
          cx="112"
          cy="170"
          rx="30"
          ry="45"
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
  )
}
