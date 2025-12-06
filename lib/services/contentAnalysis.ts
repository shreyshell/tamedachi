/**
 * Content Analysis Service
 * Analyzes URLs for credibility using OpenAI API
 */

import OpenAI from 'openai';
import type { ContentAnalysisResult, QualityCategory } from '@/lib/types';

// Initialize OpenAI client with configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 3, // Retry up to 3 times with exponential backoff
});

/**
 * Categorizes a credibility score into a quality category and message
 * @param score - Credibility score from 0-100
 * @returns Quality category and human-readable message
 */
function categorizeScore(score: number): { category: QualityCategory; message: string } {
  if (score >= 80) {
    return {
      category: 'excellent',
      message: 'Excellent source! High credibility.',
    };
  }
  if (score >= 60) {
    return {
      category: 'good',
      message: 'Good source. Generally reliable.',
    };
  }
  if (score >= 40) {
    return {
      category: 'questionable',
      message: 'Questionable source. Be cautious.',
    };
  }
  return {
    category: 'poor',
    message: 'Poor source. Low credibility.',
  };
}

/**
 * Analyzes a URL for content credibility using OpenAI API
 * @param url - The URL to analyze
 * @returns Content analysis result with credibility score and quality assessment
 * @throws Error if OpenAI API call fails or returns invalid data
 */
export async function analyzeContent(url: string): Promise<ContentAnalysisResult> {
  try {
    const prompt = `Analyze the credibility and quality of the specific content at this URL: ${url}

Please evaluate based on:
1. **Source Domain**: Reputation, authority, and track record of the publication
2. **Author Analysis**: Author's credentials, expertise, past work, and reputation (if identifiable)
3. **Content Quality**: Presence of fact-checking, citations, sources, and evidence
4. **Bias & Tone**: Potential bias, sensationalism, clickbait, or misleading framing
5. **Specific Content**: Any red flags, claims that need verification, or important context about THIS specific article/content

Respond in JSON format with:
{
  "score": <number 0-100>,
  "reasons": [<array of 2-3 brief reasons for the score>],
  "analysis": "<detailed explanation covering: 1) the source's reputation, 2) author credentials/background if available, 3) specific content quality and any important notes about claims, context, or things to watch for in THIS particular piece>"
}

Be fair but critical. Evaluate the SPECIFIC CONTENT and author, not just the domain. A score of 50+ indicates generally trustworthy content.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a media literacy expert who evaluates the credibility of news sources and online content. Analyze the SPECIFIC article/content, including author credentials and any important context or claims that readers should be aware of. Provide objective, balanced, and detailed assessments that go beyond just the domain reputation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent scoring
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI API');
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseContent);
    
    // Validate and clamp score to 0-100 range (Requirement 7.5)
    let credibilityScore = Number(parsed.score);
    if (isNaN(credibilityScore)) {
      console.error('Invalid score from OpenAI:', parsed.score);
      throw new Error('Invalid score returned from OpenAI API');
    }
    credibilityScore = Math.max(0, Math.min(100, credibilityScore));

    // Categorize the score
    const { category, message } = categorizeScore(credibilityScore);

    // Determine if this is good content (score >= 50)
    const isGoodContent = credibilityScore >= 50;

    return {
      url,
      credibilityScore,
      qualityCategory: category,
      qualityMessage: message,
      isGoodContent,
      analysis: parsed.analysis || 'No detailed analysis provided.',
    };
  } catch (error) {
    // Handle OpenAI API errors with retry logic (Requirement 7.5)
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });

      // Handle rate limiting
      if (error.status === 429) {
        throw new Error('rate limit exceeded');
      }

      // Handle timeout errors
      if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        throw new Error('timeout');
      }

      // Handle content policy violations
      if (error.type === 'invalid_request_error' && error.message.includes('content_policy')) {
        console.warn('Content policy violation for URL:', url);
        // Return a default low score for policy violations
        return {
          url,
          credibilityScore: 0,
          qualityCategory: 'poor',
          qualityMessage: 'Poor source. Low credibility.',
          isGoodContent: false,
          analysis: 'Content could not be analyzed due to policy restrictions.',
        };
      }

      // Generic API error
      throw new Error(`Content analysis failed: ${error.message}`);
    }

    // Handle JSON parsing errors (Requirement 7.5)
    if (error instanceof SyntaxError) {
      console.error('Failed to parse OpenAI response:', error);
      throw new Error('Content analysis failed: Invalid response format');
    }

    // Log and re-throw other errors (Requirement 7.5)
    console.error('Unexpected error in content analysis:', error);
    throw error;
  }
}
