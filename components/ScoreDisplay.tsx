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
    <>
      {/* Compact Score Card - Positioned below pet */}
      <div 
        className="absolute rounded-[20px] z-40 text-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          left: '110px',
          top: '680px',
          width: '220px',
          background: '#FFFFFF',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '16px 20px'
        }}
      >
        {/* Score */}
        <p 
          className="font-normal mb-2"
          style={{
            fontSize: '16px',
            lineHeight: '20px',
            fontFamily: 'Fredoka, sans-serif',
            color: score >= 50 ? '#10B981' : '#EF4444',
            fontWeight: 500
          }}
        >
          Score: {score}/100
        </p>
        
        {/* Quality message */}
        <p 
          className="font-normal mb-2"
          style={{
            fontSize: '14px',
            lineHeight: '18px',
            fontFamily: 'Fredoka, sans-serif',
            color: '#6B7280'
          }}
        >
          {qualityMessage}
        </p>

        {/* Read Summary link */}
        {analysis && (
          <button
            onClick={() => setShowAnalysis(true)}
            className="font-normal underline transition-colors hover:opacity-70"
            style={{
              fontSize: '14px',
              lineHeight: '18px',
              fontFamily: 'Fredoka, sans-serif',
              color: '#6B7280'
            }}
          >
            Read Summary
          </button>
        )}
      </div>

      {/* Summary Modal Overlay */}
      {showAnalysis && analysis && (
        <>
          {/* Overlay */}
          <div 
            className="absolute inset-0 z-[60]"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => setShowAnalysis(false)}
          />
          
          {/* Modal Container */}
          <div 
            className="absolute rounded-[32px] z-[60] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              left: '27px',
              top: '200px',
              width: '387px',
              maxHeight: '556px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6" style={{ height: '36px' }}>
              <h2 
                className="font-normal"
                style={{
                  fontSize: '18px',
                  lineHeight: '22px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 400,
                  color: '#000000'
                }}
              >
                Analysis Summary
              </h2>
              
              {/* Close button */}
              <button
                onClick={() => setShowAnalysis(false)}
                className="flex items-center justify-center transition-opacity hover:opacity-70"
                style={{
                  width: '36px',
                  height: '36px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 6l8 8M14 6l-8 8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Score display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: '#6B7280'
                  }}
                >
                  Content Score
                </p>
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '32px',
                    lineHeight: '32px',
                    fontFamily: 'Fredoka, sans-serif',
                    color: score >= 50 ? '#10B981' : '#EF4444'
                  }}
                >
                  {score}/100
                </p>
              </div>
              
              {/* Progress bar */}
              <div 
                className="w-full rounded-full overflow-hidden mb-2"
                style={{
                  height: '16px',
                  background: 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <div 
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${score}%`,
                    background: score >= 50 ? '#10B981' : '#EF4444'
                  }}
                />
              </div>

              {/* Quality message */}
              <p 
                className="font-normal"
                style={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6B7280'
                }}
              >
                {qualityMessage}
              </p>
            </div>

            {/* Analysis text */}
            <div 
              className="rounded-xl mb-6"
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <p 
                style={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#4B5563'
                }}
              >
                {analysis}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-full rounded-xl font-medium transition-all hover:shadow-2xl"
              style={{
                height: '56px',
                background: 'linear-gradient(135deg, #FFF085 0%, #FFDF20 50%, #FDC700 100%)',
                fontSize: '16px',
                lineHeight: '24px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#000000',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            >
              Got it!
            </button>
          </div>
        </>
      )}
    </>
  )
}
