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
      const trimmedUrl = url.trim()
      if (!trimmedUrl) {
        setError('Please enter a URL')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
        
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
          
          if (submissionResponse.status === 401) {
            setError('Your session has expired. Please log in again.')
            setIsLoading(false)
            return
          }
          
          console.error('Failed to create submission:', submissionError)
          setError('Analysis complete, but failed to save. Your pet may not update.')
        }
      }

      onAnalysisComplete({
        score: data.credibilityScore,
        qualityMessage: data.qualityMessage,
        analysis: data.analysis,
      })

      setUrl('')
      setIsLoading(false)
      onClose()
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('No internet connection. Please check your network.')
      } else {
        setError('Network error. Please check your connection and try again.')
      }
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setUrl('')
      setError(null)
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-50"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        onClick={handleClose}
      />
      
      {/* Modal Container - X=37, Y=269, W=366, H=508 */}
      <div 
        className="absolute rounded-[32px] z-50"
        onClick={(e) => e.stopPropagation()}
        style={{
          left: '37px',
          top: '269px',
          width: '366px',
          height: '508px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header - X=24, Y=24 */}
        <div 
          className="absolute"
          style={{
            left: '24px',
            top: '24px',
            width: '318px'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
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
                Check Media Content
              </h2>
              <p 
                className="font-normal mt-1"
                style={{
                  fontSize: '16px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6B7280'
                }}
              >
                Enter a URL to analyze its credibility
              </p>
            </div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
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
        </div>

        {/* URL Input Container - X=24, Y=96 */}
        <form onSubmit={handleSubmit}>
          <div 
            className="absolute"
            style={{
              left: '24px',
              top: '96px',
              width: '318px'
            }}
          >
            {/* URL Input Box */}
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              disabled={isLoading}
              className="w-full rounded-lg font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              style={{
                height: '52px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                fontSize: '16px',
                lineHeight: '19px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#000000'
              }}
            />

            {/* Error Message */}
            {error && (
              <div 
                className="mt-3 rounded-lg font-normal"
                style={{
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#DC2626'
                }}
              >
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 rounded-xl font-medium transition-all hover:shadow-2xl flex items-center justify-center gap-2"
              style={{
                height: '56px',
                background: 'linear-gradient(135deg, #FFF085 0%, #FFDF20 50%, #FDC700 100%)',
                fontSize: '16px',
                lineHeight: '24px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#000000',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze Content'
              )}
            </button>

            {/* Examples */}
            <div className="mt-6">
              <p 
                className="font-normal mb-2"
                style={{
                  fontSize: '16px',
                  lineHeight: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6B7280'
                }}
              >
                Try these examples:
              </p>
              <div className="space-y-2">
                {['https://www.bbc.com/news', 'https://www.reuters.com/world', 'https://www.npr.org/sections/news'].map((exampleUrl) => (
                  <button
                    key={exampleUrl}
                    type="button"
                    onClick={() => setUrl(exampleUrl)}
                    disabled={isLoading}
                    className="w-full text-left rounded-lg font-normal transition-colors hover:bg-white/50 disabled:opacity-50"
                    style={{
                      height: '36px',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontFamily: 'Fredoka, sans-serif',
                      color: '#4B5563'
                    }}
                  >
                    {exampleUrl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
