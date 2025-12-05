/**
 * PetService for Tamedachi
 * 
 * Handles all pet-related operations including creation, retrieval,
 * health updates, and growth tracking.
 */

import { createClient as createServerClient } from '@/lib/supabase/server'
import { Pet, PetHealthState, PetHealthStateInfo } from '@/lib/types'
import { Database } from '@/lib/types/database'
import { calculateAge as calculateAgeHelper, calculateHealthState as calculateHealthStateHelper } from '@/lib/utils/petHelpers'

/**
 * Converts database row to Pet interface
 */
function dbRowToPet(row: Database['public']['Tables']['pets']['Row']): Pet {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    healthScore: row.health_score,
    ageYears: row.age_years,
    goodContentCount: row.good_content_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

/**
 * Creates a new pet for a user
 * 
 * @param userId - The user's ID
 * @returns The newly created pet
 * @throws Error if database operation fails
 */
export async function createPet(userId: string): Promise<Pet> {
  const supabase = await createServerClient()

  const insertData: Database['public']['Tables']['pets']['Insert'] = {
    user_id: userId,
    name: 'Tamedachi',
    health_score: 50, // Start with neutral health
    age_years: 0,
    good_content_count: 0,
  }

  const { data, error } = await supabase
    .from('pets')
    // @ts-expect-error - Supabase type inference issue with SSR
    .insert(insertData)
    .select()
    .single()

  if (error) {
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error creating pet:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to create pet: ${error.message}`)
  }

  if (!data) {
    console.error('No data returned when creating pet for user:', userId)
    throw new Error('Failed to create pet: No data returned')
  }

  return dbRowToPet(data)
}

/**
 * Retrieves a user's pet
 * 
 * @param userId - The user's ID
 * @returns The user's pet, or null if not found
 * @throws Error if database operation fails
 */
export async function getPet(userId: string): Promise<Pet | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - this is expected for new users
      return null
    }
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error getting pet:', {
      code: error.code,
      message: error.message,
      details: error.details,
      userId,
    })
    throw new Error(`Failed to get pet: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return dbRowToPet(data)
}

/**
 * Updates a pet's health score
 * 
 * @param petId - The pet's ID
 * @param newScore - The new health score (0-100)
 * @returns The updated pet
 * @throws Error if database operation fails
 */
export async function updatePetHealth(petId: string, newScore: number): Promise<Pet> {
  const supabase = await createServerClient()

  // Clamp score to valid range (Requirement 7.5)
  const clampedScore = Math.max(0, Math.min(100, newScore))
  
  if (newScore !== clampedScore) {
    console.warn('Health score clamped:', { original: newScore, clamped: clampedScore, petId })
  }

  const { data, error } = await supabase
    .from('pets')
    // @ts-expect-error - Supabase type inference issue with SSR
    .update({
      health_score: clampedScore,
      updated_at: new Date().toISOString(),
    })
    .eq('id', petId)
    .select()
    .single()

  if (error) {
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error updating pet health:', {
      code: error.code,
      message: error.message,
      petId,
      newScore: clampedScore,
    })
    throw new Error(`Failed to update pet health: ${error.message}`)
  }

  if (!data) {
    console.error('No data returned when updating pet health:', petId)
    throw new Error('Failed to update pet health: No data returned')
  }

  return dbRowToPet(data as Database['public']['Tables']['pets']['Row'])
}

/**
 * Updates a pet's health score based on the user's submission history
 * Calculates the average of all credibility scores and updates the pet
 * 
 * @param userId - The user's ID
 * @param petId - The pet's ID
 * @returns The updated pet
 */
export async function updatePetHealthFromSubmissions(userId: string, petId: string): Promise<Pet> {
  const averageScore = await calculateAverageScore(userId)
  return updatePetHealth(petId, averageScore)
}

/**
 * Increments the good content counter and updates pet age
 * 
 * @param petId - The pet's ID
 * @returns The updated pet
 * @throws Error if database operation fails
 */
export async function incrementGoodContent(petId: string): Promise<Pet> {
  const supabase = await createServerClient()

  // First, get the current pet data
  const { data: currentPet, error: fetchError } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single()

  if (fetchError) {
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error fetching pet for increment:', {
      code: fetchError.code,
      message: fetchError.message,
      petId,
    })
    throw new Error(`Failed to fetch pet: ${fetchError.message}`)
  }

  if (!currentPet) {
    console.error('No pet found for increment:', petId)
    throw new Error('Failed to fetch pet: No data returned')
  }

  const typedPet = currentPet as Database['public']['Tables']['pets']['Row']

  // Calculate new values
  const newGoodContentCount = typedPet.good_content_count + 1
  const newAgeYears = calculateAge(newGoodContentCount)

  // Update the pet
  const { data, error } = await supabase
    .from('pets')
    // @ts-expect-error - Supabase type inference issue with SSR
    .update({
      good_content_count: newGoodContentCount,
      age_years: newAgeYears,
      updated_at: new Date().toISOString(),
    })
    .eq('id', petId)
    .select()
    .single()

  if (error) {
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error incrementing good content:', {
      code: error.code,
      message: error.message,
      petId,
      newCount: newGoodContentCount,
    })
    throw new Error(`Failed to increment good content: ${error.message}`)
  }

  if (!data) {
    console.error('No data returned when incrementing good content:', petId)
    throw new Error('Failed to increment good content: No data returned')
  }

  return dbRowToPet(data as Database['public']['Tables']['pets']['Row'])
}

/**
 * Calculates the average credibility score from all submissions
 * This is used to determine the pet's health score
 * 
 * @param userId - The user's ID
 * @returns The average score, or 50 (neutral) if no submissions exist
 * @throws Error if database operation fails
 */
export async function calculateAverageScore(userId: string): Promise<number> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('content_submissions')
    .select('credibility_score')
    .eq('user_id', userId)

  if (error) {
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error calculating average score:', {
      code: error.code,
      message: error.message,
      userId,
    })
    throw new Error(`Failed to calculate average score: ${error.message}`)
  }

  // If no submissions, return neutral score
  if (!data || data.length === 0) {
    return 50
  }

  // Type assertion for the data
  const submissions = data as Array<{ credibility_score: number }>

  // Calculate average
  const sum = submissions.reduce((acc, submission) => acc + submission.credibility_score, 0)
  return sum / submissions.length
}

/**
 * Calculates pet age based on good content count
 * Age = floor(goodContentCount / 100)
 * 
 * @param goodContentCount - The number of good content pieces consumed
 * @returns The pet's age in years
 */
export function calculateAge(goodContentCount: number): number {
  return calculateAgeHelper(goodContentCount)
}

/**
 * Calculates the health state based on health score
 * 
 * @param healthScore - The health score (0-100)
 * @returns The health state information
 */
export function calculateHealthState(healthScore: number): PetHealthStateInfo {
  return calculateHealthStateHelper(healthScore)
}
