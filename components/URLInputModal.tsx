'use client'

import { useState } from 'react'
import LogoutButton from './LogoutButton'

interface URLInputModalProps {
  isOpen: boolean
  onClose: () => void
  onAnalysisComplete: (result: {
    score: number
    qualityMessage: string
    analysis?: string
  }) => void
  petId: string | null
}

/**
 * URLInputModal component for submitting URLs for content analysis
 * 
 * Requirements:
 * - 2.1: Display input field for URL entry when middle navigation button is clicked
 * - 2.2: Send valid URLs to Content Analysis service
 * - 2.4: Clear input field on successful submission
 * - 2.5: Display error messages for invalid URLs
 */
export default function URLInputModal({
  isOpen,
  onClose,
  onAnalysisComplete,
  petId,
}: URLInputModalProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate URL on submit (Requirement 2.2, 2.5)
      const trimmedUrl = url.trim()
      if (!trimmedUrl) {
        setError('Please enter a URL')
        setIsLoading(false)
        return
      }

      // Call /api/analyze-content (Requirement 2.2)
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      })

      // Handle network errors
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
        
        // Handle specific error types (Requirement 7.5)
        if (response.status === 429) {
          setError('Too many requests. Please wait a moment and try again.')
        } else if (response.status === 504) {
          setError('Request timed out. Please try again.')
        } else if (response.status === 401) {
          setError('Your session has expired. Please log in again.')
        } else if (response.status === 400) {
          setError(data.error || 'Invalid URL format. Please check and try again.')
        } else {
          setError(data.error || 'Failed to analyze content. Please try again later.')
        }
        setIsLoading(false)
        return
      }

      const data = await response.json()

      // Create submission to persist the analysis
      if (petId) {
        const submissionResponse = await fetch('/api/submissions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            petId,
            analysisResult: data,
          }),
        })

        if (!submissionResponse.ok) {
          const submissionError = await submissionResponse.json().catch(() => ({ error: 'Unknown error' }))
          
          // Handle submission errors (Requirement 7.5)
          if (submissionResponse.status === 401) {
            setError('Your session has expired. Please log in again.')
            setIsLoading(false)
            return
          }
          
          console.error('Failed to create submission:', submissionError)
          // Continue to show results even if submission fails
          setError('Analysis complete, but failed to save. Your pet may not update.')
        }
      }

      // Show results in ScoreDisplay (Requirement 2.2)
      onAnalysisComplete({
        score: data.credibilityScore,
        qualityMessage: data.qualityMessage,
        analysis: data.analysis,
      })

      // Clear input field on success (Requirement 2.4)
      setUrl('')
      setIsLoading(false)
      
      // Close modal after successful submission (only if no error)
      if (!error) {
        onClose()
      }
    } catch (err) {
      console.error('Error analyzing content:', err)
      
      // Handle different types of network errors (Requirement 7.5)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('No internet connection. Please check your network.')
      } else {
        setError('Network error. Please check your connection and try again.')
      }
      setIsLoading(false)
    }
  }

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl)
    setError(null)
  }

  const handleClose = () => {
    if (!isLoading) {
      setUrl('')
      setError(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black">
      {/* Fixed iPhone 16 Pro Max container (440x956) */}
      <div className="relative w-[440px] h-[956px] overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F2F7]">
        {/* Logout Button */}
        <LogoutButton />

        {/* Background Decorative Vectors - Exact Figma Positions */}
        <div className="absolute" style={{ left: '255px', top: '106px' }}>
          <img src="/cloud1.svg" alt="" width={414.38} height={143.73} />
        </div>
        <div className="absolute" style={{ left: '-283px', top: '238px' }}>
          <img src="/cloud2.svg" alt="" width={676.94} height={151.91} />
        </div>
        <div className="absolute" style={{ left: '-293px', top: '23px' }}>
          <img src="/cloud3.svg" alt="" width={552.38} height={106.89} />
        </div>
        <div className="absolute" style={{ left: '116px', top: '145px' }}>
          <img src="/satellite.svg" alt="" width={79.36} height={79.36} />
        </div>
        <div className="absolute" style={{ left: '-85px', top: '793px' }}>
          <img src="/nature.svg" alt="" width={610} height={163} />
        </div>

        {/* Modal Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-6 py-8">
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
          onClick={handleClose}
          onTouchEnd={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors disabled:opacity-50 touch-manipulation"
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
            Check Content
          </h2>
          <p className="text-base text-white/90">
            Submit a URL to check its credibility
          </p>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="url-input"
              className="block text-sm font-semibold text-white mb-2"
            >
              Enter URL
            </label>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError(null)
              }}
              placeholder="https://example.com/article"
              disabled={isLoading}
              className="w-full px-4 py-3 text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(255, 255, 255, 0.5)'
              }}
              autoComplete="off"
            />
            {error && (
              <p className="mt-2 text-sm text-red-200 font-medium animate-fade-in bg-red-500/30 px-3 py-2 rounded-lg">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full py-3 px-4 text-base font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl touch-manipulation hover:scale-105 active:scale-95"
            style={{
              background: isLoading || !url.trim() 
                ? 'rgba(200, 200, 200, 0.5)' 
                : 'linear-gradient(to right, #FFF085, #FFDF20, #FDC700)',
              color: '#000'
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Content'
            )}
          </button>
        </form>
        </div>
      </div>
      </div>
    </div>
  )
}
