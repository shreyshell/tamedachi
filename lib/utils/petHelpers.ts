/**
 * Pet Helper Utilities
 * 
 * Client-safe utility functions for pet calculations and state management.
 * These functions can be used in both client and server components.
 */

import { PetHealthState, PetHealthStateInfo } from '@/lib/types'

/**
 * Calculates the health state based on health score
 * 
 * @param healthScore - The health score (0-100)
 * @returns The health state information
 */
export function calculateHealthState(healthScore: number): PetHealthStateInfo {
  let state: PetHealthState
  let message: string

  if (healthScore >= 80) {
    state = 'very-happy'
    message = 'Your Tamedachi is thriving! Keep up the excellent media diet!'
  } else if (healthScore >= 60) {
    state = 'healthy'
    message = 'Your Tamedachi is doing well! Good job choosing quality content.'
  } else if (healthScore >= 40) {
    state = 'neutral'
    message = 'Your Tamedachi is okay, but could use better content.'
  } else if (healthScore >= 20) {
    state = 'unhappy'
    message = 'Your Tamedachi is struggling. Try feeding it better sources!'
  } else {
    state = 'sick'
    message = 'Your Tamedachi needs help! Focus on high-quality, credible sources.'
  }

  return { state, message }
}

/**
 * Calculates pet age based on good content count
 * Age = floor(goodContentCount / 100)
 * 
 * @param goodContentCount - The number of good content pieces consumed
 * @returns The pet's age in years
 */
export function calculateAge(goodContentCount: number): number {
  return Math.floor(goodContentCount / 100)
}
