/**
 * Scoring utilities for Tamedachi
 * 
 * Functions for categorizing content quality scores and calculating
 * pet health states based on credibility scores.
 */

import { QualityCategory, PetHealthState, PetHealthStateInfo } from '../types';

/**
 * Categorizes a credibility score into a quality message.
 * 
 * Score ranges:
 * - 80-100: Excellent source! High credibility.
 * - 60-79: Good source. Generally reliable.
 * - 40-59: Questionable source. Be cautious.
 * - 0-39: Poor source. Low credibility.
 * 
 * @param score - Credibility score from 0 to 100
 * @returns Quality message string
 */
export function categorizeScore(score: number): string {
  if (score >= 80) {
    return "Excellent source! High credibility.";
  } else if (score >= 60) {
    return "Good source. Generally reliable.";
  } else if (score >= 40) {
    return "Questionable source. Be cautious.";
  } else {
    return "Poor source. Low credibility.";
  }
}

/**
 * Maps a credibility score to a quality category.
 * 
 * @param score - Credibility score from 0 to 100
 * @returns Quality category
 */
export function getQualityCategory(score: number): QualityCategory {
  if (score >= 80) {
    return 'excellent';
  } else if (score >= 60) {
    return 'good';
  } else if (score >= 40) {
    return 'questionable';
  } else {
    return 'poor';
  }
}

/**
 * Calculates the health state of a pet based on its health score.
 * 
 * Health state ranges:
 * - 80-100: Very Happy
 * - 60-79: Healthy
 * - 40-59: Neutral
 * - 20-39: Unhappy
 * - 0-19: Sick
 * 
 * @param healthScore - Pet health score from 0 to 100
 * @returns Pet health state information
 */
export function calculateHealthState(healthScore: number): PetHealthStateInfo {
  if (healthScore >= 80) {
    return {
      state: 'very-happy',
      message: 'Your Tamedachi is thriving! Keep up the great media diet!'
    };
  } else if (healthScore >= 60) {
    return {
      state: 'healthy',
      message: 'Your pet is doing well! Healthy and happy.'
    };
  } else if (healthScore >= 40) {
    return {
      state: 'neutral',
      message: 'Your pet is okay, but could use better content.'
    };
  } else if (healthScore >= 20) {
    return {
      state: 'unhappy',
      message: 'Your pet needs better content. Feed it quality sources!'
    };
  } else {
    return {
      state: 'sick',
      message: 'Your pet is struggling. Time for a healthier media diet!'
    };
  }
}

/**
 * Calculates the age of a pet in years based on good content count.
 * 
 * Age formula: floor(goodContentCount / 100)
 * 
 * @param goodContentCount - Number of good content pieces consumed
 * @returns Age in years
 */
export function calculateAge(goodContentCount: number): number {
  return Math.floor(goodContentCount / 100);
}

/**
 * Validates a URL format.
 * 
 * Checks for:
 * - Non-empty string
 * - Valid URL format
 * - HTTP or HTTPS protocol only
 * 
 * @param url - URL string to validate
 * @returns Object with isValid flag and optional error message
 */
export function validateURL(url: string): { isValid: boolean; error?: string } {
  // Check for empty string
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a URL'
    };
  }

  // Try to parse the URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL (e.g., https://example.com)'
    };
  }

  // Check for HTTP or HTTPS protocol
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      error: 'Only HTTP and HTTPS URLs are supported'
    };
  }

  return { isValid: true };
}
