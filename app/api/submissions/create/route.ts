/**
 * API Route: /api/submissions/create
 * Creates a new content submission and updates pet health
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createSubmission } from '@/lib/services/submissions';
import { updatePetHealth, incrementGoodContent } from '@/lib/services/pet';
import { calculateAverageScore } from '@/lib/services/submissions';
import { ContentAnalysisResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { petId, analysisResult } = body;

    // Validate required fields
    if (!petId || typeof petId !== 'string') {
      return NextResponse.json(
        { error: 'Pet ID is required and must be a string' },
        { status: 400 }
      );
    }

    if (!analysisResult || typeof analysisResult !== 'object') {
      return NextResponse.json(
        { error: 'Analysis result is required and must be an object' },
        { status: 400 }
      );
    }

    // Validate analysisResult structure
    const requiredFields = ['url', 'credibilityScore', 'qualityCategory', 'isGoodContent'];
    for (const field of requiredFields) {
      if (!(field in analysisResult)) {
        return NextResponse.json(
          { error: `Analysis result missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate credibility score range
    if (
      typeof analysisResult.credibilityScore !== 'number' ||
      analysisResult.credibilityScore < 0 ||
      analysisResult.credibilityScore > 100
    ) {
      return NextResponse.json(
        { error: 'Credibility score must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    // Create the submission
    const submission = await createSubmission(
      user.id,
      petId,
      analysisResult as ContentAnalysisResult
    );

    // Update pet health based on new average score
    const newAverageScore = await calculateAverageScore(user.id);
    await updatePetHealth(petId, newAverageScore);

    // If this is good content (score >= 50), increment the good content counter
    if (analysisResult.isGoodContent) {
      await incrementGoodContent(petId);
    }

    // Return success response with submission data
    return NextResponse.json(
      {
        success: true,
        submission,
        message: 'Content submission created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    // Log error for debugging
    console.error('Submission creation error:', error);

    // Handle different error types
    if (error instanceof Error) {
      // Check for database errors
      if (error.message.includes('Failed to create submission')) {
        return NextResponse.json(
          { error: 'Failed to save submission. Please try again.' },
          { status: 500 }
        );
      }

      if (error.message.includes('Failed to update pet')) {
        return NextResponse.json(
          { error: 'Failed to update pet health. Please try again.' },
          { status: 500 }
        );
      }

      if (error.message.includes('Failed to increment good content')) {
        return NextResponse.json(
          { error: 'Failed to update pet progress. Please try again.' },
          { status: 500 }
        );
      }

      // Return sanitized error message
      return NextResponse.json(
        { error: 'Submission creation failed. Please try again later.' },
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
