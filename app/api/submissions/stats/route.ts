import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/submissions/stats
 * 
 * Fetches submission statistics for the authenticated user
 * 
 * Requirements:
 * - 4.7: Calculate and display submission statistics including total checks,
 *        good content count, and accuracy rate
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user (Requirement 7.5)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Authentication error in stats retrieval:', authError)
      return NextResponse.json(
        { error: 'Authentication failed. Please log in again.' },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // Fetch all submissions for the user (Requirement 7.5)
    const { data: submissions, error: submissionsError } = await supabase
      .from('content_submissions')
      .select('credibility_score, is_good_content')
      .eq('user_id', user.id)

    if (submissionsError) {
      // Log database errors for monitoring (Requirement 7.5)
      console.error('Database error fetching submissions:', {
        code: submissionsError.code,
        message: submissionsError.message,
        userId: user.id,
      })
      return NextResponse.json(
        { error: 'Failed to fetch submission statistics. Please try again later.' },
        { status: 500 }
      )
    }

    // Type assertion for submissions data
    type SubmissionData = {
      credibility_score: number
      is_good_content: boolean
    }

    const typedSubmissions = (submissions || []) as SubmissionData[]

    // Calculate statistics
    const totalChecks = typedSubmissions.length
    const goodContentCount = typedSubmissions.filter(s => s.is_good_content).length
    const accuracyRate = totalChecks > 0 ? (goodContentCount / totalChecks) * 100 : 0

    return NextResponse.json({
      totalChecks,
      goodContentCount,
      accuracyRate,
    })
  } catch (error) {
    // Handle unexpected errors with graceful degradation (Requirement 7.5)
    console.error('Unexpected error in submissions stats API:', error)
    
    // Return sanitized error message to client (Requirement 7.5)
    return NextResponse.json(
      { error: 'Failed to retrieve statistics. Please try again later.' },
      { status: 500 }
    )
  }
}
