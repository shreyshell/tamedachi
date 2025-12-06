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
        className="absolute rounded-[20px] z-50 text-center"
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
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="font-normal underline transition-colors hover:opacity-70"
            style={{
              fontSize: '14px',
              lineHeight: '18px',
              fontFamily: 'Fredoka, sans-serif',
              color: '#6B7280'
            }}
          >
            {showAnalysis ? 'Hide Summary' : 'Read Summary'}
          </button>
        )}
        
        {/* Analysis Summary (expanded) */}
        {showAnalysis && analysis && (
          <div 
            className="mt-3 pt-3 animate-fade-in"
            style={{
              borderTop: '1px solid #E5E7EB'
            }}
          >
            <p 
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#4B5563',
                textAlign: 'left'
              }}
            >
              {analysis}
            </p>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="mt-3 w-full rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                height: '36px',
                background: 'linear-gradient(135deg, #FFF085 0%, #FFDF20 50%, #FDC700 100%)',
                fontSize: '14px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#000000'
              }}
            >
              Got it!
            </button>
          </div>
        )}
      </div>
    </>
  )
}
