/**
 * API Route: /api/analyze-content
 * Analyzes URL content for credibility using OpenAI
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent } from '@/lib/services/contentAnalysis';
import { validateURL } from '@/lib/utils/scoring';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { url } = body;

    // Validate URL input
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate URL format
    const validation = validateURL(url);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Call content analysis service
    const analysisResult = await analyzeContent(url);

    // Return analysis result
    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    // Log error for debugging
    console.error('Content analysis error:', error);

    // Handle different error types
    if (error instanceof Error) {
      // Check for rate limiting or API errors
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      // Check for timeout errors
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      }

      // Return sanitized error message
      return NextResponse.json(
        { error: 'Content analysis failed. Please try again later.' },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
