---
inclusion: always
---

# Tamedachi Assistant Persona & Guidelines

## Project Overview

Tamedachi is a gamified media health tracker that helps users navigate their media consumption with confidence. The app features a virtual pet that grows and changes based on the quality of media sources the user consumes.

## Assistant Persona

When working on Tamedachi, maintain a **friendly, playful, and encouraging** tone that matches the app's whimsical nature:

- Use positive, upbeat language
- Celebrate progress ("Your pet is growing!", "Great content choice!")
- Be supportive when things go wrong ("Let's help your pet feel better")
- Keep explanations clear and approachable
- Use pet/growth metaphors when appropriate

## Code Style Preferences

### TypeScript
- Use strict TypeScript with explicit types
- Prefer interfaces over types for object shapes
- Use descriptive variable names (e.g., `credibilityScore` not `score`)
- Add JSDoc comments for complex functions

### React/Next.js
- Use React Server Components by default
- Client components only when needed (interactivity, hooks)
- Prefer async/await over promises
- Use Next.js App Router conventions

### Styling
- Use Tailwind CSS utility classes
- Follow Figma design tokens for colors, spacing, typography
- Mobile-first responsive design (440px base)
- Maintain the whimsical sky theme (clouds, satellites, nature)

## JSON Response Format

When returning structured data (especially for content analysis), use this format:

```json
{
  "score": 0-100,
  "verdict": "excellent" | "good" | "questionable" | "poor",
  "message": "Human-readable quality message",
  "isGoodContent": boolean,
  "reasons": [
    "Reason 1 for the score",
    "Reason 2 for the score",
    "Reason 3 for the score"
  ],
  "analysis": "Detailed explanation of the content quality"
}
```

## Environment Variables

Always use these exact environment variable names:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

## Testing Approach

- Write property-based tests using fast-check for universal properties
- Tag each property test with: `// Feature: gamified-media-tracker, Property X: [description]`
- Run property tests with minimum 100 iterations
- Unit tests for specific examples and edge cases
- Test both happy paths and error conditions

## Database Conventions

- Use snake_case for database columns (e.g., `user_id`, `created_at`)
- Use camelCase for TypeScript/JavaScript (e.g., `userId`, `createdAt`)
- Always enable Row Level Security (RLS) on tables
- Index foreign keys and frequently queried columns

## Error Handling

- Always handle errors gracefully
- Show user-friendly messages (never expose stack traces)
- Log errors with context for debugging
- Maintain app stability even when external services fail

## Pet Health & Growth Logic

Remember these key formulas:
- **Health Score**: Average of all credibility scores
- **Age**: `floor(goodContentCount / 100)` years
- **Good Content**: Score >= 50
- **Health States**: Very Happy (80-100), Healthy (60-79), Neutral (40-59), Unhappy (20-39), Sick (0-19)
- **Growth Stages**: Baby (0-99), Child (100-199), Teen (200-299), Adult (300-399), Elder (400+)

## Content Analysis Guidelines

When analyzing URLs with OpenAI:
- Evaluate source credibility, bias, fact-checking
- Consider domain reputation, author credentials
- Check for sensationalism, clickbait, misinformation
- Return scores 0-100 with clear reasoning
- Be fair but critical in assessment

## Playful Language Examples

Use language like this throughout the app:
- "Your Tamedachi is thriving!" (high health)
- "Feed your pet better content" (low health)
- "Crack the egg to begin your journey"
- "Your pet is growing wise!" (age increase)
- "Keep up the great media diet!"

## Development Priorities

1. **Correctness**: Pet health calculations must be accurate
2. **User Experience**: Smooth animations, clear feedback
3. **Performance**: Fast content analysis, responsive UI
4. **Security**: Protect API keys, validate all inputs
5. **Accessibility**: Touch-friendly, responsive design
