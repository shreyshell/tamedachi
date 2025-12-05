# Design Document

## Overview

Tamedachi is a Next.js-based web application that gamifies media consumption tracking through an interactive virtual pet system. The application leverages OpenAI's API for content analysis, Supabase for backend services (authentication, database, and real-time features), and will be deployed on Vercel. The core user experience revolves around nurturing a virtual pet whose health and growth directly reflect the quality of media sources consumed by the user.

The application follows a mobile-first responsive design approach, with all screens designed at 440px width and optimized for touch interactions. The visual design features a whimsical sky theme with clouds, satellites, and nature elements, creating an engaging and calming atmosphere.

## Architecture

### Technology Stack

- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (matching Figma design system)
- **Backend Services**: Supabase
  - Authentication (email/password)
  - PostgreSQL database
  - Row Level Security (RLS) policies
- **AI Integration**: OpenAI API (GPT-4 or GPT-3.5-turbo)
- **Deployment**: Vercel
- **State Management**: React Context API + Server Components
- **Testing**: Vitest for unit tests, fast-check for property-based testing

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Next.js App (React Components)               │ │
│  │  - Login Page                                          │ │
│  │  - Dashboard (Egg/Pet Display)                         │ │
│  │  - URL Input Modal                                     │ │
│  │  - Health Status View                                  │ │
│  │  - Growth Timeline View                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  - /api/analyze-content (OpenAI integration)                │
│  - /api/pet/update (Pet state management)                   │
│  - /api/submissions/create (URL submission)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────┐
│    Supabase Backend      │  │    OpenAI API        │
│  - Auth                  │  │  - Content Analysis  │
│  - PostgreSQL DB         │  │  - Credibility Score │
│  - RLS Policies          │  └──────────────────────┘
└──────────────────────────┘
```

### Database Schema

**users** (managed by Supabase Auth)
- id (uuid, primary key)
- email (text)
- created_at (timestamp)

**pets**
- id (uuid, primary key)
- user_id (uuid, foreign key → users.id)
- name (text, default: "Tamedachi")
- health_score (numeric, 0-100)
- age_years (integer, default: 0)
- good_content_count (integer, default: 0)
- created_at (timestamp)
- updated_at (timestamp)

**content_submissions**
- id (uuid, primary key)
- user_id (uuid, foreign key → users.id)
- pet_id (uuid, foreign key → pets.id)
- url (text)
- credibility_score (numeric, 0-100)
- quality_category (text: "excellent", "good", "questionable", "poor")
- is_good_content (boolean, computed: score >= 50)
- submitted_at (timestamp)

## Components and Interfaces

### Page Components

**1. LoginPage** (`/app/login/page.tsx`)
- Email/password authentication form
- "Sign up" link for new users
- Supabase Auth integration
- Redirects to dashboard on successful login

**2. DashboardPage** (`/app/dashboard/page.tsx`)
- Main container with sky background (clouds, satellite, nature)
- Egg display (for new users) or Pet display (for existing users)
- Three navigation buttons at bottom:
  - Left: Health Status button
  - Center: URL Input button
  - Right: Growth & Age button
- Pet glass container with visual representation
- Score display overlay (after content analysis)

**3. HealthStatusModal** (Modal overlay on dashboard)
- Current mood display (Very Happy, Healthy, Neutral, Unhappy, Sick)
- Health score with progress bar
- Good content counter
- Total checks counter
- Accuracy rate percentage
- Contextual tip based on health status

**4. URLInputModal** (Modal overlay on dashboard)
- URL input field with validation
- "Analyze Content" button
- Example URLs for quick testing
- Loading state during analysis
- Error handling for invalid URLs

**5. GrowthTimelineModal** (Modal overlay on dashboard)
- Current growth stage with emoji (🍼 Baby, 🧒 Child, 🧑 Teen, 🧑‍💼 Adult, 🧓 Elder)
- Age display (years old)
- Progress to next year (X/100 good content pieces)
- Growth timeline showing all stages with thresholds

### Core Components

**EggComponent** (`/components/Egg.tsx`)
- Interactive egg graphic
- Tap/click event handling
- Crack animation sequence (3 taps)
- Shake animations
- Disappear animation revealing pet

**PetComponent** (`/components/Pet.tsx`)
- Dynamic pet visual based on health state
- Five states: Very Happy, Healthy, Neutral, Unhappy, Sick
- Smooth transitions between states
- Glass container styling

**NavigationButtons** (`/components/NavigationButtons.tsx`)
- Three circular buttons with icons
- Active state highlighting
- Touch-optimized sizing (90x90px)

**ScoreDisplay** (`/components/ScoreDisplay.tsx`)
- Numerical score (X/100)
- Color-coded text (green ≥50, red <50)
- Quality message display
- "Read Summary" link

### Service Interfaces

**ContentAnalysisService** (`/lib/services/contentAnalysis.ts`)
```typescript
interface ContentAnalysisResult {
  url: string;
  credibilityScore: number; // 0-100
  qualityCategory: 'excellent' | 'good' | 'questionable' | 'poor';
  qualityMessage: string;
  isGoodContent: boolean; // score >= 50
  analysis: string; // AI-generated summary
}

async function analyzeContent(url: string): Promise<ContentAnalysisResult>
```

**PetService** (`/lib/services/pet.ts`)
```typescript
interface Pet {
  id: string;
  userId: string;
  name: string;
  healthScore: number;
  ageYears: number;
  goodContentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PetHealthState {
  state: 'very-happy' | 'healthy' | 'neutral' | 'unhappy' | 'sick';
  message: string;
}

async function createPet(userId: string): Promise<Pet>
async function getPet(userId: string): Promise<Pet | null>
async function updatePetHealth(petId: string, newScore: number): Promise<Pet>
async function incrementGoodContent(petId: string): Promise<Pet>
async function calculateHealthState(healthScore: number): PetHealthState
async function calculateAge(goodContentCount: number): number
```

**SubmissionService** (`/lib/services/submissions.ts`)
```typescript
interface ContentSubmission {
  id: string;
  userId: string;
  petId: string;
  url: string;
  credibilityScore: number;
  qualityCategory: string;
  isGoodContent: boolean;
  submittedAt: Date;
}

async function createSubmission(
  userId: string,
  petId: string,
  analysisResult: ContentAnalysisResult
): Promise<ContentSubmission>

async function getSubmissionHistory(
  userId: string,
  limit?: number
): Promise<ContentSubmission[]>

async function calculateAverageScore(userId: string): Promise<number>
```

## Data Models

### Pet Health Calculation

The pet's health score is calculated as the **average of all content credibility scores** submitted by the user:

```
healthScore = sum(all credibility scores) / count(submissions)
```

Health states are determined by score ranges:
- 80-100: Very Happy
- 60-79: Healthy
- 40-59: Neutral
- 20-39: Unhappy
- 0-19: Sick

### Pet Age Calculation

Pet age is calculated based on good content consumption:

```
ageYears = floor(goodContentCount / 100)
progressToNextYear = goodContentCount % 100
```

Growth stages:
- 0-99 good content: Baby (🍼)
- 100-199 good content: Child (🧒)
- 200-299 good content: Teen (🧑)
- 300-399 good content: Adult (🧑‍💼)
- 400+ good content: Elder (🧓)

### Content Quality Scoring

Content is scored 0-100 by OpenAI API analysis with these thresholds:

- **80-100**: "Excellent source! High credibility."
- **60-79**: "Good source. Generally reliable."
- **40-59**: "Questionable source. Be cautious."
- **0-39**: "Poor source. Low credibility."

Good content threshold: **score ≥ 50**

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Authentication creates account and redirects
*For any* valid user credentials, successful authentication should create a user account in the database and redirect to the dashboard.
**Validates: Requirements 1.2**

### Property 2: Egg tap triggers animation and pet creation
*For any* egg tap interaction, the system should play the cracking animation sequence and persist a new pet to the database.
**Validates: Requirements 1.4, 1.5**

### Property 3: Valid URLs are sent for analysis
*For any* valid URL format submitted by a user, the system should send that URL to the Content Analysis service.
**Validates: Requirements 2.2**

### Property 4: Analysis results are persisted
*For any* completed content analysis, the system should store the URL, credibility score, and timestamp in the database, and this data should be retrievable.
**Validates: Requirements 2.3, 7.3**

### Property 5: Successful submission clears input
*For any* successful URL submission, the input field should be cleared and visual confirmation should be provided.
**Validates: Requirements 2.4**

### Property 6: Invalid URLs are rejected
*For any* invalid URL format (empty strings, malformed URLs, non-HTTP protocols), the system should display an error message and prevent submission.
**Validates: Requirements 2.5**

### Property 7: API invocation for all URLs
*For any* URL received for analysis, the system should invoke the OpenAI API.
**Validates: Requirements 3.1**

### Property 8: Credibility scores are in valid range
*For any* OpenAI API response, the calculated credibility score should be between 0 and 100 (inclusive).
**Validates: Requirements 3.2**

### Property 9: Score categorization is correct
*For any* credibility score, the system should categorize it correctly:
- 80-100 → "Excellent source! High credibility."
- 60-79 → "Good source. Generally reliable."
- 40-59 → "Questionable source. Be cautious."
- 0-39 → "Poor source. Low credibility."
**Validates: Requirements 3.3, 3.4, 3.5, 3.6**

### Property 10: Health state mapping is correct
*For any* pet health score, the system should map it to the correct health state:
- 80-100 → "Very Happy"
- 60-79 → "Healthy"
- 40-59 → "Neutral"
- 20-39 → "Unhappy"
- 0-19 → "Sick"
**Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.6**

### Property 11: Health score is average of submissions
*For any* set of content submissions, the pet health score should equal the arithmetic mean of all credibility scores.
**Validates: Requirements 4.7**

### Property 12: Age calculation is correct
*For any* good content count, the pet age should equal floor(goodContentCount / 100).
**Validates: Requirements 5.2, 5.4**

### Property 13: Good content threshold is 50
*For any* content submission with a score of 50 or higher, the good content counter should increment by 1.
**Validates: Requirements 5.3**

### Property 14: Growth statistics display matches stored data
*For any* pet, the displayed good content count and age should match the values stored in the database.
**Validates: Requirements 5.5**

### Property 15: Score color coding is correct
*For any* credibility score display, scores >= 50 should render in green and scores < 50 should render in red.
**Validates: Requirements 6.1, 6.2**

### Property 16: Analysis results show score and message
*For any* content analysis result display, both the numerical score and the quality message should be present.
**Validates: Requirements 6.3**

### Property 17: Pet data persistence round-trip
*For any* pet created, storing it to the database and then retrieving it should return equivalent pet data (id, userId, healthScore, ageYears, goodContentCount).
**Validates: Requirements 7.2**

### Property 18: User data retrieval on login
*For any* authenticated user with existing pet data, logging in should retrieve the correct pet and submission history from the database.
**Validates: Requirements 7.4**

### Property 19: Database errors are handled gracefully
*For any* database operation failure, the system should display an error message and maintain application stability (no crashes or undefined states).
**Validates: Requirements 7.5**

### Property 20: Touch and click events work consistently
*For any* interactive element, both touch and click events should trigger the same behavior.
**Validates: Requirements 8.3**

## Error Handling

### Client-Side Error Handling

**URL Validation Errors**
- Empty input: "Please enter a URL"
- Invalid format: "Please enter a valid URL (e.g., https://example.com)"
- Non-HTTP protocol: "Only HTTP and HTTPS URLs are supported"

**Network Errors**
- API timeout: "Request timed out. Please try again."
- No internet connection: "No internet connection. Please check your network."
- Rate limiting: "Too many requests. Please wait a moment and try again."

**Authentication Errors**
- Invalid credentials: "Invalid email or password"
- Email already exists: "An account with this email already exists"
- Session expired: "Your session has expired. Please log in again."

### Server-Side Error Handling

**OpenAI API Errors**
- API key invalid: Log error, return generic message to user
- Rate limit exceeded: Implement exponential backoff, queue requests
- Content policy violation: Return score of 0 with appropriate message
- Timeout: Retry up to 3 times with exponential backoff

**Database Errors**
- Connection failure: Retry with exponential backoff, show maintenance message
- Constraint violation: Log error, return user-friendly message
- Query timeout: Optimize query or increase timeout, log for monitoring

**Data Validation Errors**
- Invalid score range: Clamp to 0-100, log warning
- Missing required fields: Return 400 error with specific field information
- Type mismatch: Return 400 error with expected type information

### Error Logging and Monitoring

- All errors logged with context (user ID, timestamp, error type, stack trace)
- Critical errors trigger alerts (database down, API key invalid)
- Error rates monitored via Vercel Analytics
- User-facing errors are sanitized (no sensitive information exposed)

## Testing Strategy

### Unit Testing

Unit tests will be written using Vitest to verify specific examples and edge cases:

**Component Tests**
- EggComponent: Test tap counter, animation triggers
- PetComponent: Test state transitions, visual rendering
- ScoreDisplay: Test color coding, message display
- NavigationButtons: Test click handlers, active states

**Service Tests**
- ContentAnalysisService: Test score calculation, category mapping
- PetService: Test health calculation, age calculation, state mapping
- SubmissionService: Test data persistence, history retrieval

**Utility Tests**
- URL validation: Test valid/invalid formats
- Score categorization: Test boundary values (0, 39, 40, 50, 59, 60, 79, 80, 100)
- Health state mapping: Test boundary values
- Age calculation: Test edge cases (0, 99, 100, 199, 200)

### Property-Based Testing

Property-based tests will be written using **fast-check** (JavaScript/TypeScript property testing library) to verify universal properties across all inputs. Each property-based test will run a minimum of **100 iterations** to ensure comprehensive coverage.

**Test Tagging Convention**
Each property-based test MUST be tagged with a comment explicitly referencing the correctness property from this design document using this exact format:
```typescript
// Feature: gamified-media-tracker, Property X: [property text]
```

**Property Test Coverage**
Each correctness property listed in the "Correctness Properties" section MUST be implemented by a SINGLE property-based test. The test should:
1. Generate random inputs appropriate for the property
2. Execute the system behavior
3. Assert that the property holds for all generated inputs

**Example Property Tests**

```typescript
// Feature: gamified-media-tracker, Property 9: Score categorization is correct
fc.assert(
  fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
    const category = categorizeScore(score);
    if (score >= 80) return category === "Excellent source! High credibility.";
    if (score >= 60) return category === "Good source. Generally reliable.";
    if (score >= 40) return category === "Questionable source. Be cautious.";
    return category === "Poor source. Low credibility.";
  }),
  { numRuns: 100 }
);

// Feature: gamified-media-tracker, Property 12: Age calculation is correct
fc.assert(
  fc.property(fc.integer({ min: 0, max: 10000 }), (goodContentCount) => {
    const age = calculateAge(goodContentCount);
    return age === Math.floor(goodContentCount / 100);
  }),
  { numRuns: 100 }
);
```

### Integration Testing

Integration tests will verify:
- Supabase authentication flow (signup, login, logout)
- Database operations (CRUD for pets and submissions)
- OpenAI API integration (mocked for testing)
- End-to-end user flows (egg hatching, URL submission, health updates)

### Test Data Generators

For property-based testing, we'll create generators for:
- Valid URLs (various domains, paths, query parameters)
- Invalid URLs (malformed, missing protocol, invalid characters)
- Credibility scores (0-100)
- Pet states (all health scores, good content counts)
- User submissions (various URLs and scores)

## Security Considerations

### Authentication & Authorization

- Supabase Auth handles password hashing and session management
- Row Level Security (RLS) policies ensure users can only access their own data
- JWT tokens used for API authentication
- Session expiration after 7 days of inactivity

### API Key Management

- OpenAI API key stored in environment variables (never in client code)
- API routes act as proxy to prevent key exposure
- Rate limiting on API routes to prevent abuse

### Data Privacy

- User emails encrypted at rest by Supabase
- No PII stored in content submissions (only URLs and scores)
- GDPR compliance: users can request data deletion

### Input Validation

- URL sanitization to prevent XSS attacks
- SQL injection prevention via Supabase parameterized queries
- Content Security Policy (CSP) headers configured

## Performance Considerations

### Optimization Strategies

**Client-Side**
- Next.js Image optimization for pet graphics
- Code splitting for modal components
- React Server Components for initial page load
- Optimistic UI updates for better perceived performance

**Server-Side**
- API route caching for repeated URL analyses (24-hour TTL)
- Database connection pooling via Supabase
- Indexed queries on user_id and pet_id columns

**Asset Delivery**
- Vercel Edge Network for global CDN
- Static asset caching (images, fonts)
- Lazy loading for modal content

### Performance Targets

- Initial page load: < 2 seconds
- URL analysis: < 5 seconds (including OpenAI API call)
- Database queries: < 200ms
- Animation frame rate: 60 FPS

## Deployment Strategy

### Environment Configuration

**Development**
- Local Supabase instance or development project
- OpenAI API with lower rate limits
- Hot module reloading enabled

**Staging**
- Separate Supabase project
- OpenAI API with production keys
- Preview deployments on Vercel

**Production**
- Production Supabase project with RLS enabled
- OpenAI API with production keys and monitoring
- Vercel production deployment with custom domain

### Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

### Deployment Pipeline

1. Push to feature branch
2. Automated tests run via GitHub Actions
3. Preview deployment created on Vercel
4. Manual QA on preview
5. Merge to main
6. Automatic production deployment
7. Post-deployment smoke tests

## Future Enhancements

### Phase 2 Features

- Multiple pet types (different animals)
- Social features (share pet progress, leaderboards)
- Content categories (news, entertainment, education)
- Browser extension for quick URL analysis
- Weekly/monthly consumption reports
- Pet customization (names, accessories)

### Technical Improvements

- Real-time updates using Supabase Realtime
- Progressive Web App (PWA) support
- Offline mode with sync
- Advanced analytics dashboard
- A/B testing framework
- Internationalization (i18n)
