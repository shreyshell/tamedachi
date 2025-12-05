---
inclusion: always
---

# Tamedachi Design System Rules

## Overview

This document defines the design system structure, patterns, and integration guidelines for Tamedachi. Use this when implementing Figma designs or creating new UI components.

## 1. Token Definitions

### Location
Design tokens are defined in `app/globals.css` using CSS custom properties in the `:root` selector.

### Color Palette

**Sky Theme Colors (Primary)**
```css
--sky-blue: #87CEEB
--sky-blue-light: #B0E0E6
--sky-blue-dark: #4A90A4
--sky-gradient-start: #87CEEB
--sky-gradient-mid: #B0E0E6
--sky-gradient-end: #E0F2F7
```

**Cloud & Nature Colors**
```css
--cloud-white: #F8F9FA
--cloud-shadow: #E8EAED
--nature-green: #90EE90
--nature-green-dark: #228B22
--nature-green-light: #C8F7C8
--tree-brown: #8B7355
--grass-green: #7CB342
```

**Health State Colors**
```css
--health-excellent: #4CAF50 (80-100 score)
--health-good: #8BC34A (60-79 score)
--health-neutral: #FFC107 (40-59 score)
--health-poor: #FF9800 (20-39 score)
--health-sick: #F44336 (0-19 score)
```

**Accent Colors**
```css
--satellite-gray: #A9A9A9
--satellite-silver: #C0C0C0
--sun-yellow: #FFD700
--sun-orange: #FFA500
```

### Typography

**Font Families**
- `--font-sans`: 'Inter' for body text
- `--font-display`: 'Poppins' for headings (playful & bold)
- `--font-mono`: System monospace for code

**Font Sizes (Mobile-first, 440px base)**
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
--text-5xl: 3rem      /* 48px */
```

**Font Weights**
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Spacing (Mobile-first)
```css
--spacing-1: 0.25rem  /* 4px */
--spacing-2: 0.5rem   /* 8px */
--spacing-3: 0.75rem  /* 12px */
--spacing-4: 1rem     /* 16px */
--spacing-5: 1.25rem  /* 20px */
--spacing-6: 1.5rem   /* 24px */
--spacing-8: 2rem     /* 32px */
--spacing-10: 2.5rem  /* 40px */
--spacing-12: 3rem    /* 48px */
--spacing-16: 4rem    /* 64px */
--spacing-20: 5rem    /* 80px */
```

### Border Radius (Playful & Rounded)
```css
--radius-sm: 0.375rem   /* 6px */
--radius-md: 0.5rem     /* 8px */
--radius-lg: 0.75rem    /* 12px */
--radius-xl: 1rem       /* 16px */
--radius-2xl: 1.5rem    /* 24px */
--radius-3xl: 2rem      /* 32px */
--radius-full: 9999px
```

### Shadows (Soft & Whimsical)
```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 8px -2px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 8px 16px -4px rgba(0, 0, 0, 0.15)
--shadow-xl: 0 12px 24px -6px rgba(0, 0, 0, 0.2)
--shadow-2xl: 0 20px 40px -8px rgba(0, 0, 0, 0.2)
```

### Transitions (Smooth & Playful)
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

## 2. Component Library

### Location
UI components are in `/components` directory.

### Existing Components
- `Egg.tsx` - Hatching animation with tap interaction
- `Pet.tsx` - Pet display with health states
- `ScoreDisplay.tsx` - Content quality score overlay
- `URLInputModal.tsx` - URL submission modal
- `HealthStatusModal.tsx` - Pet health details modal
- `GrowthTimelineModal.tsx` - Pet growth history modal
- `NavigationButtons.tsx` - Dashboard navigation

### Component Architecture
- **Client Components**: Use `'use client'` directive for interactivity
- **Server Components**: Default for static content
- **Props**: Use TypeScript interfaces for type safety
- **State**: Use React hooks (useState, useEffect)

### Component Pattern Example
```typescript
'use client'

import { useState } from 'react'

interface ComponentProps {
  onAction: () => void
  data: DataType
}

export default function Component({ onAction, data }: ComponentProps) {
  const [state, setState] = useState<StateType>(initialValue)
  
  return (
    <div className="glass-container rounded-3xl p-6">
      {/* Component content */}
    </div>
  )
}
```

## 3. Frameworks & Libraries

### Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API
- **Testing**: Vitest + Testing Library

### Build System
- **Bundler**: Next.js built-in (Turbopack)
- **PostCSS**: Tailwind PostCSS plugin
- **TypeScript**: Strict mode enabled

## 4. Asset Management

### Storage
- Static assets in `/public` directory
- Images referenced as `/filename.ext`
- No CDN currently configured

### Optimization
- Next.js automatic image optimization
- SVG for icons and illustrations
- Emoji for decorative elements (clouds ☁️, trees 🌳, etc.)

## 5. Icon System

### Current Approach
- **Emoji-based**: Using Unicode emoji for whimsical feel
  - ☁️ Clouds
  - 🛰️ Satellite
  - ☀️ Sun
  - 🌳🌲🌿 Nature elements
  - 🐣 Hatching
  - ✨ Sparkles

### SVG Icons
- Inline SVG for custom shapes (egg, pet states)
- Defined in component files
- Use gradients and filters for depth

## 6. Styling Approach

### Methodology
- **Tailwind CSS 4** with utility classes
- **CSS Custom Properties** for design tokens
- **Inline styles** for dynamic values only
- **Global styles** in `app/globals.css`

### Utility Classes

**Glass Effect**
```css
.glass-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

**Sky Gradient Background**
```css
.bg-sky-gradient {
  background: linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 50%, #E0F2F7 100%);
}
```

**Button Styles**
```css
.btn-primary {
  background: var(--sky-blue);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
  transition: all 250ms;
}
```

**Health State Classes**
```css
.health-excellent { color: #4CAF50; background: #E8F5E9; }
.health-good { color: #8BC34A; background: #F1F8E9; }
.health-neutral { color: #FFC107; background: #FFF8E1; }
.health-poor { color: #FF9800; background: #FFF3E0; }
.health-sick { color: #F44336; background: #FFEBEE; }
```

### Responsive Design
- **Mobile-first**: Base styles for 440px
- **Breakpoints**: Use Tailwind's `md:` (768px), `lg:` (1024px)
- **Touch-optimized**: Large tap targets (min 44x44px)
- **Animations**: Smooth, playful, bounce effects

### Animation Keyframes
```css
@keyframes shake-left { /* Egg tap animation */ }
@keyframes shake-right { /* Egg tap animation */ }
@keyframes crack { /* Egg cracking */ }
@keyframes disappear { /* Egg hatching */ }
@keyframes fade-in { /* Smooth appearance */ }
```

## 7. Project Structure

```
tamedachi/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── analyze/       # Content analysis
│   │   ├── pet/          # Pet CRUD operations
│   │   └── submissions/   # Content submissions
│   ├── dashboard/         # Main app dashboard
│   │   ├── page.tsx      # Server component
│   │   └── DashboardClient.tsx  # Client component
│   ├── login/            # Authentication
│   ├── globals.css       # Design tokens & global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page (redirects)
├── components/            # Reusable UI components
│   ├── Egg.tsx
│   ├── Pet.tsx
│   ├── ScoreDisplay.tsx
│   ├── URLInputModal.tsx
│   ├── HealthStatusModal.tsx
│   ├── GrowthTimelineModal.tsx
│   └── NavigationButtons.tsx
├── lib/                   # Utilities & services
│   ├── services/         # Business logic
│   │   ├── pet.ts
│   │   └── submissions.ts
│   ├── supabase/         # Database client
│   │   ├── client.ts
│   │   └── server.ts
│   └── types.ts          # TypeScript types
├── middleware.ts          # Auth middleware
└── public/               # Static assets
```

## 8. Figma Integration Guidelines

### When Implementing Figma Designs

1. **Extract Design Tokens First**
   - Colors → CSS custom properties in `globals.css`
   - Typography → Font size/weight variables
   - Spacing → Spacing scale variables
   - Shadows → Shadow utility classes

2. **Map to Existing Components**
   - Check `/components` for reusable parts
   - Extend existing components rather than duplicate
   - Use composition for complex UIs

3. **Replace Tailwind with Tokens**
   - Figma output uses generic Tailwind classes
   - Replace with design system tokens:
     ```tsx
     // ❌ Figma output
     <div className="bg-blue-400 p-4 rounded-lg">
     
     // ✅ Design system
     <div className="glass-container rounded-2xl p-6">
     ```

4. **Maintain Visual Parity**
   - Use Figma screenshot as reference
   - Match spacing, colors, typography exactly
   - Test on mobile (440px) first
   - Validate on tablet (768px) and desktop (1024px+)

5. **Preserve Whimsical Theme**
   - Keep playful animations (bounce, shake, fade)
   - Use emoji decorations (clouds, nature, satellites)
   - Maintain sky gradient background
   - Apply glass morphism effects

6. **Component Naming**
   - Use descriptive names: `HealthStatusModal` not `Modal1`
   - Follow existing patterns: `ComponentName.tsx`
   - Export as default: `export default function ComponentName()`

7. **State Management**
   - Use local state for UI-only state
   - Fetch data in Server Components when possible
   - Pass data down as props to Client Components
   - Poll for updates when needed (pet health)

8. **Accessibility**
   - Add `aria-label` to interactive elements
   - Use semantic HTML (`button`, `nav`, `main`)
   - Ensure touch targets are 44x44px minimum
   - Test keyboard navigation

## 9. Code Connect Workflow

When creating or updating UI components:

1. **Create Component** in `/components`
2. **Match Figma Design** using design tokens
3. **Test Responsiveness** (mobile, tablet, desktop)
4. **Run Code Connect Hook** to link component to Figma
5. **Validate Visual Parity** with Figma screenshot

## 10. Common Patterns

### Modal Pattern
```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="glass-container relative z-10 rounded-3xl p-8 max-w-md">
        {children}
      </div>
    </div>
  )
}
```

### Button Pattern
```tsx
<button
  onClick={handleClick}
  className="btn-primary hover:scale-105 active:scale-95 transition-transform"
  aria-label="Descriptive action"
>
  Button Text
</button>
```

### Card Pattern
```tsx
<div className="card rounded-2xl p-6 shadow-lg">
  <h3 className="text-2xl font-bold mb-4">Card Title</h3>
  <p className="text-base text-gray-700">Card content</p>
</div>
```

### Health State Display
```tsx
const getHealthClass = (score: number) => {
  if (score >= 80) return 'health-excellent'
  if (score >= 60) return 'health-good'
  if (score >= 40) return 'health-neutral'
  if (score >= 20) return 'health-poor'
  return 'health-sick'
}

<div className={`${getHealthClass(pet.healthScore)} rounded-full px-4 py-2`}>
  {getHealthMessage(pet.healthScore)}
</div>
```

## 11. Design System Checklist

When implementing a new component from Figma:

- [ ] Extract and map colors to design tokens
- [ ] Use existing typography scale
- [ ] Apply spacing from spacing scale
- [ ] Use border radius tokens (rounded corners)
- [ ] Apply appropriate shadows
- [ ] Add smooth transitions/animations
- [ ] Ensure mobile-first responsive design
- [ ] Test touch interactions (44x44px targets)
- [ ] Add accessibility attributes
- [ ] Match visual design exactly
- [ ] Reuse existing components where possible
- [ ] Follow TypeScript strict typing
- [ ] Add JSDoc comments for complex logic
- [ ] Test error states
- [ ] Validate with Figma screenshot

## 12. Performance Guidelines

- Use Server Components by default
- Only use Client Components when needed (interactivity, hooks)
- Lazy load modals and heavy components
- Optimize images with Next.js Image component
- Minimize JavaScript bundle size
- Use CSS animations over JavaScript when possible
- Debounce user input (URL submissions)
- Cache API responses when appropriate

## 13. Error Handling

- Always wrap API calls in try-catch
- Show user-friendly error messages
- Log errors with context for debugging
- Maintain app stability even when services fail
- Handle network errors gracefully
- Validate user input before submission
- Provide fallback UI for loading states

---

**Remember**: Tamedachi is playful, whimsical, and encouraging. Every design decision should reflect this personality while maintaining professional code quality and accessibility standards.
