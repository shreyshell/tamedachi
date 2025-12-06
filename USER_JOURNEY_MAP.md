# Tamedachi User Journey Map

## Overview
This document maps all pages in the Tamedachi app and the complete user journey through them.

---

## Page Structure

### 1. **Root Page** (`/`)
- **File**: `app/page.tsx` + `app/WelcomeClient.tsx`
- **Purpose**: Welcome screen with egg hatching animation
- **Authentication**: Required (redirects to `/login` if not authenticated)

**User Experience:**
- User sees sky gradient background with decorative clouds, satellite, and nature elements
- Large heading: "Welcome!"
- Subheading: "Tap the egg to meet your Tamedachi"
- Interactive egg in center (300x399px)
- Egg requires 3 taps to hatch:
  - **Tap 1**: First crack appears
  - **Tap 2**: Second and third cracks appear
  - **Tap 3**: Complex animation sequence (down → shake left → shake right → shake left → disappear)
- After egg disappears, user is redirected to `/dashboard`

**Navigation:**
- No navigation buttons
- Automatic redirect to `/dashboard` after hatching

---

### 2. **Login Page** (`/login`)
- **File**: `app/login/page.tsx`
- **Purpose**: User authentication
- **Authentication**: Not required (public page)

**User Experience:**
- Sky gradient background (purple-pink: `#b7bffb` to `#ffc2c2`)
- Egg logo at top (108x108px yellow circle with purple-pink gradient egg inside)
- "Tamedachi" heading
- "Your media health companion" tagline
- Glass-effect login container with:
  - Email input field (with envelope icon)
  - Password input field (with lock icon)
  - Error message display (if any)
  - "Login" button (yellow gradient)
  - "Don't have an account? Sign up" link
- Bottom tagline: "Navigate your media consumption with confidence"

**Validation:**
- Email format validation
- Password minimum 6 characters
- Specific error messages for:
  - Invalid credentials
  - Unconfirmed email
  - Rate limiting
  - Network errors

**Navigation:**
- Link to `/signup`
- Successful login → `/dashboard`

---

### 3. **Sign Up Page** (`/signup`)
- **File**: `app/signup/page.tsx`
- **Purpose**: New user registration
- **Authentication**: Not required (public page)

**User Experience:**
- Identical visual design to login page
- Glass-effect signup container with:
  - Email input field (with envelope icon)
  - Password input field (with lock icon)
  - Confirm Password input field (with lock icon)
  - Error message display (if any)
  - "Sign Up" button (yellow gradient)
  - "Already have an account? Log in" link

**Validation:**
- Email format validation
- Password minimum 6 characters
- Password confirmation match
- Specific error messages for:
  - Email already registered
  - Rate limiting
  - Network errors

**Navigation:**
- Link to `/login`
- Successful signup → `/` (Welcome page)

---

### 4. **Dashboard Page** (`/dashboard`)
- **File**: `app/dashboard/page.tsx` + `app/dashboard/DashboardClient.tsx`
- **Purpose**: Main app interface - pet display and interaction hub
- **Authentication**: Required (redirects to `/login` if not authenticated)

**User Experience:**

#### Initial State (No Pet):
- Sky gradient background with decorative elements
- Logout button (top-right)
- Glass container (418x418px) with:
  - Egg component (200x240px SVG)
  - Text: "Tap the egg to hatch your Tamedachi!"
- Egg requires 3 taps:
  - Tap 1 & 2: Shake animations
  - Tap 3: Crack animation → disappear → pet creation
- No navigation buttons visible

#### After Pet Creation:
- Same background and decorations
- Logout button (top-right)
- Glass container (418x418px) with:
  - Pet SVG (varies by health state: 303-369px wide, 287-315px tall)
  - Pet visual changes based on health score:
    - **Very Happy** (80-100): `pet-veryhappy.svg` with bounce animation
    - **Healthy** (60-79): `pet-healthy.svg` with pulse animation
    - **Neutral** (40-59): `pet-neutral.svg` (no animation)
    - **Unhappy** (20-39): `pet-unhappy.svg` (no animation)
    - **Sick** (0-19): `pet-sick.svg` with pulse animation
- Three navigation buttons below pet (90x90px each, 47px gap):
  - **Left**: Health Status (heart icon)
  - **Middle**: URL Input (link icon)
  - **Right**: Growth Timeline (chart icon)
- Active button gets highlighted with blue background

**Pet Updates:**
- Pet data refreshes every 5 seconds via polling
- Health score updates automatically after content submissions

**Navigation:**
- Health button → Opens Health Status Modal
- URL button → Opens URL Input Modal
- Growth button → Opens Growth Timeline Modal
- Logout button → Returns to `/login`

---

### 5. **Health Status Modal** (Overlay on `/dashboard`)
- **Component**: `components/HealthStatusModal.tsx`
- **Trigger**: Click left navigation button
- **Purpose**: Display pet health statistics

**User Experience:**
- Full-screen overlay with same background as dashboard
- Logout button (top-right)
- Glass-effect modal container with:
  - Close button (X, top-right of modal)
  - Header: "Check Health"
  - Subheading: "See how your Tamedachi is feeling"
  - Large emoji showing current mood (😄😊😐😟😷)
  - Health state name (Very Happy, Healthy, Neutral, Unhappy, Sick)
  - Health score: "X/100"
  - Progress bar (color-coded by health)
  - Two stat cards:
    - Good Content count
    - Total Checks count
  - Contextual tip based on health score

**Data Display:**
- Fetches stats from `/api/submissions/stats`
- Shows loading spinner while fetching
- Error handling for network issues

**Navigation:**
- Close button → Returns to dashboard
- Click outside modal → Returns to dashboard

---

### 6. **URL Input Modal** (Overlay on `/dashboard`)
- **Component**: `components/URLInputModal.tsx`
- **Trigger**: Click middle navigation button
- **Purpose**: Submit URLs for content analysis

**User Experience:**
- Full-screen overlay with same background as dashboard
- Logout button (top-right)
- Glass-effect modal container with:
  - Close button (X, top-right of modal)
  - Header: "Check Content"
  - Subheading: "Submit a URL to check its credibility"
  - URL input field (placeholder: "https://example.com/article")
  - Error message display (if any)
  - "Analyze Content" button (yellow gradient)
  - Loading state: "Analyzing..." with spinner

**Workflow:**
1. User enters URL
2. Clicks "Analyze Content"
3. Button shows loading state
4. API calls:
   - `/api/analyze-content` (OpenAI analysis)
   - `/api/submissions/create` (save to database)
5. On success:
   - Input field clears
   - Modal closes
   - Score Display overlay appears
6. On error:
   - Error message shows in modal
   - Modal stays open

**Validation:**
- URL cannot be empty
- Specific error messages for:
  - Invalid URL format
  - Rate limiting (429)
  - Timeout (504)
  - Session expired (401)
  - Network errors

**Navigation:**
- Close button → Returns to dashboard
- Successful submission → Shows Score Display overlay

---

### 7. **Growth Timeline Modal** (Overlay on `/dashboard`)
- **Component**: `components/GrowthTimelineModal.tsx`
- **Trigger**: Click right navigation button
- **Purpose**: Display pet age and growth stages

**User Experience:**
- Full-screen overlay with same background as dashboard
- Logout button (top-right)
- Glass-effect modal container with:
  - Close button (X, top-right of modal)
  - Header: "Check Growth Stage"
  - Subheading: "See how your Tamedachi is growing"
  - Large emoji for current stage (🍼🧒🧑🧑‍💼🧓)
  - Stage name (Baby, Child, Teen, Adult, Elder)
  - Age: "X years old"
  - Progress bar to next year (X/100)
  - List of all growth stages with:
    - Stage emoji
    - Stage name
    - Content count range
    - "Current" badge on active stage
    - Past stages shown with lighter background

**Growth Stages:**
- **Baby**: 0-99 good content (0 years)
- **Child**: 100-199 good content (1 year)
- **Teen**: 200-299 good content (2 years)
- **Adult**: 300-399 good content (3 years)
- **Elder**: 400+ good content (4+ years)

**Age Calculation:**
- Age = floor(goodContentCount / 100)
- Progress to next year = goodContentCount % 100

**Navigation:**
- Close button → Returns to dashboard

---

### 8. **Score Display Overlay** (Overlay on `/dashboard`)
- **Component**: `components/ScoreDisplay.tsx`
- **Trigger**: After successful URL submission
- **Purpose**: Show content analysis results

**User Experience:**
- Overlay appears on top of dashboard
- Displays:
  - Credibility score (0-100)
  - Quality message (e.g., "Excellent Source!", "Questionable Content")
  - Detailed analysis text
  - Color-coded by score:
    - Green (80-100): Excellent
    - Light green (60-79): Good
    - Yellow (40-59): Questionable
    - Red (0-39): Poor
- Close button or tap outside to dismiss

**Navigation:**
- Close → Returns to dashboard
- Pet health updates automatically after closing

---

## Complete User Journey

### New User Journey:
1. **Start** → `/signup`
2. Enter email, password, confirm password
3. Click "Sign Up"
4. **Redirect** → `/` (Welcome page)
5. Tap egg 3 times
6. **Redirect** → `/dashboard`
7. Tap egg 3 times (create pet)
8. Pet appears with navigation buttons
9. Explore modals (Health, URL, Growth)

### Returning User Journey:
1. **Start** → `/login`
2. Enter email and password
3. Click "Login"
4. **Redirect** → `/dashboard`
5. See existing pet
6. Interact with navigation buttons:
   - Check health status
   - Submit URLs for analysis
   - View growth timeline

### Content Submission Flow:
1. From dashboard, click URL button (middle)
2. URL Input Modal opens
3. Enter URL
4. Click "Analyze Content"
5. Wait for analysis (loading state)
6. Modal closes
7. Score Display overlay appears
8. View results
9. Close overlay
10. Return to dashboard
11. Pet health updates (within 5 seconds via polling)

---

## Navigation Summary

```
/login ←→ /signup
   ↓
   / (Welcome)
   ↓
/dashboard
   ├→ Health Status Modal (overlay)
   ├→ URL Input Modal (overlay)
   │   └→ Score Display (overlay)
   └→ Growth Timeline Modal (overlay)
```

---

## Key User Flow Issues

### Current Problems:
1. **Welcome page redundancy**: After signup, user goes to Welcome page to tap egg, then to Dashboard to tap egg again (double egg-tapping)
2. **Modal navigation**: All modals are full-screen overlays, not true modals - feels like page navigation
3. **No back button**: Users must use close button (X) to return to dashboard
4. **Polling inefficiency**: Dashboard polls every 5 seconds for pet updates instead of updating immediately after submission
5. **No loading states**: Dashboard doesn't show loading when pet is being fetched initially
6. **No empty states**: No guidance when user has 0 submissions
7. **No success feedback**: After URL submission, user only sees score - no confirmation that pet was updated

### Recommended Improvements:
1. Skip Welcome page after signup, go directly to Dashboard
2. Make modals true overlays (not full-screen) so dashboard is visible behind
3. Add back button or breadcrumb navigation
4. Update pet immediately after submission instead of polling
5. Add loading skeleton for initial pet fetch
6. Add empty state with tutorial for first-time users
7. Add success toast/notification after URL submission
