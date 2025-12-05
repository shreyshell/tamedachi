'use client'

import { useState } from 'react'

interface ScoreDisplayProps {
  score: number
  qualityMessage: string
  analysis?: string
  onClose: () => void
}

/**
 * ScoreDisplay component shows content analysis results as an overlay
 * with color-coded score, quality message, and optional detailed analysis.
 * 
 * Requirements:
 * - 6.1: Green color for scores >= 50
 * - 6.2: Red color for scores < 50
 * - 6.3: Display both numerical score and quality message
 */
export default function ScoreDisplay({ 
  score, 
  qualityMessage, 
  analysis,
  onClose 
}: ScoreDisplayProps) {
  const [showAnalysis, setShowAnalysis] = useState(false)
  
  // Determine color based on score threshold (Requirements 6.1, 6.2)
  const scoreColor = score >= 50 ? 'text-green-600' : 'text-red-600'
  const bgColor = score >= 50 ? 'bg-green-50' : 'bg-red-50'
  const borderColor = score >= 50 ? 'border-green-200' : 'border-red-200'

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4"
      onClick={onClose}
      onTouchEnd={onClose}
    >
      <div 
        className={`
          relative w-full max-w-md md:max-w-lg rounded-3xl border-4 p-5 md:p-6 lg:p-8 shadow-2xl
          ${bgColor} ${borderColor}
          animate-fade-in max-h-[90vh] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Close button - responsive sizing */}
        <button
          onClick={onClose}
          onTouchEnd={onClose}
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

        {/* Score display (Requirement 6.3) - responsive sizing */}
        <div className="text-center mb-5 md:mb-6">
          <div className="mb-3">
            <span className="text-gray-700 text-base md:text-lg font-bold">Content Quality Score</span>
          </div>
          <div className={`text-6xl md:text-7xl lg:text-8xl font-extrabold ${scoreColor} mb-4 md:mb-5 drop-shadow-lg`}>
            {score}/100
          </div>
          
          {/* Quality message (Requirement 6.3) - responsive sizing */}
          <div className={`text-xl md:text-2xl lg:text-3xl font-bold ${scoreColor} px-2`}>
            {qualityMessage}
          </div>
        </div>

        {/* Visual indicator - responsive sizing */}
        <div className="mb-5 md:mb-6">
          <div className="relative w-full h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`
                absolute top-0 left-0 h-full rounded-full transition-all duration-700
                ${score >= 50 ? 'bg-green-500' : 'bg-red-500'}
              `}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Read Summary link - responsive sizing */}
        {analysis && (
          <div className="text-center">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              onTouchEnd={() => setShowAnalysis(!showAnalysis)}
              className="text-sm md:text-base text-sky-600 hover:text-sky-700 active:text-sky-800 font-bold underline transition-colors touch-manipulation"
            >
              {showAnalysis ? '📖 Hide Summary' : '📖 Read Summary'}
            </button>
            
            {showAnalysis && (
              <div className="mt-4 p-4 md:p-5 bg-white rounded-xl text-left text-sm md:text-base text-gray-700 animate-fade-in border-2 border-gray-200 shadow-inner">
                {analysis}
              </div>
            )}
          </div>
        )}

        {/* Action buttons - responsive sizing */}
        <div className="mt-5 md:mt-6 flex gap-3">
          <button
            onClick={onClose}
            onTouchEnd={onClose}
            className="flex-1 py-3 md:py-3.5 px-4 text-sm md:text-base bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl font-bold text-white hover:from-sky-600 hover:to-blue-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl touch-manipulation"
          >
            ✨ Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
