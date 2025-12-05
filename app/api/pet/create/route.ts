import { createClient } from '@/lib/supabase/server'
import { createPet } from '@/lib/services/pet'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Get the authenticated user (Requirement 7.5)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Authentication error in pet creation:', authError)
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

    // Create the pet (Requirement 7.5)
    const pet = await createPet(user.id)

    return NextResponse.json({
      success: true,
      pet,
    })
  } catch (error) {
    // Handle database errors with graceful degradation (Requirement 7.5)
    console.error('Error creating pet:', error)
    
    // Return sanitized error message to client (Requirement 7.5)
    return NextResponse.json(
      { 
        error: 'Failed to create pet. Please try again later.',
      },
      { status: 500 }
    )
  }
}
