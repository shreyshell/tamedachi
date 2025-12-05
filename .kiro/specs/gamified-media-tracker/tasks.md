# Implementation Plan

- [x] 1. Initialize Next.js project with TypeScript and Tailwind CSS
  - Create Next.js 14+ project with App Router
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom design tokens from Figma
  - Install dependencies: @supabase/supabase-js, @supabase/ssr, openai, fast-check, vitest
  - Configure environment variables structure
  - _Requirements: 8.1, 8.2_

- [x] 2. Set up Supabase project and database schema
  - Create Supabase project (or connect to existing)
  - Create `pets` table with columns: id, user_id, name, health_score, age_years, good_content_count, created_at, updated_at
  - Create `content_submissions` table with columns: id, user_id, pet_id, url, credibility_score, quality_category, is_good_content, submitted_at
  - Configure Row Level Security (RLS) policies for user data isolation
  - Set up database indexes on user_id and pet_id columns
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 3. Implement core utility functions and types
- [x] 3.1 Create TypeScript types and interfaces
  - Define Pet, ContentSubmission, ContentAnalysisResult interfaces
  - Define PetHealthState, QualityCategory types
  - Create Supabase database types
  - _Requirements: 7.2, 7.3_

- [x] 3.2 Implement score categorization function
  - Write categorizeScore function (0-100 → quality message)
  - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [ ]* 3.3 Write property test for score categorization
  - **Property 9: Score categorization is correct**
  - **Validates: Requirements 3.3, 3.4, 3.5, 3.6**

- [x] 3.4 Implement health state mapping function
  - Write calculateHealthState function (score → health state)
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ]* 3.5 Write property test for health state mapping
  - **Property 10: Health state mapping is correct**
  - **Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.6**

- [x] 3.6 Implement age calculation function
  - Write calculateAge function (goodContentCount → age in years)
  - _Requirements: 5.2, 5.4_

- [ ]* 3.7 Write property test for age calculation
  - **Property 12: Age calculation is correct**
  - **Validates: Requirements 5.2, 5.4**

- [x] 3.8 Implement URL validation function
  - Write validateURL function with format checking
  - Handle edge cases: empty, malformed, non-HTTP protocols
  - _Requirements: 2.5_

- [ ]* 3.9 Write property test for URL validation
  - **Property 6: Invalid URLs are rejected**
  - **Validates: Requirements 2.5**

- [x] 4. Implement Supabase authentication
- [x] 4.1 Set up Supabase client configuration
  - Create Supabase client with SSR support
  - Configure auth helpers for Next.js App Router
  - _Requirements: 1.1, 1.2, 7.1_

- [x] 4.2 Create login page component
  - Build LoginPage with email/password form
  - Implement form validation
  - Add "Sign up" link
  - Handle authentication errors
  - _Requirements: 1.1_

- [x] 4.3 Implement authentication flow
  - Create sign-up functionality
  - Create login functionality
  - Implement redirect to dashboard after successful auth
  - _Requirements: 1.2_

- [ ]* 4.4 Write property test for authentication flow
  - **Property 1: Authentication creates account and redirects**
  - **Validates: Requirements 1.2**

- [x] 5. Implement PetService for pet management
- [x] 5.1 Create PetService with CRUD operations
  - Implement createPet function
  - Implement getPet function
  - Implement updatePetHealth function
  - Implement incrementGoodContent function
  - _Requirements: 1.5, 7.2_

- [x] 5.2 Implement health score calculation
  - Write calculateAverageScore function (average of all submissions)
  - Integrate with updatePetHealth
  - _Requirements: 4.7_

- [ ]* 5.3 Write property test for health score calculation
  - **Property 11: Health score is average of submissions**
  - **Validates: Requirements 4.7**

- [ ]* 5.4 Write property test for pet data persistence
  - **Property 17: Pet data persistence round-trip**
  - **Validates: Requirements 7.2**

- [x] 6. Implement ContentAnalysisService with OpenAI integration
- [x] 6.1 Create OpenAI client configuration
  - Set up OpenAI API client with API key from env
  - Configure timeout and retry logic
  - _Requirements: 3.1_

- [x] 6.2 Implement content analysis function
  - Write analyzeContent function that calls OpenAI API
  - Parse response and extract credibility score (0-100)
  - Generate quality category and message
  - Determine isGoodContent flag (score >= 50)
  - _Requirements: 3.1, 3.2, 5.3_

- [ ]* 6.3 Write property test for API invocation
  - **Property 7: API invocation for all URLs**
  - **Validates: Requirements 3.1**

- [ ]* 6.4 Write property test for score range validation
  - **Property 8: Credibility scores are in valid range**
  - **Validates: Requirements 3.2**

- [ ]* 6.5 Write property test for good content threshold
  - **Property 13: Good content threshold is 50**
  - **Validates: Requirements 5.3**

- [x] 6.6 Create API route for content analysis
  - Create /api/analyze-content route
  - Validate URL input
  - Call analyzeContent service
  - Return analysis result
  - Handle errors gracefully
  - _Requirements: 2.2, 3.1, 7.5_

- [x] 7. Implement SubmissionService for content tracking
- [x] 7.1 Create SubmissionService with database operations
  - Implement createSubmission function
  - Implement getSubmissionHistory function
  - Implement calculateAverageScore function
  - _Requirements: 2.3, 7.3_

- [ ]* 7.2 Write property test for submission persistence
  - **Property 4: Analysis results are persisted**
  - **Validates: Requirements 2.3, 7.3**

- [x] 7.3 Create API route for submission creation
  - Create /api/submissions/create route
  - Validate input data
  - Store submission to database
  - Update pet health and good content count
  - Return success response
  - _Requirements: 2.3_

- [x] 8. Build EggComponent with animation
- [x] 8.1 Create Egg component with tap interaction
  - Build egg SVG or use image asset
  - Implement tap counter (3 taps to hatch)
  - Add shake animations (left, right, left again)
  - Add crack animation
  - Add disappear animation
  - _Requirements: 1.3, 1.4_

- [ ]* 8.2 Write property test for egg tap behavior
  - **Property 2: Egg tap triggers animation and pet creation**
  - **Validates: Requirements 1.4, 1.5**

- [x] 8.3 Integrate egg hatching with pet creation
  - Call createPet API when egg hatches
  - Transition to pet display after hatching
  - Show navigation buttons after hatching
  - _Requirements: 1.5_

- [x] 9. Build PetComponent with health states
- [x] 9.1 Create Pet component with visual states
  - Create or import pet graphics for each state (Very Happy, Healthy, Neutral, Unhappy, Sick)
  - Implement state-based rendering
  - Add glass container styling
  - Add smooth transitions between states
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 9.2 Implement pet state updates
  - Connect pet display to health score from database
  - Update visual representation when health changes
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 10. Build Dashboard page
- [x] 10.1 Create Dashboard layout
  - Add sky background with clouds, satellite, nature elements
  - Create main container with responsive design
  - Add pet/egg display area
  - Add three navigation buttons at bottom
  - _Requirements: 1.3, 8.1_

- [x] 10.2 Implement dashboard data loading
  - Fetch user's pet data on page load
  - Display egg for new users, pet for existing users
  - Handle loading states
  - _Requirements: 7.4_

- [ ]* 10.3 Write property test for user data retrieval
  - **Property 18: User data retrieval on login**
  - **Validates: Requirements 7.4**

- [x] 10.4 Add ScoreDisplay overlay component
  - Create score display with numerical value
  - Implement color coding (green >= 50, red < 50)
  - Show quality message
  - Add "Read Summary" link
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 10.5 Write property test for score color coding
  - **Property 15: Score color coding is correct**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 10.6 Write property test for analysis result display
  - **Property 16: Analysis results show score and message**
  - **Validates: Requirements 6.3**

- [x] 11. Build URLInputModal component
- [x] 11.1 Create URL input modal UI
  - Create modal overlay with backdrop
  - Add URL input field
  - Add "Analyze Content" button
  - Add example URLs section
  - Add loading state during analysis
  - _Requirements: 2.1_

- [x] 11.2 Implement URL submission logic
  - Validate URL on submit
  - Call /api/analyze-content
  - Display loading indicator
  - Show results in ScoreDisplay
  - Clear input field on success
  - Show error messages for invalid URLs
  - _Requirements: 2.2, 2.4, 2.5_

- [ ]* 11.3 Write property test for valid URL submission
  - **Property 3: Valid URLs are sent for analysis**
  - **Validates: Requirements 2.2**

- [ ]* 11.4 Write property test for input clearing
  - **Property 5: Successful submission clears input**
  - **Validates: Requirements 2.4**

- [x] 12. Build HealthStatusModal component
- [x] 12.1 Create health status modal UI
  - Create modal overlay with header
  - Display current mood with emoji/text
  - Show health score with progress bar
  - Display good content counter
  - Display total checks counter
  - Show accuracy rate percentage
  - Add contextual tip based on health
  - _Requirements: 4.1_

- [x] 12.2 Implement health status data loading
  - Fetch pet health data
  - Fetch submission statistics
  - Calculate accuracy rate
  - Display all metrics
  - _Requirements: 4.7_

- [ ]* 12.3 Write property test for growth statistics display
  - **Property 14: Growth statistics display matches stored data**
  - **Validates: Requirements 5.5**

- [x] 13. Build GrowthTimelineModal component
- [x] 13.1 Create growth timeline modal UI
  - Create modal overlay with header
  - Display current growth stage with emoji
  - Show age in years
  - Display progress to next year (X/100)
  - Show growth timeline with all stages
  - List stage thresholds (Baby: 0-99, Child: 100-199, etc.)
  - _Requirements: 5.1_

- [x] 13.2 Implement growth data loading
  - Fetch pet age and good content count
  - Calculate progress to next year
  - Determine current growth stage
  - Display all growth information
  - _Requirements: 5.2, 5.5_

- [x] 14. Implement navigation and routing
- [x] 14.1 Create NavigationButtons component
  - Build three circular buttons with icons
  - Left: Health icon
  - Center: URL icon
  - Right: Growth icon
  - Add active state styling
  - Make touch-optimized (90x90px)
  - _Requirements: 1.5_

- [x] 14.2 Wire up modal navigation
  - Connect health button to HealthStatusModal
  - Connect URL button to URLInputModal
  - Connect growth button to GrowthTimelineModal
  - Implement modal open/close logic
  - _Requirements: 2.1, 4.1, 5.1_

- [x] 15. Implement error handling and edge cases
- [x] 15.1 Add client-side error handling
  - Handle network errors
  - Handle authentication errors
  - Handle validation errors
  - Display user-friendly error messages
  - _Requirements: 7.5_

- [x] 15.2 Add server-side error handling
  - Handle OpenAI API errors with retry logic
  - Handle database errors with graceful degradation
  - Implement error logging
  - Return sanitized error messages to client
  - _Requirements: 7.5_

- [ ]* 15.3 Write property test for error handling
  - **Property 19: Database errors are handled gracefully**
  - **Validates: Requirements 7.5**

- [x] 16. Implement responsive design and accessibility
- [x] 16.1 Add responsive breakpoints
  - Test on mobile (440px)
  - Test on tablet (768px)
  - Test on desktop (1024px+)
  - Adjust layouts for each breakpoint
  - _Requirements: 8.1, 8.2_

- [x] 16.2 Implement touch and click event handling
  - Ensure all buttons work with touch
  - Ensure all buttons work with mouse clicks
  - Add appropriate hover states
  - _Requirements: 8.3_

- [ ]* 16.3 Write property test for input method consistency
  - **Property 20: Touch and click events work consistently**
  - **Validates: Requirements 8.3**

- [x] 17. Add design system styling from Figma
- [x] 17.1 Extract design tokens from Figma
  - Colors (sky blue, cloud white, nature green, etc.)
  - Typography (font families, sizes, weights)
  - Spacing (margins, padding)
  - Border radius, shadows
  - _Requirements: 8.1_

- [x] 17.2 Apply Figma designs to components
  - Style login page to match Figma
  - Style dashboard to match Figma
  - Style modals to match Figma
  - Style buttons and inputs to match Figma
  - Add cloud, satellite, and nature decorative elements
  - _Requirements: 8.1_

- [x] 18. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Set up deployment configuration
- [x] 19.1 Configure environment variables
  - Set up .env.local for development
  - Configure Vercel environment variables for production
  - Add Supabase URL and keys
  - Add OpenAI API key
  - _Requirements: 7.1, 3.1_

- [x] 19.2 Deploy to Vercel
  - Connect GitHub repository to Vercel
  - Configure build settings
  - Deploy to production
  - Test production deployment
  - _Requirements: 8.4_

- [ ] 20. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
