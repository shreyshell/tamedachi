'use client'

import { useState } from 'react'
import LogoutButton from './LogoutButton'

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-8" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
        <div 
          className="relative w-full max-w-md rounded-[32px] p-8 animate-fade-in max-h-[90vh] overflow-y-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
        {/* Close button */}
        <button
          onClick={onClose}
          onTouchEnd={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors touch-manipulation"
          aria-label="Close"
        >
          <svg 
            className="w-6 h-6" 
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

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Content Analysis
          </h2>
        </div>

        {/* Score display */}
        <div className="text-center mb-6">
          <div className={`text-7xl font-extrabold mb-4 drop-shadow-lg`}
            style={{ 
              color: score >= 50 ? '#4CAF50' : '#F44336'
            }}
          >
            {score}/100
          </div>
          
          {/* Quality message */}
          <div className="text-2xl font-bold text-white px-2 mb-4">
            {qualityMessage}
          </div>

          {/* Visual indicator */}
          <div className="w-full rounded-full h-4 overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ 
                width: `${score}%`,
                background: score >= 50 ? '#4CAF50' : '#F44336'
              }}
            />
          </div>
        </div>

        {/* Analysis Summary */}
        {analysis && (
          <div className="mb-6">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              onTouchEnd={() => setShowAnalysis(!showAnalysis)}
              className="text-base text-white hover:text-gray-200 font-bold underline transition-colors touch-manipulation mb-3"
            >
              {showAnalysis ? '📖 Hide Summary' : '📖 Read Summary'}
            </button>
            
            {showAnalysis && (
              <div className="p-4 rounded-xl text-left text-sm text-white/90 animate-fade-in"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {analysis}
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        <button
          onClick={onClose}
          onTouchEnd={onClose}
          className="w-full py-3 px-4 text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-xl touch-manipulation hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(to right, #FFF085, #FFDF20, #FDC700)',
            color: '#000'
          }}
        >
          Got it!
        </button>
        </div>
    </div>
  )
}
