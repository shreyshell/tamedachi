'use client'

import { useState } from 'react'

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4"
      onClick={handleClose}
      onTouchEnd={handleClose}
    >
      <div
        className="relative w-full max-w-md md:max-w-lg rounded-3xl bg-white p-5 md:p-6 lg:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto border-4 border-sky-100"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Close button - responsive sizing */}
        <button
          onClick={handleClose}
          onTouchEnd={handleClose}
          disabled={isLoading}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 touch-manipulation"
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

        {/* Header - responsive sizing */}
        <div className="mb-5 md:mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Analyze Content 🔗
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Submit a URL to check its credibility and feed your Tamedachi!
          </p>
        </div>

        {/* URL Input Form - responsive sizing */}
        <form onSubmit={handleSubmit} className="mb-5 md:mb-6">
          <div className="mb-4">
            <label
              htmlFor="url-input"
              className="block text-sm md:text-base font-semibold text-gray-700 mb-2"
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
              className="w-full px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-300 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoComplete="off"
            />
            {error && (
              <p className="mt-2 text-xs md:text-sm text-red-600 font-medium animate-fade-in">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Submit Button - responsive sizing */}
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full py-3 md:py-3.5 px-4 text-sm md:text-base bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl touch-manipulation"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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

        {/* Example URLs Section - responsive sizing */}
        <div className="border-t-2 border-gray-100 pt-4">
          <h3 className="text-sm md:text-base font-bold text-gray-700 mb-3">
            ✨ Try these examples:
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleExampleClick('https://www.bbc.com/news')}
              onTouchEnd={() => handleExampleClick('https://www.bbc.com/news')}
              disabled={isLoading}
              className="w-full text-left px-4 py-3 text-sm md:text-base text-sky-600 font-medium bg-sky-50 hover:bg-sky-100 active:bg-sky-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation border-2 border-sky-100"
            >
              📰 BBC News
            </button>
            <button
              type="button"
              onClick={() => handleExampleClick('https://www.nature.com')}
              onTouchEnd={() => handleExampleClick('https://www.nature.com')}
              disabled={isLoading}
              className="w-full text-left px-4 py-3 text-sm md:text-base text-sky-600 font-medium bg-sky-50 hover:bg-sky-100 active:bg-sky-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation border-2 border-sky-100"
            >
              🔬 Nature Journal
            </button>
            <button
              type="button"
              onClick={() => handleExampleClick('https://www.wikipedia.org')}
              onTouchEnd={() => handleExampleClick('https://www.wikipedia.org')}
              disabled={isLoading}
              className="w-full text-left px-4 py-3 text-sm md:text-base text-sky-600 font-medium bg-sky-50 hover:bg-sky-100 active:bg-sky-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation border-2 border-sky-100"
            >
              📚 Wikipedia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
