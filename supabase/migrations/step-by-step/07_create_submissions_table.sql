-- Step 7: Create content_submissions table
CREATE TABLE IF NOT EXISTS public.content_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    credibility_score NUMERIC(5,2) NOT NULL CHECK (credibility_score >= 0 AND credibility_score <= 100),
    quality_category TEXT NOT NULL CHECK (quality_category IN ('excellent', 'good', 'questionable', 'poor')),
    is_good_content BOOLEAN NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
