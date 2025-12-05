/**
 * SubmissionService for Tamedachi
 * 
 * Handles all content submission operations including creation,
 * history retrieval, and score calculations.
 */

import { createClient as createServerClient } from '@/lib/supabase/server'
import { ContentSubmission, ContentAnalysisResult } from '@/lib/types'
import { Database } from '@/lib/types/database'

/**
 * Converts database row to ContentSubmission interface
 */
function dbRowToSubmission(row: Database['public']['Tables']['content_submissions']['Row']): ContentSubmission {
  return {
    id: row.id,
    userId: row.user_id,
    petId: row.pet_id,
    url: row.url,
    credibilityScore: row.credibility_score,
    qualityCategory: row.quality_category,
    isGoodContent: row.is_good_content,
    submittedAt: new Date(row.submitted_at),
  }
}

/**
 * Creates a new content submission in the database
 * 
 * @param userId - The user's ID
 * @param petId - The pet's ID
 * @param analysisResult - The content analysis result from OpenAI
 * @returns The newly created submission
 * @throws Error if database operation fails
 */
export async function createSubmission(
  userId: string,
  petId: string,
  analysisResult: ContentAnalysisResult
): Promise<ContentSubmission> {
  const supabase = await createServerClient()

  const insertData: Database['public']['Tables']['content_submissions']['Insert'] = {
    user_id: userId,
    pet_id: petId,
    url: analysisResult.url,
    credibility_score: analysisResult.credibilityScore,
    quality_category: analysisResult.qualityCategory,
    is_good_content: analysisResult.isGoodContent,
  }

  const { data, error } = await supabase
    .from('content_submissions')
    // @ts-expect-error - Supabase type inference issue with SSR
    .insert(insertData)
    .select()
    .single()

  if (error) {
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error creating submission:', {
      code: error.code,
      message: error.message,
      details: error.details,
      userId,
      petId,
      url: analysisResult.url,
    })
    throw new Error(`Failed to create submission: ${error.message}`)
  }

  if (!data) {
    console.error('No data returned when creating submission:', { userId, petId })
    throw new Error('Failed to create submission: No data returned')
  }

  return dbRowToSubmission(data)
}

/**
 * Retrieves submission history for a user
 * 
 * @param userId - The user's ID
 * @param limit - Optional limit on number of submissions to return (default: all)
 * @returns Array of content submissions, ordered by most recent first
 * @throws Error if database operation fails
 */
export async function getSubmissionHistory(
  userId: string,
  limit?: number
): Promise<ContentSubmission[]> {
  const supabase = await createServerClient()

  let query = supabase
    .from('content_submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    // Log database errors for monitoring (Requirement 7.5)
    console.error('Database error getting submission history:', {
      code: error.code,
      message: error.message,
      userId,
      limit,
    })
    throw new Error(`Failed to get submission history: ${error.message}`)
  }

  if (!data) {
    return []
  }

  return data.map(dbRowToSubmission)
}

/**
 * Calculates the average credibility score from all submissions for a user
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
